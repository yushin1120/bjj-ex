/* ==========================================================================
   Upgrade Manager & Shop Logic
   ========================================================================== */

import { RECIPES, UPGRADES } from './data.js';
import { soundManager } from './audio.js';

export class UpgradeManager {
  constructor(gameEngine) {
    this.game = gameEngine;
  }

  unlockRecipe(recipeId) {
    const recipe = RECIPES[recipeId];
    if (!recipe) return { success: false, msg: "존재하지 않는 레시피입니다." };

    if (this.game.state.unlockedRecipes.includes(recipeId)) {
      return { success: false, msg: "이미 해금된 레시피입니다." };
    }

    if (this.game.state.money < recipe.unlockCost) {
      return { success: false, msg: "자금이 부족합니다!" };
    }

    this.game.deductMoney(recipe.unlockCost);
    this.game.state.unlockedRecipes.push(recipeId);

    soundManager.playUpgrade();
    this.game.renderer.showFloatText(`🎉 [${recipe.name}] 레시피 해금!`, 'gain');
    return { success: true, msg: `${recipe.name} 해금 완료!` };
  }

  upgradeStove() {
    const currentSlots = this.game.state.stoveSlotsCount;
    const nextUpgrade = UPGRADES.stoves.find(u => u.slots > currentSlots);
    if (!nextUpgrade) return { success: false, msg: "최대 주방 등급에 도달했습니다." };

    if (this.game.state.money < nextUpgrade.cost) {
      return { success: false, msg: "자금이 부족합니다!" };
    }

    this.game.deductMoney(nextUpgrade.cost);
    this.game.state.stoveSlotsCount = nextUpgrade.slots;
    this.game.state.cookSpeedBonus = nextUpgrade.speedBonus;
    this.game.kitchen.updateSlotsCount(nextUpgrade.slots);

    soundManager.playUpgrade();
    this.game.renderer.showFloatText(`🔥 ${nextUpgrade.name} 업그레이드!`, 'gain');
    return { success: true, msg: "주방 업그레이드 성공!" };
  }

  upgradeTables() {
    const currentTables = this.game.state.maxTables;
    const nextUpgrade = UPGRADES.tables.find(t => t.count > currentTables);
    if (!nextUpgrade) return { success: false, msg: "최대 홀 테이블 크기입니다." };

    if (this.game.state.money < nextUpgrade.cost) {
      return { success: false, msg: "자금이 부족합니다!" };
    }

    this.game.deductMoney(nextUpgrade.cost);
    this.game.state.maxTables = nextUpgrade.count;
    this.game.customers.updateTablesCount(nextUpgrade.count);

    soundManager.playUpgrade();
    this.game.renderer.showFloatText(`🛋️ ${nextUpgrade.name} 확장!`, 'gain');
    return { success: true, msg: "테이블 확장 성공!" };
  }

  hireStaff(role) {
    const staffDef = UPGRADES.staff[role];
    if (!staffDef) return { success: false, msg: "잘못된 직원 종류입니다." };

    if (this.game.state.money < staffDef.cost) {
      return { success: false, msg: "채용 자금이 부족합니다!" };
    }

    this.game.deductMoney(staffDef.cost);
    if (role === 'chef') {
      this.game.state.chefsCount += 1;
    } else if (role === 'waiter') {
      this.game.state.waitersCount += 1;
    }

    soundManager.playUpgrade();
    this.game.renderer.showFloatText(`👨‍🍳 ${staffDef.name} 완료!`, 'gain');
    return { success: true, msg: `${staffDef.name} 채용 완료!` };
  }

  buyInterior(decorId) {
    const decor = UPGRADES.interior.find(d => d.id === decorId);
    if (!decor) return { success: false, msg: "존재하지 않는 인테리어입니다." };

    if (this.game.state.money < decor.cost) {
      return { success: false, msg: "자금이 부족합니다!" };
    }

    this.game.deductMoney(decor.cost);
    this.game.state.patienceMultiplier = Math.max(this.game.state.patienceMultiplier, decor.patienceBonus);

    soundManager.playUpgrade();
    this.game.renderer.showFloatText(`✨ ${decor.name} 구매 완료!`, 'gain');
    return { success: true, msg: "인테리어 장착 완료!" };
  }
}
