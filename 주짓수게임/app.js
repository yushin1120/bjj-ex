/**
 * ==========================================================================
 * 주짓수 기술 승급 수련장 (BJJ Sequence Master)
 * - 메인 로드맵 ⭐ 별 기반 체육관 시설 업그레이드
 * - 레벨비교 55% 기본 승률 기반 마스터 PvP 대전 엔진
 * ==========================================================================
 */

const BELT_RANKS = [
  { id: 'white', name: '화이트벨트', color: '#F8FAFC', textColor: '#0F172A', badge: '⚪ 화이트벨트', reqStars: 0 },
  { id: 'blue', name: '블루벨트', color: '#2563EB', textColor: '#FFFFFF', badge: '🔵 블루벨트', reqStars: 33 }
];

const BJJ_CHARACTERS = [
  {
    id: 'tiger',
    name: '도복 호랑이',
    avatar: '🐯',
    title: '서브미션 공격형',
    desc: '강력한 악력과 맹수 같은 본능으로 서브미션 연계에 강합니다.',
    baseAtk: 15, baseDef: 10, baseSpd: 12
  },
  {
    id: 'bear',
    name: '도복 곰돌이',
    avatar: '🐻',
    title: '가드 패스 방어형',
    desc: '묵직한 체중 압박과 철벽 방어로 상대 가드를 짓누릅니다.',
    baseAtk: 10, baseDef: 18, baseSpd: 8
  },
  {
    id: 'fox',
    name: '도복 여우',
    avatar: '🦊',
    title: '스윕 스피드형',
    desc: '민첩한 스피드와 정교한 타이밍으로 순식간에 상대를 뒤집습니다.',
    baseAtk: 12, baseDef: 9, baseSpd: 18
  },
  {
    id: 'cat',
    name: '도복 고양이',
    avatar: '🐱',
    title: '가드 유연형',
    desc: '유연한 몸놀림으로 어떤 위기에서도 무릎을 넘어 가드로 복귀합니다.',
    baseAtk: 11, baseDef: 15, baseSpd: 14
  }
];

const OPPONENT_BOTS = [
  { name: '화이트벨트 김철수', avatar: '🐼', belt: 'white', level: 1, atk: 14, def: 12, spd: 10 },
  { name: '블루벨트 박지성', avatar: '🦁', belt: 'blue', level: 3, atk: 20, def: 18, spd: 16 },
  { name: '퍼플벨트 이영표', avatar: '🦅', belt: 'purple', level: 5, atk: 28, def: 25, spd: 22 },
  { name: '브라운벨트 강호동', avatar: '🐗', belt: 'brown', level: 8, atk: 38, def: 35, spd: 30 },
  { name: '블랙벨트 릭슨', avatar: '👑', belt: 'black', level: 12, atk: 55, def: 50, spd: 45 }
];

const BJJ_TECHNIQUES = [
  // --- 화이트벨트 커스텀 11단계 ---
  {
    id: 'stage_1_guard_armbar',
    stageNumber: 1,
    name: '클로즈드 가드 암바',
    category: '팔꿈치 관절 꺾기',
    position: '클로즈드 가드 (누워서 다리로 감싼 자세)',
    belt: 'white',
    difficulty: 1,
    icon: '🥋',
    youtubeUrl: 'https://www.youtube.com/watch?v=ynPWc9K0A-k',
    youtubeTitle: '클로즈드 가드 암바 (1분 43초~)',
    description: '가드 상태에서 상대 손목과 팔꿈치를 제압하고 골반을 밟아 엉덩이를 90도 튼 뒤, 머리 위로 다리를 넘겨 팔꿈치를 꺾는 정석 암바예요!',
    steps: [
      { order: 1, title: '상대 손목과 팔꿈치 꽉 잡기', text: '클로즈드 가드에서 한 손은 상대 팔꿈치 깃, 반대 손은 상대 손목을 잡아 밖으로 안 나가게 단단히 그립해요.', tip: '상대 팔이 내 가슴 중앙으로 들어오도록 바짝 끌어당기세요.', stepImgIcon: '1단계' },
      { order: 2, title: '발로 골반 밟고 엉덩이 90도 틀기', text: '가드를 풀고 같은 쪽 발로 상대 골반을 세게 밟으며 엉덩이를 옆으로 90도 틀어 자리를 만들어 줘요.', tip: '엉덩이를 90도 꺾어줘야 암바 각도가 완벽하게 나와요.', stepImgIcon: '2단계' },
      { order: 3, title: '상대 등 뒤에 다리 걸어 위로 짓누르기', text: '반대쪽 다리를 상대 등 뒤로 깊게 올려 상대 상체가 세워지지 못하게 딱 눌러 고정해요.', tip: '상대 상체를 바닥 쪽으로 눌러놓아야 일어서지 못해요.', stepImgIcon: '3단계' },
      { order: 4, title: '상대 얼굴 위로 다리 넘기기', text: '골반을 밟던 다리를 떼어 상대 목과 얼굴 위로 넘어뜨려 꽉 덮어 누르고 내 무릎을 조여요.', tip: '다리를 넘길 때 머리를 꽉 눌러줘야 상대가 빠져나가지 못해요.', stepImgIcon: '4단계' },
      { order: 5, title: '엄지손가락 하늘로 두고 엉덩이 올려 탭 받기', text: '상대 엄지손가락이 하늘을 보게 잡고, 양 무릎을 꼭 조이며 엉덩이를 튕겨 올려 탭을 받아내요.', tip: '팔꿈치가 내 골반 뼈 바로 위 받침점에 걸리도록 엉덩이를 올려야 꺾여요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_2_guard_triangle',
    stageNumber: 2,
    name: '클로즈드 가드 트라이앵글',
    category: '목 조르기 (초크)',
    position: '클로즈드 가드 (누워서 다리로 감싼 자세)',
    belt: 'white',
    difficulty: 1,
    icon: '🔺',
    youtubeUrl: 'https://www.youtube.com/watch?v=dCk0L1Iz4U0',
    youtubeTitle: '클로즈드 가드 트라이앵글 강좌',
    description: '상대 한 팔은 안으로 넣고 한 팔은 바깥으로 뺀 뒤, 양 다리로 삼각 고리를 만들어 상대 목을 꼭 조여주는 대표 초크예요!',
    steps: [
      { order: 1, title: '한 팔은 안으로 넣고 한 팔은 바깥으로 밀기', text: '상대 손목을 잡고 한쪽 팔은 내 가슴 안으로 쏙 넣고 다른 팔은 바깥으로 치워요.', tip: '엉덩이를 튕기면서 한쪽 팔을 빠르게 밀어넣으세요.', stepImgIcon: '1단계' },
      { order: 2, title: '엉덩이 튕겨 올리며 목 뒤로 다리 넘기기', text: '엉덩이를 바닥에서 붕 튕겨 올려 안으로 들어온 팔 쪽 다리를 상대 목 뒤로 높게 걸어요.', tip: '엉덩이를 높이 들수록 상대 목에 다리가 쏙 안착돼요.', stepImgIcon: '2단계' },
      { order: 3, title: '상대 머리 끌어내리며 몸 각도 틀기', text: '양 손으로 상대 머리를 끌어내리면서 몸을 대각선 옆으로 슬쩍 틀어 자리를 잡아요.', tip: '상대와 일직선이 아니라 꺾인 각도를 만들어야 단단히 조여져요.', stepImgIcon: '3단계' },
      { order: 4, title: '발목 잡아 오금 뒤로 집어넣어 삼각 다리 고리 잠그기', text: '목 뒤를 감싼 발목을 끌어당겨 반대쪽 무릎 오금 뒤로 깊숙이 넣어 숫자 4자 고리를 완성해요.', tip: '발목을 끌어당겨 오금 깊숙이 껴안아야 통증 없이 조여져요.', stepImgIcon: '4단계' },
      { order: 5, title: '상대 팔 끌어당기고 엉덩이 올려 탭 받기', text: '갇힌 상대 팔을 내 가슴으로 당겨주고 양 무릎을 조이며 엉덩이를 올려 탭을 받아내요.', tip: '상대 팔이 내 가슴을 가로질러야 목이 훨씬 세게 조여져요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_3_single_x_sweep',
    stageNumber: 3,
    name: '싱글엑스가드 스윕',
    category: '상대 뒤집기 (스윕)',
    position: '싱글엑스 가드 (하체 제압 자세)',
    belt: 'white',
    difficulty: 2,
    icon: '🦵',
    youtubeUrl: 'https://www.youtube.com/watch?v=WcXbJ69bMhQ',
    youtubeTitle: '싱글엑스가드 스윕 강좌',
    description: '상대 한쪽 다리를 겨드랑이에 끼고 양 다리로 골반과 오금을 받친 뒤, 엉덩이를 튕겨 올려 넘어뜨리고 일어서는 스윕이에요!',
    steps: [
      { order: 1, title: '상대 한쪽 다리 안아 겨드랑이에 고정하기', text: '오픈 가드에서 상대 한쪽 다리 뒤꿈치를 내 겨드랑이 밑에 꼭 껴안아 겨드랑이 훅을 만들어요.', tip: '상대 뒤꿈치를 꽉 안아야 다리가 빠지지 않아요.', stepImgIcon: '1단계' },
      { order: 2, title: '내 발 안쪽 고리를 상대 골반에 걸기', text: '겨드랑이에 낀 다리 쪽 내 발목을 상대 안쪽 골반 뼈에 딱 걸어 받아내요.', tip: '발목이 골반 뼈에 안착해야 밀어낼 힘이 생겨요.', stepImgIcon: '2단계' },
      { order: 3, title: '반대발 오금에 걸어 싱글엑스 포지션 완성', text: '반대발을 상대 엉덩이 밑 무릎 오금에 대어 상대 한쪽 다리를 두 다리로 차단해요.', tip: '양 다리 고리가 단단히 잠겨야 상대 균형을 허물 수 있어요.', stepImgIcon: '3단계' },
      { order: 4, title: '골반 밀며 엉덩이 튕겨 상대 넘어뜨리기', text: '골반을 짚은 내 다리로 밀면서 엉덩이를 천장으로 튕겨 상대 균형을 깨뜨리고 넘어뜨려요.', tip: '엉덩이를 폭발적으로 튕겨 올려야 상대가 넘어져요.', stepImgIcon: '4단계' },
      { order: 5, title: '상대 다리 잡은 채 위로 일어서서 스윕 성공', text: '넘어진 상대 다리를 끝까지 껴안은 채 내 몸을 따라 일어서서 탑 포지션을 점유해요.', tip: '다리를 쥔 손을 놓지 말고 따라 일어서야 탑 득점이 돼요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_4_delariva_sweep',
    stageNumber: 4,
    name: '데라히바 가드 스윕',
    category: '상대 뒤집기 (스윕)',
    position: '데라히바 가드 (발목 건 오픈 자세)',
    belt: 'white',
    difficulty: 2,
    icon: '🌀',
    youtubeUrl: 'https://www.youtube.com/watch?v=ss8komdTT4c',
    youtubeTitle: '데라히바 가드 스윕 강좌',
    description: '상대 뒤꿈치와 소매를 잡은 채 바깥 다리를 허벅지 안으로 감아 걸고, 훅을 위로 튕겨 상대를 넘어뜨린 뒤 올려타는 스윕이에요!',
    steps: [
      { order: 1, title: '상대 아킬레스건 뒤꿈치 잡고 소매 그립 잡기', text: '한 손으로 상대 서 있는 발 뒤꿈치 아킬레스건을 안아 잡고, 반대 손은 상대 소매를 잡아요.', tip: '뒤꿈치 그립을 놓치지 않아야 상대가 뒤로 못 물러나요.', stepImgIcon: '1단계' },
      { order: 2, title: '바깥 다리로 상대 허벅지 뒤로 감싸 데라히바 훅 걸기', text: '바깥 다리를 상대 다리 바깥에서 안쪽으로 감아 돌려 발가락을 상대 허벅지 안쪽에 콕 걸어줘요.', tip: '발가락을 깊이 걸어주어야 훅이 안 풀려요.', stepImgIcon: '2단계' },
      { order: 3, title: '반대 발로 상대 반대쪽 무릎 밀어 중심 흔들기', text: '자유로운 반대 발바닥으로 상대 반대쪽 무릎이나 골반을 지그시 밀어 무게중심을 앞뒤로 흔들어요.', tip: '상대 체중이 앞뒤로 쏠리게 흔들어놓으세요.', stepImgIcon: '3단계' },
      { order: 4, title: '소매 당기고 훅 차올려 상대 매트에 앉히기', text: '잡고 있던 소매를 내 몸 쪽으로 당기면서 데라히바 훅 다리를 위로 튕겨 올려 상대를 매트에 엉덩이 방아 찧게 만들어요.', tip: '소매 당김과 다리 차기를 동시에 해야 넘어가요.', stepImgIcon: '4단계' },
      { order: 5, title: '상대 다리 밀치며 몸 일으켜 위로 올라타기', text: '넘어진 상대 다리를 밀쳐내며 내가 잽싸게 상체를 일으켜 탑 포지션을 차지해요.', tip: '상대가 일어서기 전에 빨리 일어나서 누르세요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_5_side_keylock',
    stageNumber: 5,
    name: '사이드 포지션 키락',
    category: '어깨 관절 꺾기',
    position: '사이드 포지션 (옆에서 누른 자세)',
    belt: 'white',
    difficulty: 1,
    icon: '🗝️',
    youtubeUrl: 'https://www.youtube.com/watch?v=sKpBiKVLMi0',
    youtubeTitle: '사이드 포지션 키락 강좌',
    description: '사이드 누르기 자세에서 상대 손목을 바닥에 누르고 내 손목을 4자 모양으로 잡은 뒤, 손목을 바닥 위로 쓸어올려 어깨를 꺾는 기술이에요!',
    steps: [
      { order: 1, title: '사이드 탑에서 상대 한쪽 손목 바닥에 꼭 누르기', text: '사이드 누르기 자세에서 상대 위쪽 손목을 내 같은 쪽 손으로 바닥 매트에 꽉 눌러요.', tip: '체중을 실어 상대 손목이 안 빠지게 누르세요.', stepImgIcon: '1단계' },
      { order: 2, title: '겨드랑이 밑으로 손 집어넣어 4자 모양 잡기', text: '반대 팔을 상대 겨드랑이 밑으로 찔러 넣어 바닥 손목을 잡은 내 손목을 4자 모양으로 잡아요.', tip: '엄지손가락을 빼고 감싸쥐어야 세게 잠겨요.', stepImgIcon: '2단계' },
      { order: 3, title: '내 가슴 체중으로 상대 팔꿈치 바닥 밀착', text: '가슴과 머리를 낮춰 상대 팔꿈치가 바닥에서 떼어지지 않도록 단단히 눌러줘요.', tip: '팔꿈치가 바닥에 붙어있어야 꺾임 각도가 나와요.', stepImgIcon: '3단계' },
      { order: 4, title: '팔꿈치를 대고 손목을 바닥 따라 쓸어올리기', text: '팔꿈치를 지지점으로 삼아 손목을 바닥 매트를 따라 머리 방향으로 슬그머니 쓸어올려요.', tip: '원형을 그리듯 천천히 위로 쓸어올려야 해요.', stepImgIcon: '4단계' },
      { order: 5, title: '손목 살짝 들어올리고 체중 눌러 어깨 꺾기 탭', text: '상대 손목을 바닥에서 살짝 들며 위로 밀어 어깨 관절을 비틀어 탭을 받아요.', tip: '체중을 눌러놓은 상태에서 손목을 들어올리세요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_6_scissor_sweep',
    stageNumber: 6,
    name: '시저스 스윕',
    category: '상대 뒤집기 (스윕)',
    position: '클로즈드 가드 (누워서 다리로 감싼 자세)',
    belt: 'white',
    difficulty: 1,
    icon: '✂️',
    youtubeUrl: 'https://www.youtube.com/watch?v=H9bGbHEfLCo',
    youtubeTitle: '시저스 스윕 강좌',
    description: '가위질하듯 다리를 차면서 상대를 넘어뜨리고 잽싸게 위로 올려타 마운트를 차지하는 대표 뒤집기 기술이에요!',
    steps: [
      { order: 1, title: '상대 옷깃과 소매 꽉 잡기', text: '한 손은 상대 목 옆 옷깃을 깊게 잡고, 반대 손은 상대 소매를 잡아요.', tip: '옷깃 잡은 손이 깊어야 상체를 컨트롤할 수 있어요.', stepImgIcon: '1단계' },
      { order: 2, title: '엉덩이를 옆으로 쏙 빼서 옆으로 눕기', text: '발바닥으로 바닥을 밟으며 엉덩이를 옆으로 살짝 빼내어 가위질할 공간을 만들어요.', tip: '상대와 정면이 아니라 옆으로 누워야 가위질이 돼요.', stepImgIcon: '2단계' },
      { order: 3, title: '정강이를 상대 가슴에 대고 가위 다리 세팅', text: '위쪽 정강이를 상대 가슴 앞으로 가로질러 대고, 아래 다리는 바닥 쪽 무릎 뒤에 대요.', tip: '가슴 정강이가 상대를 띄울 받침대 역할을 해요.', stepImgIcon: '3단계' },
      { order: 4, title: '옷깃 당겨 상대 몸 내 위로 붕 띄우기', text: '잡고 있던 옷깃과 소매를 내 가슴 쪽으로 끌어당겨 상대 무게중심을 내 위로 띄워요.', tip: '상대 체중이 붕 떠야 쉽게 차서 넘어뜨릴 수 있어요.', stepImgIcon: '4단계' },
      { order: 5, title: '가위질하듯 다리를 차서 넘어뜨리고 올려타기', text: '위 다리는 가슴을 밀고 아래 다리는 무릎을 걷어차 넘어뜨린 뒤 잽싸게 위로 올려타요.', tip: '넘어뜨림과 동시에 상체를 따라 일어나야 해요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_7_mount_escape',
    stageNumber: 7,
    name: '마운트 탈출',
    category: '위기 탈출 (방어)',
    position: '마운트 밑 (누르고 갇힌 자세)',
    belt: 'white',
    difficulty: 1,
    icon: '🛡️',
    youtubeUrl: 'https://www.youtube.com/shorts/xhoqlo_D1Ic',
    youtubeTitle: '마운트 포지션 탈출 숏폼',
    description: '상대가 위에서 누를 때 팔과 발을 묶어 차단한 뒤, 브릿지로 엉덩이를 튕겨 상대를 넘겨 뒤집어 탈출하는 브릿지 이스케이프예요!',
    steps: [
      { order: 1, title: '상대 한쪽 팔과 같은 쪽 다리 꼭 차단하기', text: '상대가 위에서 누를 때, 상대 한쪽 팔을 내 두 손으로 끌어안고 같은 쪽 발을 내 발로 걸어 잠가요.', tip: '손과 발을 꽉 묶어놓아야 짚지 못하고 넘어가요.', stepImgIcon: '1단계' },
      { order: 2, title: '양발 바닥 차며 엉덩이 붕 높이 튕기기', text: '양발로 매트 바닥을 강하게 차면서 엉덩이를 천장으로 폭발적으로 튕겨 올려요.', tip: '엉덩이를 세게 튕길수록 상대가 붕 떠서 뒤집혀요.', stepImgIcon: '2단계' },
      { order: 3, title: '차단한 팔 방향으로 몸 뒤집기', text: '팔과 다리를 가둬둔 방향으로 체중을 굴려 상대를 내 몸 밑으로 뒤집어 넘겨요.', tip: '차단된 팔 쪽으로 몸을 돌려야 뒤집어져요.', stepImgIcon: '3단계' },
      { order: 4, title: '상대 다리 사이로 들어가 가드 포지션 잡기', text: '뒤집고 나서 상체를 세우고 상대 다리 사이 안쪽으로 내 상체를 넣어요.', tip: '잽싸게 상체를 올려 자세를 안정시키세요.', stepImgIcon: '4단계' },
      { order: 5, title: '가슴 펴고 바닥 손 짚어 마운트 완전 탈출', text: '상대 가슴에 갇혔던 위기에서 벗어나 탑 자세를 잡으며 마운트 이스케이프를 완수해요.', tip: '위협적인 눌림에서 안전하게 탈출이 완수돼요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_8_side_escape',
    stageNumber: 8,
    name: '사이드 탈출',
    category: '위기 탈출 (방어)',
    position: '사이드 컨트롤 밑 (눌린 자세)',
    belt: 'white',
    difficulty: 1,
    icon: '🛡️',
    youtubeUrl: 'https://www.youtube.com/shorts/uXKa0o0DZUQ',
    youtubeTitle: '사이드 포지션 탈출 숏폼',
    description: '사이드에 갇혔을 때 내 팔로 기둥을 세우고, 브릿지로 엉덩이를 튕긴 뒤 새우뛰기로 무릎을 넣어 가드로 돌아가는 이스케이프예요!',
    steps: [
      { order: 1, title: '목과 골반 안쪽에 팔 기둥(프레임) 세우기', text: '사이드 아래 눌렸을 때 한 팔은 상대 목 옆, 한 팔은 상대 골반 뼈에 안쪽 기둥을 세워요.', tip: '내 뼈 기둥으로 상대 체중을 받쳐야 해요.', stepImgIcon: '1단계' },
      { order: 2, title: '엉덩이 바닥에서 들썩 높이 튕기기', text: '양발을 엉덩이 가까이 당기고 매트를 차며 상대 몸 쪽으로 엉덩이를 붕 높게 튕겨 올려요.', tip: '엉덩이를 높이 들어야 빠져나갈 자리가 생겨요.', stepImgIcon: '2단계' },
      { order: 3, title: '새우처럼 몸 구부려 엉덩이 바깥으로 쏙 빼기', text: '엉덩이가 들린 순간 엉덩이를 상대 반대편으로 빠르게 빼내며 몸을 새우처럼 구부려요.', tip: '엉덩이가 멀어질수록 무릎 공간이 넓어져요.', stepImgIcon: '3단계' },
      { order: 4, title: '만들어진 공간 사이로 안쪽 무릎 쏙 집어넣기', text: '엉덩이를 빼서 만든 공간 사이로 내 안쪽 무릎을 대각선으로 슬라이딩해 집어넣어요.', tip: '무릎이 들어가면 더 이상 누르지 못해요.', stepImgIcon: '4단계' },
      { order: 5, title: '양 다리로 상대 허리 감싸서 풀가드 복귀', text: '반대 다리까지 넘겨 상대 허리를 양 다리로 감싸 잠그며 안전하게 탈출을 완수해요.', tip: '상대 허리를 감싸면 탈출 성공이에요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_9_omoplata',
    stageNumber: 9,
    name: '오모플라타',
    category: '어깨 관절 꺾기',
    position: '클로즈드 가드 (누워서 다리로 감싼 자세)',
    belt: 'white',
    difficulty: 2,
    icon: '🦵',
    youtubeUrl: 'https://www.youtube.com/shorts/EM92SEjHKZk',
    youtubeTitle: '오모플라타 어깨 꺾기 숏폼',
    description: '누운 자세에서 상대 팔을 내 다리 오금에 걸어 가두고, 상대 몸을 바닥에 납작 누른 뒤 엉덩이를 밀어 올려 어깨를 꺾는 관절기예요!',
    steps: [
      { order: 1, title: '소매랑 깃 잡고 엉덩이 옆으로 90도 틀기', text: '가드에서 한 손은 상대 소매, 한 손은 깃을 깊게 잡고 엉덩이를 옆으로 90도 틀어 자리를 만들어요.', tip: '상대 팔꿈치가 내 골반 안쪽으로 쏙 들어오게 당기세요.', stepImgIcon: '1단계' },
      { order: 2, title: '다리를 상대 겨드랑이 넘어 어깨 위로 깊게 넘기기', text: '잡아둔 팔 쪽 다리를 상대 겨드랑이 밑에서 어깨 위로 깊숙이 넘겨 내 무릎 오금 속에 상대 어깨를 가둬요.', tip: '발목을 상대 목 뒤로 높게 넘겨야 해요.', stepImgIcon: '2단계' },
      { order: 3, title: '양 다리 앞으로 쭉 뻗어 상대 상체 바닥에 납작 누르기', text: '넘어간 양 다리를 앞으로 쭉 뻗어(킥아웃) 상대 이마와 가슴이 바닥 매트에 딱 닿게 납작 눌러줘요.', tip: '상대 몸을 바닥에 구겨놓아야 안 굴러가요.', stepImgIcon: '3단계' },
      { order: 4, title: '상대 허리 감싸안고 엉덩이 옆으로 비스듬히 놓기', text: '한 손으로 상대 허리나 벨트를 깊게 안아서 상대가 구르지 못하게 막고 양 다리를 옆으로 구부려놓아요.', tip: '허리를 잡아둬야 도망치지 못해요.', stepImgIcon: '4단계' },
      { order: 5, title: '상체 대각선 앞으로 숙이며 일어서서 어깨 꺾기 탭', text: '상대 머리 대각선 방향으로 상체를 앞으로 숙이며 엉덩이를 올려 상대 어깨를 꺾어 탭을 받아요.', tip: '대각선 앞으로 숙이면서 엉덩이를 밀어야 어깨가 꺾여요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_10_berimbolo',
    stageNumber: 10,
    name: '베림보로',
    category: '등 뒤 점유 (백 테이크)',
    position: '드라히바 가드 (발목 건 모던 자세)',
    belt: 'white',
    difficulty: 3,
    icon: '🌀',
    youtubeUrl: 'https://www.youtube.com/shorts/pmJf9oaSkh4',
    youtubeTitle: '베림보로 백 테이크 숏폼',
    description: '상대를 매트에 앉히고 내 몸을 거꾸로 뒤집어 팽이처럼 빙글 구른 뒤, 상대 등 뒤를 완전히 차지하는 모던 백테이크 기술이에요!',
    steps: [
      { order: 1, title: '상대 뒤꿈치와 도복 바지 뒷깃 꽉 잡기', text: '드라히바 상태에서 상대 뒤꿈치를 잡고 반대 손으로 도복 바지 뒷깃이나 벨트를 잡아 힙을 통제해요.', tip: '바지 뒷깃 그립이 엉덩이를 조종하는 열쇠예요.', stepImgIcon: '1단계' },
      { order: 2, title: '상대 엉덩이 앉히고 몸 거꾸로 빙글 구르기', text: '상대 무릎 뒤를 밀어 엉덩이를 앉히고 내 머리를 상대 다리 밑으로 밀어넣으며 거꾸로 회전해요.', tip: '어깨와 목으로 체중을 받치며 빙글 구르세요.', stepImgIcon: '2단계' },
      { order: 3, title: '상대 엉덩이를 내 발 위에 붕 띄워 받아내기', text: '구르면서 상대 엉덩이를 내 발목과 정강이 위에 붕 띄워 받아내 상대가 못 도망치게 해요.', tip: '상대 엉덩이가 내 몸 위에 떠있어야 해요.', stepImgIcon: '3단계' },
      { order: 4, title: '상대 골반 뒤로 내 다리 고리 차례로 집어넣기', text: '상대 골반 뒤쪽으로 내 다리 훅 고리를 넣고 상대 상체를 내 가슴에 바짝 당겨요.', tip: '내 가슴과 상대 등이 틈 없이 밀착되어야 해요.', stepImgIcon: '4단계' },
      { order: 5, title: '양발 고리 걸고 안전벨트 그립 완벽 백 점유', text: '양발 고리를 상대 허벅지 안쪽에 완성하고 싯벨트 그립을 잠가 백 마운트 점유를 완성해요.', tip: '두 다리 고리와 안전벨트 잡기로 백을 점유해요.', stepImgIcon: '5단계' }
    ]
  },
  {
    id: 'stage_11_spider_sweep',
    stageNumber: 11,
    name: '스파이더 가드 스윕',
    category: '상대 뒤집기 (스윕)',
    position: '스파이더 가드 (이두근을 발로 미는 자세)',
    belt: 'white',
    difficulty: 2,
    icon: '🕷️',
    youtubeUrl: 'https://www.youtube.com/shorts/frzo5vmN6DU',
    youtubeTitle: '스파이더 가드 스윕 숏폼',
    description: '상대 소매를 잡고 발바닥으로 이두근을 뻗어 밀며 대각선 위로 차올려 넘긴 뒤, 상체를 따라 일어나 탑을 점유하는 스윕이에요!',
    steps: [
      { order: 1, title: '상대 양쪽 소매를 양손으로 꽉 잡기', text: '오픈 가드에서 상대 양쪽 소매를 C-그립으로 잡고 내 몸 쪽으로 팽팽하게 당겨줘요.', tip: '소매를 당겨 상대 팔을 팽팽하게 잡으세요.', stepImgIcon: '1단계' },
      { order: 2, title: '한쪽 발바닥으로 상대 이두근 팍 찌르기', text: '한쪽 발바닥을 상대 이두근 안쪽에 딱 대어 다리를 쭉 뻗으며 상대 상체를 팽팽하게 고정해요.', tip: '다리를 곧게 뻗어 이두근을 꽉 밀어주세요.', stepImgIcon: '2단계' },
      { order: 3, title: '반대 발로 상대 골반이나 무릎 오금 대어 차기', text: '반대 발바닥은 상대 골반을 짚거나 무릎 오금 뒤를 대어 균형을 허물어요.', tip: '반대 발로 골반이나 무릎을 차서 중심을 흔드세요.', stepImgIcon: '3단계' },
      { order: 4, title: '이두근 뻗은 다리를 대각선 위로 차며 소매 당기기', text: '이두근을 밀던 다리를 대각선 하늘 방향으로 강력하게 걷어차며 반대 소매를 내 힙 쪽으로 당겨요.', tip: '다리 차기와 소매 당김을 동시에 해야 넘어갑니다.', stepImgIcon: '4단계' },
      { order: 5, title: '상대 측면으로 넘어뜨리고 상체 일으켜 위로 탑 점유', text: '상대가 측면 매트로 쾅 넘어지면 그 탄력으로 상체를 따라 일으켜 탑 자세로 스윕을 완수해요.', tip: '탄력으로 잽싸게 일어나 상대를 누르세요.', stepImgIcon: '5단계' }
    ]
  }
];

for (let i = 0; i < BJJ_TECHNIQUES.length; i++) {
  const t = BJJ_TECHNIQUES[i];
  t.engName = t.position;
}

// ==========================================================================
// 2. Web Audio API 오디오 합성엔진
// ==========================================================================
class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playPickup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e){}
  }

  playDrop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch(e){}
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.35);
      });
    } catch(e){}
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch(e){}
  }

  playBeltPromotion() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 659.25, d: 0.12, t: 0.12 },
        { f: 783.99, d: 0.12, t: 0.24 },
        { f: 1046.50, d: 0.4, t: 0.36 },
        { f: 880.00, d: 0.15, t: 0.78 },
        { f: 1046.50, d: 0.6, t: 0.95 }
      ];
      notes.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, this.ctx.currentTime + note.t);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + note.t + note.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + note.t);
        osc.stop(this.ctx.currentTime + note.t + note.d);
      });
    } catch(e){}
  }
}

const soundEffects = new SoundEffectsEngine();

// ==========================================================================
// 3. 캔버스 파티클 효과 엔진
// ==========================================================================
class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  triggerConfetti(colors = ['#2563EB', '#9333EA', '#F59E0B', '#10B981', '#EF4444', '#FFFFFF']) {
    if (!this.canvas) return;
    const count = 100;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 5 + 4,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        opacity: 1
      });
    }
    if (!this.animId) this.loop();
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.opacity -= 0.008;

      if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
    }
  }
}

// ==========================================================================
// 4. 주짓수 승급 수련 로드맵 뷰 컴포넌트 (BJJRoadmapView)
// ==========================================================================
class BJJRoadmapView {
  constructor(options) {
    this.containerEl = options.containerEl;
    this.engine = options.engine;
    this.onSelectStage = options.onSelectStage || (() => {});
  }

  render() {
    if (!this.containerEl) return;

    this.engine.loadState();
    const clearedTechs = this.engine.clearedTechniqueIds;
    const currentActiveStage = clearedTechs.size + 1;
    const char = this.engine.getSelectedCharacter();

    let html = `
      <div class="duolingo-path-header">
        <h2 class="path-title">🥋 주짓수 화이트벨트 1~11단계 승급 로드맵</h2>
        <p class="path-sub">수련 캐릭터 <strong>${char.avatar} ${char.name}</strong>와(과) 함께 11개 기술을 완수하고 🔵 블루벨트로 승급하세요!</p>
      </div>

      <div class="duolingo-path-tree">
    `;

    BELT_RANKS.forEach((belt) => {
      const beltTechs = BJJ_TECHNIQUES.filter(t => t.belt === belt.id);
      if (beltTechs.length === 0) return;

      const isBeltUnlocked = belt.id === 'white' || (clearedTechs.size >= 11);

      html += `
        <div class="belt-section-block">
          <div class="belt-gate-banner belt-${belt.id}">
            <span class="gate-icon">🏆</span>
            <div class="gate-text">
              <h3>${belt.name} 코스</h3>
              <p>${belt.badge}</p>
            </div>
            <span class="gate-status">${isBeltUnlocked ? '🔓 개방됨' : '🔒 11단계 완료 시 승급'}</span>
          </div>

          <div class="nodes-winding-path">
      `;

      beltTechs.forEach((tech, idx) => {
        const stageNum = tech.stageNumber;
        const isUnlocked = stageNum <= currentActiveStage;
        const isCompleted = clearedTechs.has(tech.id);
        const isActive = stageNum === currentActiveStage;

        const positionClass = (idx % 3 === 0) ? 'pos-center' : (idx % 3 === 1 ? 'pos-left' : 'pos-right');

        html += `
          <div class="roadmap-node-wrapper ${positionClass}">
            <button class="roadmap-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active-pulse' : ''} ${!isUnlocked ? 'locked' : ''} belt-node-${belt.id}" 
                    data-tech-id="${tech.id}" 
                    ${!isUnlocked ? 'disabled' : ''}>
              <div class="node-inner">
                <span class="node-icon">${!isUnlocked ? '🔒' : tech.icon}</span>
                <span class="node-number">${stageNum}단계</span>
              </div>
              ${isCompleted ? `<div class="node-stars-badge">⭐⭐⭐</div>` : ''}
              ${isActive ? `
                <div class="active-badge-tag">현재 도전!</div>
                <div class="active-char-avatar-node" title="${char.name}">${char.avatar}</div>
              ` : ''}
            </button>
            <div class="node-title-card">
              <span class="node-tech-name">${tech.name}</span>
              <span class="node-tech-pos">${tech.position}</span>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `</div>`;

    this.containerEl.innerHTML = html;
    this.attachEvents();
  }

  attachEvents() {
    this.containerEl.querySelectorAll('.roadmap-node:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        soundEffects.playPickup();
        const techId = btn.dataset.techId;
        const tech = BJJ_TECHNIQUES.find(t => t.id === techId);
        if (tech) {
          this.onSelectStage(tech);
        }
      });
    });
  }
}

// ==========================================================================
// 5. 고품격 프리미엄 체육관 뷰 컴포넌트 (PremiumGymView) - 경영, 별 업그레이드 & 대전
// ==========================================================================
class PremiumGymView {
  constructor(options) {
    this.containerEl = options.containerEl;
    this.engine = options.engine;
    this.activeTab = 'business'; // 'business' | 'training' | 'pvp'
    this.currentOpponent = null;
    this.battleLogs = [];
    this.isFighting = false;
    this.heroHpPct = 100;
    this.oppHpPct = 100;
    this.onReturnRoadmap = options.onReturnRoadmap || (() => {});
  }

  render() {
    if (!this.containerEl) return;
    const char = this.engine.getSelectedCharacter();

    if (!this.currentOpponent) {
      this.currentOpponent = OPPONENT_BOTS[Math.floor(Math.random() * OPPONENT_BOTS.length)];
    }
    const opp = this.currentOpponent;

    this.containerEl.innerHTML = `
      <div class="gym-hero-banner">
        <div class="gym-hero-title">
          <h2>🏢 내 주짓수 체육관 (Gym Management & Training)</h2>
          <p>로드맵에서 획득한 <strong>⭐ 별</strong>로 체육관 시설을 업그레이드하고, <strong>💰 관비 골드</strong>로 수련생 스탯을 강화하세요!</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="btn-return-roadmap" class="btn btn-secondary btn-sm">🗺️ 메인 로드맵 돌아가기</button>
          <button id="btn-gym-change-char" class="btn btn-secondary btn-sm">🎭 수련 캐릭터 교체</button>
        </div>
      </div>

      <div class="gym-nav-tabs">
        <button class="gym-tab-btn ${this.activeTab === 'business' ? 'active' : ''}" data-tab="business">
          🏢 체육관 경영 & ⭐별 시설업글
        </button>
        <button class="gym-tab-btn ${this.activeTab === 'training' ? 'active' : ''}" data-tab="training">
          🏋️‍♂️ 캐릭터 스탯 수련장 (골드&EXP 소비)
        </button>
        <button class="gym-tab-btn ${this.activeTab === 'pvp' ? 'active' : ''}" data-tab="pvp">
          ⚔️ 마스터 대전 아레나 (PvP)
        </button>
      </div>

      <div class="gym-tab-content">
        ${this.activeTab === 'business' ? this.renderBusinessHTML() : (this.activeTab === 'training' ? this.renderTrainingHTML(char) : this.renderPvPHTML(char, opp))}
      </div>
    `;

    this.attachEvents();
  }

  renderBusinessHTML() {
    const totalStars = this.engine.getTotalStars();
    const availableStars = this.engine.getAvailableStars();

    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="gym-biz-card">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
              💰 체육관 누적 관비 수익금
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              수련생들이 납부한 관비가 자동으로 축적됩니다. 수거하기를 누르면 소지 골드로 들어옵니다!
            </p>
            <div class="biz-gold-counter" style="margin-top: 10px;">
              💰 +<span id="biz-uncollected-gold">${this.engine.uncollectedGold.toLocaleString()}</span> 골드
            </div>
            <p style="font-size: 0.8rem; color: #10B981; font-weight: 700; margin-top: 4px;">
              ⚡ 현재 체육관 수익 창출 속도: 초당 +${this.engine.goldIncomePerSec} 골드
            </p>
          </div>

          <button id="btn-collect-gym-gold" class="btn btn-collect-gold">
            💰 관비 수거하기!
          </button>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h4 style="font-size: 1.1rem; font-weight: 800;">⭐ 로드맵 별(Star) 기반 체육관 시설 업그레이드</h4>
          <span style="font-size: 0.9rem; font-weight: 800; color: #FBBF24;">
            내 보유 별: ⭐ ${availableStars}개 (누적 획득: ${totalStars}개)
          </span>
        </div>

        <div class="gym-upgrade-grid">
          <div class="upgrade-card">
            <div>
              <h4>🥋 일반 주짓수 수련생 모집</h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                관원을 모집하여 초당 관비 수익을 증대시킵니다.
              </p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span class="cost-tag-exp">필요: ⭐ 별 3개</span>
              <button class="btn btn-primary btn-sm btn-upgrade-gym" data-type="students">
                수익 +5골드/초
              </button>
            </div>
          </div>

          <div class="upgrade-card">
            <div>
              <h4>🤼 프리미엄 전용 매트 설치</h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                충격 흡수 매트와 샤워 시설을 갖춰 관비 수입을 대폭 올립니다.
              </p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span class="cost-tag-exp">필요: ⭐ 별 9개</span>
              <button class="btn btn-primary btn-sm btn-upgrade-gym" data-type="mats">
                수익 +15골드/초
              </button>
            </div>
          </div>

          <div class="upgrade-card">
            <div>
              <h4>🏆 챔피언 코치 및 선수단 영입</h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                유명 챔피언 코치를 영입하여 명문 주짓수 체육관으로 거듭납니다.
              </p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span class="cost-tag-exp">필요: ⭐ 별 18개</span>
              <button class="btn btn-primary btn-sm btn-upgrade-gym" data-type="coach">
                수익 +50골드/초
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderTrainingHTML(char) {
    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="training-hero-card">
          <div class="dojo-char-avatar-large">${char.avatar}</div>
          <div class="dojo-char-details">
            <div style="display: flex; align-items: center; gap: 10px;">
              <h3 style="font-size: 1.4rem; font-weight: 900;">${char.name}</h3>
              <span class="char-level-badge" style="font-size: 0.9rem;">Lv.${this.engine.charLevel}</span>
            </div>
            <p style="color: #60A5FA; font-weight: 700; font-size: 0.88rem;">${char.title}</p>
            <p style="color: var(--text-secondary); font-size: 0.85rem;">${char.desc}</p>
            <div style="margin-top: 6px;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">소지 자산: 💰 ${this.engine.gold.toLocaleString()} 골드 | 수련 경험치: ✨ ${this.engine.charExp} EXP</span>
              <div class="char-exp-bar-wrap" style="width: 100%; height: 8px; margin-top: 4px;">
                <div class="char-exp-fill" style="width: ${Math.min(100, Math.floor((this.engine.charExp / this.engine.getExpThreshold()) * 100))}%;"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="dojo-gear-grid">
          <div class="gear-card">
            <div class="gear-card-header">
              <span class="gear-icon">💪</span>
              <div class="gear-title">
                <h4>서브미션 공격력</h4>
                <span>현재 스탯: +${this.engine.charAtk} Atk</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">샌드백 단련 및 무거운 타격 훈련으로 암바 & 초크 파워를 올립니다.</p>
            <div class="cost-tag-group">
              <span class="cost-tag-gold">💰 100 골드</span>
              <span>+</span>
              <span class="cost-tag-exp">✨ 30 EXP 소비</span>
            </div>
            <button id="btn-train-atk-gear" class="btn btn-primary btn-sm">
              💪 샌드백 암바 훈련 (공격력 +1)
            </button>
          </div>

          <div class="gear-card">
            <div class="gear-card-header">
              <span class="gear-icon">🛡️</span>
              <div class="gear-title">
                <h4>가드 방어 리커버리</h4>
                <span>현재 스탯: +${this.engine.charDef} Def</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">힙 브릿지 및 코어 훈련으로 상대 누르기 탈출 방어력을 단련합니다.</p>
            <div class="cost-tag-group">
              <span class="cost-tag-gold">💰 100 골드</span>
              <span>+</span>
              <span class="cost-tag-exp">✨ 30 EXP 소비</span>
            </div>
            <button id="btn-train-def-gear" class="btn btn-primary btn-sm">
              🛡️ 코어 브릿지 훈련 (방어력 +1)
            </button>
          </div>

          <div class="gear-card">
            <div class="gear-card-header">
              <span class="gear-icon">⚡</span>
              <div class="gear-title">
                <h4>기술 순발력</h4>
                <span>현재 스탯: +${this.engine.charSpd} Spd</span>
              </div>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">0.05초 초고속 스윕 반응속도를 집중 단련하여 선제공격율을 극대화합니다.</p>
            <div class="cost-tag-group">
              <span class="cost-tag-gold">💰 100 골드</span>
              <span>+</span>
              <span class="cost-tag-exp">✨ 30 EXP 소비</span>
            </div>
            <button id="btn-train-spd-gear" class="btn btn-primary btn-sm">
              ⚡ 0.05초 스윕 훈련 (순발력 +1)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderPvPHTML(hero, opp) {
    // 레벨 차이에 따른 승률 계산 (동급 55%)
    const winRatePct = this.engine.getWinRateAgainstOpponent(opp.level);

    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 10px 16px; border-radius: var(--radius-md); text-align: center;">
          <span style="font-weight: 800; color: #60A5FA;">
            ⚡ 레벨비교 대전 예상 승률: <strong style="font-size: 1.1rem; color: #FBBF24;">${winRatePct}%</strong> (내 캐릭터 Lv.${this.engine.charLevel} VS 상대 Lv.${opp.level})
          </span>
        </div>

        <div class="master-pvp-stage">
          <div class="fighter-card-pvp hero-card">
            <div class="fighter-avatar-circle" style="color: #3B82F6;">${hero.avatar}</div>
            <h3 style="font-weight: 900; font-size: 1.15rem;">${hero.name} (나)</h3>
            <span class="char-level-badge">Lv.${this.engine.charLevel}</span>
            <div style="width: 100%;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #93C5FD;">
                <span>체력 HP</span><span>${this.heroHpPct}%</span>
              </div>
              <div class="hp-bar-outer">
                <div class="hp-bar-fill ${this.heroHpPct < 30 ? 'danger' : ''}" style="width: ${this.heroHpPct}%;"></div>
              </div>
            </div>
            <p style="font-size: 0.78rem; color: #93C5FD;">공격 ${this.engine.charAtk} | 방어 ${this.engine.charDef} | 순발력 ${this.engine.charSpd}</p>
          </div>

          <div class="vs-master-badge">VS</div>

          <div class="fighter-card-pvp opp-card">
            <div class="fighter-avatar-circle" style="color: #EF4444;">${opp.avatar}</div>
            <h3 style="font-weight: 900; font-size: 1.15rem; color: #FCA5A5;">${opp.name}</h3>
            <span class="char-level-badge" style="background: #EF4444; color: #FFF;">Lv.${opp.level}</span>
            <div style="width: 100%;">
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #FCA5A5;">
                <span>체력 HP</span><span>${this.oppHpPct}%</span>
              </div>
              <div class="hp-bar-outer">
                <div class="hp-bar-fill ${this.oppHpPct < 30 ? 'danger' : ''}" style="width: ${this.oppHpPct}%;"></div>
              </div>
            </div>
            <p style="font-size: 0.78rem; color: #FCA5A5;">공격 ${opp.atk} | 방어 ${opp.def} | 순발력 ${opp.spd}</p>
          </div>
        </div>

        <div class="pvp-battle-log-box" id="pvp-battle-log-box">
          ${this.battleLogs.length === 0 ? `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
              🥋 '🥊 자동 대전 스파링 시작' 버튼을 누르면 마스터 PvP 대전이 전개됩니다!
            </div>
          ` : this.battleLogs.map(log => `
            <div class="battle-log-line ${log.type}">${log.text}</div>
          `).join('')}
        </div>

        <div style="display: flex; gap: 12px;">
          <button id="btn-start-master-pvp" class="btn btn-primary btn-large" style="flex: 2;" ${this.isFighting ? 'disabled' : ''}>
            🥊 마스터 자동 대전 스파링 시작!
          </button>
          <button id="btn-change-pvp-opp" class="btn btn-secondary" style="flex: 1;" ${this.isFighting ? 'disabled' : ''}>
            🔄 다른 상대 검색
          </button>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const btnReturn = this.containerEl.querySelector('#btn-return-roadmap');
    if (btnReturn) {
      btnReturn.addEventListener('click', () => {
        soundEffects.playPickup();
        this.onReturnRoadmap();
      });
    }

    const btnCharChange = this.containerEl.querySelector('#btn-gym-change-char');
    if (btnCharChange) {
      btnCharChange.addEventListener('click', () => {
        const charModal = document.getElementById('character-select-modal');
        if (charModal) charModal.classList.remove('hidden');
      });
    }

    this.containerEl.querySelectorAll('.gym-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        soundEffects.playPickup();
        this.activeTab = btn.dataset.tab;
        this.render();
      });
    });

    if (this.activeTab === 'business') {
      const btnCollect = this.containerEl.querySelector('#btn-collect-gym-gold');
      if (btnCollect) {
        btnCollect.addEventListener('click', () => {
          if (this.engine.uncollectedGold <= 0) {
            alert('💰 아직 쌓인 관비 수익이 없습니다!');
            return;
          }
          soundEffects.playBeltPromotion();
          const collected = this.engine.collectGold();
          alert(`💰 관비 ${collected.toLocaleString()} 골드를 수거하였습니다!`);
          this.render();
        });
      }

      this.containerEl.querySelectorAll('.btn-upgrade-gym').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.dataset.type;
          let starCost = 3;
          let inc = 5;

          if (type === 'mats') { starCost = 9; inc = 15; }
          else if (type === 'coach') { starCost = 18; inc = 50; }

          const availableStars = this.engine.getAvailableStars();
          if (availableStars < starCost) {
            alert(`⭐ 별(Star)이 부족합니다!\n(필요: ⭐ ${starCost}개 / 보유: ⭐ ${availableStars}개)\n메인 로드맵 기술 순서를 맞추고 별을 획득하세요!`);
            return;
          }

          soundEffects.playBeltPromotion();
          this.engine.spentStars += starCost;
          this.engine.goldIncomePerSec += inc;
          this.engine.saveState();
          alert(`🎉 ⭐ 별 ${starCost}개를 사용하여 시설 업그레이드 완료! 수익 속도가 초당 +${inc}골드 증가했습니다!`);
          this.render();
        });
      });
    } else if (this.activeTab === 'training') {
      const btnAtk = this.containerEl.querySelector('#btn-train-atk-gear');
      const btnDef = this.containerEl.querySelector('#btn-train-def-gear');
      const btnSpd = this.containerEl.querySelector('#btn-train-spd-gear');

      const attemptTrain = (statName) => {
        const goldCost = 100;
        const expCost = 30;

        if (this.engine.gold < goldCost) {
          alert(`💰 소지 골드가 부족합니다!\n(필요: ${goldCost} 골드 / 소지: ${this.engine.gold} 골드)\n내 체육관에서 관비를 수거해보세요!`);
          return;
        }
        if (this.engine.charExp < expCost) {
          alert(`✨ 수련 경험치(EXP)가 부족합니다!\n(필요: ${expCost} EXP / 소지: ${this.engine.charExp} EXP)\n로드맵 기술 순서를 맞추고 EXP를 획득하세요!`);
          return;
        }

        soundEffects.playPickup();
        this.engine.gold -= goldCost;
        this.engine.charExp -= expCost;

        if (statName === 'atk') this.engine.charAtk++;
        else if (statName === 'def') this.engine.charDef++;
        else if (statName === 'spd') this.engine.charSpd++;

        this.engine.saveState();
        this.render();
      };

      if (btnAtk) btnAtk.addEventListener('click', () => attemptTrain('atk'));
      if (btnDef) btnDef.addEventListener('click', () => attemptTrain('def'));
      if (btnSpd) btnSpd.addEventListener('click', () => attemptTrain('spd'));

    } else if (this.activeTab === 'pvp') {
      const btnStart = this.containerEl.querySelector('#btn-start-master-pvp');
      const btnChangeOpp = this.containerEl.querySelector('#btn-change-pvp-opp');

      if (btnChangeOpp) {
        btnChangeOpp.addEventListener('click', () => {
          soundEffects.playPickup();
          this.currentOpponent = OPPONENT_BOTS[Math.floor(Math.random() * OPPONENT_BOTS.length)];
          this.battleLogs = [];
          this.heroHpPct = 100;
          this.oppHpPct = 100;
          this.render();
        });
      }

      if (btnStart) {
        btnStart.addEventListener('click', () => {
          this.startMasterBattle();
        });
      }
    }
  }

  startMasterBattle() {
    if (this.isFighting) return;
    this.isFighting = true;
    this.battleLogs = [];
    this.heroHpPct = 100;
    this.oppHpPct = 100;
    this.render();

    const hero = this.engine.getSelectedCharacter();
    const opp = this.currentOpponent;

    // 레벨 차이에 따른 55% 기준 승리 판정 미리 계산
    const winRatePct = this.engine.getWinRateAgainstOpponent(opp.level);
    const isHeroWinner = Math.random() * 100 < winRatePct;

    this.battleLogs.push({ 
      type: '', 
      text: `🔔 띵! ${hero.name}(Lv.${this.engine.charLevel}) VS ${opp.name}(Lv.${opp.level}) 마스터 대전 시작! (예상 승률: ${winRatePct}%)` 
    });
    this.render();

    let round = 1;
    const battleInterval = setInterval(() => {
      if (round < 3) {
        if (isHeroWinner) {
          const dmg = 35 + Math.floor(Math.random() * 15);
          this.oppHpPct = Math.max(10, this.oppHpPct - dmg);
          soundEffects.playPickup();
          this.battleLogs.push({
            type: 'hero-attack',
            text: `🥋 [${round}라운드] ${hero.name}의 선제 가드패스 및 암바 세팅 성공! (상대 HP: ${this.oppHpPct}%)`
          });
        } else {
          const dmg = 35 + Math.floor(Math.random() * 15);
          this.heroHpPct = Math.max(10, this.heroHpPct - dmg);
          soundEffects.playWrong();
          this.battleLogs.push({
            type: 'opp-attack',
            text: `💥 [${round}라운드] ${opp.name}의 정교한 스윕 및 포지션 제압! (내 HP: ${this.heroHpPct}%)`
          });
        }
        round++;
      } else {
        clearInterval(battleInterval);
        this.isFighting = false;

        if (isHeroWinner) {
          this.oppHpPct = 0;
          soundEffects.playBeltPromotion();
          this.engine.addExp(150);
          this.engine.gold += 300;
          this.engine.pvpTrophies += 50;
          this.engine.score += 250;
          this.battleLogs.push({
            type: 'victory',
            text: `🏆 [최종 승리!] 서브미션 탭(항복)을 받아냈습니다! (승리 확률 ${winRatePct}% 달성! +💰 300골드, +50 트로피, +150 EXP)`
          });
        } else {
          this.heroHpPct = 0;
          soundEffects.playWrong();
          this.battleLogs.push({
            type: 'opp-attack',
            text: `💔 [최종 패배] 상대 수련 레벨(Lv.${opp.level})의 벽을 넘지 못했습니다. 캐릭터 레벨을 더 올린 뒤 재도전하세요!`
          });
        }
      }
      this.render();
    }, 1200);
  }
}

// ==========================================================================
// 6. 순서 맞추기 드래그 & 드롭 보드 컴포넌트
// ==========================================================================
class DragOrderBoard {
  constructor(options) {
    this.containerEl = options.containerEl;
    this.onValidation = options.onValidation || (() => {});
    this.onOpenRoadmap = options.onOpenRoadmap || (() => {});
    this.currentTechnique = null;
    this.shuffledSteps = [];
    this.placedSteps = [];
    this.selectedCardIndex = null;
  }

  loadTechnique(technique) {
    this.currentTechnique = technique;
    this.shuffledSteps = this.shuffle([...technique.steps]);
    if (this.isIdentical(this.shuffledSteps, technique.steps)) {
      this.shuffledSteps.reverse();
    }
    this.placedSteps = new Array(technique.steps.length).fill(null);
    this.selectedCardIndex = null;
    this.render();
  }

  isIdentical(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, idx) => item.order === arr2[idx].order);
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  render() {
    if (!this.currentTechnique || !this.containerEl) return;
    const { name, position, steps, icon, description, belt, stageNumber, youtubeUrl, youtubeTitle } = this.currentTechnique;

    this.containerEl.innerHTML = `
      <div class="board-header">
        <div class="technique-header-row">
          <div class="technique-badge-group">
            <span class="tech-icon">${icon}</span>
            <div class="tech-title-wrap">
              <div class="tech-title-flex">
                <span class="stage-num-pill">${stageNumber || 1}단계 스테이지</span>
                <h2 class="tech-name">${name}</h2>
                <span class="belt-tag belt-${belt}">${BELT_RANKS.find(b=>b.id===belt).name}</span>
              </div>
              <p class="tech-eng">기본 자세: <span class="tech-position">${position}</span></p>
            </div>
          </div>
          <div class="header-right-btns">
            ${youtubeUrl ? `
              <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-youtube btn-sm" title="${youtubeTitle || '유튜브 영상 시청'}">
                📺 유튜브 영상 보기
              </a>
            ` : ''}
            <button id="btn-board-roadmap" class="btn btn-secondary btn-sm">
              🗺️ 로드맵 보기
            </button>
          </div>
        </div>

        <div class="tech-desc-box" style="margin-top: 12px;">
          <p>💡 <strong>쉽게 배우는 포인트:</strong> ${description}</p>
        </div>
      </div>

      <div class="sequence-slots-section">
        <div class="section-label">
          <span>📍 올바른 동작 순서 슬롯 (1단계 ➔ ${steps.length}단계)</span>
          <span class="slot-count-badge">${this.getPlacedCount()} / ${steps.length} 완료</span>
        </div>
        <div class="slots-grid" id="slots-grid">
          ${steps.map((_, index) => this.renderSlotHTML(index)).join('')}
        </div>
      </div>

      <div class="cards-pool-section">
        <div class="pool-header">
          <span class="pool-title">🎴 아래 카드를 클릭하거나 드래그해서 위 순서에 맞춰 놓아보세요!</span>
          <button id="btn-reset-board" class="btn-sm btn-ghost">🔄 순서 섞기</button>
        </div>
        <div class="cards-grid" id="cards-grid">
          ${this.shuffledSteps.map((step, index) => this.renderCardHTML(step, index)).join('')}
        </div>
      </div>

      <div class="board-actions">
        <button id="btn-check-answer" class="btn btn-primary btn-large" ${!this.isAllSlotsFilled() ? 'disabled' : ''}>
          ✨ 정답 확인하기
        </button>
      </div>
    `;

    this.attachEvents();
  }

  renderSlotHTML(index) {
    const placed = this.placedSteps[index];
    const isSelectedTarget = this.selectedCardIndex !== null && !placed;

    return `
      <div class="slot-card ${placed ? 'filled' : 'empty'} ${isSelectedTarget ? 'target-highlight' : ''}" 
           data-slot-index="${index}">
        <div class="slot-number-tag">${index + 1}단계 슬롯</div>
        ${placed ? `
          <div class="placed-card-content" draggable="true" data-slot-index="${index}">
            <div class="step-card-header">
              <span class="step-title-badge">${placed.title}</span>
              <button class="btn-remove-slot" data-slot-index="${index}" title="슬롯에서 빼기">✕</button>
            </div>
            <p class="step-card-text">${placed.text}</p>
            <div class="step-card-tip">💡 꿀팁: ${placed.tip}</div>
          </div>
        ` : `
          <div class="slot-placeholder">
            <span class="placeholder-icon">📥</span>
            <span class="placeholder-text">${index + 1}번째 동작 카드를 여기에 놓으세요</span>
          </div>
        `}
      </div>
    `;
  }

  renderCardHTML(step, index) {
    const isPlaced = this.placedSteps.some(s => s && s.order === step.order);
    const isSelected = this.selectedCardIndex === index;

    if (isPlaced) {
      return `<div class="pool-card placed-hidden"></div>`;
    }

    return `
      <div class="pool-card ${isSelected ? 'selected' : ''}" 
           draggable="true" 
           data-card-index="${index}">
        <div class="card-drag-handle">⋮⋮</div>
        <div class="card-body">
          <div class="card-step-badge-row">
            <span class="step-pictogram">📌</span>
            <h4 class="card-step-title">${step.title}</h4>
          </div>
          <p class="card-step-text">${step.text}</p>
        </div>
        <div class="card-footer-tip">
          <span class="tip-tag">꿀팁</span> ${step.tip}
        </div>
      </div>
    `;
  }

  getPlacedCount() {
    return this.placedSteps.filter(Boolean).length;
  }

  isAllSlotsFilled() {
    return this.placedSteps.every(Boolean);
  }

  attachEvents() {
    const slotsGrid = this.containerEl.querySelector('#slots-grid');
    const cardsGrid = this.containerEl.querySelector('#cards-grid');

    const btnRoadmap = this.containerEl.querySelector('#btn-board-roadmap');
    if (btnRoadmap) {
      btnRoadmap.addEventListener('click', () => {
        soundEffects.playPickup();
        this.onOpenRoadmap();
      });
    }

    const btnReset = this.containerEl.querySelector('#btn-reset-board');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        soundEffects.playPickup();
        this.loadTechnique(this.currentTechnique);
      });
    }

    const btnCheck = this.containerEl.querySelector('#btn-check-answer');
    if (btnCheck) {
      btnCheck.addEventListener('click', () => {
        this.checkAnswer();
      });
    }

    if (cardsGrid) {
      cardsGrid.querySelectorAll('.pool-card:not(.placed-hidden)').forEach(cardEl => {
        cardEl.addEventListener('click', () => {
          const idx = parseInt(cardEl.dataset.cardIndex, 10);
          soundEffects.playPickup();

          if (this.selectedCardIndex === idx) {
            this.selectedCardIndex = null;
          } else {
            this.selectedCardIndex = idx;
            const emptySlotIdx = this.placedSteps.findIndex(s => s === null);
            if (emptySlotIdx !== -1) {
              this.placeCardInSlot(this.selectedCardIndex, emptySlotIdx);
              return;
            }
          }
          this.render();
        });

        cardEl.addEventListener('dragstart', (e) => {
          const idx = parseInt(cardEl.dataset.cardIndex, 10);
          e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'pool', cardIndex: idx }));
          soundEffects.playPickup();
        });
      });
    }

    if (slotsGrid) {
      slotsGrid.querySelectorAll('.slot-card').forEach(slotEl => {
        const slotIdx = parseInt(slotEl.dataset.slotIndex, 10);

        slotEl.addEventListener('click', (e) => {
          if (e.target.classList.contains('btn-remove-slot')) {
            soundEffects.playDrop();
            this.placedSteps[slotIdx] = null;
            this.selectedCardIndex = null;
            this.render();
            return;
          }

          if (this.selectedCardIndex !== null && !this.placedSteps[slotIdx]) {
            this.placeCardInSlot(this.selectedCardIndex, slotIdx);
          }
        });

        slotEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          slotEl.classList.add('drag-over');
        });

        slotEl.addEventListener('dragleave', () => {
          slotEl.classList.remove('drag-over');
        });

        slotEl.addEventListener('drop', (e) => {
          e.preventDefault();
          slotEl.classList.remove('drag-over');
          try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.type === 'pool') {
              this.placeCardInSlot(data.cardIndex, slotIdx);
            } else if (data.type === 'slot') {
              const fromSlot = data.slotIndex;
              const temp = this.placedSteps[fromSlot];
              this.placedSteps[fromSlot] = this.placedSteps[slotIdx];
              this.placedSteps[slotIdx] = temp;
              soundEffects.playDrop();
              this.render();
            }
          } catch (err) {}
        });
      });
    }
  }

  placeCardInSlot(cardIndex, slotIndex) {
    const cardStep = this.shuffledSteps[cardIndex];
    if (!cardStep) return;

    const existingSlotIdx = this.placedSteps.findIndex(s => s && s.order === cardStep.order);
    if (existingSlotIdx !== -1) {
      this.placedSteps[existingSlotIdx] = null;
    }

    this.placedSteps[slotIndex] = cardStep;
    this.selectedCardIndex = null;
    soundEffects.playDrop();
    this.render();
  }

  checkAnswer() {
    if (!this.isAllSlotsFilled()) return;
    const originalSteps = this.currentTechnique.steps;
    let isCorrect = true;
    const errors = [];

    this.placedSteps.forEach((placed, idx) => {
      const correctStep = originalSteps[idx];
      if (!placed || placed.order !== correctStep.order) {
        isCorrect = false;
        errors.push(idx);
      }
    });

    if (isCorrect) {
      soundEffects.playCorrect();
      this.onValidation({
        success: true,
        technique: this.currentTechnique,
        placedSteps: this.placedSteps
      });
    } else {
      soundEffects.playWrong();
      this.highlightErrors(errors);
      this.onValidation({
        success: false,
        technique: this.currentTechnique,
        errors: errors
      });
    }
  }

  highlightErrors(errorIndexes) {
    const slotsGrid = this.containerEl.querySelector('#slots-grid');
    if (!slotsGrid) return;
    errorIndexes.forEach(idx => {
      const slotEl = slotsGrid.children[idx];
      if (slotEl) {
        slotEl.classList.add('shake-error');
        setTimeout(() => slotEl.classList.remove('shake-error'), 800);
      }
    });
  }
}

// ==========================================================================
// 7. 주짓수 캐릭터 선택 모달 컴포넌트
// ==========================================================================
class CharacterSelectModal {
  constructor(options) {
    this.modalEl = document.getElementById(options.modalId || 'character-select-modal');
    this.engine = options.engine;
    this.onSelectCharacter = options.onSelectCharacter || (() => {});
  }

  init() {
    if (!this.modalEl) return;
    this.attachEvents();
  }

  open() {
    if (!this.modalEl) return;
    soundEffects.playPickup();
    this.modalEl.classList.remove('hidden');
    this.render();
  }

  close() {
    if (!this.modalEl) return;
    soundEffects.playDrop();
    this.modalEl.classList.add('hidden');
  }

  render() {
    const gridEl = this.modalEl.querySelector('#char-cards-grid');
    if (!gridEl) return;

    const activeChar = this.engine.getSelectedCharacter();

    gridEl.innerHTML = BJJ_CHARACTERS.map(c => `
      <div class="char-select-card ${c.id === activeChar.id ? 'selected' : ''}" data-char-id="${c.id}">
        <span class="char-select-avatar">${c.avatar}</span>
        <div class="char-select-info">
          <span class="char-title-tag">${c.title}</span>
          <h4>${c.name}</h4>
          <p>${c.desc}</p>
        </div>
      </div>
    `).join('');

    this.attachDynamicEvents(gridEl);
  }

  attachEvents() {
    const btnClose = this.modalEl.querySelector('.btn-close-modal');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });
  }

  attachDynamicEvents(gridEl) {
    gridEl.querySelectorAll('.char-select-card').forEach(card => {
      card.addEventListener('click', () => {
        soundEffects.playPickup();
        const charId = card.dataset.charId;
        this.engine.setSelectedCharacter(charId);
        this.close();
        this.onSelectCharacter(charId);
      });
    });
  }
}

// ==========================================================================
// 8. 주짓수 백과사전 (CodexModal) 컴포넌트
// ==========================================================================
class CodexModal {
  constructor(options) {
    this.modalEl = document.getElementById(options.modalId || 'codex-modal');
    this.onSelectTechnique = options.onSelectTechnique || (() => {});
    this.activeBeltFilter = 'all';
    this.searchQuery = '';
    this.selectedTechnique = null;
  }

  init() {
    if (!this.modalEl) return;
    this.attachEvents();
  }

  open() {
    if (!this.modalEl) return;
    soundEffects.playPickup();
    this.modalEl.classList.remove('hidden');
    this.render();
  }

  close() {
    if (!this.modalEl) return;
    soundEffects.playDrop();
    this.modalEl.classList.add('hidden');
  }

  render() {
    const bodyEl = this.modalEl.querySelector('.modal-body-content');
    if (!bodyEl) return;

    let filtered = BJJ_TECHNIQUES;
    if (this.activeBeltFilter !== 'all') {
      filtered = filtered.filter(t => t.belt === this.activeBeltFilter);
    }
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.position.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    bodyEl.innerHTML = `
      <div class="codex-container">
        <div class="codex-filter-bar">
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" id="codex-search-input" placeholder="기술 이름, 포지션 검색..." value="${this.searchQuery}">
          </div>

          <div class="belt-filter-tabs">
            <button class="tab-btn ${this.activeBeltFilter === 'all' ? 'active' : ''}" data-belt="all">전체 (${BJJ_TECHNIQUES.length}개)</button>
            ${BELT_RANKS.map(b => `
              <button class="tab-btn ${this.activeBeltFilter === b.id ? 'active' : ''}" data-belt="${b.id}" style="--belt-color: ${b.color}">
                ${b.name} (${BJJ_TECHNIQUES.filter(t=>t.belt===b.id).length})
              </button>
            `).join('')}
          </div>
        </div>

        <div class="codex-layout">
          <div class="codex-list">
            ${filtered.length === 0 ? `
              <div class="empty-codex">검색 결과에 맞는 기술이 없습니다.</div>
            ` : filtered.map(tech => `
              <div class="codex-item ${this.selectedTechnique && this.selectedTechnique.id === tech.id ? 'active' : ''}" data-tech-id="${tech.id}">
                <span class="tech-item-icon">${tech.icon}</span>
                <div class="tech-item-info">
                  <div class="tech-item-title">${tech.name}</div>
                  <div class="tech-item-sub">${tech.position}</div>
                </div>
                <span class="belt-tag belt-${tech.belt}">${BELT_RANKS.find(b=>b.id===tech.belt).name}</span>
              </div>
            `).join('')}
          </div>

          <div class="codex-detail">
            ${this.selectedTechnique ? this.renderDetailHTML(this.selectedTechnique) : `
              <div class="detail-placeholder">
                <span class="big-icon">🥋</span>
                <h3>목록에서 기술을 선택해보세요!</h3>
                <p>1단계 동작부터 쉽고 재미있게 읽어보실 수 있습니다.</p>
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    this.attachDynamicEvents(bodyEl);
  }

  renderDetailHTML(tech) {
    return `
      <div class="tech-detail-card">
        <div class="detail-header">
          <div class="detail-title-group">
            <span class="detail-icon">${tech.icon}</span>
            <div>
              <h2>${tech.name}</h2>
              <p class="eng">기본 자세: ${tech.position}</p>
            </div>
          </div>
          <div class="detail-action-btns">
            ${tech.youtubeUrl ? `
              <a href="${tech.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-youtube btn-sm">
                📺 영상 보기
              </a>
            ` : ''}
            <button id="btn-practice-tech" class="btn btn-primary" data-tech-id="${tech.id}">
              🎮 바로 맞춰보기
            </button>
          </div>
        </div>

        <div class="detail-meta-pills">
          <span class="meta-pill">포지션: ${tech.position}</span>
          <span class="meta-pill">종류: ${tech.category}</span>
          <span class="meta-pill belt-${tech.belt}">${BELT_RANKS.find(b=>b.id===tech.belt).name}</span>
        </div>

        <p class="detail-desc">${tech.description}</p>

        <h4 class="steps-heading">📌 쉽게 배우는 ${tech.name} (${tech.steps.length}단계)</h4>
        <div class="detail-steps-list">
          ${tech.steps.map((step, idx) => `
            <div class="detail-step-item">
              <div class="step-num">${step.stepImgIcon || (idx + 1 + '단계')}</div>
              <div class="step-content">
                <h5>${step.title}</h5>
                <p>${step.text}</p>
                <div class="step-tip-box">💡 꿀팁: ${step.tip}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  attachEvents() {
    const btnClose = this.modalEl.querySelector('.btn-close-modal');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });
  }

  attachDynamicEvents(bodyEl) {
    const inputSearch = bodyEl.querySelector('#codex-search-input');
    if (inputSearch) {
      inputSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    bodyEl.querySelectorAll('.belt-filter-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        soundEffects.playPickup();
        this.activeBeltFilter = btn.dataset.belt;
        this.render();
      });
    });

    bodyEl.querySelectorAll('.codex-item').forEach(item => {
      item.addEventListener('click', () => {
        soundEffects.playPickup();
        const techId = item.dataset.techId;
        this.selectedTechnique = BJJ_TECHNIQUES.find(t => t.id === techId);
        this.render();
      });
    });

    const btnPractice = bodyEl.querySelector('#btn-practice-tech');
    if (btnPractice) {
      btnPractice.addEventListener('click', () => {
        const techId = btnPractice.dataset.techId;
        const tech = BJJ_TECHNIQUES.find(t => t.id === techId);
        if (tech) {
          this.close();
          this.onSelectTechnique(tech);
        }
      });
    }
  }
}

// ==========================================================================
// 9. 게임진행 관리 엔진 (GameEngine) - 영구 보존, 별 시스템 & 55% 기본 승률 대전
// ==========================================================================
class GameEngine {
  constructor() {
    this.mode = 'roadmap';
    this.currentBeltIndex = 0;
    this.currentTechniqueIndex = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.pvpTrophies = 1000;
    this.clearedTechniqueIds = new Set();
    this.spentStars = 0;

    // 경제 및 체육관 관비 수익 정보
    this.gold = 1000;
    this.uncollectedGold = 0;
    this.goldIncomePerSec = 5;

    // 수련 캐릭터 정보
    this.selectedCharacterId = 'tiger';
    this.charExp = 0;
    this.charLevel = 1;
    this.charAtk = 15;
    this.charDef = 10;
    this.charSpd = 12;

    this.loadState();
    this.startPassiveGoldGenerator();
  }

  loadState() {
    try {
      const saved = localStorage.getItem('bjj_duolingo_whitebelt_v8');
      if (saved) {
        const data = JSON.parse(saved);
        this.score = data.score || 0;
        this.currentBeltIndex = data.currentBeltIndex || 0;
        this.clearedTechniqueIds = new Set(data.clearedTechniqueIds || []);
        this.maxCombo = data.maxCombo || 0;
        this.pvpTrophies = data.pvpTrophies || 1000;
        this.spentStars = data.spentStars || 0;
        this.gold = data.gold !== undefined ? data.gold : 1000;
        this.uncollectedGold = data.uncollectedGold || 0;
        this.goldIncomePerSec = data.goldIncomePerSec || 5;

        this.selectedCharacterId = data.selectedCharacterId || 'tiger';
        this.charExp = data.charExp || 0;
        this.charLevel = data.charLevel || 1;
        this.charAtk = data.charAtk || 15;
        this.charDef = data.charDef || 10;
        this.charSpd = data.charSpd || 12;
      }
    } catch (e) {}
  }

  saveState() {
    try {
      const data = {
        score: this.score,
        currentBeltIndex: this.currentBeltIndex,
        clearedTechniqueIds: Array.from(this.clearedTechniqueIds),
        maxCombo: this.maxCombo,
        pvpTrophies: this.pvpTrophies,
        spentStars: this.spentStars,
        gold: this.gold,
        uncollectedGold: this.uncollectedGold,
        goldIncomePerSec: this.goldIncomePerSec,
        selectedCharacterId: this.selectedCharacterId,
        charExp: this.charExp,
        charLevel: this.charLevel,
        charAtk: this.charAtk,
        charDef: this.charDef,
        charSpd: this.charSpd
      };
      localStorage.setItem('bjj_duolingo_whitebelt_v8', JSON.stringify(data));
    } catch (e) {}
  }

  getTotalStars() {
    return this.clearedTechniqueIds.size * 3;
  }

  getAvailableStars() {
    return Math.max(0, this.getTotalStars() - this.spentStars);
  }

  // 레벨 비교 기반 대전 승률 계산 (동급 레벨일 때 55% 기본 승률)
  getWinRateAgainstOpponent(oppLevel) {
    const levelDiff = this.charLevel - oppLevel;
    let baseRate = 55 + (levelDiff * 10);
    return Math.max(5, Math.min(95, baseRate));
  }

  startPassiveGoldGenerator() {
    setInterval(() => {
      this.uncollectedGold += this.goldIncomePerSec;
      const uncollectedEl = document.getElementById('biz-uncollected-gold');
      if (uncollectedEl) uncollectedEl.textContent = this.uncollectedGold.toLocaleString();
    }, 1000);
  }

  collectGold() {
    const amount = this.uncollectedGold;
    this.gold += amount;
    this.uncollectedGold = 0;
    this.saveState();
    return amount;
  }

  getSelectedCharacter() {
    return BJJ_CHARACTERS.find(c => c.id === this.selectedCharacterId) || BJJ_CHARACTERS[0];
  }

  setSelectedCharacter(charId) {
    this.selectedCharacterId = charId;
    const c = this.getSelectedCharacter();
    this.charAtk = c.baseAtk + (this.charLevel - 1) * 3;
    this.charDef = c.baseDef + (this.charLevel - 1) * 2;
    this.charSpd = c.baseSpd + (this.charLevel - 1) * 2;
    this.saveState();
  }

  getExpThreshold() {
    return this.charLevel * 100;
  }

  addExp(amount) {
    this.charExp += amount;
    const threshold = this.getExpThreshold();
    if (this.charExp >= threshold) {
      this.charLevel++;
      this.charExp -= threshold;
      this.charAtk += 3;
      this.charDef += 2;
      this.charSpd += 2;
      soundEffects.playBeltPromotion();
      const char = this.getSelectedCharacter();
      alert(`⚡ 수련 레벨 UP!\n${char.avatar} ${char.name} 수련 레벨이 Lv.${this.charLevel}(으)로 상승했습니다!\n(컴퓨터 대전 시 승리 확률이 크게 상승합니다!)`);
    }
    this.saveState();
  }

  getCurrentBelt() {
    if (this.clearedTechniqueIds.size >= 11) {
      return BELT_RANKS[1]; // 🔵 블루벨트
    }
    return BELT_RANKS[0]; // ⚪ 화이트벨트
  }

  getNextBelt() {
    return BELT_RANKS[1];
  }

  getCurrentTechnique() {
    return BJJ_TECHNIQUES[this.currentTechniqueIndex % BJJ_TECHNIQUES.length];
  }

  setTechniqueById(id) {
    const idx = BJJ_TECHNIQUES.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.currentTechniqueIndex = idx;
      return BJJ_TECHNIQUES[idx];
    }
    return this.getCurrentTechnique();
  }

  recordSuccess(technique) {
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;

    const base = 100;
    const comboBonus = (this.combo - 1) * 30;
    const earnedPoints = base + comboBonus;

    this.score += earnedPoints;
    this.gold += 200;
    this.clearedTechniqueIds.add(technique.id);

    this.addExp(100);

    let promotedBelt = null;
    if (this.clearedTechniqueIds.size >= 11 && this.currentBeltIndex === 0) {
      this.currentBeltIndex = 1;
      promotedBelt = BELT_RANKS[1];
    }

    this.saveState();

    return {
      earnedPoints,
      combo: this.combo,
      promotedBelt,
      charLevel: this.charLevel,
      totalCleared: this.clearedTechniqueIds.size
    };
  }

  recordFailure() {
    this.combo = 0;
  }
}

// ==========================================================================
// 10. 메인 App 컨트롤러
// ==========================================================================
class App {
  constructor() {
    this.engine = new GameEngine();
    this.particles = new ParticleEngine('fx-canvas');

    this.roadmapView = new BJJRoadmapView({
      containerEl: document.getElementById('duolingo-roadmap-view'),
      engine: this.engine,
      onSelectStage: (tech) => this.showStageStartModal(tech)
    });

    this.board = new DragOrderBoard({
      containerEl: document.getElementById('game-board-container'),
      onValidation: (result) => this.handleValidation(result),
      onOpenRoadmap: () => this.showRoadmapView()
    });

    this.premiumGymView = new PremiumGymView({
      containerEl: document.getElementById('premium-gym-view'),
      engine: this.engine,
      onReturnRoadmap: () => this.showRoadmapView()
    });

    this.charModal = new CharacterSelectModal({
      modalId: 'character-select-modal',
      engine: this.engine,
      onSelectCharacter: () => {
        this.updateHUD();
        this.roadmapView.render();
        this.premiumGymView.render();
      }
    });

    this.codexModal = new CodexModal({
      modalId: 'codex-modal',
      onSelectTechnique: (tech) => this.startStageDirect(tech)
    });

    this.initUI();
    this.showRoadmapView();
  }

  initUI() {
    this.charModal.init();
    this.codexModal.init();

    const btnGymPage = document.getElementById('btn-open-gym-page');
    if (btnGymPage) {
      btnGymPage.addEventListener('click', () => {
        soundEffects.playPickup();
        const isGymVisible = !document.getElementById('premium-gym-view').classList.contains('hidden');
        if (isGymVisible) {
          this.showRoadmapView();
        } else {
          this.showPremiumGymView();
        }
      });
    }

    const btnChangeChar = document.getElementById('btn-change-char');
    if (btnChangeChar) {
      btnChangeChar.addEventListener('click', () => {
        this.charModal.open();
      });
    }

    const btnOpenCodex = document.getElementById('btn-open-codex');
    if (btnOpenCodex) {
      btnOpenCodex.addEventListener('click', () => {
        this.codexModal.open();
      });
    }

    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isMuted = soundEffects.toggleMute();
        btnSound.innerHTML = isMuted ? '🔇' : '🔊';
      });
    }

    const btnStartNow = document.getElementById('btn-start-stage-now');
    if (btnStartNow) {
      btnStartNow.addEventListener('click', () => {
        soundEffects.playPickup();
        const stageModal = document.getElementById('stage-start-modal');
        if (stageModal) stageModal.classList.add('hidden');
        this.showBoardView();
      });
    }

    const btnNextTech = document.getElementById('btn-next-technique');
    if (btnNextTech) {
      btnNextTech.addEventListener('click', () => {
        soundEffects.playPickup();
        this.hideVictoryModal();
        
        const cleared = this.engine.clearedTechniqueIds;
        const nextTech = BJJ_TECHNIQUES.find(t => !cleared.has(t.id));
        if (nextTech) {
          this.startStageDirect(nextTech);
        } else {
          this.showRoadmapView();
        }
      });
    }

    this.updateHUD();
  }

  hideAllSections() {
    document.getElementById('duolingo-roadmap-view').classList.add('hidden');
    document.getElementById('game-board-container').classList.add('hidden');
    document.getElementById('premium-gym-view').classList.add('hidden');
  }

  showRoadmapView() {
    this.hideAllSections();
    this.engine.loadState();
    document.getElementById('duolingo-roadmap-view').classList.remove('hidden');
    const toggleBtn = document.getElementById('btn-open-gym-page');
    if (toggleBtn) toggleBtn.textContent = '🏢 체육관 이동';
    const currentGymName = document.getElementById('hud-current-gym-name');
    if (currentGymName) currentGymName.textContent = '🏢 본관 주짓수 수련장';
    this.roadmapView.render();
    this.updateHUD();
  }

  showBoardView() {
    this.hideAllSections();
    this.engine.loadState();
    document.getElementById('game-board-container').classList.remove('hidden');
    const tech = this.engine.getCurrentTechnique();
    this.board.loadTechnique(tech);
    this.updateHUD();
  }

  showPremiumGymView() {
    this.hideAllSections();
    this.engine.loadState();
    document.getElementById('premium-gym-view').classList.remove('hidden');
    const toggleBtn = document.getElementById('btn-open-gym-page');
    if (toggleBtn) toggleBtn.textContent = '🗺️ 메인 로드맵 돌아가기';
    const currentGymName = document.getElementById('hud-current-gym-name');
    if (currentGymName) currentGymName.textContent = '🏢 내 주짓수 체육관 (경영&수련)';
    this.premiumGymView.render();
    this.updateHUD();
  }

  showStageStartModal(tech) {
    this.engine.setTechniqueById(tech.id);
    const modal = document.getElementById('stage-start-modal');
    if (!modal) return;

    document.getElementById('stage-modal-icon').textContent = tech.icon;
    document.getElementById('stage-modal-title').textContent = tech.name;
    document.getElementById('stage-modal-belt').textContent = `STAGE ${tech.stageNumber || 1} • ${BELT_RANKS.find(b=>b.id===tech.belt).name}`;
    document.getElementById('stage-modal-desc').textContent = tech.description;

    modal.classList.remove('hidden');
  }

  startStageDirect(tech) {
    this.engine.setTechniqueById(tech.id);
    this.showBoardView();
  }

  handleValidation(result) {
    if (result.success) {
      const stats = this.engine.recordSuccess(result.technique);
      this.particles.triggerConfetti();

      if (stats.promotedBelt) {
        soundEffects.playBeltPromotion();
        this.particles.triggerConfetti(['#F59E0B', '#3B82F6', '#A855F7', '#FFFFFF']);
      }

      this.updateHUD();
      this.showVictoryModal(result.technique, stats);
    } else {
      this.engine.recordFailure();
      this.updateHUD();
    }
  }

  showVictoryModal(technique, stats) {
    const modal = document.getElementById('victory-modal');
    if (!modal) return;

    document.getElementById('victory-tech-name').textContent = `${technique.name} (${technique.position})`;
    document.getElementById('victory-points').textContent = stats.earnedPoints;

    const promoBanner = document.getElementById('promotion-banner');
    if (stats.promotedBelt) {
      promoBanner.classList.remove('hidden');
      document.getElementById('promoted-belt-name').textContent = `🎉 축하합니다! ${stats.promotedBelt.name} 승급!`;
    } else {
      promoBanner.classList.add('hidden');
    }

    modal.classList.remove('hidden');
  }

  hideVictoryModal() {
    const modal = document.getElementById('victory-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  updateHUD() {
    this.engine.loadState();
    const goldEl = document.getElementById('hud-gold');
    const scoreEl = document.getElementById('hud-score');
    const trophiesEl = document.getElementById('hud-pvp-trophies');

    if (goldEl) goldEl.textContent = this.engine.gold.toLocaleString();
    if (scoreEl) scoreEl.textContent = this.engine.score.toLocaleString();
    if (trophiesEl) trophiesEl.textContent = this.engine.pvpTrophies.toLocaleString();

    // 수련 캐릭터 HUD 업데이트
    const char = this.engine.getSelectedCharacter();
    const avatarEl = document.getElementById('hud-char-avatar');
    const nameEl = document.getElementById('hud-char-name');
    const levelEl = document.getElementById('hud-char-level');
    const expFillEl = document.getElementById('hud-char-exp-fill');

    if (avatarEl) avatarEl.textContent = char.avatar;
    if (nameEl) nameEl.textContent = char.name;
    if (levelEl) levelEl.textContent = `Lv.${this.engine.charLevel}`;
    if (expFillEl) {
      const pct = Math.min(100, Math.floor((this.engine.charExp / this.engine.getExpThreshold()) * 100));
      expFillEl.style.width = `${pct}%`;
    }

    const belt = this.engine.getCurrentBelt();
    const beltBadgeEl = document.getElementById('hud-belt-badge');
    const beltProgressEl = document.getElementById('hud-belt-progress');

    if (beltBadgeEl) {
      beltBadgeEl.textContent = belt.badge;
      beltBadgeEl.className = `belt-pill-badge belt-${belt.id}`;
    }

    if (beltProgressEl) {
      const clearedCount = this.engine.clearedTechniqueIds.size;
      const totalStars = clearedCount * 3;
      beltProgressEl.textContent = `⭐ ${totalStars}개 (${clearedCount}/11 완료)`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.bjjApp = new App();
});
