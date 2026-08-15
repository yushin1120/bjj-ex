/**
 * 주짓수 기술 단계 카드의 드래그 & 드롭 및 터치 조작 보드 컴포넌트
 */

import { soundEffects } from '../audio/soundEffects.js';

export class DragOrderBoard {
  constructor(options) {
    this.containerEl = options.containerEl;
    this.onValidation = options.onValidation || (() => {});
    this.currentTechnique = null;
    this.shuffledSteps = [];
    this.placedSteps = []; // slots: Array of step objects or null
    this.selectedCardIndex = null; // 터치/클릭 조작용 선택된 카드 인덱스
  }

  loadTechnique(technique) {
    this.currentTechnique = technique;
    // 셔플된 단계 카드 생성 (정답과 다른 순서가 되도록 보장)
    this.shuffledSteps = this.shuffle([...technique.steps]);
    // 셔플 후 혹시 원본과 똑같다면 한번 더 셔플
    if (this.isIdenticalToOriginal(this.shuffledSteps, technique.steps)) {
      this.shuffledSteps.reverse();
    }

    this.placedSteps = new Array(technique.steps.length).fill(null);
    this.selectedCardIndex = null;
    this.render();
  }

  isIdenticalToOriginal(arr1, arr2) {
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

    const { name, engName, position, category, steps, icon, description } = this.currentTechnique;

    this.containerEl.innerHTML = `
      <div class="board-header">
        <div class="technique-badge-group">
          <span class="tech-icon">${icon}</span>
          <div class="tech-title-wrap">
            <h2 class="tech-name">${name}</h2>
            <p class="tech-eng">${engName} • <span class="tech-position">${position}</span></p>
          </div>
        </div>
        <div class="tech-desc-box">
          <p>${description}</p>
        </div>
      </div>

      <!-- 순서 슬롯 영역 (Target Drop Slots) -->
      <div class="sequence-slots-section">
        <div class="section-label">
          <span>📍 올바른 동작 순서 슬롯 (1단계 ➔ ${steps.length}단계)</span>
          <span class="slot-count-badge">${this.getPlacedCount()} / ${steps.length} 완료</span>
        </div>
        
        <div class="slots-grid" id="slots-grid">
          ${steps.map((_, index) => this.renderSlotHTML(index)).join('')}
        </div>
      </div>

      <!-- 보관 덱 카드 영역 (Shuffled Cards Pool) -->
      <div class="cards-pool-section">
        <div class="pool-header">
          <span class="pool-title">🎴 아래 동작 카드들의 순서를 맞추어 위 슬롯에 넣으세요</span>
          <button id="btn-reset-board" class="btn-sm btn-ghost">🔄 다시 섞기</button>
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
        <div class="slot-number-tag">STEP ${index + 1}</div>
        ${placed ? `
          <div class="placed-card-content" draggable="true" data-slot-index="${index}">
            <div class="step-card-header">
              <span class="step-title-badge">${placed.title}</span>
              <button class="btn-remove-slot" data-slot-index="${index}" title="슬롯에서 빼기">✕</button>
            </div>
            <p class="step-card-text">${placed.text}</p>
            <div class="step-card-tip">💡 ${placed.tip}</div>
          </div>
        ` : `
          <div class="slot-placeholder">
            <span class="placeholder-icon">📥</span>
            <span class="placeholder-text">${index + 1}번째 동작을 여기에 넣으세요</span>
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
          <h4 class="card-step-title">${step.title}</h4>
          <p class="card-step-text">${step.text}</p>
        </div>
        <div class="card-footer-tip">
          <span class="tip-tag">체크포인트</span> ${step.tip}
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

    // 다시 섞기 / 리셋
    const btnReset = this.containerEl.querySelector('#btn-reset-board');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        soundEffects.playPickup();
        this.loadTechnique(this.currentTechnique);
      });
    }

    // 정답 제출
    const btnCheck = this.containerEl.querySelector('#btn-check-answer');
    if (btnCheck) {
      btnCheck.addEventListener('click', () => {
        this.checkAnswer();
      });
    }

    // 카드 탭/클릭 선택 (터치 조작 및 가벼운 클릭 대응)
    cardsGrid.querySelectorAll('.pool-card:not(.placed-hidden)').forEach(cardEl => {
      cardEl.addEventListener('click', (e) => {
        const idx = parseInt(cardEl.dataset.cardIndex, 10);
        soundEffects.playPickup();

        if (this.selectedCardIndex === idx) {
          this.selectedCardIndex = null;
        } else {
          this.selectedCardIndex = idx;
          // 비어있는 첫번째 슬롯으로 자동 배치 시도
          const emptySlotIdx = this.placedSteps.findIndex(s => s === null);
          if (emptySlotIdx !== -1) {
            this.placeCardInSlot(this.selectedCardIndex, emptySlotIdx);
            return;
          }
        }
        this.render();
      });

      // HTML5 Drag Start
      cardEl.addEventListener('dragstart', (e) => {
        const idx = parseInt(cardEl.dataset.cardIndex, 10);
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'pool', cardIndex: idx }));
        cardEl.classList.add('dragging');
        soundEffects.playPickup();
      });

      cardEl.addEventListener('dragend', () => {
        cardEl.classList.remove('dragging');
      });
    });

    // 슬롯 드롭 및 클릭 조작
    slotsGrid.querySelectorAll('.slot-card').forEach(slotEl => {
      const slotIdx = parseInt(slotEl.dataset.slotIndex, 10);

      // 클릭으로 선택된 카드를 이 슬롯으로 지정 배치
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

      // Drag Over
      slotEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        slotEl.classList.add('drag-over');
      });

      slotEl.addEventListener('dragleave', () => {
        slotEl.classList.remove('drag-over');
      });

      // Drop
      slotEl.addEventListener('drop', (e) => {
        e.preventDefault();
        slotEl.classList.remove('drag-over');
        try {
          const data = JSON.parse(e.dataTransfer.getData('text/plain'));
          if (data.type === 'pool') {
            this.placeCardInSlot(data.cardIndex, slotIdx);
          } else if (data.type === 'slot') {
            // 슬롯 간 이동
            const fromSlot = data.slotIndex;
            const temp = this.placedSteps[fromSlot];
            this.placedSteps[fromSlot] = this.placedSteps[slotIdx];
            this.placedSteps[slotIdx] = temp;
            soundEffects.playDrop();
            this.render();
          }
        } catch (err) {
          console.error(err);
        }
      });
    });

    // 슬롯에 배치된 카드 드래그 이동 지원
    slotsGrid.querySelectorAll('.placed-card-content').forEach(cardEl => {
      cardEl.addEventListener('dragstart', (e) => {
        const slotIdx = parseInt(cardEl.dataset.slotIndex, 10);
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'slot', slotIndex: slotIdx }));
        soundEffects.playPickup();
      });
    });
  }

  placeCardInSlot(cardIndex, slotIndex) {
    const cardStep = this.shuffledSteps[cardIndex];
    if (!cardStep) return;

    // 이미 다른 슬롯에 같은 카드가 있다면 제거
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
