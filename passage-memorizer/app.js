/**
 * PassageMemo - 영어 본문 빈칸 암기 & 해석 마스터
 * Core JavaScript Logic
 */

(function () {
  'use strict';

  // 불용어 (단순 기능어는 낮은 난이도에서 빈칸 우선순위 제외)
  const STOP_WORDS = new Set([
    'a', 'an', 'the', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about',
    'and', 'or', 'but', 'so', 'if', 'as', 'that', 'this', 'it', 'its',
    'he', 'she', 'they', 'we', 'you', 'i', 'my', 'your', 'his', 'her', 'their', 'our'
  ]);



  // State Management
  const state = {
    level: 2, // 1 ~ 5
    mode: 'typing', // 'typing' | 'flip'
    firstLetterHint: true,
    caseSensitive: false,
    sentences: [], // { id, en, ko, tokens: [], starred: boolean }
    totalBlanks: 0,
    solvedBlanks: 0,
    showAllAnswers: false,
    activeVoiceIdx: null,
    starredSentences: new Set(), // 별표 체크된 문장 ID 세트
    starredFilter: false // 별표 모아보기 필터 활성화 여부
  };

  // DOM Elements
  const $ = id => document.getElementById(id);
  const elements = {
    viewInput: $('view-input'),
    viewStudy: $('view-study'),
    btnModeInput: $('btn-mode-input'),
    btnModeStudy: $('btn-mode-study'),
    btnPrintSheet: $('btn-print-sheet'),
    inputEn: $('input-en'),
    inputKo: $('input-ko'),
    enCountInfo: $('en-count-info'),
    koCountInfo: $('ko-count-info'),
    mismatchWarning: $('mismatch-warning'),
    btnStartStudy: $('btn-start-study'),
    levelPills: document.querySelectorAll('.level-pill'),
    modeTyping: $('mode-typing'),
    modeFlip: $('mode-flip'),
    optFirstLetter: $('opt-first-letter'),
    optCaseSensitive: $('opt-case-sensitive'),
    cardsContainer: $('study-cards-container'),
    statSolved: $('stat-solved'),
    statTotal: $('stat-total'),
    statAccuracy: $('stat-accuracy'),
    progressBar: $('study-progress-bar'),
    btnFilterStar: $('btn-filter-star'),
    filterStarText: $('filter-star-text'),
    btnToggleAnswers: $('btn-toggle-answers'),
    btnResetStudy: $('btn-reset-study'),
    btnBackToInput: $('btn-back-to-input'),
    btnListenAll: $('btn-listen-all'),
    completionBanner: $('completion-banner'),
    btnCompRetry: $('btn-comp-retry'),
    btnCompPrint: $('btn-comp-print'),
    // OCR Elements
    btnToggleOcr: $('btn-toggle-ocr'),
    ocrPanel: $('ocr-panel'),
    btnCloseOcr: $('btn-close-ocr'),
    ocrLangSelect: $('ocr-lang-select'),
    ocrDropzone: $('ocr-dropzone'),
    ocrFileInput: $('ocr-file-input'),
    ocrPreviewWrap: $('ocr-preview-wrap'),
    ocrPreviewImg: $('ocr-preview-img'),
    btnRunOcr: $('btn-run-ocr'),
    btnCancelOcrImg: $('btn-cancel-ocr-img'),
    ocrStatus: $('ocr-status'),
    ocrStatusText: $('ocr-status-text')
  };

  // ----------------------------------------------------
  // 초기화 & 로컬스토리지 복원
  // ----------------------------------------------------
  function init() {
    loadSavedData();
    bindEvents();
    initOcr();
    updateInputCounts();
  }

  function loadSavedData() {
    const saved = localStorage.getItem('passagememo_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.en) elements.inputEn.value = parsed.en;
        if (parsed.ko) elements.inputKo.value = parsed.ko;
        if (parsed.level) setLevel(parsed.level);
        if (parsed.mode) setStudyMode(parsed.mode);
        if (typeof parsed.firstLetterHint === 'boolean') {
          state.firstLetterHint = parsed.firstLetterHint;
          elements.optFirstLetter.checked = parsed.firstLetterHint;
        }
        if (typeof parsed.caseSensitive === 'boolean') {
          state.caseSensitive = parsed.caseSensitive;
          elements.optCaseSensitive.checked = parsed.caseSensitive;
        }
        if (Array.isArray(parsed.starred)) {
          state.starredSentences = new Set(parsed.starred.map(Number));
        }
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    } else {
      // 초기 기본값
      elements.inputEn.value = `Stay hungry, stay foolish.
Your time is limited, so don't waste it living someone else's life.
Have the courage to follow your heart and intuition.`;
      elements.inputKo.value = `계속 갈망하고, 우직하게 나아가십시오.
여러분의 시간은 한정되어 있으니, 다른 사람의 삶을 사느라 낭비하지 마십시오.
여러분의 가슴과 직관을 따를 용기를 가지십시오.`;
    }
  }

  function saveData() {
    const payload = {
      en: elements.inputEn.value,
      ko: elements.inputKo.value,
      level: state.level,
      mode: state.mode,
      firstLetterHint: state.firstLetterHint,
      caseSensitive: state.caseSensitive,
      starred: Array.from(state.starredSentences)
    };
    localStorage.setItem('passagememo_data', JSON.stringify(payload));
  }

  // ----------------------------------------------------
  // 이벤트 바인딩
  // ----------------------------------------------------
  function bindEvents() {
    // 탭 전환
    elements.btnModeInput.addEventListener('click', () => switchView('input'));
    elements.btnModeStudy.addEventListener('click', () => {
      if (!state.sentences.length) {
        generateStudyData();
      }
      switchView('study');
    });
    elements.btnBackToInput.addEventListener('click', () => switchView('input'));

    // 별표 모아보기 필터 버튼
    if (elements.btnFilterStar) {
      elements.btnFilterStar.addEventListener('click', toggleStarFilter);
    }

    // 본문 추출 팁 따옴표 클릭 시 클립보드 복사
    const btnCopyQuote = $('btn-copy-quote');
    const copyPill = $('copy-pill');
    if (btnCopyQuote) {
      btnCopyQuote.addEventListener('click', () => {
        const textToCopy = btnCopyQuote.dataset.quote || "이 영어 내용만 글자로 따서 문장단위로 엔터치면서 한문단으로 써줘";
        
        function showFeedback() {
          btnCopyQuote.classList.add('copied');
          if (copyPill) copyPill.innerHTML = '<span class="copy-icon">✓</span> 복사완료!';
          setTimeout(() => {
            btnCopyQuote.classList.remove('copied');
            if (copyPill) copyPill.innerHTML = '<span class="copy-icon">📋</span> 클릭 시 복사';
          }, 1800);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(showFeedback).catch(() => {
            fallbackCopy(textToCopy, showFeedback);
          });
        } else {
          fallbackCopy(textToCopy, showFeedback);
        }
      });
    }

    function fallbackCopy(text, cb) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        cb();
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(ta);
    }

    // 입력창 카운트 실시간 업데이트
    elements.inputEn.addEventListener('input', () => {
      updateInputCounts();
      saveData();
    });
    elements.inputKo.addEventListener('input', () => {
      updateInputCounts();
      saveData();
    });

    // 난이도 선택
    elements.levelPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const lvl = parseInt(pill.dataset.level, 10);
        setLevel(lvl);
        saveData();
      });
    });

    // 모드 및 옵션 변경
    elements.modeTyping.addEventListener('change', () => {
      state.mode = 'typing';
      saveData();
    });
    elements.modeFlip.addEventListener('change', () => {
      state.mode = 'flip';
      saveData();
    });
    elements.optFirstLetter.addEventListener('change', e => {
      state.firstLetterHint = e.target.checked;
      saveData();
    });
    elements.optCaseSensitive.addEventListener('change', e => {
      state.caseSensitive = e.target.checked;
      saveData();
    });

    // 학습 시작 버튼
    elements.btnStartStudy.addEventListener('click', () => {
      generateStudyData();
      switchView('study');
    });

    // 상단 툴바 액션
    elements.btnToggleAnswers.addEventListener('click', toggleAllAnswers);
    elements.btnResetStudy.addEventListener('click', resetStudyProgress);
    elements.btnListenAll.addEventListener('click', listenAllSentences);
    elements.btnPrintSheet.addEventListener('click', triggerPrint);

    // 완료 배너 액션
    elements.btnCompRetry.addEventListener('click', () => switchView('input'));
    elements.btnCompPrint.addEventListener('click', triggerPrint);
  }

  function setLevel(lvl) {
    state.level = lvl;
    elements.levelPills.forEach(p => {
      const active = parseInt(p.dataset.level, 10) === lvl;
      p.classList.toggle('active', active);
      p.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  function setStudyMode(mode) {
    state.mode = mode;
    if (mode === 'flip') {
      elements.modeFlip.checked = true;
    } else {
      elements.modeTyping.checked = true;
    }
  }

  function updateInputCounts() {
    const enLines = getLines(elements.inputEn.value);
    const koLines = getLines(elements.inputKo.value);

    elements.enCountInfo.textContent = `${enLines.length} 문장`;
    elements.koCountInfo.textContent = `${koLines.length} 문장`;

    if (enLines.length > 0 && koLines.length > 0 && enLines.length !== koLines.length) {
      elements.mismatchWarning.hidden = false;
      elements.mismatchWarning.textContent = `⚠️ 문장 수가 맞지 않습니다 (영어: ${enLines.length}줄 / 해석: ${koLines.length}줄). 순서대로 1:1 매칭됩니다.`;
    } else {
      elements.mismatchWarning.hidden = true;
    }
  }

  function getLines(text) {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  function switchView(viewName) {
    if (viewName === 'input') {
      elements.viewInput.classList.add('active');
      elements.viewStudy.classList.remove('active');
      elements.btnModeInput.classList.add('active');
      elements.btnModeStudy.classList.remove('active');
      elements.btnModeInput.setAttribute('aria-selected', 'true');
      elements.btnModeStudy.setAttribute('aria-selected', 'false');
    } else {
      elements.viewInput.classList.remove('active');
      elements.viewStudy.classList.add('active');
      elements.btnModeInput.classList.remove('active');
      elements.btnModeStudy.classList.add('active');
      elements.btnModeInput.setAttribute('aria-selected', 'false');
      elements.btnModeStudy.setAttribute('aria-selected', 'true');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ----------------------------------------------------
  // 스마트 토큰화 및 난이도별 빈칸 생성 알고리즘
  // ----------------------------------------------------
  function generateStudyData() {
    const enLines = getLines(elements.inputEn.value);
    const koLines = getLines(elements.inputKo.value);

    if (enLines.length === 0) {
      alert('영어 본문 문장을 최소 1줄 이상 입력해 주세요!');
      switchView('input');
      return;
    }

    state.sentences = [];
    state.totalBlanks = 0;
    state.solvedBlanks = 0;
    state.showAllAnswers = false;
    elements.completionBanner.hidden = true;

    enLines.forEach((enLine, idx) => {
      const sid = idx + 1;
      const koLine = koLines[idx] || '(해석 없음)';
      const tokens = tokenizeSentence(enLine, state.level);
      state.sentences.push({
        id: sid,
        en: enLine,
        ko: koLine,
        tokens,
        starred: state.starredSentences.has(sid)
      });
    });

    renderStudyCards();
    updateStats();
  }

  /**
   * 문장을 토큰(단어/구두점/공백)으로 분해하고 난이도에 따라 빈칸 지정
   */
  function tokenizeSentence(sentence, level) {
    // 단어와 구분자(공백/구두점) 정규식
    const regex = /([a-zA-Z0-9'’-]+)|([^a-zA-Z0-9'’\s]+)|(\s+)/g;
    const tokens = [];
    let match;

    while ((match = regex.exec(sentence)) !== null) {
      if (match[1]) {
        // 단어
        tokens.push({
          type: 'word',
          text: match[1],
          isBlank: false,
          solved: false,
          userValue: ''
        });
      } else if (match[2]) {
        // 구두점
        tokens.push({
          type: 'punct',
          text: match[2]
        });
      } else if (match[3]) {
        // 공백
        tokens.push({
          type: 'space',
          text: match[3]
        });
      }
    }

    // 단어 토큰들만 필터링하여 빈칸 선정
    const wordTokens = tokens.filter(t => t.type === 'word');
    if (wordTokens.length === 0) return tokens;

    // 난이도별 목표 빈칸 비율
    // Lv 1: ~20%, Lv 2: ~40%, Lv 3: ~60%, Lv 4: ~80%, Lv 5: 100%
    let targetRatio = 0.2;
    if (level === 2) targetRatio = 0.4;
    else if (level === 3) targetRatio = 0.6;
    else if (level === 4) targetRatio = 0.8;
    else if (level === 5) targetRatio = 1.0;

    let targetCount = Math.round(wordTokens.length * targetRatio);
    if (level >= 1 && targetCount < 1) targetCount = 1;
    if (level === 5) targetCount = wordTokens.length;

    // 단어별 빈칸 우선순위 스코어링
    // 1) 내용어(Content Word) > 불용어(Stop word)
    // 2) 단어 길이가 길수록 우선순위 높음
    // 3) ⭐️ 요구사항: 대문자로 시작하는 단어(인명, 지명, 고유명사, 문장 첫 단어 등)는 되도록 빈칸에서 제외 (-100점 페널티)
    const scoredWords = wordTokens.map((tok, index) => {
      const clean = tok.text.toLowerCase();
      const isStop = STOP_WORDS.has(clean);
      const isCapitalized = /^[A-Z]/.test(tok.text);

      let score = tok.text.length;
      if (!isStop) score += 10; // 일반 내용어 가산점
      if (isCapitalized) score -= 100; // 대문자로 시작하는 단어는 우선순위 대폭 하락!

      return { tok, index, score };
    });

    if (level === 5) {
      // 100% 백지 모드
      wordTokens.forEach(t => {
        t.isBlank = true;
        state.totalBlanks++;
      });
    } else {
      // 점수 높은 순으로 정렬하여 상위 targetCount개 선택
      // 너무 연속으로 뚫리지 않도록 적절히 분산
      scoredWords.sort((a, b) => b.score - a.score);
      const chosenIndices = new Set(
        scoredWords.slice(0, targetCount).map(item => item.index)
      );

      wordTokens.forEach((tok, index) => {
        if (chosenIndices.has(index)) {
          tok.isBlank = true;
          state.totalBlanks++;
        }
      });
    }

    return tokens;
  }

  // ----------------------------------------------------
  // 학습 화면 카드 렌더링
  // ----------------------------------------------------
  function renderStudyCards() {
    elements.cardsContainer.innerHTML = '';

    state.sentences.forEach(item => {
      const card = document.createElement('article');
      card.className = `sentence-card ${item.starred ? 'starred' : ''}`;
      card.id = `sentence-card-${item.id}`;
      if (state.starredFilter && !item.starred) {
        card.style.display = 'none';
      }

      // 1. 카드 탑바 (별표 토글 & 문장 번호 & 발음 듣기 & 정답 보기)
      const topbar = document.createElement('div');
      topbar.className = 'card-topbar';
      topbar.innerHTML = `
        <div class="card-topbar-left">
          <button class="star-toggle-btn ${item.starred ? 'active' : ''}" type="button" title="${item.starred ? '별표 해제' : '중요 문장 별표 체크'}" data-id="${item.id}" aria-label="문장 #${item.id} 별표">
            <span class="star-icon">${item.starred ? '★' : '☆'}</span>
            <span class="star-text">${item.starred ? '중요 문장' : '별표 체크'}</span>
          </button>
          <span class="sentence-badge">Sentence #${item.id}</span>
        </div>
        <div class="card-quick-actions">
          <button class="action-icon-btn btn-tts-sentence" type="button" title="이 문장 영어 발음 듣기" data-id="${item.id}">
            🔊
          </button>
          <button class="action-icon-btn btn-reveal-sentence" type="button" title="이 문장 정답 보기/가리기" data-id="${item.id}">
            👁️
          </button>
        </div>
      `;
      card.appendChild(topbar);

      // 2. 영어 본문 빈칸 영역
      const enBox = document.createElement('div');
      enBox.className = 'sentence-en-box';

      item.tokens.forEach((token, tIdx) => {
        if (token.type === 'word') {
          if (token.isBlank) {
            if (state.mode === 'typing') {
              // 타이핑 입력 모드
              const wrapper = document.createElement('span');
              wrapper.className = 'blank-input-wrapper';

              const input = document.createElement('input');
              input.type = 'text';
              input.className = 'blank-input';
              input.id = `blank-${item.id}-${tIdx}`;
              input.dataset.sid = item.id;
              input.dataset.tidx = tIdx;
              input.dataset.answer = token.text;
              input.autocomplete = 'off';
              input.autocapitalize = 'off';
              input.spellcheck = false;

              // 글자 수 기반 width 계산 (글자당 약 13px)
              const inputWidth = Math.max(48, token.text.length * 13 + 18);
              input.style.width = `${inputWidth}px`;

              // 첫 글자 힌트
              if (state.firstLetterHint && token.text.length > 1) {
                const hint = token.text[0] + '_'.repeat(token.text.length - 1);
                input.placeholder = hint;
              }

              // 키 입력 및 포커스 이벤트
              input.addEventListener('input', e => handleBlankInput(e, item, token));
              input.addEventListener('keydown', e => handleBlankKeydown(e, item, tIdx));

              wrapper.appendChild(input);
              enBox.appendChild(wrapper);
            } else {
              // 클릭 확인 모드 (Flip)
              const flip = document.createElement('span');
              flip.className = 'blank-flip';
              flip.id = `blank-flip-${item.id}-${tIdx}`;
              flip.dataset.sid = item.id;
              flip.dataset.tidx = tIdx;

              if (state.firstLetterHint && token.text.length > 1) {
                flip.textContent = token.text[0] + '·'.repeat(token.text.length - 1);
              } else {
                flip.textContent = '·'.repeat(Math.max(3, token.text.length));
              }

              flip.addEventListener('click', () => handleFlipClick(flip, token, item));
              enBox.appendChild(flip);
            }
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'plain-word';
            wordSpan.textContent = token.text;
            enBox.appendChild(wordSpan);
          }
        } else if (token.type === 'punct' || token.type === 'space') {
          const span = document.createElement('span');
          span.className = 'plain-punct';
          span.textContent = token.text;
          enBox.appendChild(span);
        }
      });
      card.appendChild(enBox);

      // 3. ⭐️ 핵심 요구사항: 바로 밑줄에 나오는 해석 박스 ⭐️
      const koRow = document.createElement('div');
      koRow.className = 'sentence-ko-row';
      koRow.innerHTML = `
        <span class="ko-tag">해석</span>
        <p class="ko-text-content">${escapeHtml(item.ko)}</p>
      `;
      card.appendChild(koRow);

      elements.cardsContainer.appendChild(card);
    });

    // 개별 문장 버튼 이벤트 연결
    attachCardActionEvents();
  }

  function attachCardActionEvents() {
    // 문장별 별표 토글 버튼
    document.querySelectorAll('.star-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sid = parseInt(btn.dataset.id, 10);
        toggleSentenceStar(sid);
      });
    });

    // 문장별 TTS 발음 듣기
    document.querySelectorAll('.btn-tts-sentence').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = parseInt(btn.dataset.id, 10);
        const item = state.sentences.find(s => s.id === sid);
        if (item) speakText(item.en);
      });
    });

    // 문장별 정답 토글
    document.querySelectorAll('.btn-reveal-sentence').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = parseInt(btn.dataset.id, 10);
        toggleSentenceAnswer(sid);
      });
    });
  }

  // ----------------------------------------------------
  // 빈칸 입력 및 정답 검증 인터랙션
  // ----------------------------------------------------
  function handleBlankInput(e, sentenceItem, token) {
    const input = e.target;
    const val = input.value.trim();
    token.userValue = val;

    const answer = token.text;
    const isCorrect = state.caseSensitive
      ? val === answer
      : val.toLowerCase() === answer.toLowerCase();

    if (isCorrect) {
      if (!token.solved) {
        token.solved = true;
        state.solvedBlanks++;
      }
      input.classList.remove('wrong');
      input.classList.add('correct');

      // 정답이면 자동으로 다음 빈칸으로 포커스 이동!
      focusNextBlank(input);
    } else {
      if (token.solved) {
        token.solved = false;
        state.solvedBlanks--;
      }
      input.classList.remove('correct');
      // 답 길이만큼 쳤는데 틀렸으면 붉은 경고
      if (val.length >= answer.length) {
        input.classList.add('wrong');
      } else {
        input.classList.remove('wrong');
      }
    }

    checkSentenceCompletion(sentenceItem);
    updateStats();
  }

  function handleBlankKeydown(e, sentenceItem, tIdx) {
    const input = e.target;
    // Enter를 치면 무조건 다음 빈칸으로 이동
    if (e.key === 'Enter') {
      e.preventDefault();
      focusNextBlank(input);
    } else if (e.key === 'Backspace' && input.value === '') {
      // 빈칸에서 백스페이스 누르면 이전 빈칸으로 포커스
      focusPrevBlank(input);
    }
  }

  function focusNextBlank(currentInput) {
    const allInputs = Array.from(document.querySelectorAll('.blank-input'));
    const currIndex = allInputs.indexOf(currentInput);
    if (currIndex !== -1 && currIndex < allInputs.length - 1) {
      allInputs[currIndex + 1].focus();
    }
  }

  function focusPrevBlank(currentInput) {
    const allInputs = Array.from(document.querySelectorAll('.blank-input'));
    const currIndex = allInputs.indexOf(currentInput);
    if (currIndex > 0) {
      allInputs[currIndex - 1].focus();
    }
  }

  function handleFlipClick(flipEl, token, sentenceItem) {
    if (!token.solved) {
      token.solved = true;
      state.solvedBlanks++;
      flipEl.classList.add('revealed');
      flipEl.textContent = token.text;
    } else {
      token.solved = false;
      state.solvedBlanks--;
      flipEl.classList.remove('revealed');
      if (state.firstLetterHint && token.text.length > 1) {
        flipEl.textContent = token.text[0] + '·'.repeat(token.text.length - 1);
      } else {
        flipEl.textContent = '·'.repeat(Math.max(3, token.text.length));
      }
    }

    checkSentenceCompletion(sentenceItem);
    updateStats();
  }

  function checkSentenceCompletion(sentenceItem) {
    const blanks = sentenceItem.tokens.filter(t => t.isBlank);
    const allDone = blanks.every(b => b.solved);
    const cardEl = $(`sentence-card-${sentenceItem.id}`);
    if (cardEl) {
      cardEl.classList.toggle('completed', allDone);
    }

    // 전체 본문 완료 검사
    if (state.totalBlanks > 0 && state.solvedBlanks >= state.totalBlanks) {
      elements.completionBanner.hidden = false;
    } else {
      elements.completionBanner.hidden = true;
    }
  }

  function updateStats() {
    elements.statSolved.textContent = state.solvedBlanks;
    elements.statTotal.textContent = state.totalBlanks;

    const percent = state.totalBlanks > 0
      ? Math.round((state.solvedBlanks / state.totalBlanks) * 100)
      : 0;

    elements.statAccuracy.textContent = `${percent}%`;
    elements.progressBar.style.width = `${percent}%`;

    updateStarFilterButton();
  }

  // ----------------------------------------------------
  // 보조 기능: 정답 보기/숨기기, 다시 풀기, TTS, 인쇄
  // ----------------------------------------------------
  function toggleAllAnswers() {
    state.showAllAnswers = !state.showAllAnswers;
    elements.btnToggleAnswers.innerHTML = state.showAllAnswers
      ? '<span class="btn-icon">🙈</span> <span class="btn-lbl">정답 숨기기</span>'
      : '<span class="btn-icon">👁️</span> <span class="btn-lbl">정답 보기</span>';

    state.sentences.forEach(item => {
      item.tokens.forEach((tok, tIdx) => {
        if (!tok.isBlank) return;

        if (state.mode === 'typing') {
          const input = $(`blank-${item.id}-${tIdx}`);
          if (input) {
            if (state.showAllAnswers) {
              input.value = tok.text;
              input.classList.add('correct');
              tok.solved = true;
            } else {
              input.value = tok.userValue || '';
              const match = state.caseSensitive
                ? input.value === tok.text
                : input.value.toLowerCase() === tok.text.toLowerCase();
              input.classList.toggle('correct', match);
              tok.solved = match;
            }
          }
        } else {
          const flip = $(`blank-flip-${item.id}-${tIdx}`);
          if (flip) {
            if (state.showAllAnswers) {
              flip.textContent = tok.text;
              flip.classList.add('revealed');
              tok.solved = true;
            } else {
              flip.classList.remove('revealed');
              tok.solved = false;
              if (state.firstLetterHint && tok.text.length > 1) {
                flip.textContent = tok.text[0] + '·'.repeat(tok.text.length - 1);
              } else {
                flip.textContent = '·'.repeat(Math.max(3, tok.text.length));
              }
            }
          }
        }
      });
      checkSentenceCompletion(item);
    });

    state.solvedBlanks = state.showAllAnswers ? state.totalBlanks : 0;
    updateStats();
  }

  function toggleSentenceAnswer(sid) {
    const item = state.sentences.find(s => s.id === sid);
    if (!item) return;

    const blanks = item.tokens.filter(t => t.isBlank);
    const areAllSolved = blanks.every(b => b.solved);

    item.tokens.forEach((tok, tIdx) => {
      if (!tok.isBlank) return;

      if (state.mode === 'typing') {
        const input = $(`blank-${item.id}-${tIdx}`);
        if (!input) return;
        if (!areAllSolved) {
          input.value = tok.text;
          input.classList.add('correct');
          tok.solved = true;
        } else {
          input.value = '';
          input.classList.remove('correct', 'wrong');
          tok.solved = false;
        }
      } else {
        const flip = $(`blank-flip-${item.id}-${tIdx}`);
        if (!flip) return;
        if (!areAllSolved) {
          flip.textContent = tok.text;
          flip.classList.add('revealed');
          tok.solved = true;
        } else {
          flip.classList.remove('revealed');
          tok.solved = false;
          if (state.firstLetterHint && tok.text.length > 1) {
            flip.textContent = tok.text[0] + '·'.repeat(tok.text.length - 1);
          } else {
            flip.textContent = '·'.repeat(Math.max(3, tok.text.length));
          }
        }
      }
    });

    // 전체 맞춘 개수 재계산
    state.solvedBlanks = 0;
    state.sentences.forEach(s => {
      s.tokens.forEach(t => {
        if (t.isBlank && t.solved) state.solvedBlanks++;
      });
    });

    checkSentenceCompletion(item);
    updateStats();
  }

  // ----------------------------------------------------
  // 문장별 별표 토글 & 필터 모아보기
  // ----------------------------------------------------
  function toggleSentenceStar(sid) {
    const item = state.sentences.find(s => s.id === sid);
    if (!item) return;

    item.starred = !item.starred;
    if (item.starred) {
      state.starredSentences.add(sid);
    } else {
      state.starredSentences.delete(sid);
    }
    saveData();

    const card = $(`sentence-card-${sid}`);
    if (card) {
      card.classList.toggle('starred', item.starred);
      const starBtn = card.querySelector('.star-toggle-btn');
      if (starBtn) {
        starBtn.classList.toggle('active', item.starred);
        starBtn.title = item.starred ? '별표 해제' : '중요 문장 별표 체크';
        const icon = starBtn.querySelector('.star-icon');
        const txt = starBtn.querySelector('.star-text');
        if (icon) icon.textContent = item.starred ? '★' : '☆';
        if (txt) txt.textContent = item.starred ? '중요 문장' : '별표 체크';
      }

      if (state.starredFilter && !item.starred) {
        card.style.display = 'none';
      }
    }

    updateStarFilterButton();
  }

  function toggleStarFilter() {
    state.starredFilter = !state.starredFilter;
    updateStarFilterButton();

    state.sentences.forEach(item => {
      const card = $(`sentence-card-${item.id}`);
      if (card) {
        if (state.starredFilter) {
          card.style.display = item.starred ? 'block' : 'none';
        } else {
          card.style.display = 'block';
        }
      }
    });
  }

  function updateStarFilterButton() {
    const btn = elements.btnFilterStar;
    const lbl = elements.filterStarText;
    const count = state.starredSentences.size;

    if (btn) {
      btn.classList.toggle('active', state.starredFilter);
    }
    if (lbl) {
      if (state.starredFilter) {
        lbl.textContent = `전체 문장 보기 (${count}개 별표)`;
      } else {
        lbl.textContent = count > 0 ? `별표만 보기 (${count})` : '별표만 보기';
      }
    }
  }

  function resetStudyProgress() {
    if (!confirm('현재 입력한 답을 모두 초기화하고 다시 시작하시겠습니까?')) return;
    generateStudyData();
  }

  // ----------------------------------------------------
  // 영어 TTS 음성 읽기
  // ----------------------------------------------------
  function speakText(text, onEnd) {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 합성을 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // 약간 또렷한 속도

    // 원어민 영어 보이스 우선 선택
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
    if (enVoice) utterance.voice = enVoice;

    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }

  function listenAllSentences() {
    if (!state.sentences.length) return;
    let currentIdx = 0;

    function playNext() {
      if (currentIdx >= state.sentences.length) {
        elements.btnListenAll.innerHTML = '<span class="btn-icon">🔊</span> <span class="btn-lbl">전체 듣기</span>';
        return;
      }
      const item = state.sentences[currentIdx];
      // 해당 문장 카드 살짝 하이라이트 스크롤
      const card = $(`sentence-card-${item.id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      elements.btnListenAll.innerHTML = `<span class="btn-icon">⏹</span> <span class="btn-lbl">${currentIdx + 1}/${state.sentences.length} 듣는 중</span>`;
      currentIdx++;
      speakText(item.en, playNext);
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      elements.btnListenAll.innerHTML = '<span class="btn-icon">🔊</span> <span class="btn-lbl">전체 듣기</span>';
      return;
    }

    playNext();
  }

  // ----------------------------------------------------
  // 시험지 인쇄
  // ----------------------------------------------------
  function triggerPrint() {
    if (!state.sentences.length) {
      generateStudyData();
    }
    switchView('study');

    // 인쇄 전 답안이 가려진 상태로 인쇄되도록 보장
    setTimeout(() => {
      window.print();
    }, 250);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ----------------------------------------------------
  // 교과서 사진 글자 자동 추출 (AI 안 쓰는 순수 로컬 OCR - Tesseract.js)
  // ----------------------------------------------------
  let currentOcrFile = null;

  function initOcr() {
    // 패널 열기/닫기 토글
    elements.btnToggleOcr.addEventListener('click', () => {
      elements.ocrPanel.hidden = !elements.ocrPanel.hidden;
      if (!elements.ocrPanel.hidden) {
        elements.ocrPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    elements.btnCloseOcr.addEventListener('click', () => {
      elements.ocrPanel.hidden = true;
    });

    // 파일 선택
    elements.ocrFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) handleOcrFile(file);
    });

    // 드래그 앤 드롭
    const dropzone = elements.ocrDropzone;
    ['dragover', 'dragenter'].forEach(ev => {
      dropzone.addEventListener(ev, e => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(ev => {
      dropzone.addEventListener(ev, e => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
      });
    });

    dropzone.addEventListener('drop', e => {
      const file = e.dataTransfer.files[0];
      if (file) handleOcrFile(file);
    });

    // Ctrl+V 클립보드 이미지 붙여넣기 지원
    document.addEventListener('paste', e => {
      if (elements.ocrPanel.hidden) return; // 패널 열려있을 때만 동작
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          handleOcrFile(file);
          break;
        }
      }
    });

    // 사진 다시 선택
    elements.btnCancelOcrImg.addEventListener('click', () => {
      currentOcrFile = null;
      elements.ocrFileInput.value = '';
      elements.ocrPreviewWrap.hidden = true;
      elements.ocrDropzone.hidden = false;
      elements.ocrStatus.hidden = true;
    });

    // OCR 실행
    elements.btnRunOcr.addEventListener('click', runOcrProcess);
  }

  function handleOcrFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG 등)을 선택해 주세요.');
      return;
    }

    currentOcrFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      elements.ocrPreviewImg.src = reader.result;
      elements.ocrDropzone.hidden = true;
      elements.ocrPreviewWrap.hidden = false;
      elements.ocrStatus.hidden = true;
    };
    reader.readAsDataURL(file);
  }

  async function runOcrProcess() {
    if (!currentOcrFile) {
      alert('먼저 교과서 사진을 선택해 주세요.');
      return;
    }

    if (!window.Tesseract) {
      alert('Tesseract OCR 엔진을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    const lang = elements.ocrLangSelect.value || 'eng';
    elements.btnRunOcr.disabled = true;
    elements.ocrStatus.hidden = false;
    elements.ocrStatus.classList.remove('error');
    elements.ocrStatusText.textContent = '⚙️ [로컬 OCR] 브라우저 자체 엔진 준비 중...';

    try {
      // 순수 브라우저 로컬 OCR 실행 (API 키 불필요, AI 미사용)
      const ret = await Tesseract.recognize(
        currentOcrFile,
        lang,
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              const p = Math.round((m.progress || 0) * 100);
              elements.ocrStatusText.textContent = `📖 [로컬 OCR] 사진 속 글자 읽는 중... ${p}%`;
            } else if (m.status === 'loading language traineddata') {
              elements.ocrStatusText.textContent = '📥 언어 데이터 로딩 중 (최초 1회 캐싱)...';
            } else {
              elements.ocrStatusText.textContent = `⚙️ 준비 중: ${m.status}...`;
            }
          }
        }
      );

      const rawText = (ret.data && ret.data.text) ? ret.data.text.trim() : '';
      if (!rawText) {
        throw new Error('사진에서 글자를 감지하지 못했습니다. 더 선명하거나 밝은 사진으로 시도해 주세요.');
      }

      // 추출된 텍스트 처리: 영어 문장과 한국어 해석 스마트 분리
      const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const enLines = [];
      const koLines = [];

      const hasKoreanInPhoto = /[가-힣]/.test(rawText);

      if (hasKoreanInPhoto) {
        // 영문과 한글이 함께 있는 사진일 경우 라인별 분리
        lines.forEach(line => {
          if (/[가-힣]/.test(line)) {
            koLines.push(line);
          } else if (/[a-zA-Z]/.test(line)) {
            enLines.push(line);
          }
        });
      } else {
        // 영어만 있는 교과서 본문 사진일 경우:
        // 줄바꿈 또는 온전한 문장 단위(. ! ?)로 깔끔하게 분리
        // 개행이 단어 중간에 끊겼을 수 있으므로 단락 재구성
        const paragraph = lines.join(' ');
        // 마침표/물음표/느낌표 뒤 공백을 기준으로 문장 분할
        const sentences = paragraph
          .replace(/([.!?])\s+(?=[A-Z0-9])/g, '$1\n')
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean);

        sentences.forEach(s => enLines.push(s));
      }

      // 입력창에 반영 (사용자가 바로 자유롭게 수정 가능!)
      if (enLines.length > 0) {
        elements.inputEn.value = enLines.join('\n');
      } else {
        elements.inputEn.value = rawText;
      }

      if (koLines.length > 0) {
        elements.inputKo.value = koLines.join('\n');
      }

      updateInputCounts();
      saveData();

      elements.ocrStatusText.textContent = `🎉 로컬 글자 추출 완료! 아래 입력창에서 필요시 오탈자를 수정한 후 학습을 시작하세요!`;
      elements.btnRunOcr.disabled = false;

      // 입력창으로 부드럽게 스크롤
      setTimeout(() => {
        elements.inputEn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 700);

    } catch (err) {
      console.error(err);
      elements.ocrStatus.classList.add('error');
      elements.ocrStatusText.textContent = `⚠️ 오류: ${err.message}`;
      elements.btnRunOcr.disabled = false;
    }
  }

  // 실행
  init();
})();
