/* ==========================================================================
   UI Renderer & DOM Controller
   ========================================================================== */

import { RECIPES, UPGRADES } from './data.js';

export class Renderer {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.elements = {};
    this.cacheElements();
  }

  cacheElements() {
    this.elements = {
      restaurantName: document.getElementById('restaurant-name'),
      levelBadge: document.getElementById('level-badge'),
      hudDay: document.getElementById('hud-day'),
      hudTime: document.getElementById('hud-time'),
      hudReputation: document.getElementById('hud-reputation'),
      hudMoney: document.getElementById('hud-money'),

      occupiedTablesCount: document.getElementById('occupied-tables-count'),
      maxTablesCount: document.getElementById('max-tables-count'),
      rushIndicator: document.getElementById('rush-indicator'),
      waitingQueue: document.getElementById('waiting-queue'),
      tablesGrid: document.getElementById('tables-grid'),

      chefCount: document.getElementById('chef-count'),
      waiterCount: document.getElementById('waiter-count'),
      activeEventBanner: document.getElementById('active-event-banner'),

      kitchenSlots: document.getElementById('kitchen-slots'),
      trashZone: document.getElementById('trash-zone'),

      btnToggleDay: document.getElementById('btn-toggle-day'),
      dayBtnText: document.getElementById('day-btn-text'),

      // Modals
      modalShop: document.getElementById('modal-shop'),
      modalShopContent: document.getElementById('modal-shop-content'),
      modalRecipes: document.getElementById('modal-recipes'),
      modalRecipesContent: document.getElementById('modal-recipes-content'),
      modalSummary: document.getElementById('modal-summary'),

      // Summary Fields
      summaryDayNum: document.getElementById('summary-day-num'),
      sumRevenue: document.getElementById('sum-revenue'),
      sumTips: document.getElementById('sum-tips'),
      sumExpenses: document.getElementById('sum-expenses'),
      sumNetProfit: document.getElementById('sum-net-profit'),
      sumServed: document.getElementById('sum-customers-served'),
      sumLeft: document.getElementById('sum-customers-left'),
      sumRating: document.getElementById('sum-rating'),
      sumBadge: document.getElementById('sum-evaluation-badge'),

      floatingLayer: document.getElementById('floating-layer')
    };
  }

  render() {
    const s = this.game.state;

    // HUD Header
    if (this.elements.hudDay) this.elements.hudDay.textContent = `Day ${s.day}`;
    if (this.elements.hudTime) this.elements.hudTime.textContent = this.game.getFormattedTime();
    if (this.elements.hudReputation) this.elements.hudReputation.textContent = `⭐ ${s.reputation.toFixed(1)} / 5.0`;
    if (this.elements.hudMoney) this.elements.hudMoney.textContent = `₩ ${s.money.toLocaleString()}`;
    if (this.elements.levelBadge) this.elements.levelBadge.textContent = `LV ${s.level} ${this.getLevelTitle(s.level)}`;

    // Rush hour
    const isRush = this.game.isRushHour();
    if (this.elements.rushIndicator) {
      if (isRush) {
        this.elements.rushIndicator.textContent = "🔥 피크 타임 러시!";
        this.elements.rushIndicator.classList.add('active');
      } else {
        this.elements.rushIndicator.textContent = "평상시";
        this.elements.rushIndicator.classList.remove('active');
      }
    }

    // Table Counts & Staff
    const occupied = this.game.customers.tables.filter(t => t.status !== 'EMPTY').length;
    if (this.elements.occupiedTablesCount) this.elements.occupiedTablesCount.textContent = occupied;
    if (this.elements.maxTablesCount) this.elements.maxTablesCount.textContent = s.maxTables;

    if (this.elements.chefCount) this.elements.chefCount.textContent = s.chefsCount;
    if (this.elements.waiterCount) this.elements.waiterCount.textContent = s.waitersCount;

    // Event Banner
    if (this.elements.activeEventBanner) {
      if (this.game.activeEvent) {
        this.elements.activeEventBanner.textContent = `${this.game.activeEvent.title}`;
      } else {
        this.elements.activeEventBanner.textContent = "📢 평온한 영업일";
      }
    }

    // Toggle Day Button State
    if (this.elements.btnToggleDay && this.elements.dayBtnText) {
      if (s.isOpen) {
        this.elements.dayBtnText.textContent = "영업 마감 (조기종료)";
        this.elements.btnToggleDay.classList.add('active');
      } else {
        this.elements.dayBtnText.textContent = "영업 시작";
        this.elements.btnToggleDay.classList.remove('active');
      }
    }

    // Render Queue & Floor Tables
    this.renderWaitingQueue();
    this.renderTables();
    this.renderKitchenSlots();
  }

  renderWaitingQueue() {
    const queueContainer = this.elements.waitingQueue;
    if (!queueContainer) return;

    const queue = this.game.customers.waitingQueue;
    if (queue.length === 0) {
      queueContainer.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted); padding:10px;">대기 중인 손님이 없습니다.</span>`;
      return;
    }

    queueContainer.innerHTML = queue.map(c => {
      const patiencePct = Math.max(0, (c.patience / c.maxPatience) * 100);
      let colorClass = 'var(--accent-green)';
      if (patiencePct < 30) colorClass = 'var(--accent-red)';
      else if (patiencePct < 60) colorClass = 'var(--accent-gold)';

      return `
        <div class="customer-avatar">
          <div class="avatar-icon">${c.icon}</div>
          <div class="patience-bar-wrap">
            <div class="patience-bar" style="width: ${patiencePct}%; background-color: ${colorClass}"></div>
          </div>
          <span class="customer-type-tag">${c.name}</span>
        </div>
      `;
    }).join('');
  }

  renderTables() {
    const container = this.elements.tablesGrid;
    if (!container) return;

    const tables = this.game.customers.tables;

    container.innerHTML = tables.map(t => {
      if (t.status === 'EMPTY') {
        return `
          <div class="table-card">
            <div class="table-header">
              <span class="table-num">테이블 #${t.id}</span>
              <span class="table-status">빈 테이블</span>
            </div>
            <div class="table-center">
              <span style="font-size: 2.2rem; opacity: 0.3;">🪑</span>
            </div>
          </div>
        `;
      }

      if (t.status === 'DIRTY') {
        return `
          <div class="table-card dirty">
            <div class="table-header">
              <span class="table-num">테이블 #${t.id}</span>
              <span class="table-status" style="color:var(--accent-red)">청소 필요</span>
            </div>
            <div class="table-center">
              <span style="font-size: 2.2rem;">🍽️</span>
              <button class="btn btn-sm btn-outline btn-clean-table" data-table-id="${t.id}">🧹 테이블 청소하기</button>
            </div>
          </div>
        `;
      }

      // OCCUPIED
      const cust = t.customer;
      if (!cust) return '';

      const patiencePct = Math.max(0, (cust.patience / cust.maxPatience) * 100);
      let colorClass = 'var(--accent-green)';
      if (patiencePct < 30) colorClass = 'var(--accent-red)';
      else if (patiencePct < 60) colorClass = 'var(--accent-gold)';

      let centerContent = '';
      if (cust.state === 'ORDERING') {
        centerContent = `<span class="order-bubble">💭 고민 중...</span>`;
      } else if (cust.state === 'WAITING_FOOD') {
        const dish = cust.orderRecipe;
        centerContent = `
          <span class="order-bubble">주문: ${dish.icon} ${dish.name}</span>
          <div class="patience-bar-wrap" style="width: 80px; height: 6px; margin-top:6px;">
            <div class="patience-bar" style="width: ${patiencePct}%; background-color: ${colorClass}"></div>
          </div>
        `;
      } else if (cust.state === 'EATING') {
        const eatPct = Math.min(100, (t.eatProgress / t.eatDuration) * 100);
        centerContent = `
          <span style="font-size: 1.8rem;">😋 ${t.dishOnTable ? t.dishOnTable.recipe.icon : '🍲'}</span>
          <div class="cook-progress-bar" style="width: 80px;">
            <div class="cook-progress-fill" style="width: ${eatPct}%; background: var(--accent-green);"></div>
          </div>
        `;
      }

      return `
        <div class="table-card occupied">
          <div class="table-header">
            <span class="table-num">테이블 #${t.id}</span>
            <span class="table-status" style="color:var(--accent-gold)">${cust.icon} ${cust.name}</span>
          </div>
          <div class="table-center">
            ${centerContent}
          </div>
        </div>
      `;
    }).join('');
  }

  renderKitchenSlots() {
    const container = this.elements.kitchenSlots;
    if (!container) return;

    const slots = this.game.kitchen.slots;

    container.innerHTML = slots.map(s => {
      if (s.status === 'EMPTY') {
        return `
          <div class="stove-slot">
            <div class="stove-icon-wrap">🔥</div>
            <div class="stove-info">
              <div class="stove-title">조리대 #${s.id}</div>
              <div class="stove-status">대기 중 (클릭하여 조리)</div>
            </div>
            <button class="btn btn-sm btn-primary btn-start-cook" data-slot-id="${s.id}">요리하기</button>
          </div>
        `;
      }

      if (s.status === 'COOKING') {
        const cookPct = Math.min(100, (s.cookProgress / s.totalCookTime) * 100);
        return `
          <div class="stove-slot cooking">
            <div class="stove-icon-wrap">${s.dish.recipe.icon}</div>
            <div class="stove-info">
              <div class="stove-title">${s.dish.recipe.name}</div>
              <div class="stove-status">조리 중... (${Math.round(cookPct)}%)</div>
              <div class="cook-progress-bar">
                <div class="cook-progress-fill" style="width: ${cookPct}%;"></div>
              </div>
            </div>
          </div>
        `;
      }

      if (s.status === 'READY') {
        const burntWarning = s.burntTimer > 7;
        return `
          <div class="stove-slot ready">
            <div class="stove-icon-wrap">${s.dish.recipe.icon}</div>
            <div class="stove-info">
              <div class="stove-title" style="color:var(--accent-green)">${s.dish.recipe.name} 완성!</div>
              <div class="stove-status">${burntWarning ? '⚠️ 곧 타버립니다!' : '손님에게 서빙 준비 완료'}</div>
            </div>
            <button class="btn btn-sm btn-primary btn-serve-dish" data-slot-id="${s.id}">서빙하기 🍱</button>
          </div>
        `;
      }

      if (s.status === 'BURNT') {
        return `
          <div class="stove-slot burnt">
            <div class="stove-icon-wrap">🍳</div>
            <div class="stove-info">
              <div class="stove-title" style="color:var(--accent-red)">🔥 탄 음식!</div>
              <div class="stove-status">쓰레기통에 폐기해야 합니다.</div>
            </div>
            <button class="btn btn-sm btn-outline btn-trash-dish" data-slot-id="${s.id}">버리기 🗑️</button>
          </div>
        `;
      }
    }).join('');
  }

  renderShopTab(tabId) {
    const container = this.elements.modalShopContent;
    if (!container) return;

    const s = this.game.state;

    if (tabId === 'tab-kitchen') {
      const nextStove = UPGRADES.stoves.find(u => u.slots > s.stoveSlotsCount);
      let stoveHTML = '';
      if (nextStove) {
        const canAfford = s.money >= nextStove.cost;
        stoveHTML = `
          <div class="shop-item">
            <div class="shop-item-icon">🔥</div>
            <div class="shop-item-info">
              <div class="shop-item-title">${nextStove.name}</div>
              <div class="shop-item-desc">${nextStove.desc}</div>
              <div class="shop-item-price">₩ ${nextStove.cost.toLocaleString()}</div>
            </div>
            <button class="btn btn-primary btn-upgrade-stove" ${!canAfford ? 'disabled style="opacity:0.5"' : ''}>업그레이드</button>
          </div>
        `;
      } else {
        stoveHTML = `<div class="shop-item-desc" style="padding:12px;">최대 화력 주방 보유 중입니다! (5구 풀 세팅)</div>`;
      }
      container.innerHTML = stoveHTML;
    } else if (tabId === 'tab-menu') {
      const recipesKeys = Object.keys(RECIPES);
      container.innerHTML = recipesKeys.map(key => {
        const r = RECIPES[key];
        const isUnlocked = s.unlockedRecipes.includes(key);
        const canAfford = s.money >= r.unlockCost;

        return `
          <div class="shop-item">
            <div class="shop-item-icon">${r.icon}</div>
            <div class="shop-item-info">
              <div class="shop-item-title">${r.name} <span class="badge">${r.category}</span></div>
              <div class="shop-item-desc">${r.desc} (단가: ₩${r.price.toLocaleString()} / 재료비: ₩${r.cost.toLocaleString()})</div>
              <div class="shop-item-price">${isUnlocked ? '✅ 보유 중' : `₩ ${r.unlockCost.toLocaleString()}`}</div>
            </div>
            ${isUnlocked ? '<button class="btn btn-outline" disabled>해금됨</button>' : `<button class="btn btn-primary btn-unlock-menu" data-recipe-id="${key}" ${!canAfford ? 'disabled style="opacity:0.5"' : ''}>해금하기</button>`}
          </div>
        `;
      }).join('');
    } else if (tabId === 'tab-staff') {
      const chefDef = UPGRADES.staff.chef;
      const waiterDef = UPGRADES.staff.waiter;

      container.innerHTML = `
        <div class="shop-item">
          <div class="shop-item-icon">🧑‍🍳</div>
          <div class="shop-item-info">
            <div class="shop-item-title">${chefDef.name} (현재 ${s.chefsCount}명)</div>
            <div class="shop-item-desc">${chefDef.desc} (일당: ₩${chefDef.dailySalary.toLocaleString()})</div>
            <div class="shop-item-price">₩ ${chefDef.cost.toLocaleString()}</div>
          </div>
          <button class="btn btn-primary btn-hire-staff" data-role="chef" ${s.money < chefDef.cost ? 'disabled style="opacity:0.5"' : ''}>채용하기</button>
        </div>

        <div class="shop-item">
          <div class="shop-item-icon">🏃</div>
          <div class="shop-item-info">
            <div class="shop-item-title">${waiterDef.name} (현재 ${s.waitersCount}명)</div>
            <div class="shop-item-desc">${waiterDef.desc} (일당: ₩${waiterDef.dailySalary.toLocaleString()})</div>
            <div class="shop-item-price">₩ ${waiterDef.cost.toLocaleString()}</div>
          </div>
          <button class="btn btn-primary btn-hire-staff" data-role="waiter" ${s.money < waiterDef.cost ? 'disabled style="opacity:0.5"' : ''}>채용하기</button>
        </div>
      `;
    } else if (tabId === 'tab-interior') {
      const nextTable = UPGRADES.tables.find(t => t.count > s.maxTables);
      let tableHTML = '';
      if (nextTable) {
        tableHTML = `
          <div class="shop-item">
            <div class="shop-item-icon">🛋️</div>
            <div class="shop-item-info">
              <div class="shop-item-title">${nextTable.name}</div>
              <div class="shop-item-desc">${nextTable.desc}</div>
              <div class="shop-item-price">₩ ${nextTable.cost.toLocaleString()}</div>
            </div>
            <button class="btn btn-primary btn-upgrade-tables" ${s.money < nextTable.cost ? 'disabled style="opacity:0.5"' : ''}>확장하기</button>
          </div>
        `;
      }

      const decorsHTML = UPGRADES.interior.map(d => {
        const canAfford = s.money >= d.cost;
        return `
          <div class="shop-item">
            <div class="shop-item-icon">🪴</div>
            <div class="shop-item-info">
              <div class="shop-item-title">${d.name}</div>
              <div class="shop-item-desc">${d.desc}</div>
              <div class="shop-item-price">₩ ${d.cost.toLocaleString()}</div>
            </div>
            <button class="btn btn-primary btn-buy-interior" data-decor-id="${d.id}" ${!canAfford ? 'disabled style="opacity:0.5"' : ''}>구매하기</button>
          </div>
        `;
      }).join('');

      container.innerHTML = tableHTML + decorsHTML;
    }
  }

  renderRecipesModal() {
    const container = this.elements.modalRecipesContent;
    if (!container) return;

    const s = this.game.state;
    container.innerHTML = s.unlockedRecipes.map(id => {
      const r = RECIPES[id];
      if (!r) return '';
      return `
        <div class="shop-item">
          <div class="shop-item-icon">${r.icon}</div>
          <div class="shop-item-info">
            <div class="shop-item-title">${r.name}</div>
            <div class="shop-item-desc">${r.desc}</div>
          </div>
          <div class="shop-item-price">판매가: ₩${r.price.toLocaleString()}</div>
        </div>
      `;
    }).join('');
  }

  renderSummaryModal(report) {
    if (this.elements.summaryDayNum) this.elements.summaryDayNum.textContent = report.day;
    if (this.elements.sumRevenue) this.elements.sumRevenue.textContent = `+ ₩ ${report.revenue.toLocaleString()}`;
    if (this.elements.sumTips) this.elements.sumTips.textContent = `+ ₩ ${report.tips.toLocaleString()}`;
    if (this.elements.sumExpenses) this.elements.sumExpenses.textContent = `- ₩ ${report.expenses.toLocaleString()}`;
    if (this.elements.sumNetProfit) this.elements.sumNetProfit.textContent = `₩ ${report.netProfit.toLocaleString()}`;

    if (this.elements.sumServed) this.elements.sumServed.textContent = `${report.customersServed} 명`;
    if (this.elements.sumLeft) this.elements.sumLeft.textContent = `${report.customersLeft} 명`;
    if (this.elements.sumRating) this.elements.sumRating.textContent = `⭐️ ${report.dayRating.toFixed(1)} / 5.0`;

    if (this.elements.sumBadge) {
      if (report.dayRating >= 4.5) {
        this.elements.sumBadge.textContent = "🥇 미슐랭 3스타 레스토랑";
      } else if (report.dayRating >= 3.5) {
        this.elements.sumBadge.textContent = "🥈 인기가 치솟는 맛집";
      } else {
        this.elements.sumBadge.textContent = "🥉 평범한 식당";
      }
    }
  }

  showFloatText(text, type = 'gain') {
    const layer = this.elements.floatingLayer;
    if (!layer) return;

    const el = document.createElement('div');
    el.className = `float-text ${type}`;
    el.textContent = text;

    el.style.left = `${30 + Math.random() * 40}%`;
    el.style.top = `${40 + Math.random() * 20}%`;

    layer.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1200);
  }

  getLevelTitle(level) {
    if (level >= 5) return '전설의 파인다이닝';
    if (level >= 4) return '럭셔리 다이닝';
    if (level >= 3) return '유명 맛집';
    if (level >= 2) return '동네 소문난 식당';
    return '초보 식당';
  }
}
