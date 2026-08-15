/* ==========================================================================
   Customer Manager & AI Behavior Engine
   ========================================================================== */

import { CUSTOMER_TYPES, RECIPES } from './data.js';
import { soundManager } from './audio.js';

export class CustomerManager {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.waitingQueue = [];
    this.tables = [];
    this.nextCustomerId = 1;
    this.spawnTimer = 0;
  }

  initTables() {
    this.tables = [];
    for (let i = 0; i < this.game.state.maxTables; i++) {
      this.tables.push({
        id: i + 1,
        status: 'EMPTY', // 'EMPTY', 'OCCUPIED', 'DIRTY'
        customer: null,
        dishOnTable: null,
        eatProgress: 0,
        eatDuration: 5 // seconds to eat
      });
    }
  }

  updateTablesCount(newCount) {
    while (this.tables.length < newCount) {
      this.tables.push({
        id: this.tables.length + 1,
        status: 'EMPTY',
        customer: null,
        dishOnTable: null,
        eatProgress: 0,
        eatDuration: 5
      });
    }
  }

  tick(dt) {
    if (!this.game.state.isOpen) return;

    // 1. Spawning customers
    this.spawnTimer += dt;
    const isRushHour = this.game.isRushHour();
    const event = this.game.activeEvent;
    
    let spawnInterval = isRushHour ? 4.5 : 9.0;
    if (event && event.spawnRateMultiplier) {
      spawnInterval /= event.spawnRateMultiplier;
    }

    if (this.spawnTimer >= spawnInterval) {
      this.spawnTimer = 0;
      this.trySpawnCustomer();
    }

    // 2. Queue patience & Auto seating
    for (let i = this.waitingQueue.length - 1; i >= 0; i--) {
      const cust = this.waitingQueue[i];
      cust.patience -= dt;

      if (cust.patience <= 0) {
        // Angry left queue
        this.waitingQueue.splice(i, 1);
        this.game.recordCustomerLeft(cust);
        soundManager.playAngry();
        this.game.renderer.showFloatText(`😡 기꺼움! (${cust.name} 이탈)`, 'loss');
      }
    }

    // Auto seat if empty table available
    this.autoSeatQueue();

    // 3. Update table customer patience & eating progress
    this.tables.forEach(table => {
      if (table.status === 'OCCUPIED' && table.customer) {
        const cust = table.customer;

        if (cust.state === 'ORDERING') {
          cust.orderTimer += dt;
          if (cust.orderTimer >= 1.5) { // 1.5 sec to decide order
            cust.state = 'WAITING_FOOD';
            cust.orderRecipe = this.selectRandomRecipe();
            soundManager.playClick();
          }
        } else if (cust.state === 'WAITING_FOOD') {
          cust.patience -= dt;
          if (cust.patience <= 0) {
            // Left angry from table
            table.status = 'EMPTY';
            table.customer = null;
            this.game.recordCustomerLeft(cust);
            soundManager.playAngry();
            this.game.renderer.showFloatText(`🤬 손님이 지쳐 나갔습니다!`, 'loss');
          }
        } else if (cust.state === 'EATING') {
          table.eatProgress += dt;
          if (table.eatProgress >= table.eatDuration) {
            // Finish eating! Pay money & tip
            this.finishEating(table);
          }
        }
      }
    });

    // 4. Auto Waiter logic (serve food or clean dirty tables)
    if (this.game.state.waitersCount > 0) {
      this.processAutoWaiter(dt);
    }
  }

  trySpawnCustomer() {
    if (this.waitingQueue.length >= this.game.state.maxQueue) return;

    // Pick customer type based on weights
    const types = Object.keys(CUSTOMER_TYPES);
    const chosenTypeKey = types[Math.floor(Math.random() * types.length)];
    const typeDef = CUSTOMER_TYPES[chosenTypeKey];

    const icon = typeDef.icons[Math.floor(Math.random() * typeDef.icons.length)];

    let patience = typeDef.patienceSec * this.game.state.patienceMultiplier;
    if (this.game.activeEvent && this.game.activeEvent.patienceMultiplier) {
      patience *= this.game.activeEvent.patienceMultiplier;
    }

    const customer = {
      id: this.nextCustomerId++,
      typeKey: chosenTypeKey,
      name: typeDef.name,
      icon: icon,
      maxPatience: patience,
      patience: patience,
      tipRate: typeDef.tipRate,
      state: 'WAITING_SEAT', // 'WAITING_SEAT', 'ORDERING', 'WAITING_FOOD', 'EATING'
      orderTimer: 0,
      orderRecipe: null
    };

    this.waitingQueue.push(customer);
  }

  autoSeatQueue() {
    if (this.waitingQueue.length === 0) return;

    const emptyTable = this.tables.find(t => t.status === 'EMPTY');
    if (emptyTable) {
      const cust = this.waitingQueue.shift();
      cust.state = 'ORDERING';
      cust.orderTimer = 0;

      emptyTable.status = 'OCCUPIED';
      emptyTable.customer = cust;
      emptyTable.dishOnTable = null;
      emptyTable.eatProgress = 0;
    }
  }

  selectRandomRecipe() {
    const unlocked = this.game.state.unlockedRecipes;
    if (!unlocked || unlocked.length === 0) return RECIPES.gimbap;
    const randomId = unlocked[Math.floor(Math.random() * unlocked.length)];
    return RECIPES[randomId] || RECIPES.gimbap;
  }

  serveDishToTable(tableId, dish) {
    const table = this.tables.find(t => t.id === tableId);
    if (!table || table.status !== 'OCCUPIED' || !table.customer) return false;
    
    const cust = table.customer;
    if (cust.state !== 'WAITING_FOOD' || cust.orderRecipe.id !== dish.recipe.id) {
      return false;
    }

    // Dish matches order!
    cust.state = 'EATING';
    table.dishOnTable = dish;
    table.eatProgress = 0;
    table.eatDuration = dish.recipe.cookTime * 0.8 + 2; // Eating duration

    soundManager.playCookDone();
    this.game.renderer.showFloatText(`😋 서빙 완료!`, 'tip');
    return true;
  }

  finishEating(table) {
    const cust = table.customer;
    const recipe = cust.orderRecipe;

    // Price calculation
    let price = recipe.price;
    if (this.game.activeEvent && this.game.activeEvent.priceMultiplier) {
      price *= this.game.activeEvent.priceMultiplier;
    }

    // Tip calculation based on remaining patience ratio
    const patienceRatio = Math.max(0, cust.patience / cust.maxPatience);
    const tip = Math.round(price * cust.tipRate * patienceRatio);

    // Rating (1 to 5 stars)
    let rating = 3.0 + patienceRatio * 2.0;
    if (patienceRatio > 0.8) rating = 5.0;

    this.game.addRevenue(price, tip, recipe.cost);
    this.game.recordRating(rating);

    soundManager.playCoin();
    this.game.renderer.showFloatText(`+₩ ${(price + tip).toLocaleString()} (팁: ₩${tip.toLocaleString()})`, 'gain');

    // Table now becomes DIRTY
    table.status = 'DIRTY';
    table.customer = null;
    table.dishOnTable = null;
  }

  cleanTable(tableId) {
    const table = this.tables.find(t => t.id === tableId);
    if (table && table.status === 'DIRTY') {
      table.status = 'EMPTY';
      soundManager.playClick();
      return true;
    }
    return false;
  }

  processAutoWaiter(dt) {
    // 1. First priority: clean dirty tables
    const dirtyTable = this.tables.find(t => t.status === 'DIRTY');
    if (dirtyTable) {
      dirtyTable.status = 'EMPTY';
      return;
    }

    // 2. Second priority: deliver ready cooked dishes from stove slots to waiting customers
    const readySlots = this.game.kitchen.slots.filter(s => s.status === 'READY' && s.dish);
    if (readySlots.length > 0) {
      const readySlot = readySlots[0];
      const targetTable = this.tables.find(t => 
        t.status === 'OCCUPIED' && 
        t.customer && 
        t.customer.state === 'WAITING_FOOD' && 
        t.customer.orderRecipe.id === readySlot.dish.recipe.id
      );

      if (targetTable) {
        const dish = this.game.kitchen.pickupDish(readySlot.id);
        if (dish) {
          this.serveDishToTable(targetTable.id, dish);
        }
      }
    }
  }
}
