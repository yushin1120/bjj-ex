/* ==========================================================================
   Main Application Entrypoint & Event Listener Bindings
   ========================================================================== */

import { GameEngine } from './gameEngine.js';
import { RECIPES } from './data.js';
import { soundManager } from './audio.js';
import { saveGame } from './storage.js';
import { StockUiController } from './stockUiController.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new GameEngine();
  game.init();

  const stockUi = new StockUiController(game);
  stockUi.init();

  let activeShopTab = 'tab-kitchen';

  // --- Speed & Sound Controls ---
  const btnSpeed1 = document.getElementById('btn-speed-1');
  const btnSpeed2 = document.getElementById('btn-speed-2');
  const btnSpeed3 = document.getElementById('btn-speed-3');
  const btnSound = document.getElementById('btn-sound');

  const updateSpeedUI = (speed) => {
    [btnSpeed1, btnSpeed2, btnSpeed3].forEach(b => b && b.classList.remove('active'));
    if (speed === 1 && btnSpeed1) btnSpeed1.classList.add('active');
    if (speed === 2 && btnSpeed2) btnSpeed2.classList.add('active');
    if (speed === 3 && btnSpeed3) btnSpeed3.classList.add('active');
  };

  if (btnSpeed1) btnSpeed1.addEventListener('click', () => { game.setSpeed(1); updateSpeedUI(1); });
  if (btnSpeed2) btnSpeed2.addEventListener('click', () => { game.setSpeed(2); updateSpeedUI(2); });
  if (btnSpeed3) btnSpeed3.addEventListener('click', () => { game.setSpeed(3); updateSpeedUI(3); });

  if (btnSound) {
    btnSound.addEventListener('click', () => {
      const enabled = soundManager.toggle();
      btnSound.textContent = enabled ? '🔊' : '🔇';
    });
  }

  // --- Bottom Navigation Toolbar ---
  const btnToggleDay = document.getElementById('btn-toggle-day');
  const btnOpenShop = document.getElementById('btn-open-shop');
  const btnOpenMenuUpgrade = document.getElementById('btn-open-menu-upgrade');
  const btnOpenStaff = document.getElementById('btn-open-staff');
  const btnOpenDecor = document.getElementById('btn-open-decor');
  const btnSaveGame = document.getElementById('btn-save-game');

  if (btnToggleDay) {
    btnToggleDay.addEventListener('click', () => {
      game.toggleDay();
    });
  }

  const modalShop = document.getElementById('modal-shop');
  const modalRecipes = document.getElementById('modal-recipes');

  const openShopWithTab = (tabId) => {
    activeShopTab = tabId;
    document.querySelectorAll('.modal-tabs .tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    game.renderer.renderShopTab(tabId);
    if (modalShop) modalShop.classList.add('open');
    soundManager.playClick();
  };

  if (btnOpenShop) btnOpenShop.addEventListener('click', () => openShopWithTab('tab-kitchen'));
  if (btnOpenMenuUpgrade) btnOpenMenuUpgrade.addEventListener('click', () => openShopWithTab('tab-menu'));
  if (btnOpenStaff) btnOpenStaff.addEventListener('click', () => openShopWithTab('tab-staff'));
  if (btnOpenDecor) btnOpenDecor.addEventListener('click', () => openShopWithTab('tab-interior'));

  if (btnSaveGame) {
    btnSaveGame.addEventListener('click', () => {
      saveGame(game.state);
      soundManager.playUpgrade();
      game.renderer.showFloatText("💾 게임 상태 저장 완료!", "gain");
    });
  }

  // --- Recipe Book Modal ---
  const btnOpenRecipes = document.getElementById('btn-open-recipes');
  const btnCloseRecipes = document.getElementById('btn-close-recipes');

  if (btnOpenRecipes) {
    btnOpenRecipes.addEventListener('click', () => {
      game.renderer.renderRecipesModal();
      if (modalRecipes) modalRecipes.classList.add('open');
      soundManager.playClick();
    });
  }

  if (btnCloseRecipes) {
    btnCloseRecipes.addEventListener('click', () => {
      if (modalRecipes) modalRecipes.classList.remove('open');
      soundManager.playClick();
    });
  }

  // Shop Modal Tab Click
  document.querySelectorAll('.modal-tabs .tab-btn').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabId = e.target.getAttribute('data-tab');
      openShopWithTab(tabId);
    });
  });

  const btnCloseShop = document.getElementById('btn-close-shop');
  if (btnCloseShop) {
    btnCloseShop.addEventListener('click', () => {
      if (modalShop) modalShop.classList.remove('open');
      soundManager.playClick();
    });
  }

  // Summary Next Day Button
  const btnNextDay = document.getElementById('btn-next-day');
  if (btnNextDay) {
    btnNextDay.addEventListener('click', () => {
      game.nextDay();
    });
  }

  // --- Dynamic Delegate Clicks (Tables, Kitchen Slots, Shop Buttons) ---

  // 1. Kitchen Slots Click (Cook, Serve, Trash)
  const kitchenSlotsContainer = document.getElementById('kitchen-slots');
  if (kitchenSlotsContainer) {
    kitchenSlotsContainer.addEventListener('click', (e) => {
      const startCookBtn = e.target.closest('.btn-start-cook');
      if (startCookBtn) {
        const slotId = parseInt(startCookBtn.getAttribute('data-slot-id'));
        openRecipeSelectorForSlot(slotId);
        return;
      }

      const serveBtn = e.target.closest('.btn-serve-dish');
      if (serveBtn) {
        const slotId = parseInt(serveBtn.getAttribute('data-slot-id'));
        manualServeSlot(slotId);
        return;
      }

      const trashBtn = e.target.closest('.btn-trash-dish');
      if (trashBtn) {
        const slotId = parseInt(trashBtn.getAttribute('data-slot-id'));
        game.kitchen.discardBurntDish(slotId);
        return;
      }
    });
  }

  // Trash Zone Click
  const trashZone = document.getElementById('trash-zone');
  if (trashZone) {
    trashZone.addEventListener('click', () => {
      game.kitchen.discardAnyBurnt();
    });
  }

  // 2. Tables Grid Click (Clean Dirty Table)
  const tablesGridContainer = document.getElementById('tables-grid');
  if (tablesGridContainer) {
    tablesGridContainer.addEventListener('click', (e) => {
      const cleanBtn = e.target.closest('.btn-clean-table');
      if (cleanBtn) {
        const tableId = parseInt(cleanBtn.getAttribute('data-table-id'));
        game.customers.cleanTable(tableId);
      }
    });
  }

  // 3. Shop Modal Content Buttons (Upgrades, Menu Unlocks, Staff)
  const modalShopContent = document.getElementById('modal-shop-content');
  if (modalShopContent) {
    modalShopContent.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-upgrade-stove')) {
        const res = game.upgrades.upgradeStove();
        if (res.success) game.renderer.renderShopTab(activeShopTab);
      } else if (e.target.classList.contains('btn-unlock-menu')) {
        const recipeId = e.target.getAttribute('data-recipe-id');
        const res = game.upgrades.unlockRecipe(recipeId);
        if (res.success) game.renderer.renderShopTab(activeShopTab);
      } else if (e.target.classList.contains('btn-hire-staff')) {
        const role = e.target.getAttribute('data-role');
        const res = game.upgrades.hireStaff(role);
        if (res.success) game.renderer.renderShopTab(activeShopTab);
      } else if (e.target.classList.contains('btn-upgrade-tables')) {
        const res = game.upgrades.upgradeTables();
        if (res.success) game.renderer.renderShopTab(activeShopTab);
      } else if (e.target.classList.contains('btn-buy-interior')) {
        const decorId = e.target.getAttribute('data-decor-id');
        const res = game.upgrades.buyInterior(decorId);
        if (res.success) game.renderer.renderShopTab(activeShopTab);
      }
    });
  }

  function openRecipeSelectorForSlot(slotId) {
    const unlocked = game.state.unlockedRecipes;
    if (!unlocked || unlocked.length === 0) return;

    // Pick first recipe or show quick recipe prompt
    const defaultRecipeId = unlocked[0];
    const recipe = RECIPES[defaultRecipeId];
    if (recipe) {
      game.kitchen.startCooking(slotId, recipe);
    }
  }

  function manualServeSlot(slotId) {
    const slot = game.kitchen.slots.find(s => s.id === slotId);
    if (!slot || slot.status !== 'READY') return;

    const targetTable = game.customers.tables.find(t => 
      t.status === 'OCCUPIED' && 
      t.customer && 
      t.customer.state === 'WAITING_FOOD' && 
      t.customer.orderRecipe.id === slot.dish.recipe.id
    );

    if (targetTable) {
      const dish = game.kitchen.pickupDish(slotId);
      if (dish) {
        game.customers.serveDishToTable(targetTable.id, dish);
      }
    } else {
      game.renderer.showFloatText("❌ 해당 요리를 기다리는 손님이 없습니다!", "loss");
    }
  }

  // Keybindings
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      game.toggleDay();
    } else if (e.code === 'Digit1') {
      game.setSpeed(1); updateSpeedUI(1);
    } else if (e.code === 'Digit2') {
      game.setSpeed(2); updateSpeedUI(2);
    } else if (e.code === 'Digit3') {
      game.setSpeed(3); updateSpeedUI(3);
    }
  });
});
