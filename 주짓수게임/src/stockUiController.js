/* ==========================================================================
   AI Stock UI Controller & Multi-Mode Canvas Renderer (stockUiController.js)
   ========================================================================== */

import { StockAiEngine, POPULAR_STOCKS } from './stockAiManager.js';

export class StockUiController {
  constructor(gameEngine) {
    this.game = gameEngine;
    this.engine = new StockAiEngine();
    this.currentSymbol = '005930';
    this.currentData = null;
    this.currentAnalysis = null;
    this.currentNews = null;
    this.activeTab = 'tab-stock-news';
    this.activeChartMode = 'price'; // 'price', 'obv', 'mfi'
    this.chatMessages = [];
  }

  init() {
    this.bindEvents();
    this.renderPresets();
  }

  renderPresets() {
    const container = document.getElementById('stock-presets-list');
    if (!container) return;

    container.innerHTML = POPULAR_STOCKS.map(s => `
      <button class="stock-preset-pill ${s.symbol === this.currentSymbol || s.code === this.currentSymbol ? 'active' : ''}" data-symbol="${s.symbol}">
        ${s.icon} ${s.name}
      </button>
    `).join('');
  }

  bindEvents() {
    const modalOverlay = document.getElementById('modal-stock-ai');
    const openBtn = document.getElementById('btn-open-stock-ai');
    const openNavBtn = document.getElementById('btn-open-stock-ai-nav');
    const closeBtn = document.getElementById('btn-close-stock-ai');
    const searchBtn = document.getElementById('btn-stock-search');
    const searchInput = document.getElementById('stock-search-input');
    const presetsList = document.getElementById('stock-presets-list');

    const handleOpen = () => {
      if (modalOverlay) modalOverlay.classList.add('open');
      this.loadStock(this.currentSymbol);
    };

    if (openBtn) openBtn.addEventListener('click', handleOpen);
    if (openNavBtn) openNavBtn.addEventListener('click', handleOpen);
    if (closeBtn) closeBtn.addEventListener('click', () => modalOverlay && modalOverlay.classList.remove('open'));

    if (searchBtn && searchInput) {
      const doSearch = () => {
        const val = searchInput.value.trim().toUpperCase();
        if (val) {
          this.loadStock(val);
        }
      };
      searchBtn.addEventListener('click', doSearch);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch();
      });
    }

    if (presetsList) {
      presetsList.addEventListener('click', (e) => {
        const pill = e.target.closest('.stock-preset-pill');
        if (pill) {
          const sym = pill.getAttribute('data-symbol');
          if (sym) {
            this.currentSymbol = sym;
            this.renderPresets();
            this.loadStock(sym);
          }
        }
      });
    }

    document.querySelectorAll('.stock-sub-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.stock-sub-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.activeTab = e.target.getAttribute('data-tab');
        this.renderActiveTabContent();
      });
    });
  }

  async loadStock(symbol) {
    this.currentSymbol = symbol;
    const priceDisplay = document.getElementById('stock-price-display');
    if (priceDisplay) priceDisplay.textContent = '당일 실시간 시세 연결 중...';

    try {
      this.currentData = await this.engine.getStockData(symbol);
      this.currentAnalysis = this.engine.analyzeAndPredict(this.currentData);
      this.currentNews = await this.engine.getNewsAndSummary(symbol, this.currentData);

      this.renderBanner();
      this.renderAiCard();
      this.drawChart();
      this.renderActiveTabContent();

      if (this.chatMessages.length === 0) {
        this.chatMessages.push({
          sender: 'ai',
          text: `🤖 안녕하세요! **${this.currentData.name}** OBV/MFI 기술분석 리포트가 준비되었습니다. 당일 실시간가: **${this.currentData.currency} ${this.currentData.currentPrice.toLocaleString()}**`
        });
      }
    } catch (e) {
      console.error('[StockUI] Error loading stock:', e);
    }
  }

  renderBanner() {
    const data = this.currentData;
    if (!data) return;

    const nameDisp = document.getElementById('stock-name-display');
    const liveBadge = document.getElementById('stock-live-badge');
    const priceDisp = document.getElementById('stock-price-display');
    const changeDisp = document.getElementById('stock-change-display');

    if (nameDisp) {
      const preset = POPULAR_STOCKS.find(s => s.symbol === data.symbol || s.code === data.symbol);
      nameDisp.innerHTML = `${preset ? preset.icon : '📈'} ${data.name} <span class="stock-symbol-tag" id="stock-symbol-display">${data.symbol}</span>`;
    }

    if (liveBadge) {
      liveBadge.textContent = data.isRealTime ? '🟢 당일 실시간 LIVE' : '⚡ 당일 시세 API';
      liveBadge.className = `stock-live-badge ${data.isRealTime ? 'realtime' : ''}`;
    }

    if (priceDisp) {
      priceDisp.textContent = `${data.currency} ${data.currentPrice.toLocaleString()}`;
    }

    if (changeDisp) {
      const isUp = data.change >= 0;
      changeDisp.className = `stock-change-tag ${isUp ? 'up' : 'down'}`;
      const sign = isUp ? '+' : '';
      changeDisp.textContent = `${sign}${data.currency}${Math.abs(data.change).toLocaleString()} (${sign}${data.changePercent.toFixed(2)}%)`;
    }
  }

  renderAiCard() {
    const analysis = this.currentAnalysis;
    const data = this.currentData;
    if (!analysis || !data) return;

    const badge = document.getElementById('ai-signal-badge');
    const scoreNum = document.getElementById('ai-score-num');
    const targetPrice = document.getElementById('ai-target-price');
    const winRate = document.getElementById('ai-win-rate');
    const rsiVal = document.getElementById('ai-rsi-val');
    const stopLoss = document.getElementById('ai-stop-loss');

    if (badge) {
      badge.textContent = analysis.signalLabel;
      badge.style.color = analysis.signalColor;
      badge.style.borderColor = analysis.signalColor;
    }

    if (scoreNum) scoreNum.textContent = `${analysis.aiScore} / 100`;

    if (targetPrice) {
      const sign = analysis.forecast.expectedReturnPct >= 0 ? '+' : '';
      targetPrice.textContent = `${data.currency} ${analysis.forecast.targetPrice.toLocaleString()} (${sign}${analysis.forecast.expectedReturnPct}%)`;
    }

    if (winRate) winRate.textContent = `${analysis.forecast.winProbability}%`;

    if (rsiVal) {
      const rsi = analysis.technical.rsi;
      const mfi = analysis.technical.mfi;
      rsiVal.textContent = `RSI ${rsi} | MFI ${mfi} (${analysis.technical.mfiStatus})`;
    }

    if (stopLoss) stopLoss.textContent = `${data.currency} ${analysis.forecast.stopLossPrice.toLocaleString()} (-6.0%)`;
  }

  drawChart() {
    const canvas = document.getElementById('stockChartCanvas');
    if (!canvas || !this.currentData || !this.currentAnalysis) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);

    const history = this.currentData.history;
    const predictions = this.currentAnalysis.forecast.predictions;

    const histPrices = history.map(h => h.close);
    const predPrices = predictions.map(p => p.price);
    const allPrices = [...histPrices, ...predPrices];
    const minP = Math.min(...allPrices) * 0.98;
    const maxP = Math.max(...allPrices) * 1.02;

    const paddingLeft = 55, paddingRight = 20, paddingTop = 20, paddingBottom = 30;
    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    const getX = (idx, total) => paddingLeft + (idx / (total - 1)) * chartW;
    const getY = (val) => paddingTop + chartH - ((val - minP) / (maxP - minP)) * chartH;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = paddingTop + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      const priceVal = maxP - (i / 4) * (maxP - minP);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(priceVal).toLocaleString(), paddingLeft - 8, y + 3);
    }

    const totalPoints = history.length + predictions.length;
    const splitX = getX(history.length - 1, totalPoints);

    // AI Confidence Band
    ctx.beginPath();
    ctx.moveTo(splitX, getY(history[history.length - 1].close));

    predictions.forEach((p, idx) => {
      const x = getX(history.length + idx, totalPoints);
      ctx.lineTo(x, getY(p.upperBound));
    });

    for (let idx = predictions.length - 1; idx >= 0; idx--) {
      const x = getX(history.length + idx, totalPoints);
      ctx.lineTo(x, getY(predictions[idx].lowerBound));
    }
    ctx.closePath();

    const bandGrad = ctx.createLinearGradient(0, 0, 0, height);
    bandGrad.addColorStop(0, 'rgba(168, 85, 247, 0.18)');
    bandGrad.addColorStop(1, 'rgba(168, 85, 247, 0.02)');
    ctx.fillStyle = bandGrad;
    ctx.fill();

    // Historical Close Line
    ctx.beginPath();
    history.forEach((h, idx) => {
      const x = getX(idx, totalPoints);
      const y = getY(h.close);
      if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });

    const lineGrad = ctx.createLinearGradient(0, 0, 0, height);
    lineGrad.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
    lineGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.lineTo(splitX, height - paddingBottom);
    ctx.lineTo(paddingLeft, height - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = lineGrad;
    ctx.fill();

    // Dotted AI Future Line
    ctx.beginPath();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;

    ctx.moveTo(splitX, getY(history[history.length - 1].close));
    predictions.forEach((p, idx) => {
      const x = getX(history.length + idx, totalPoints);
      const y = getY(p.price);
      ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }

  renderActiveTabContent() {
    const container = document.getElementById('stock-tab-content');
    if (!container) return;

    if (this.activeTab === 'tab-stock-news') this.renderNewsTab(container);
    else if (this.activeTab === 'tab-stock-chat') this.renderChatTab(container);
    else if (this.activeTab === 'tab-stock-trade') this.renderTradeTab(container);
  }

  renderNewsTab(container) {
    const news = this.currentNews;
    if (!news) return;

    container.innerHTML = `
      <div class="news-summary-box">
        <div class="news-summary-title">🤖 AI 3줄 실시간 수급 및 뉴스 요약</div>
        <div class="news-keypoints-list">
          ${news.keyPoints.map(pt => `<div>${pt}</div>`).join('')}
        </div>
        <div class="sentiment-bar-container">
          <div class="sentiment-label">
            <span class="bull">🔥 AI 상승 여론 (${news.bullishScore}%)</span>
            <span class="bear">❄️ 하락 리스크 (${news.bearishScore}%)</span>
          </div>
          <div class="sentiment-progress">
            <div class="sentiment-fill" style="width: ${news.bullishScore}%;"></div>
          </div>
        </div>
      </div>

      <div style="font-weight: 800; font-size: 0.9rem; color: #cbd5e1; margin-bottom: 8px;">📰 관련 실시간 주요 속보</div>
      <div class="news-feed-grid">
        ${news.news.map(n => `
          <div class="news-item-card">
            <div class="news-item-title">${n.title}</div>
            <div class="news-item-meta">
              <span>${n.source} • ${n.time}</span>
              <span class="news-impact-tag">${n.impact}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderChatTab(container) {
    container.innerHTML = `
      <div class="stock-chat-container">
        <div class="chat-history-box" id="chat-history-box">
          ${this.chatMessages.map(m => `
            <div class="chat-msg ${m.sender}">
              ${m.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </div>
          `).join('')}
        </div>
        
        <div class="chat-quick-prompts">
          <button class="quick-chip" data-query="OBV 스마트머니 매집 상태 어때?">🌊 OBV 스마트머니</button>
          <button class="quick-chip" data-query="MFI 머니플로우 수급 지표 알려줘">💸 MFI 수급지표</button>
          <button class="quick-chip" data-query="목표가와 손절가는 얼마인가요?">🎯 목표가 & 손절가</button>
        </div>

        <div class="chat-input-row">
          <input type="text" id="chat-user-input" class="chat-input" placeholder="${this.currentData ? this.currentData.name : '주식'} OBV/MFI 질문...">
          <button id="btn-send-chat" class="btn-send-chat">전송</button>
        </div>
      </div>
    `;

    const historyBox = document.getElementById('chat-history-box');
    const input = document.getElementById('chat-user-input');
    const sendBtn = document.getElementById('btn-send-chat');

    if (historyBox) historyBox.scrollTop = historyBox.scrollHeight;

    const sendMessage = (queryText) => {
      const q = queryText || (input ? input.value.trim() : '');
      if (!q || !this.currentData || !this.currentAnalysis) return;

      this.chatMessages.push({ sender: 'user', text: q });
      if (input) input.value = '';

      const aiReply = this.engine.generateChatResponse(
        this.currentSymbol,
        this.currentData,
        this.currentAnalysis,
        q
      );

      this.chatMessages.push({ sender: 'ai', text: aiReply });
      this.renderChatTab(container);
    };

    if (sendBtn) sendBtn.addEventListener('click', () => sendMessage());
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    container.querySelectorAll('.quick-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const q = e.target.getAttribute('data-query');
        sendMessage(q);
      });
    });
  }

  renderTradeTab(container) {
    const data = this.currentData;
    if (!data) return;

    const userMoney = this.game.state ? this.game.state.money : 50000;
    const holdings = this.engine.portfolio.holdings[data.symbol] || { shares: 0, avgPrice: 0 };
    const currentPriceInKRW = data.currency === '$' ? data.currentPrice * 1350 : data.currentPrice;

    const totalValuation = holdings.shares * currentPriceInKRW;
    const totalCost = holdings.shares * holdings.avgPrice;
    const pnl = totalValuation - totalCost;
    const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

    container.innerHTML = `
      <div class="trade-container">
        <div class="trade-panel">
          <div class="trade-panel-title">🛒 ${data.name} 주식 매수 / 매도</div>
          <div style="font-size: 0.85rem; color: #94a3b8;">
            현재 당일가: <strong style="color:#fff;">₩ ${Math.round(currentPriceInKRW).toLocaleString()}</strong> / 1주<br>
            보유 현금: <strong style="color:#fbbf24;">₩ ${userMoney.toLocaleString()}</strong>
          </div>
          <div class="trade-btn-group">
            <button id="btn-buy-1" class="btn-trade-action btn-trade-buy">1주 매수</button>
            <button id="btn-buy-max" class="btn-trade-action btn-trade-buy" style="background:#059669;">최대 매수</button>
            <button id="btn-sell-all" class="btn-trade-action btn-trade-sell">전량 매도</button>
          </div>
        </div>

        <div class="trade-panel">
          <div class="trade-panel-title">📊 보유 잔고 & 투자 수익률</div>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:0.85rem;">
            <div style="display:flex; justify-between;"><span>보유 주식 수:</span> <strong>${holdings.shares} 주</strong></div>
            <div style="display:flex; justify-between;"><span>평균 매수 단가:</span> <strong>₩ ${Math.round(holdings.avgPrice).toLocaleString()}</strong></div>
            <div style="display:flex; justify-between;"><span>총 평가 금액:</span> <strong>₩ ${Math.round(totalValuation).toLocaleString()}</strong></div>
            <div style="display:flex; justify-between;"><span>평가 손익 (ROI):</span> 
              <strong style="color: ${pnl >= 0 ? '#f87171' : '#60a5fa'};">
                ${pnl >= 0 ? '+' : ''}₩ ${Math.round(pnl).toLocaleString()} (${pnl >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%)
              </strong>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-buy-1')?.addEventListener('click', () => this.executeTrade(data.symbol, currentPriceInKRW, 1));
    document.getElementById('btn-buy-max')?.addEventListener('click', () => {
      const maxShares = Math.floor(userMoney / currentPriceInKRW);
      if (maxShares > 0) this.executeTrade(data.symbol, currentPriceInKRW, maxShares);
    });
    document.getElementById('btn-sell-all')?.addEventListener('click', () => {
      if (holdings.shares > 0) this.executeTrade(data.symbol, currentPriceInKRW, -holdings.shares);
    });
  }

  executeTrade(symbol, priceInKRW, amount) {
    const portfolio = this.engine.portfolio;
    if (!portfolio.holdings[symbol]) portfolio.holdings[symbol] = { shares: 0, avgPrice: 0 };
    const item = portfolio.holdings[symbol];

    if (amount > 0) {
      const cost = priceInKRW * amount;
      if (this.game.state.money < cost) {
        if (this.game.renderer) this.game.renderer.showFloatText("❌ 자금이 부족합니다!", "loss");
        return;
      }
      this.game.state.money -= cost;
      const totalCost = (item.shares * item.avgPrice) + cost;
      item.shares += amount;
      item.avgPrice = totalCost / item.shares;

      if (this.game.renderer) this.game.renderer.showFloatText(`📈 ${amount}주 매수 완료!`, "gain");
    } else {
      const sellShares = Math.abs(amount);
      if (item.shares < sellShares) return;
      const revenue = priceInKRW * sellShares;
      this.game.state.money += revenue;
      item.shares -= sellShares;
      if (item.shares === 0) item.avgPrice = 0;

      if (this.game.renderer) this.game.renderer.showFloatText(`💰 ₩ ${Math.round(revenue).toLocaleString()} 매도 완료!`, "gain");
    }

    this.engine.savePortfolio();
    this.game.renderer.updateHUD();
    this.renderTradeTab(document.getElementById('stock-tab-content'));
  }
}
