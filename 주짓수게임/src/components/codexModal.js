/**
 * 주짓수 기술 백과사전 (Technique Codex) 모달 컴포넌트
 */

import { BJJ_TECHNIQUES, BELT_RANKS } from '../data/bjjTechniques.js';
import { soundEffects } from '../audio/soundEffects.js';

export class CodexModal {
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
        t.engName.toLowerCase().includes(q) ||
        t.position.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    bodyEl.innerHTML = `
      <div class="codex-container">
        <!-- 필터 헤더 -->
        <div class="codex-filter-bar">
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input type="text" id="codex-search-input" placeholder="기술 이름, 포지션, 서브미션 검색..." value="${this.searchQuery}">
          </div>

          <div class="belt-filter-tabs">
            <button class="tab-btn ${this.activeBeltFilter === 'all' ? 'active' : ''}" data-belt="all">전체</button>
            ${BELT_RANKS.map(b => `
              <button class="tab-btn ${this.activeBeltFilter === b.id ? 'active' : ''}" data-belt="${b.id}" style="--belt-color: ${b.color}">
                ${b.name}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="codex-layout">
          <!-- 좌측: 기술 목록 -->
          <div class="codex-list">
            ${filtered.length === 0 ? `
              <div class="empty-codex">검색 결과에 맞는 주짓수 기술이 없습니다.</div>
            ` : filtered.map(tech => `
              <div class="codex-item ${this.selectedTechnique && this.selectedTechnique.id === tech.id ? 'active' : ''}" data-tech-id="${tech.id}">
                <span class="tech-item-icon">${tech.icon}</span>
                <div class="tech-item-info">
                  <div class="tech-item-title">${tech.name}</div>
                  <div class="tech-item-sub">${tech.position} • ${tech.category}</div>
                </div>
                <span class="belt-tag belt-${tech.belt}">${tech.belt.toUpperCase()}</span>
              </div>
            `).join('')}
          </div>

          <!-- 우측: 세부 단계 백과 사전 로드 -->
          <div class="codex-detail">
            ${this.selectedTechnique ? this.renderDetailHTML(this.selectedTechnique) : `
              <div class="detail-placeholder">
                <span class="big-icon">🥋</span>
                <h3>목록에서 주짓수 기술을 선택하여</h3>
                <p>1단계부터 마지막 단계까지의 올바른 실전 동작 순서를 공부하세요!</p>
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
              <p class="eng">${tech.engName}</p>
            </div>
          </div>
          <button id="btn-practice-tech" class="btn btn-primary" data-tech-id="${tech.id}">
            🎮 이 기술 맞추기 도전!
          </button>
        </div>

        <div class="detail-meta-pills">
          <span class="meta-pill">포지션: ${tech.position}</span>
          <span class="meta-pill">분류: ${tech.category}</span>
          <span class="meta-pill belt-${tech.belt}">권장 난이도: ${tech.belt.toUpperCase()} BELT</span>
        </div>

        <p class="detail-desc">${tech.description}</p>

        <h4 class="steps-heading">📌 실전 세부 동작 순서 (${tech.steps.length}단계)</h4>
        <div class="detail-steps-list">
          ${tech.steps.map((step, idx) => `
            <div class="detail-step-item">
              <div class="step-num">${idx + 1}</div>
              <div class="step-content">
                <h5>${step.title}</h5>
                <p>${step.text}</p>
                <div class="step-tip-box">💡 <strong>디테일 팁:</strong> ${step.tip}</div>
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
    // 검색창
    const inputSearch = bodyEl.querySelector('#codex-search-input');
    if (inputSearch) {
      inputSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    // 벨트 필터
    bodyEl.querySelectorAll('.belt-filter-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        soundEffects.playPickup();
        this.activeBeltFilter = btn.dataset.belt;
        this.render();
      });
    });

    // 기술 목록 아이템 클릭
    bodyEl.querySelectorAll('.codex-item').forEach(item => {
      item.addEventListener('click', () => {
        soundEffects.playPickup();
        const techId = item.dataset.techId;
        this.selectedTechnique = BJJ_TECHNIQUES.find(t => t.id === techId);
        this.render();
      });
    });

    // 도전하기 버튼
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
