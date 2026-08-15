/* ==========================================================================
   Gourmet Restaurant Tycoon - Game Master Data & Definitions
   ========================================================================== */

export const INITIAL_STATE = {
  restaurantName: "고메 레스토랑",
  day: 1,
  timeMinutes: 9 * 60, // 09:00 AM (in minutes, 9:00 ~ 22:00 = 13h = 780 mins)
  isOpen: false,
  money: 50000,
  reputation: 4.5,
  level: 1,
  speed: 1, // 1x, 2x, 3x

  // Floor & Tables
  maxTables: 4,
  maxQueue: 5,

  // Kitchen
  stoveSlotsCount: 2,
  cookSpeedBonus: 1.0, // Multiplier (1.0 = normal, 0.7 = 30% faster)

  // Staff
  chefsCount: 1,
  waitersCount: 1,

  // Interior Decor
  patienceMultiplier: 1.0,

  // Unlocked Recipes (Array of recipe IDs)
  unlockedRecipes: ["ramen", "gimbap"],

  // Stats for the day
  todayStats: {
    revenue: 0,
    tips: 0,
    expenses: 0,
    customersServed: 0,
    customersLeft: 0,
    ratingsReceived: []
  }
};

export const RECIPES = {
  gimbap: {
    id: "gimbap",
    name: "고소한 참치김밥",
    icon: "🍙",
    category: "한식",
    price: 8000,
    cost: 2500,
    cookTime: 6.0, // seconds
    unlockCost: 0, // default unlocked
    desc: "신선한 재료로 정성스럽게 말아낸 대표 분식 레시피."
  },
  ramen: {
    id: "ramen",
    name: "얼큰한 얼큰라면",
    icon: "🍜",
    category: "한식",
    price: 10000,
    cost: 3000,
    cookTime: 8.0,
    unlockCost: 0, // default unlocked
    desc: "계란과 대파를 듬뿍 넣은 진하고 얼큰한 라면."
  },
  burger: {
    id: "burger",
    name: "클래식 치즈버거",
    icon: "🍔",
    category: "양식",
    price: 15000,
    cost: 5000,
    cookTime: 11.0,
    unlockCost: 40000,
    desc: "육즙 가득한 패티와 멜팅 치즈의 조화."
  },
  pasta: {
    id: "pasta",
    name: "트러플 크림 파스타",
    icon: "🍝",
    category: "양식",
    price: 22000,
    cost: 7000,
    cookTime: 13.0,
    unlockCost: 80000,
    desc: "향긋한 트러플 오일이 가미된 풍미 깊은 크림 파스타."
  },
  sushi: {
    id: "sushi",
    name: "특선 연어 초밥 셋트",
    icon: "🍣",
    category: "일식",
    price: 28000,
    cost: 10000,
    cookTime: 15.0,
    unlockCost: 150000,
    desc: "입안에서 부드럽게 녹아내리는 연어 초밥 정식."
  },
  steak: {
    id: "steak",
    name: "프라임 안심 스테이크",
    icon: "🥩",
    category: "양식",
    price: 45000,
    cost: 16000,
    cookTime: 18.0,
    unlockCost: 300000,
    desc: "최상급 미디엄 웰던 불맛 안심 스테이크."
  },
  dessert: {
    id: "dessert",
    name: "달콤 시그니처 케이크",
    icon: "🍰",
    category: "디저트",
    price: 14000,
    cost: 4000,
    cookTime: 7.0,
    unlockCost: 60000,
    desc: "식후 디저트로 인기 폭발인 푹신한 조각 케이크."
  }
};

export const CUSTOMER_TYPES = {
  student: {
    name: "학생",
    icons: ["🧑‍🎓", "👩‍🎓"],
    patienceSec: 35,
    tipRate: 0.1,
    spawnWeight: 30
  },
  worker: {
    name: "성급한 직장인",
    icons: ["👨‍💼", "👩‍💼"],
    patienceSec: 28,
    tipRate: 0.2,
    spawnWeight: 40
  },
  critic: {
    name: "미식가 평론가",
    icons: ["🧐", "🕵️‍♂️"],
    patienceSec: 32,
    tipRate: 0.35,
    spawnWeight: 10
  },
  vip: {
    name: "VIP 단골 손님",
    icons: ["🤴", "👸"],
    patienceSec: 40,
    tipRate: 0.5,
    spawnWeight: 10
  },
  family: {
    name: "가족 단위 손님",
    icons: ["👨‍👩‍👧", "👨‍👩‍👦"],
    patienceSec: 42,
    tipRate: 0.25,
    spawnWeight: 10
  }
};

export const UPGRADES = {
  stoves: [
    { level: 2, name: "조리대 3구 증설", cost: 30000, slots: 3, speedBonus: 1.0, desc: "동시에 3개의 요리를 조리할 수 있습니다." },
    { level: 3, name: "조리대 4구 및 가스화력 강화", cost: 80000, slots: 4, speedBonus: 0.85, desc: "조리 슬롯 4개 + 조리 속도 15% 상승!" },
    { level: 4, name: "하이테크 전자동 조리 시스템", cost: 200000, slots: 5, speedBonus: 0.7, desc: "조리 슬롯 5개 + 조리 속도 30% 상승!" }
  ],
  tables: [
    { count: 6, name: "홀 테이블 확장 (6개)", cost: 40000, desc: "동시 수용 가능 테이블이 6개로 늘어납니다." },
    { count: 8, name: "대형 프리미엄 홀 (8개)", cost: 100000, desc: "동시 수용 가능 테이블이 8개로 늘어납니다." },
    { count: 10, name: "VIP 럭셔리 라운지 (10개)", cost: 250000, desc: "동시 수용 가능 테이블이 10개로 늘어납니다." }
  ],
  staff: {
    chef: { name: "보조 셰프 고용", cost: 60000, dailySalary: 15000, desc: "주방에서 대기 중인 요리를 자동으로 조리 시작합니다." },
    waiter: { name: "서빙 알바 고용", cost: 45000, dailySalary: 10000, desc: "완성된 요리를 알아서 손님에게 전달하고 빈 테이블을 청소합니다." }
  },
  interior: [
    { id: "decor1", name: "안락한 푹신 소파", cost: 35000, patienceBonus: 1.15, desc: "손님의 인내심이 15% 더 오래 유지됩니다." },
    { id: "decor2", name: "고급 인테리어 조명 & 은은한 음악", cost: 90000, patienceBonus: 1.3, desc: "손님의 인내심이 30% 더 오래 유지됩니다." },
    { id: "decor3", name: "미슐랭 럭셔리 다이닝 분위기", cost: 220000, patienceBonus: 1.5, desc: "손님의 인내심이 50% 폭증합니다." }
  ]
};

export const RANDOM_EVENTS = [
  {
    id: "influencer",
    title: "📢 SNS 인플루언서 맛집 리뷰!",
    desc: "유명 유튜버의 방문 효과로 오늘 모든 메뉴 가격이 1.5배 상승하고 손님이 몰려듭니다!",
    priceMultiplier: 1.5,
    spawnRateMultiplier: 1.8
  },
  {
    id: "discount",
    title: "🥬 식자재 도매 시장 파격 세일!",
    desc: "신선한 재료 원가가 절반으로 낮아졌습니다! (재료비 50% 할인)",
    costMultiplier: 0.5
  },
  {
    id: "inspection",
    title: "🔍 위생 점검원의 기습 방문",
    desc: "깐깐한 위생 점검 중입니다. 손님의 평가가 평점 수치에 더 예밀하게 반영됩니다.",
    patienceMultiplier: 0.85
  }
];
