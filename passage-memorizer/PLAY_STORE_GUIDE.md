# 🚀 PassageMemo 구글 플레이스토어 업로드 가이드

PassageMemo 웹 애플리케이션을 구글 플레이스토어 공식 규격(`.aab` - Android App Bundle)으로 변환하여 최종 출시하는 가장 쉽고 빠른 방법입니다.

---

## 📂 현재 준비된 플레이스토어 파일 목록

현재 폴더에 플레이스토어 등록에 필요한 모든 파일이 완벽히 세팅되어 있습니다:

| 파일 / 폴더 | 설명 |
| :--- | :--- |
| **`manifest.json`** | 구글 공식 Web App Manifest (앱 이름, 테마 색상, 실행 모드 등) |
| **`sw.js`** | 오프라인 동작 및 PWA 설치 인증을 위한 서비스 워커 |
| **`privacy.html`** | 구글 플레이스토어 필수 제출용 **개인정보처리방침 웹페이지** |
| **`playstore-assets/icon-512.png`** | 플레이스토어 필수 앱 아이콘 (512x512 고해상도) |
| **`playstore-assets/feature-graphic-1024x500.png`** | 플레이스토어 메인 그래픽 배너 (1024x500 고해상도) |
| **`playstore-assets/PLAY_STORE_LISTING.md`** | 복사해서 쓸 수 있는 앱 이름, 간단한 설명, 자세한 설명 |
| **`.well-known/assetlinks.json`** | 주소창 없는 전체화면 네이티브 앱 연동 인증 파일 |

---

## ⚡ 1단계: 플레이스토어용 `.aab` 파일 1분 만에 만들기 (추천: PWABuilder)

구글과 마이크로소프트가 공식 지원하는 **PWABuilder**를 사용하면 복잡한 안드로이드 스튜디오 설치 없이 클라우드에서 바로 구글 플레이 제출용 `.aab` 파일을 만들 수 있습니다.

### 1. 무료 웹 호스팅에 폴더 올리기
앱이 인터넷 주소(HTTPS)를 가지고 있어야 구글 플레이 TWA로 패키징할 수 있습니다.
- **GitHub Pages 이용 시:**
  - 현재 저장소를 GitHub에 push한 후 [Settings] -> [Pages] 활성화
  - 생성된 주소 확인: `https://[깃허브아이디].github.io/[저장소이름]/`
- **또는 Vercel / Netlify 이용 시:**
  - `passage-memorizer` 폴더를 Vercel 또는 Netlify에 드래그&드롭하면 10초 만에 무료 HTTPS 주소가 생성됩니다.

### 2. PWABuilder에서 .aab 추출하기
1. 웹 브라우저에서 [https://www.pwabuilder.com](https://www.pwabuilder.com) 접속
2. 위에서 배포한 **웹 앱 URL** 입력 후 `Start` 클릭
3. PWA 점수가 100점(Manifest, Service Worker, Icons 모두 완비)으로 표시됩니다.
4. **`Package for Store`** 버튼 클릭 -> **`Google Play (Android)`** 선택
5. 옵션 설정:
   - **Package ID:** `com.passagememo.app` (원하는 고유 ID 지정)
   - **App Name:** `PassageMemo`
   - **Version:** `1.0.0`
6. **`Generate`** 클릭!
7. 다운로드된 ZIP 파일 안에 **`app-release.aab`** 및 **`signing-keystore`**가 들어있습니다. 이 `.aab` 파일이 구글 플레이에 업로드할 파일입니다!

---

## 📋 2단계: 구글 플레이 콘솔(Play Console) 등록 순서

1. **[구글 플레이 콘솔](https://play.google.com/console) 접속 및 로그인**
   - 개발자 등록비: 1회 25달러 (신용카드)

2. **[앱 만들기] 클릭**
   - 앱 이름: `PassageMemo: 영어 본문 빈칸 암기`
   - 기본 언어: 한국어
   - 앱 또는 게임: 앱
   - 무료 또는 유료: 무료

3. **[앱 설정 및 정책] 완료 (대시보드 체크리스트)**
   - **개인정보처리방침:** 배포한 `https://[도메인]/privacy.html` 주소 입력
   - **광고:** "아니요, 앱에 광고가 포함되어 있지 않습니다" 선택
   - **앱 액세스 권한:** "제한 없이 모든 기능 이용 가능"
   - **콘텐츠 등급:** 설문 진행 후 '전체이용가' 부여
   - **타겟 연령층:** 13세 이상(또는 모든 연령)

4. **[스토어 등록정보] 입력**
   - `playstore-assets/PLAY_STORE_LISTING.md`에 적힌 내용을 그대로 복사·붙여넣기:
     - 간단한 설명 (80자)
     - 자세한 설명 (4000자)
   - **그래픽 자산 업로드:**
     - 앱 아이콘: `playstore-assets/icon-512.png` 업로드
     - 그래픽 이미지: `playstore-assets/feature-graphic-1024x500.png` 업로드
     - 스크린샷: 스마트폰 크기 화면 캡처 이미지 2~4장 업로드

5. **[프로덕션] 또는 [내부 테스트]에 `.aab` 업로드**
   - [출시] -> [프로덕션] -> [새 버전 만들기]
   - PWABuilder에서 다운로드받은 **`.aab` 파일**을 드래그하여 업로드
   - 버전 이름: `1.0.0`
   - 출시 노트: `PassageMemo 첫 공식 출시 - 본문 영어 & 밑줄 해석 빈칸 암기 도우미`
   - [검토 및 출시] 클릭!

6. **검토 대기 및 출시 완료**
   - 구글 검토(보통 1~3일) 후 플레이스토어에 정식 출시됩니다.
