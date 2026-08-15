/**
 * 주짓수 기술 세부 순서 데이터베이스 (총 28+종 확장판)
 */

export const BELT_RANKS = [
  { id: 'white', name: '화이트벨트', color: '#F8FAFC', textColor: '#0F172A', badge: '⚪ WHITE BELT', reqStars: 0 },
  { id: 'blue', name: '블루벨트', color: '#2563EB', textColor: '#FFFFFF', badge: '🔵 BLUE BELT', reqStars: 5 },
  { id: 'purple', name: '퍼플벨트', color: '#9333EA', textColor: '#FFFFFF', badge: '🟣 PURPLE BELT', reqStars: 12 },
  { id: 'brown', name: '브라운벨트', color: '#78350F', textColor: '#FFFFFF', badge: '🟤 BROWN BELT', reqStars: 20 },
  { id: 'black', name: '블랙벨트', color: '#0F172A', textColor: '#F59E0B', badge: '⚫ BLACK BELT', reqStars: 28 }
];

export const BJJ_TECHNIQUES = [
  // --- 화이트벨트 기술 (기초 8종) ---
  {
    id: 'mount_armbar',
    name: '마운트 포지션 암바',
    engName: 'Mount Position Armbar',
    category: 'Submission',
    position: '마운트 (Mount)',
    belt: 'white',
    difficulty: 1,
    icon: '🥋',
    description: '마운트 포지션에서 상대의 한쪽 팔을 제압하여 어깨와 팔꿈치 관절을 차례대로 고립시킨 뒤 꺾는 가장 대표적인 서브미션 기술입니다.',
    steps: [
      { order: 1, title: '상대 팔 고립 (Isolation)', text: '마운트 자세에서 상대가 방어하는 한쪽 팔을 두 손(Cross-Grip)으로 감싸 잡고 내 몸쪽으로 당겨 바닥에서 떼어낸다.', tip: '체중을 실어 상대 손목과 팔꿈치를 내 가슴 안쪽에 단단히 그립하세요.' },
      { order: 2, title: 'S-마운트 전환 (S-Mount Transit)', text: '체중을 상대 가슴 위로 싣고 내 한쪽 무릎을 상대 겨드랑이 밑으로 높게 끌어올려 S-마운트 자세를 만든다.', tip: 'S-마운트 자세를 잡으면 상대 어깨가 바닥에 고정되어 탈출하기 어려워집니다.' },
      { order: 3, title: '체중 베이스 확보 (Base & Shift)', text: '상대 머리 반대편 바닥에 한쪽 손을 짚어 든든한 베이스를 잡고 weight 중심을 상대 가슴 위로 이동시킨다.', tip: '상대가 브릿지로 뒤집지 못하도록 무게중심을 낮게 유지하세요.' },
      { order: 4, title: '머리 위 다리 넘어넘기기 (Leg Over Head)', text: '상대 머리 쪽에 있는 내 다리를 상대 목과 얼굴 위로 넘어뜨려 밀착시키며 엉덩이를 바닥에 댄다.', tip: '다리를 느슨하게 넘기면 상대가 머리를 빼내 탈출하므로 타이트하게 넘어갑니다.' },
      { order: 5, title: '힙 드라이브 및 탭 신호 (Submission Finish)', text: '상대 손목을 잡고 엄지손가락이 하늘을 향하게 맞춘 뒤, 양 무릎을 조이고 힙을 들어올려 탭을 받아낸다.', tip: '팔꿈치가 내 골반(받침점) 바로 위에 놓이도록 엉덩이를 튕겨 올려야 합니다.' }
    ]
  },
  {
    id: 'guard_triangle',
    name: '클로즈드 가드 트라이앵글 초크',
    engName: 'Closed Guard Triangle Choke',
    category: 'Submission',
    position: '클로즈드 가드 (Closed Guard)',
    belt: 'white',
    difficulty: 1,
    icon: '🔺',
    description: '가드 상태에서 상대의 한 팔은 가슴 안으로 넣고 한 팔은 밖으로 뺀 상태에서 양 다리로 상대의 목과 경동맥을 조이는 기술입니다.',
    steps: [
      { order: 1, title: '원-인 원-아웃 셋업 (1-In 1-Out Setup)', text: '클로즈드 가드에서 상대 양 손목을 그립한 뒤, 한쪽 팔은 내 가슴 안쪽으로 밀어넣고 다른 팔은 바깥으로 뽑아낸다.', tip: '상대의 방어를 깨기 위해 순간적인 힙 트위스트와 함께 한쪽 팔을 집어넣어야 합니다.' },
      { order: 2, title: '다리 목 걸기 (Leg Over Shoulder)', text: '클로즈드 가드를 풀며 힙을 높게 튕겨 올리고, 안으로 들어온 팔쪽 다리를 상대 목 뒤 깊숙이 넘어 걸친다.', tip: '엉덩이를 높이 들 수록 상대 목 뒤에 다리를 깊게 안착시킬 수 있습니다.' },
      { order: 3, title: '각도 틀기 및 머리 당기기 (Angle Change)', text: '양 손으로 상대 머리를 끌어내리면서 내 힙을 대각선 45도 각도로 틀어 다리의 각도를 조율한다.', tip: '상대와 일직선이 아닌 측면 각도를 만들어야 트라이앵글 락이 정확히 조여집니다.' },
      { order: 4, title: '4자 삼각 락 완성 (Triangle Lock)', text: '목 뒤를 감싼 발목을 반대쪽 무릎 오금(Knee Pit) 뒤로 깊이 걸어 숫자 4자 모양 삼각 그립을 완성한다.', tip: '락을 걸 때 내 발목이 아닌 오금 뒤로 매끄럽게 들어가야 발목 통증 없이 조여집니다.' },
      { order: 5, title: '팔 넘기기 및 조이기 (Cross Arm & Squeeze)', text: '갇힌 상대의 팔을 내 가슴 가로지르게 당겨주고, 양 무릎을 당기면서 힙을 올려 경동맥을 압박하여 탭을 받는다.', tip: '상대 팔이 내 가슴을 가로질러야 상대 자신의 어깨가 본인 경동맥을 막아 초크가 완성됩니다.' }
    ]
  },
  {
    id: 'scissor_sweep',
    name: '클로즈드 가드 시저스 스윕',
    engName: 'Scissor Sweep',
    category: 'Sweep',
    position: '클로즈드 가드 (Closed Guard)',
    belt: 'white',
    difficulty: 1,
    icon: '✂️',
    description: '가위(Scissor)질을 하듯 양 다리의 교차 차기 동작과 상체 그립 당김을 활용해 상대를 넘어뜨리고 마운트를 빼앗는 대표 가드 스윕입니다.',
    steps: [
      { order: 1, title: 'Cross Collar & Sleeve 그립 (Grip Control)', text: '클로즈드 가드에서 한 손은 상대 대각선 깃(Cross Collar)을 깊게 잡고, 반대 손은 상대 슬리브(소매)를 그립한다.', tip: '깃 그립은 상대 목 옆까지 깊숙이 파들어가야 상체 제압이 원활합니다.' },
      { order: 2, title: '새우뛰기 측면 이동 (Hip Escape)', text: '가드를 풀고 발바닥으로 매트를 밟으며 엉덩이를 한쪽으로 살짝 빼내어(Hip Escape) 상체 측면 공간을 확보한다.', tip: '상대와 정면으로 서있으면 가위질 각도가 나오지 않으므로 옆으로 누워야 합니다.' },
      { order: 3, title: '가슴 쉴드 및 가위 다리 세팅 (Chest Shield)', text: '위쪽 다리 정강이를 상대 가슴/복부 앞으로 가로질러 쉴드를 대고, 아래쪽 다리는 상대 무릎 오금 바닥에 대어 가위 다리를 만든다.', tip: '정강이 프레임이 상대 가슴을 밀어주어 상대 체중을 띄울 준비를 합니다.' },
      { order: 4, title: '상체 당기기 및 오프 밸런스 (Off-Balancing)', text: '잡아둔 깃과 소매를 내 가슴 쪽으로 강하게 끌어당겨 상대의 체중을 내 몸 위쪽으로 띄워 올린다.', tip: '상대의 중심이 앞으로 쏠려 바닥 무릎에 체중이 빠질 때가 스윕의 핵심 순간입니다.' },
      { order: 5, title: '가위 차기 및 마운트 탑 점유 (Scissor Kick & Mount)', text: '위쪽 다리로 가슴을 밀고 아래쪽 다리로 상대 무릎을 가위질하듯 걷어차 상대를 넘어뜨린 뒤 마운트로 올라탄다.', tip: '스윕과 동시에 상체를 따라 일으켜 상대를 덮쳐 눌러야 마운트 4점을 획득합니다.' }
    ]
  },
  {
    id: 'side_escape_guard',
    name: '사이드 컨트롤 이스케이프 to 가드 리커버리',
    engName: 'Side Control Escape to Guard',
    category: 'Escape',
    position: '사이드 컨트롤 밑 (Bottom Side)',
    belt: 'white',
    difficulty: 1,
    icon: '🛡️',
    description: '사이드 컨트롤 아래 눌렸을 때 프레임 세우기와 폭발적인 브릿지, 새우뛰기(Shrimping)를 통해 무릎을 넣고 가드로 생환하는 방어 이스케이프입니다.',
    steps: [
      { order: 1, title: '양손 프레임 구축 (Frame Placement)', text: '바닥에 눌린 상태에서 한 팔은 상대 목/턱 밑에 프레임을 대고, 반대 팔은 상대 골반 뼈에 안쪽 프레임을 세운다.', tip: '상대 체중을 직접 힘으로 미는 것이 아니라 뼈 구조(프레임)로 받쳐야 합니다.' },
      { order: 2, title: '폭발적 힙 브릿지 (Explosive Bridge)', text: '양발을 엉덩이 가까이 당기고 매트를 강하게 밟으며 상대 몸 방향으로 엉덩이를 높게 튕겨 올린다.', tip: '브릿지로 상대 체중을 위로 띄워 순간적인 공간을 뚫는 것이 핵심입니다.' },
      { order: 3, title: '새우뛰기 히프 이스케이프 (Shrimping / Hip Escape)', text: '브릿지 최고점에서 엉덩이를 상대 반대쪽으로 빠르게 빼내며 몸을 새우처럼 구부려 공간을 만든다.', tip: '엉덩이가 멀어질수록 내 무릎이 들어갈 수 있는 넓은 공간이 생겨납니다.' },
      { order: 4, title: 'Knee Shield 무릎 슬라이딩 (Knee Insertion)', text: '확보된 엉덩이 공간 사이로 상대 골반 쪽에 가까운 안쪽 무릎(Knee Shield)을 대각선으로 슬라이딩하여 집어넣는다.', tip: '무릎 프레임이 들어가면 상대가 다시 덮쳐 누르지 못하게 차단됩니다.' },
      { order: 5, title: '가드 완전히 복귀 (Full Guard Recovery)', text: '반대쪽 다리까지 넘어와 상대 허리를 감싸안으며 클로즈드 가드 또는 오픈 가드로 안전하게 리커버리한다.', tip: '상대 허리를 양 다리로 잠그는 순간 안전한 가드 복귀가 완료됩니다.' }
    ]
  },
  {
    id: 'guard_kimura',
    name: '클로즈드 가드 기무라 락',
    engName: 'Closed Guard Kimura Lock',
    category: 'Submission',
    position: '클로즈드 가드 (Closed Guard)',
    belt: 'white',
    difficulty: 1,
    icon: '💪',
    description: '가드 상태에서 상대 손목을 C-그립으로 잡고 상체를 일으켜 상대 팔을 4자 그립으로 묶은 뒤 어깨 관절을 비틀어 꺾는 락입니다.',
    steps: [
      { order: 1, title: '상대 손목 C-Grip 제압', text: '클로즈드 가드에서 상대 한쪽 손목을 같은 쪽 손(C-Grip)으로 바닥에 누르듯 꽉 잡아 고정한다.', tip: '상대가 손목을 당기지 못하도록 매트 바닥 쪽으로 단단히 눌러주세요.' },
      { order: 2, title: '상체 일으키기 및 팔 넘기기', text: '가드를 풀지 않은 상태에서 상체를 위로 일으키며 반대 팔을 상대 겨드랑이 뒤로 파넘긴다.', tip: '상체를 높게 일으켜 상대 어깨 위로 깊이 넘어가야 4자 그립이 잡힙니다.' },
      { order: 3, title: '4자 그립(Figure-4) 결합', text: '상대 팔을 감싼 손으로 내 자신의 손목을 잡아 핑거리스(Thumbless) 4자 그립을 완성한다.', tip: '엄지손가락을 빼고 손목을 감싸 쥐어야 그립이 풀리지 않습니다.' },
      { order: 4, title: '힙 측면 이동 및 어깨 축 제압', text: '가드를 풀고 엉덩이를 꺾인 팔 방향으로 살짝 빼내며 상대 몸체 옆에 내 몸을 90도로 붙인다.', tip: '상대가 몸을 굴려 이스케이프하지 못하도록 등판을 지탱합니다.' },
      { order: 5, title: '손목 등 뒤 회전 탭', text: '상대 팔꿈치를 90도로 유지하고 손목을 상대 등 뒤/머리 방향으로 회전시켜 탭을 받는다.', tip: '팔꿈치를 받침대로 삼아 지그시 손목을 머리 쪽으로 비틀어 올립니다.' }
    ]
  },
  {
    id: 'cross_collar_mount',
    name: '마운트 포지션 십자가 초크',
    engName: 'Mount Cross Collar Choke',
    category: 'Submission',
    position: '마운트 (Mount)',
    belt: 'white',
    difficulty: 1,
    icon: '✝️',
    description: '마운트 탑에서 상대 도복 깃을 교차(Cross)하여 깊숙이 잡고 양 팔꿈치를 조여 상대 경동맥을 직접 차단하는 전통 십자가 초크입니다.',
    steps: [
      { order: 1, title: '첫 번째 딥 그립 (First Deep Grip)', text: '마운트 자세에서 한 손을 상대 대각선 칼라(Cross Collar) 깊숙이 손가락을 넣어 잡는다.', tip: '깃을 잡은 엄지손가락이 상대 목 경동맥 뒤쪽까지 깊게 들어가야 합니다.' },
      { order: 2, title: '두 번째 크로스 그립 (Second Cross Grip)', text: '반대 손을 깃 위나 밑으로 교차시켜 상대 반대편 칼라 깃을 깊숙하게 파잡는다.', tip: '두 손이 X 자 형태로 단단히 엇갈려 그립이 완성되어야 합니다.' },
      { order: 3, title: '체중 가슴 밀착 (Chest Down Base)', text: '상체가 붕 뜨지 않도록 내 체중과 이두근을 상대 가슴과 목 바로 위에 바짝 밀착시킨다.', tip: '머리를 상대 바닥 쪽에 대어 베이스를 낮추면 상대가 브릿지를 치지 못합니다.' },
      { order: 4, title: '손목 뼈 경동맥 밀착 (Wrist Alignment)', text: '양 손목을 회전시켜 날카로운 요골 뼈(Radial Bone)가 상대 양쪽 경동맥에 부딪히게 맞춘다.', tip: '손목이 꺾이지 않고 곧게 펴진 상태로 팽팽하게 죄어 들어갑니다.' },
      { order: 5, title: '팔꿈치 벌리기 및 조이기 탭', text: '양 팔꿈치를 바닥을 향해 내려 조이면서 가슴 압박을 더해 상대의 경동맥을 차단해 탭을 받는다.', tip: '힘으로 당기는 것이 아닌 몸 전체의 체중 압박으로 목을 조입니다.' }
    ]
  },
  {
    id: 'guard_armbar_classic',
    name: '클로즈드 가드 정석 암바',
    engName: 'Closed Guard Classic Armbar',
    category: 'Submission',
    position: '클로즈드 가드 (Closed Guard)',
    belt: 'white',
    difficulty: 1,
    icon: '⚡',
    description: '가드 바텀에서 상대 한 팔을 낚아채 골반을 밟고 측면 90도로 틀어 목 위로 다리를 넘겨 꺾는 대표 정석 관절기입니다.',
    steps: [
      { order: 1, title: '팔꿈치 & 손목 크로스 그립', text: '클로즈드 가드에서 상대 한쪽 손목을 잡고, 반대 손으로 상대 삼두근 팔꿈치 뒤를 깊게 안아 당긴다.', tip: '상대 팔꿈치가 내 가슴 중앙선을 넘어오도록 당기는 것이 핵심입니다.' },
      { order: 2, title: '골반 밟기 & 90도 힙 트위스트', text: '공격하는 팔쪽 발로 상대 골반을 세게 밟으며 엉덩이를 측면 90도 각도로 높게 튕겨 올린다.', tip: '상대 어깨가 바닥에 고정되도록 힙을 높이 띄워야 합니다.' },
      { order: 3, title: '등판 제압 훅 & 목 위 다리 넘어넘기기', text: '반대쪽 다리로 상대 등판을 밑으로 짓눌러 고정하고, 골반을 밟던 다리를 상대 목 위로 크게 넘긴다.', tip: '다리를 느슨하게 넘기면 상대가 머리를 세워 탈출하므로 강하게 넘깁니다.' },
      { order: 4, title: '양 무릎 조이기 & 손목 방향 조정', text: '양 무릎 오금을 단단히 조이고 상대 손목의 엄지손가락이 하늘을 향하도록 고정한다.', tip: '엄지가 하늘을 향해야 팔꿈치 관절이 정확히 내 엉덩이 받침점에 걸립니다.' },
      { order: 5, title: '힙 리프트 암바 탭', text: '상대 손목을 내 가슴에 붙인 채 엉덩이를 천장 방향으로 튕겨 올려 팔꿈치를 꺾어 탭을 받는다.', tip: '골반을 들어 올릴 때 조여진 무릎의 압박을 유지하세요.' }
    ]
  },
  {
    id: 'side_escape_turtle',
    name: '사이드 이스케이프 to 터틀 & 스탠딩',
    engName: 'Side Escape to Turtle & Stand',
    category: 'Escape',
    position: '사이드 컨트롤 밑 (Bottom Side)',
    belt: 'white',
    difficulty: 1,
    icon: '🐢',
    description: '사이드 아래 갇혔을 때 회전 프레임으로 힙을 빼내고 터틀(Turtle) 자세로 전환한 뒤 스탠딩 업으로 가드를 살려내는 기술입니다.',
    steps: [
      { order: 1, title: '내부 프레임 & 무릎 당김', text: '상대 밑에서 목 프레임과 골반 프레임을 세우고 양발을 엉덩이 바짝 당겨 무릎을 세운다.', tip: '상대 체중이 내 상체를 짓누르지 못하게 뼈 프레임을 유지합니다.' },
      { order: 2, title: '힙 브릿지 후 바깥쪽 롤링', text: '힙을 순간적으로 올렸다가 상대 몸 바깥쪽 방향으로 엉덩이를 빠르게 회전하여 몸을 돌린다.', tip: '상대 반대편으로 몸을 돌려 엎드리는 터틀 회전 공간을 만듭니다.' },
      { order: 3, title: '터틀 포지션 엎드리기 (Turtle Lock)', text: '양 무릎과 팔꿈치를 몸 안으로 웅크려 상대에게 백 훅을 주지 않고 터틀 자세를 잡는다.', tip: '목과 늑골 유격을 바짝 조여 상대 손이 안으로 들어오지 못하게 합니다.' },
      { order: 4, title: '상대 싱글렉 뒤꿈치 잡기', text: '터틀 자세에서 일으키며 상대 서 있는 한쪽 다리 뒤꿈치를 안아 힙 드라이브를 건다.', tip: '상대의 하체 기지를 무너뜨리며 위로 일어나야 합니다.' },
      { order: 5, title: '스탠딩 업 & 스윕 2점 획득', text: '상체 체중으로 상대 다리를 밀어 넘어뜨리고 탑 포지션을 잡거나 스탠딩 업하여 리커버리한다.', tip: '빠른 스탠딩 업 동작으로 사이드 열세를 반전시킵니다.' }
    ]
  }
];

export function getTechniquesByBelt(beltId) {
  if (beltId === 'all') return BJJ_TECHNIQUES;
  return BJJ_TECHNIQUES.filter(t => t.belt === beltId);
}

export function getTechniqueById(id) {
  return BJJ_TECHNIQUES.find(t => t.id === id);
}
