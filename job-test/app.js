// GoJob 웹 애플리케이션 메인 스크립트

document.addEventListener("DOMContentLoaded", () => {
  // 앱 상태
  const state = {
    currentStep: 0,
    answers: new Array(TEST_QUESTIONS.length).fill(null),
    scores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
    currentResult: null,
    soundEnabled: true
  };

  // DOM 엘리먼트 캐싱
  const views = {
    hero: document.getElementById("heroView"),
    quiz: document.getElementById("quizView"),
    loading: document.getElementById("loadingView"),
    result: document.getElementById("resultView")
  };

  const btnStart = document.getElementById("btnStart");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const btnRestart = document.getElementById("btnRestart");
  const btnCatalog = document.getElementById("btnCatalog");
  const btnCloseCatalog = document.getElementById("btnCloseCatalog");
  const btnDownloadImage = document.getElementById("btnDownloadImage");
  const btnCopyLink = document.getElementById("btnCopyLink");
  const btnSoundToggle = document.getElementById("btnSoundToggle");
  const catalogModal = document.getElementById("catalogModal");
  const catalogList = document.getElementById("catalogList");
  const toastMsg = document.getElementById("toastMsg");

  // 퀴즈 관련 엘리먼트
  const stepIndicator = document.getElementById("stepIndicator");
  const progressBar = document.getElementById("progressBar");
  const questionCategory = document.getElementById("questionCategory");
  const questionTitle = document.getElementById("questionTitle");
  const optionsContainer = document.getElementById("optionsContainer");

  // 로딩 텍스트
  const loadingStepText = document.getElementById("loadingStepText");

  // 결과 관련 엘리먼트
  const resultBadge = document.getElementById("resultBadge");
  const resultTitle = document.getElementById("resultTitle");
  const resultQuote = document.getElementById("resultQuote");
  const resultTags = document.getElementById("resultTags");
  const envDesc = document.getElementById("envDesc");
  const jobsList = document.getElementById("jobsList");
  const bestChemName = document.getElementById("bestChemName");
  const bestChemDesc = document.getElementById("bestChemDesc");
  const worstChemName = document.getElementById("worstChemName");
  const worstChemDesc = document.getElementById("worstChemDesc");
  const radarCanvas = document.getElementById("radarChartCanvas");

  // 1. 뷰 전환 함수
  function switchView(viewName) {
    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.add("active");
      } else {
        views[key].classList.remove("active");
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 2. 토스트 알림
  function showToast(message) {
    toastMsg.textContent = message;
    toastMsg.classList.add("show");
    setTimeout(() => {
      toastMsg.classList.remove("show");
    }, 2400);
  }

  // 3. 질문 렌더링
  function renderQuestion(index) {
    const q = TEST_QUESTIONS[index];
    stepIndicator.textContent = `QUESTION ${index + 1} / ${TEST_QUESTIONS.length}`;
    
    // 진행도 바
    const progressPercent = Math.round(((index) / TEST_QUESTIONS.length) * 100);
    progressBar.style.width = `${progressPercent}%`;

    questionCategory.textContent = q.category;
    questionTitle.textContent = q.title;

    optionsContainer.innerHTML = "";
    const selectedChoice = state.answers[index];

    q.options.forEach((opt, optIdx) => {
      const card = document.createElement("div");
      card.className = `option-card ${selectedChoice === optIdx ? "selected" : ""}`;
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");

      card.innerHTML = `
        <div class="option-key">${optIdx + 1}</div>
        <div class="option-text">${opt.text}</div>
      `;

      card.addEventListener("click", () => {
        handleOptionSelect(index, optIdx);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOptionSelect(index, optIdx);
        }
      });

      optionsContainer.appendChild(card);
    });

    btnPrev.disabled = index === 0;
    btnNext.disabled = selectedChoice === null;
  }

  // 4. 옵션 선택 처리
  function handleOptionSelect(qIndex, optIndex) {
    sounds.playSelect();
    state.answers[qIndex] = optIndex;

    // UI 즉시 반영
    const cards = optionsContainer.querySelectorAll(".option-card");
    cards.forEach((card, idx) => {
      card.classList.toggle("selected", idx === optIndex);
    });

    btnNext.disabled = false;

    // 부드러운 자동 다음 문항 이동 (300ms)
    setTimeout(() => {
      if (state.currentStep < TEST_QUESTIONS.length - 1) {
        state.currentStep++;
        renderQuestion(state.currentStep);
      } else {
        // 마지막 질문 완료 시 결과 계산 시작
        startAnalysis();
      }
    }, 280);
  }

  // 5. 점수 집계 & 분석 연출
  function startAnalysis() {
    // 100% 진행 표시
    progressBar.style.width = "100%";
    sounds.playClick();
    switchView("loading");

    // 점수 초기화 및 집계
    state.scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    state.answers.forEach((optIdx, qIdx) => {
      if (optIdx !== null) {
        const traits = TEST_QUESTIONS[qIdx].options[optIdx].traits;
        for (const [key, val] of Object.entries(traits)) {
          state.scores[key] += val;
        }
      }
    });

    // 분석 애니메이션 텍스트 단계
    const stepTexts = [
      "12개 핵심 직무 질문 응답 분석 중...",
      "RIASEC 6대 성향 벡터 및 가중치 추출 중...",
      "16개 직무 페르소나 대조 및 최적 직업 산출 중..."
    ];

    let currentStepTextIdx = 0;
    loadingStepText.textContent = stepTexts[0];

    const intervalId = setInterval(() => {
      currentStepTextIdx++;
      if (currentStepTextIdx < stepTexts.length) {
        loadingStepText.textContent = stepTexts[currentStepTextIdx];
      }
    }, 700);

    setTimeout(() => {
      clearInterval(intervalId);
      try {
        const resultData = calculateResultPersona(state.scores);
        state.currentResult = resultData;
        
        // 1. 뷰를 먼저 전환하여 DOM 크기가 계산될 수 있도록 함
        sounds.playSuccess();
        switchView("result");
        
        // 2. 결과 텍스트 및 카드 렌더링
        renderResult(resultData);
        
        // 3. 차트는 DOM 레이아웃 확정 후 렌더링
        requestAnimationFrame(() => {
          setTimeout(() => {
            drawRadarChart(state.scores);
          }, 60);
        });
      } catch (err) {
        console.error("Result calculation error:", err);
        switchView("result");
      }
    }, 1800);
  }

  // 6. 결과 렌더링
  function renderResult({ persona, topTraits }) {
    if (!persona) return;

    resultBadge.textContent = persona.badge || "🎯 직무 추천";
    resultTitle.textContent = persona.title || "커리어 스페셜리스트";
    resultQuote.textContent = persona.quote || "";

    // 태그 목록
    resultTags.innerHTML = "";
    if (persona.keyTraits && Array.isArray(persona.keyTraits)) {
      persona.keyTraits.forEach(trait => {
        const span = document.createElement("span");
        span.className = "trait-tag";
        span.textContent = `#${trait}`;
        resultTags.appendChild(span);
      });
    }

    // 작업 환경
    envDesc.textContent = persona.idealEnvironment || "자율성과 성장이 균형을 이루는 환경";

    // 추천 직업 TOP 3 (클릭 시 단계별 준비과정 로드맵 아코디언 펼침)
    jobsList.innerHTML = "";
    if (persona.topJobs && Array.isArray(persona.topJobs)) {
      persona.topJobs.forEach((job, idx) => {
        const roadmap = (typeof getJobRoadmap === 'function') ? getJobRoadmap(job) : null;
        const jobEl = document.createElement("div");
        jobEl.className = "job-card";
        jobEl.setAttribute("tabindex", "0");
        jobEl.setAttribute("role", "button");
        jobEl.setAttribute("aria-expanded", "false");

        let roadmapHtml = "";
        if (roadmap) {
          roadmapHtml = `
            <div class="job-roadmap-panel">
              <div class="roadmap-timeline">
                <div class="roadmap-step-box">
                  <div class="step-box-header">🌱 ${roadmap.step1.title}</div>
                  <div class="step-box-desc">${roadmap.step1.desc}</div>
                  <ul class="step-box-list">
                    ${roadmap.step1.items.map(it => `<li>${it}</li>`).join("")}
                  </ul>
                </div>
                <div class="roadmap-step-box">
                  <div class="step-box-header">⚡ ${roadmap.step2.title}</div>
                  <div class="step-box-desc">${roadmap.step2.desc}</div>
                  <ul class="step-box-list">
                    ${roadmap.step2.items.map(it => `<li>${it}</li>`).join("")}
                  </ul>
                </div>
                <div class="roadmap-step-box">
                  <div class="step-box-header">🎯 ${roadmap.step3.title}</div>
                  <div class="step-box-desc">${roadmap.step3.desc}</div>
                  <ul class="step-box-list">
                    ${roadmap.step3.items.map(it => `<li>${it}</li>`).join("")}
                  </ul>
                </div>
              </div>
              <div class="roadmap-mentor-tip">
                ${roadmap.mentorTip}
              </div>
            </div>
          `;
        }

        jobEl.innerHTML = `
          <div class="job-card-top">
            <div class="job-card-title">${job.title}</div>
            <span class="job-rank-badge">추천 ${idx + 1}위</span>
          </div>
          <p class="job-desc">${job.desc}</p>
          <div class="job-skills-wrap">
            ${(job.skills || []).map(skill => `<span class="skill-chip">${skill}</span>`).join("")}
          </div>
          <div class="job-trend">${job.trend || ""}</div>
          <div class="job-toggle-footer">
            <span class="job-toggle-text">📖 준비 과정 & 취업 로드맵 보기 ▾</span>
            <span style="font-size: 0.75rem; color: #64748b;">클릭하여 열기</span>
          </div>
          ${roadmapHtml}
        `;

        // 카드 클릭 시 로드맵 아코디언 토글
        jobEl.addEventListener("click", (e) => {
          sounds.playClick();
          const isOpen = jobEl.classList.toggle("open");
          jobEl.setAttribute("aria-expanded", isOpen ? "true" : "false");
          const toggleText = jobEl.querySelector(".job-toggle-text");
          if (toggleText) {
            toggleText.textContent = isOpen ? "📖 준비 과정 & 취업 로드맵 닫기 ▴" : "📖 준비 과정 & 취업 로드맵 보기 ▾";
          }
        });

        // 키보드 엔터/스페이스 키 지원
        jobEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            jobEl.click();
          }
        });

        jobsList.appendChild(jobEl);
      });
    }

    // 케미 매칭
    if (persona.chemistry) {
      if (persona.chemistry.best) {
        bestChemName.textContent = persona.chemistry.best.title;
        bestChemDesc.textContent = persona.chemistry.best.desc;
      }
      if (persona.chemistry.worst) {
        worstChemName.textContent = persona.chemistry.worst.title;
        worstChemDesc.textContent = persona.chemistry.worst.desc;
      }
    }
  }

  // RIASEC 6대 성향 상세 해설 렌더링
  // 7. 고해상도 Canvas 6각 레이더 차트 렌더링
  function drawRadarChart(scores) {
    if (!radarCanvas) return;
    const ctx = radarCanvas.getContext("2d");
    if (!ctx) return;

    try {
      const dpr = window.devicePixelRatio || 1;
      const rect = radarCanvas.getBoundingClientRect();
      const width = rect.width > 0 ? rect.width : (radarCanvas.parentElement ? radarCanvas.parentElement.clientWidth : 340);
      const height = rect.height > 0 ? rect.height : 330;

      radarCanvas.width = width * dpr;
      radarCanvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const centerX = width / 2;
      const centerY = height / 2 + 5;
      const radius = Math.max(50, Math.min(centerX, centerY) - 52);

      ctx.clearRect(0, 0, width, height);

      const keys = ["R", "I", "A", "S", "E", "C"];
      const totalAxes = keys.length;
      const angleStep = (Math.PI * 2) / totalAxes;

      // 점수 최대값 기준 (기본 15점 스케일)
      const maxVal = Math.max(12, ...Object.values(scores || {}));

      // 배경 거미줄 다각형 그리기 (4단계)
      const levels = 4;
      for (let l = 1; l <= levels; l++) {
        const levelRadius = (radius / levels) * l;
        ctx.beginPath();
        for (let i = 0; i < totalAxes; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const x = centerX + Math.cos(angle) * levelRadius;
          const y = centerY + Math.sin(angle) * levelRadius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // RIASEC 약자 매핑 데이터
      const labelMap = {
        R: { code: "R", name: "현실형", desc: "실행·도구" },
        I: { code: "I", name: "탐구형", desc: "분석·연구" },
        A: { code: "A", name: "예술형", desc: "창의·감성" },
        S: { code: "S", name: "사회형", desc: "조력·소통" },
        E: { code: "E", name: "진취형", desc: "리더·추진" },
        C: { code: "C", name: "관습형", desc: "체계·관리" }
      };

      // 축 선 그리기 & 약자/의미/점수 라벨 표시
      ctx.textBaseline = "middle";

      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // 축 선
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 라벨 위치 및 정렬 방향 지능적 계산
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const labelX = centerX + cosA * (radius + 26);
        const labelY = centerY + sinA * (radius + 26);

        if (Math.abs(cosA) < 0.25) {
          ctx.textAlign = "center";
        } else if (cosA > 0) {
          ctx.textAlign = "left";
        } else {
          ctx.textAlign = "right";
        }

        const k = keys[i];
        const info = labelMap[k];
        const scoreVal = (scores && scores[k]) ? scores[k] : 0;

        // 1줄: R [현실형]
        ctx.font = "800 12px 'Pretendard', sans-serif";
        ctx.fillStyle = "#0f172a";
        ctx.fillText(`${info.code} [${info.name}]`, labelX, labelY - 7);

        // 2줄: (실행·도구) • 12점
        ctx.font = "600 11px 'Pretendard', sans-serif";
        ctx.fillStyle = "#2563eb";
        ctx.fillText(`(${info.desc}) ${scoreVal}점`, labelX, labelY + 8);
      }

      // 사용자 데이터 다각형 그리기
      ctx.beginPath();
      const pointCoords = [];
      for (let i = 0; i < totalAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const k = keys[i];
        const val = (scores && scores[k]) ? scores[k] : 0;
        const dist = (val / maxVal) * radius;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        pointCoords.push({ x, y });

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // 채우기 (맑은 소프트 블루)
      ctx.fillStyle = "rgba(37, 99, 235, 0.18)";
      ctx.fill();

      // 테두리
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 각 꼭짓점 원형 포인트
      pointCoords.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    } catch (e) {
      console.warn("Radar chart render error:", e);
    }
  }

  // 8. 전체 직업 도감 모달 렌더링
  function openCatalogModal() {
    sounds.playClick();
    catalogList.innerHTML = "";
    Object.values(JOB_PERSONAS).forEach(p => {
      const item = document.createElement("div");
      item.className = "catalog-item";
      item.innerHTML = `
        <div class="catalog-badge">${p.badge} (${p.id})</div>
        <div class="catalog-title">${p.title}</div>
        <div class="catalog-summary">${p.summary}</div>
      `;
      catalogList.appendChild(item);
    });
    catalogModal.classList.add("open");
  }

  function closeCatalogModal() {
    sounds.playClick();
    catalogModal.classList.remove("open");
  }

  // 9. 결과 카드 이미지 다운로드 (화이트 에디토리얼 스타일)
  function downloadResultCard() {
    sounds.playClick();
    if (!state.currentResult) return;

    const p = state.currentResult.persona;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 1000;

    // 배경 순백색
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 1000);

    // 상단 포인트 블루 바
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(0, 0, 800, 8);

    // 카드 외곽 테두리
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 740, 940);

    // 브랜드 로고
    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 22px 'Pretendard', sans-serif";
    ctx.fillText("🚀 GoJob 직업 적성 리포트", 60, 90);

    // 배지
    ctx.fillStyle = "#2563eb";
    ctx.font = "bold 18px 'Pretendard', sans-serif";
    ctx.fillText(p.badge, 60, 150);

    // 타이틀
    ctx.fillStyle = "#0f172a";
    ctx.font = "800 36px 'Pretendard', sans-serif";
    ctx.fillText(p.title, 60, 205);

    // 인용구
    ctx.fillStyle = "#64748b";
    ctx.font = "italic 18px 'Pretendard', sans-serif";
    ctx.fillText(p.quote, 60, 250);

    // 구분선
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 280);
    ctx.lineTo(740, 280);
    ctx.stroke();

    // 추천 직업 헤더
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 22px 'Pretendard', sans-serif";
    ctx.fillText("🎯 추천 천직 TOP 3", 60, 325);

    p.topJobs.forEach((job, idx) => {
      const baseY = 365 + idx * 130;
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(60, baseY, 680, 110);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(60, baseY, 680, 110);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 20px 'Pretendard', sans-serif";
      ctx.fillText(`${idx + 1}. ${job.title}`, 80, baseY + 38);

      ctx.fillStyle = "#475569";
      ctx.font = "14px 'Pretendard', sans-serif";
      const shortDesc = job.desc.length > 48 ? job.desc.substring(0, 46) + "..." : job.desc;
      ctx.fillText(shortDesc, 80, baseY + 68);

      ctx.fillStyle = "#b45309";
      ctx.font = "bold 13px 'Pretendard', sans-serif";
      ctx.fillText(job.trend, 80, baseY + 92);
    });

    // 하단 정보
    ctx.fillStyle = "#64748b";
    ctx.font = "14px 'Pretendard', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("나에게 딱 맞는 천직을 찾고 싶다면? 지금 바로 GoJob에서 테스트해보세요!", 400, 930);

    // 다운로드 트리거
    const link = document.createElement("a");
    link.download = `GoJob_${p.title}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    showToast("📸 결과 카드가 이미지로 저장되었습니다!");
  }

  // 10. 링크 복사
  function copyShareLink() {
    sounds.playClick();
    const shareUrl = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("🔗 테스트 링크가 클립보드에 복사되었습니다!");
      }).catch(() => {
        fallbackCopy(shareUrl);
      });
    } else {
      fallbackCopy(shareUrl);
    }
  }

  function fallbackCopy(text) {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    showToast("🔗 테스트 링크가 클립보드에 복사되었습니다!");
  }

  // 11. 사운드 토글
  function toggleSound() {
    const isEnabled = sounds.toggle();
    state.soundEnabled = isEnabled;
    btnSoundToggle.textContent = isEnabled ? "🔊" : "🔇";
    btnSoundToggle.setAttribute("aria-label", isEnabled ? "소리 끄기" : "소리 켜기");
    showToast(isEnabled ? "🔊 사운드가 켜졌습니다" : "🔇 사운드가 음소거되었습니다");
  }

  // 12. 테스트 재시작
  function restartTest() {
    sounds.playClick();
    state.currentStep = 0;
    state.answers = new Array(TEST_QUESTIONS.length).fill(null);
    state.scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    state.currentResult = null;
    switchView("hero");
  }

  // 13. 이벤트 리스너 등록
  btnStart.addEventListener("click", () => {
    sounds.playClick();
    state.currentStep = 0;
    renderQuestion(0);
    switchView("quiz");
  });

  btnPrev.addEventListener("click", () => {
    if (state.currentStep > 0) {
      sounds.playClick();
      state.currentStep--;
      renderQuestion(state.currentStep);
    }
  });

  btnNext.addEventListener("click", () => {
    if (state.answers[state.currentStep] !== null) {
      sounds.playClick();
      if (state.currentStep < TEST_QUESTIONS.length - 1) {
        state.currentStep++;
        renderQuestion(state.currentStep);
      } else {
        startAnalysis();
      }
    }
  });

  btnRestart.addEventListener("click", restartTest);
  btnCatalog.addEventListener("click", openCatalogModal);
  btnCloseCatalog.addEventListener("click", closeCatalogModal);
  btnDownloadImage.addEventListener("click", downloadResultCard);
  btnCopyLink.addEventListener("click", copyShareLink);
  btnSoundToggle.addEventListener("click", toggleSound);

  // 모달 바깥 배경 클릭 시 닫기
  catalogModal.addEventListener("click", (e) => {
    if (e.target === catalogModal) {
      closeCatalogModal();
    }
  });

  // 키보드 조작 지원 (1, 2, 3, 4 키로 즉시 옵션 선택)
  document.addEventListener("keydown", (e) => {
    if (!views.quiz.classList.contains("active")) return;
    if (["1", "2", "3", "4"].includes(e.key)) {
      const optIdx = parseInt(e.key, 10) - 1;
      const currentQ = TEST_QUESTIONS[state.currentStep];
      if (currentQ && currentQ.options[optIdx]) {
        handleOptionSelect(state.currentStep, optIdx);
      }
    } else if (e.key === "ArrowLeft" && !btnPrev.disabled) {
      btnPrev.click();
    } else if (e.key === "ArrowRight" && !btnNext.disabled) {
      btnNext.click();
    }
  });

  // 브라우저 리사이즈 시 Canvas 차트 다시 그리기
  window.addEventListener("resize", () => {
    if (views.result.classList.contains("active") && state.currentResult) {
      drawRadarChart(state.scores);
    }
  });
});
