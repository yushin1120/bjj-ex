/* ==========================================================================
   Kitchen Manager & Cooking Slots Engine
   ========================================================================== */

import { soundManager } from './audio.js';

export class KitchenManager {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.slots = [];
  }

  initSlots() {
    this.slots = [];
    for (let i = 0; i < this.game.state.stoveSlotsCount; i++) {
      this.slots.push({
        id: i + 1,
        status: 'EMPTY', // 'EMPTY', 'COOKING', 'READY', 'BURNT'
        dish: null,
        cookProgress: 0,
        totalCookTime: 0,
        burntTimer: 0,
        maxBurntTime: 12 // seconds before dish gets burnt
      });
    }
  }

  updateSlotsCount(newCount) {
    while (this.slots.length < newCount) {
      this.slots.push({
        id: this.slots.length + 1,
        status: 'EMPTY',
        dish: null,
        cookProgress: 0,
        totalCookTime: 0,
        burntTimer: 0,
        maxBurntTime: 12
      });
    }
  }

  tick(dt) {
    if (!this.game.state.isOpen) return;

    // Update slots cooking progress & burning timer
    this.slots.forEach(slot => {
      if (slot.status === 'COOKING') {
        const speedBonus = this.game.state.cookSpeedBonus || 1.0;
        slot.cookProgress += dt / speedBonus;

        if (slot.cookProgress >= slot.totalCookTime) {
          slot.status = 'READY';
          slot.cookProgress = slot.totalCookTime;
          slot.burntTimer = 0;
          soundManager.playCookDone();
        }
      } else if (slot.status === 'READY') {
        slot.burntTimer += dt;
        if (slot.burntTimer >= slot.maxBurntTime) {
          slot.status = 'BURNT';
          soundManager.playAngry();
          this.game.renderer.showFloatText(`🔥 음식 탄 냄새!`, 'loss');
        }
      }
    });

    // Auto Chef logic (if hired)
    if (this.game.state.chefsCount > 0) {
      this.processAutoChef();
    }
  }

  startCooking(slotId, recipe) {
    const slot = this.slots.find(s => s.id === slotId);
    if (!slot || slot.status !== 'EMPTY') return false;

    slot.status = 'COOKING';
    slot.dish = { recipe: recipe, quality: 1.0 };
    slot.cookProgress = 0;
    slot.totalCookTime = recipe.cookTime;
    slot.burntTimer = 0;

    soundManager.playCookStart();
    return true;
  }

  pickupDish(slotId) {
    const slot = this.slots.find(s => s.id === slotId);
    if (!slot || slot.status !== 'READY') return null;

    const dish = slot.dish;
    slot.status = 'EMPTY';
    slot.dish = null;
    slot.cookProgress = 0;
    return dish;
  }

  discardBurntDish(slotId) {
    const slot = this.slots.find(s => s.id === slotId);
    if (slot && (slot.status === 'BURNT' || slot.status === 'READY')) {
      slot.status = 'EMPTY';
      slot.dish = null;
      slot.cookProgress = 0;
      soundManager.playTrash();
      return true;
    }
    return false;
  }

  discardAnyBurnt() {
    let clearedCount = 0;
    this.slots.forEach(slot => {
      if (slot.status === 'BURNT') {
        slot.status = 'EMPTY';
        slot.dish = null;
        slot.cookProgress = 0;
        clearedCount++;
      }
    });
    if (clearedCount > 0) {
      soundManager.playTrash();
    }
  }

  processAutoChef() {
    // 1. Find empty stove slots
    const emptySlot = this.slots.find(s => s.status === 'EMPTY');
    if (!emptySlot) return;

    // 2. Find waiting customer orders that haven't been started in cooking yet
    const waitingTables = this.game.customers.tables.filter(t => 
      t.status === 'OCCUPIED' && 
      t.customer && 
      t.customer.state === 'WAITING_FOOD'
    );

    for (const table of waitingTables) {
      const requiredRecipe = table.customer.orderRecipe;
      // Check if this recipe is already cooking or ready in any slot
      const alreadyCookingOrReady = this.slots.some(s => 
        (s.status === 'COOKING' || s.status === 'READY') && 
        s.dish && 
        s.dish.recipe.id === requiredRecipe.id
      );

      if (!alreadyCookingOrReady) {
        this.startCooking(emptySlot.id, requiredRecipe);
        break;
      }
    }
  }
}
