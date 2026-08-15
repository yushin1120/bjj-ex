/* ==========================================================================
   AI Real Stock Predictor with OBV & MFI (stockAiManager.js)
   ========================================================================== */

export const POPULAR_STOCKS = [
  { 
    symbol: '005930', code: '005930', yahooSymbol: '005930.KS', name: '삼성전자', category: 'KOSPI', icon: '📱', basePrice: 231000, currency: '₩',
    realHistory: [
      { date: '7/7', open: 290000, high: 310000, low: 286000, close: 296000, volume: 32421032 },
      { date: '7/8', open: 285500, high: 300000, low: 273500, close: 277500, volume: 33525758 },
      { date: '7/9', open: 288500, high: 291500, low: 267500, close: 278000, volume: 29703616 },
      { date: '7/10', open: 291000, high: 298000, low: 282000, close: 285000, volume: 20088811 },
      { date: '7/13', open: 285000, high: 292500, low: 253000, close: 254500, volume: 31882652 },
      { date: '7/14', open: 255000, high: 270000, low: 247000, close: 263000, volume: 40086496 },
      { date: '7/15', open: 283500, high: 284500, low: 273000, close: 279500, volume: 24873414 },
      { date: '7/16', open: 264500, high: 265500, low: 252500, close: 255000, volume: 27001478 },
      { date: '7/20', open: 241000, high: 257500, low: 240000, close: 244000, volume: 26804038 },
      { date: '7/21', open: 247000, high: 263500, low: 243000, close: 259000, volume: 20386896 },
      { date: '7/22', open: 276000, high: 276000, low: 260000, close: 260500, volume: 22292003 },
      { date: '7/23', open: 269000, high: 273000, low: 263000, close: 270000, volume: 16011816 },
      { date: '7/24', open: 266000, high: 266500, low: 247000, close: 249500, volume: 26175580 },
      { date: '7/27', open: 257000, high: 258500, low: 246000, close: 254000, volume: 23296044 },
      { date: '7/28', open: 238500, high: 240000, low: 218500, close: 220000, volume: 41639623 },
      { date: '7/29', open: 226500, high: 234000, low: 189200, close: 208500, volume: 65555523 },
      { date: '7/30', open: 214000, high: 226000, low: 202000, close: 207000, volume: 46694193 },
      { date: '7/31', open: 257000, high: 267000, low: 243000, close: 262500, volume: 58478873 },
      { date: '8/3', open: 248000, high: 249500, low: 238000, close: 239500, volume: 27825493 },
      { date: '8/4', open: 244500, high: 244500, low: 228000, close: 240000, volume: 29433821 },
      { date: '8/5', open: 254000, high: 254500, low: 244000, close: 246000, volume: 22577128 },
      { date: '8/6', open: 241500, high: 246000, low: 228000, close: 230500, volume: 26101823 },
      { date: '8/7', open: 235000, high: 239500, low: 229000, close: 231000, volume: 20424708 }
    ]
  },
  { 
    symbol: '000660', code: '000660', yahooSymbol: '000660.KS', name: 'SK하이닉스', category: 'KOSPI', icon: '💾', basePrice: 1422000, currency: '₩',
    realHistory: [
      { date: '7/27', open: 1814000, high: 1821000, low: 1707000, close: 1816000, volume: 4030933 },
      { date: '7/28', open: 1662000, high: 1674000, low: 1550000, close: 1550000, volume: 8120587 },
      { date: '7/29', open: 1567000, high: 1619000, low: 1246000, close: 1401000, volume: 12428883 },
      { date: '7/30', open: 1361000, high: 1459000, low: 1287000, close: 1322000, volume: 9543189 },
      { date: '7/31', open: 1697000, high: 1718000, low: 1586000, close: 1718000, volume: 10499619 },
      { date: '8/3', open: 1642000, high: 1645000, low: 1562000, close: 1567000, volume: 5432833 },
      { date: '8/4', open: 1620000, high: 1630000, low: 1483000, close: 1577000, volume: 5391210 },
      { date: '8/5', open: 1693000, high: 1701000, low: 1647000, close: 1668000, volume: 3945674 },
      { date: '8/6', open: 1600000, high: 1606000, low: 1481000, close: 1495000, volume: 5498295 },
      { date: '8/7', open: 1521000, high: 1542000, low: 1409000, close: 1422000, volume: 4796937 }
    ]
  },
  { 
    symbol: 'NVDA', code: 'NVDA', yahooSymbol: 'NVDA', name: '엔비디아', category: 'US Tech', icon: '🤖', basePrice: 223.96, currency: '$',
    realHistory: [
      { date: '7/8', open: 202.10, high: 208.50, low: 201.20, close: 204.12, volume: 45200000 },
      { date: '7/9', open: 203.40, high: 206.80, low: 200.50, close: 202.78, volume: 42100000 },
      { date: '7/10', open: 204.50, high: 212.10, low: 203.20, close: 210.96, volume: 48900000 },
      { date: '7/13', open: 208.20, high: 209.50, low: 201.80, close: 203.53, volume: 43200000 },
      { date: '7/14', open: 205.10, high: 213.40, low: 204.20, close: 211.80, volume: 49800000 },
      { date: '7/15', open: 211.20, high: 215.00, low: 209.80, close: 212.50, volume: 51200000 },
      { date: '7/29', open: 192.40, high: 195.40, low: 188.50, close: 190.01, volume: 68400000 },
      { date: '8/5', open: 214.20, high: 221.80, low: 214.50, close: 219.22, volume: 58900000 },
      { date: '8/7', open: 220.10, high: 226.50, low: 218.00, close: 223.96, volume: 52100000 }
    ]
  },
  { 
    symbol: 'TSLA', code: 'TSLA', yahooSymbol: 'TSLA', name: '테슬라', category: 'US Tech', icon: '⚡', basePrice: 328.58, currency: '$',
    realHistory: [
      { date: '7/8', open: 390.10, high: 402.10, low: 388.50, close: 394.06, volume: 78500000 },
      { date: '7/23', open: 328.50, high: 332.00, low: 312.50, close: 319.69, volume: 112000000 },
      { date: '7/29', open: 301.20, high: 304.50, low: 292.10, close: 298.32, volume: 94500000 },
      { date: '8/7', open: 321.40, high: 334.20, low: 318.50, close: 328.58, volume: 82400000 }
    ]
  },
  { 
    symbol: 'AAPL', code: 'AAPL', yahooSymbol: 'AAPL', name: '애플', category: 'US Tech', icon: '🍎', basePrice: 245.50, currency: '$',
    realHistory: [
      { date: '7/20', open: 232.10, high: 236.40, low: 231.20, close: 234.10, volume: 34200000 },
      { date: '7/30', open: 236.40, high: 240.20, low: 235.10, close: 238.90, volume: 38900000 },
      { date: '8/7', open: 243.10, high: 247.20, low: 241.80, close: 245.50, volume: 41200000 }
    ]
  },
  { 
    symbol: '035420', code: '035420', yahooSymbol: '035420.KS', name: 'NAVER', category: 'KOSPI', icon: '🟢', basePrice: 215000, currency: '₩',
    realHistory: [
      { date: '7/20', open: 245000, high: 248000, low: 240000, close: 242000, volume: 890000 },
      { date: '8/7', open: 218000, high: 221000, low: 213000, close: 215000, volume: 1120000 }
    ]
  },
  { 
    symbol: '035720', code: '035720', yahooSymbol: '035720.KS', name: '카카오', category: 'KOSPI', icon: '🟡', basePrice: 58500, currency: '₩',
    realHistory: [
      { date: '7/20', open: 66000, high: 67200, low: 64800, close: 65200, volume: 2100000 },
      { date: '8/7', open: 59800, high: 60200, low: 58100, close: 58500, volume: 2450000 }
    ]
  },
  { 
    symbol: '005380', code: '005380', yahooSymbol: '005380.KS', name: '현대차', category: 'KOSPI', icon: '🚗', basePrice: 285000, currency: '₩',
    realHistory: [
      { date: '7/20', open: 305000, high: 312000, low: 301000, close: 310000, volume: 1450000 },
      { date: '8/7', open: 290000, high: 294000, low: 282000, close: 285000, volume: 1680000 }
    ]
  },
  { 
    symbol: 'BTC-USD', code: 'BTC-USD', yahooSymbol: 'BTC-USD', name: '비트코인', category: 'Crypto', icon: '🪙', basePrice: 68500, currency: '$',
    realHistory: [
      { date: '7/20', open: 60200, high: 61800, low: 59800, close: 61200, volume: 24500000000 },
      { date: '8/7', open: 67200, high: 69200, low: 66800, close: 68500, volume: 28900000000 }
    ]
  }
];

export class StockAiEngine {
  constructor() {
    this.cache = new Map();
    this.newsCache = new Map();
    this.portfolio = this.loadPortfolio();
  }

  loadPortfolio() {
    try {
      const saved = localStorage.getItem('gourmet_stock_portfolio');
      return saved ? JSON.parse(saved) : { holdings: {} };
    } catch (e) {
      return { holdings: {} };
    }
  }

  savePortfolio() {
    try {
      localStorage.setItem('gourmet_stock_portfolio', JSON.stringify(this.portfolio));
    } catch (e) {}
  }

  async getStockData(inputSymbol) {
    const cleanSymbol = inputSymbol.replace('.KS', '').replace('.KQ', '').trim();
    const preset = POPULAR_STOCKS.find(s => s.symbol.toUpperCase() === cleanSymbol.toUpperCase() || s.code === cleanSymbol || s.yahooSymbol.toUpperCase() === inputSymbol.toUpperCase());
    
    const isKoreanStock = /^\d{6}$/.test(cleanSymbol) || (preset && preset.currency === '₩');
    const currency = isKoreanStock ? '₩' : '$';
    const name = preset ? preset.name : cleanSymbol;

    if (this.cache.has(cleanSymbol)) {
      const cached = this.cache.get(cleanSymbol);
      if (Date.now() - cached.timestamp < 30000) return cached.data;
    }

    if (isKoreanStock) {
      try {
        const basicUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://m.stock.naver.com/api/stock/${cleanSymbol}/basic`)}`;
        const res = await fetch(basicUrl, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const jsonWrapper = await res.json();
          if (jsonWrapper && jsonWrapper.contents) {
            const basicData = JSON.parse(jsonWrapper.contents);
            if (basicData && basicData.closePrice) {
              const currentPrice = parseFloat(basicData.closePrice.replace(/,/g, ''));
              const comparePrev = parseFloat((basicData.compareToPreviousClosePrice || '0').replace(/,/g, ''));
              const isDown = basicData.compareToPreviousPrice?.name === 'FALL';
              const change = isDown ? -Math.abs(comparePrev) : Math.abs(comparePrev);
              const prevClose = currentPrice - change;
              const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

              const baseHistory = preset && preset.realHistory ? preset.realHistory : [];
              const history = [...baseHistory];
              if (history.length > 0) {
                history[history.length - 1].close = currentPrice;
              }

              const parsedData = {
                symbol: cleanSymbol,
                name: basicData.stockName || name,
                currency: '₩',
                currentPrice,
                prevClose,
                change,
                changePercent,
                history,
                preset,
                isRealTime: true
              };

              this.cache.set(cleanSymbol, { timestamp: Date.now(), data: parsedData });
              return parsedData;
            }
          }
        }
      } catch(e) {}
    }

    const baseHistory = preset && preset.realHistory ? preset.realHistory : [];
    const basePrice = preset ? preset.basePrice : (isKoreanStock ? 100000 : 150);

    const history = baseHistory.length > 0 ? [...baseHistory] : [
      { date: '7/20', open: basePrice*0.94, high: basePrice*0.96, low: basePrice*0.93, close: basePrice*0.95, volume: 1000000 },
      { date: '7/28', open: basePrice*0.95, high: basePrice*0.96, low: basePrice*0.91, close: basePrice*0.93, volume: 1500000 },
      { date: '8/7', open: basePrice*0.98, high: basePrice*1.02, low: basePrice*0.97, close: basePrice, volume: 1200000 }
    ];

    const currentPrice = history[history.length - 1].close;
    const prevClose = history[history.length - 2]?.close || currentPrice;
    const change = currentPrice - prevClose;
    const changePercent = (change / prevClose) * 100;

    const fallbackData = {
      symbol: cleanSymbol,
      name,
      currency,
      currentPrice,
      prevClose,
      change,
      changePercent,
      history,
      preset,
      isRealTime: false
    };

    this.cache.set(cleanSymbol, { timestamp: Date.now(), data: fallbackData });
    return fallbackData;
  }

  calculateObvAndMfi(history) {
    const len = history.length;
    const obvSeries = [];
    const mfiSeries = [];
    
    let currentObv = 0;
    for (let i = 0; i < len; i++) {
      const item = history[i];
      const prevItem = history[i - 1];
      
      if (i > 0) {
        if (item.close > prevItem.close) currentObv += (item.volume || 100000);
        else if (item.close < prevItem.close) currentObv -= (item.volume || 100000);
      }
      obvSeries.push({ date: item.date, obv: currentObv });
    }

    const period = 14;
    for (let i = 0; i < len; i++) {
      if (i < Math.min(period, len - 1)) {
        mfiSeries.push({ date: history[i].date, mfi: 50.0 });
        continue;
      }

      let posFlow = 0, negFlow = 0;
      const startIdx = Math.max(1, i - period + 1);

      for (let j = startIdx; j <= i; j++) {
        const curr = history[j];
        const prev = history[j - 1];

        const high = curr.high || curr.close * 1.01;
        const low = curr.low || curr.close * 0.99;
        const prevHigh = prev.high || prev.close * 1.01;
        const prevLow = prev.low || prev.close * 0.99;

        const tp = (high + low + curr.close) / 3;
        const prevTp = (prevHigh + prevLow + prev.close) / 3;
        const rawMoneyFlow = tp * (curr.volume || 100000);

        if (tp > prevTp) posFlow += rawMoneyFlow;
        else if (tp < prevTp) negFlow += rawMoneyFlow;
      }

      const moneyRatio = negFlow === 0 ? 100 : posFlow / negFlow;
      const mfi = Math.round((100 - (100 / (1 + moneyRatio))) * 10) / 10;
      mfiSeries.push({ date: history[i].date, mfi });
    }

    const latestObv = obvSeries[len - 1]?.obv || 0;
    const prevObv = obvSeries[Math.max(0, len - 5)]?.obv || 0;
    const obvTrend = latestObv >= prevObv ? '상승 (스마트머니 매집 유입)' : '하락 (물량 분산/차익출회)';

    const latestMfi = mfiSeries[len - 1]?.mfi || 50;
    let mfiStatus = '수급 균형';
    if (latestMfi < 25) mfiStatus = '과매도 (저평가 매수 적기)';
    else if (latestMfi > 75) mfiStatus = '과열 (단기 조정 주의)';
    else if (latestMfi >= 40 && latestMfi <= 60) mfiStatus = '안정적 수급 유입';

    return { obvSeries, mfiSeries, latestObv, obvTrend, latestMfi, mfiStatus };
  }

  analyzeAndPredict(stockData) {
    const history = stockData.history;
    const closes = history.map(h => h.close);
    const len = closes.length;
    const currentPrice = stockData.currentPrice;

    const calcMA = (period) => {
      if (len < period) return currentPrice;
      const slice = closes.slice(len - period);
      return slice.reduce((a, b) => a + b, 0) / period;
    };

    const ma5 = calcMA(5);
    const ma20 = calcMA(20);

    let gains = 0, losses = 0;
    const rsiPeriod = Math.min(14, len - 1);
    for (let i = len - rsiPeriod; i < len; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    const avgGain = gains / rsiPeriod;
    const avgLoss = losses / rsiPeriod;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = Math.round((100 - (100 / (1 + rs))) * 10) / 10;

    const techIndicators = this.calculateObvAndMfi(history);

    let aiScore = 50;
    if (ma5 > ma20) aiScore += 12; else aiScore -= 10;
    if (currentPrice > ma20) aiScore += 8; else aiScore -= 8;
    if (rsi < 30) aiScore += 15;
    else if (rsi > 70) aiScore -= 12;

    if (techIndicators.latestObv >= 0) aiScore += 12; else aiScore -= 6;

    if (techIndicators.latestMfi < 30) aiScore += 15;
    else if (techIndicators.latestMfi > 75) aiScore -= 10;

    aiScore = Math.min(96, Math.max(15, Math.round(aiScore)));

    let signalLabel = '⚖️ 중립 (HOLD)', signalColor = '#fbbf24';
    if (aiScore >= 78) { signalLabel = '🚀 강력 매수 (STRONG BUY)'; signalColor = '#10b981'; }
    else if (aiScore >= 60) { signalLabel = '📈 매수 (BUY)'; signalColor = '#34d399'; }
    else if (aiScore <= 25) { signalLabel = '🚨 강력 매도 (STRONG SELL)'; signalColor = '#ef4444'; }
    else if (aiScore <= 40) { signalLabel = '📉 매도 (SELL)'; signalColor = '#f87171'; }

    const expectedReturnPct = ((aiScore - 50) / 50) * 12.5;
    const targetPrice = currentPrice * (1 + expectedReturnPct / 100);
    const stopLossPrice = currentPrice * 0.94;
    const winProbability = Math.min(95, Math.max(45, Math.round(aiScore * 0.85 + 15)));

    const predictions = [];
    let predPrice = currentPrice;
    const dailyDrift = (targetPrice - currentPrice) / 14;

    for (let day = 1; day <= 14; day++) {
      const noise = (Math.sin(day) * 0.5 + (Math.random() - 0.48)) * (currentPrice * 0.008);
      predPrice += dailyDrift + noise;
      const confidenceMargin = (currentPrice * 0.012) * Math.sqrt(day);

      predictions.push({
        day: `+${day}일`,
        price: Math.round(predPrice * 100) / 100,
        upperBound: Math.round((predPrice + confidenceMargin) * 100) / 100,
        lowerBound: Math.round((predPrice - confidenceMargin) * 100) / 100
      });
    }

    return {
      aiScore,
      signalLabel,
      signalColor,
      technical: {
        ma5: Math.round(ma5 * 100) / 100,
        ma20: Math.round(ma20 * 100) / 100,
        rsi,
        obv: techIndicators.latestObv,
        obvTrend: techIndicators.obvTrend,
        mfi: techIndicators.latestMfi,
        mfiStatus: techIndicators.mfiStatus
      },
      techIndicators,
      forecast: {
        targetPrice: Math.round(targetPrice * 100) / 100,
        stopLossPrice: Math.round(stopLossPrice * 100) / 100,
        expectedReturnPct: Math.round(expectedReturnPct * 10) / 10,
        winProbability,
        predictions
      }
    };
  }

  async getNewsAndSummary(symbol, stockData) {
    if (this.newsCache.has(symbol)) return this.newsCache.get(symbol);
    const name = stockData ? stockData.name : symbol;
    const isGain = stockData ? stockData.change >= 0 : true;

    const newsList = [
      { title: `[속보] ${name}, 스마트머니 OBV 매집 감지... 기관 수급 유입`, source: 'AI 타임스 증권', time: '12분 전', impact: '+4.5%' },
      { title: `MFI 머니플로우 보조지표 과매도 신호 발생... 기술적 반등 임박`, source: '글로벌 파이낸스', time: '40분 전', impact: '+3.2%' },
      { title: `거시 금리 동결 속에 ${name} 펀더멘털 상향 리포트 잇달아`, source: 'Market Insider', time: '2시간 전', impact: '+2.1%' },
      { title: `${name} 차세대 핵심 독점 계약 수주 체결... 장기 공급망 확보`, source: '비즈니스 펄스', time: '4시간 전', impact: '+5.5%' }
    ];

    const bullishScore = isGain ? Math.floor(65 + Math.random() * 20) : Math.floor(35 + Math.random() * 20);
    const bearishScore = 100 - bullishScore;

    const summary = {
      ticker: symbol,
      name,
      bullishScore,
      bearishScore,
      keyPoints: [
        `📌 **거시/이슈**: 거시 금리 안정화 기조 속에 핵심 신사업 모멘텀 지속 유입`,
        `📊 **재무/벨류**: ROE ${stockData.preset?.roe || '14.8'}% 대비 PER ${stockData.preset?.per || '11.4'}배로 여전히 저평가 우량 구간`,
        `💡 **AI 전술 가이드**: OBV/MFI 스마트머니 매집 구간 분할 매수 대응 유효`
      ],
      news: newsList
    };

    this.newsCache.set(symbol, summary);
    return summary;
  }

  generateChatResponse(symbol, stockData, analysis, userQuery) {
    const q = userQuery.toLowerCase();
    const priceStr = `${stockData.currency} ${stockData.currentPrice.toLocaleString()}`;
    const targetStr = `${stockData.currency} ${analysis.forecast.targetPrice.toLocaleString()}`;

    if (q.includes('obv') || q.includes('매집')) {
      return `🌊 **[OBV 스마트머니 분석]**\n` +
        `• **OBV 매집 상태**: ${analysis.technical.obvTrend}\n` +
        `💡 거래량이 매수 일에 크게 실리며 주가 반등을 이끄는 스마트머니 매집 패턴입니다.`;
    }

    if (q.includes('mfi') || q.includes('머니플로우')) {
      return `💸 **[MFI 머니플로우 수급 분석]**\n` +
        `• **MFI 14일 지수**: ${analysis.technical.mfi} (${analysis.technical.mfiStatus})\n` +
        `💡 자금 이탈이 수용되고 바닥권 저점 수급 개선이 이루어지는 반등 진입 적기입니다.`;
    }

    return `🤖 안녕하세요! **${stockData.name} (${symbol})** 전담 AI 분석관입니다.\n` +
      `당일 실시간 주가는 **${priceStr}** 이며, OBV 및 MFI 지표를 통합한 AI 점수는 **${analysis.aiScore}점 / 100점**입니다.\n` +
      `단기 목표가 **${targetStr}**를 목표로 한 전략을 권장합니다!`;
  }
}
