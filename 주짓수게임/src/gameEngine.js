/**
 * 주짓수 시퀀스 마스터 게임 엔진
 * 게임 모드, 플레이어 진행도, 벨트 승급, 점수, 타임어택 관리
 */

import { BJJ_TECHNIQUES, BELT_RANKS } from './data/bjjTechniques.js';

const STORAGE_KEY = 'bjj_sequence_master_stats_v1';

export class GameEngine {
  constructor() {
    this.mode = 'career'; // 'career' | 'time_attack' | 'practice'
    this.currentBeltIndex = 0;
    this.currentTechniqueIndex = 0;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.clearedTechniqueIds = new Set();

    // 타임 어택 전용
    this.timeRemaining = 60;
    this.timerInterval = null;
    this.timeAttackScore = 0;
    this.timeAttackHighscore = 0;

    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.score = data.score || 0;
        this.currentBeltIndex = data.currentBeltIndex || 0;
        this.clearedTechniqueIds = new Set(data.clearedTechniqueIds || []);
        this.maxCombo = data.maxCombo || 0;
        this.timeAttackHighscore = data.timeAttackHighscore || 0;
      }
    } catch (e) {
      console.error('Failed to load local storage stats', e);
    }
  }

  saveState() {
    try {
      const data = {
        score: this.score,
        currentBeltIndex: this.currentBeltIndex,
        clearedTechniqueIds: Array.from(this.clearedTechniqueIds),
        maxCombo: this.maxCombo,
        timeAttackHighscore: this.timeAttackHighscore
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save state to local storage', e);
    }
  }

  getCurrentBelt() {
    return BELT_RANKS[this.currentBeltIndex] || BELT_RANKS[0];
  }

  getNextBelt() {
    return BELT_RANKS[this.currentBeltIndex + 1] || null;
  }

  getBeltTechniques(beltId) {
    return BJJ_TECHNIQUES.filter(t => t.belt === beltId);
  }

  getCurrentTechniqueList() {
    if (this.mode === 'career') {
      const belt = this.getCurrentBelt();
      return this.getBeltTechniques(belt.id);
    }
    return BJJ_TECHNIQUES;
  }

  getCurrentTechnique() {
    const list = this.getCurrentTechniqueList();
    if (list.length === 0) return BJJ_TECHNIQUES[0];
    return list[this.currentTechniqueIndex % list.length];
  }

  nextTechnique() {
    const list = this.getCurrentTechniqueList();
    this.currentTechniqueIndex = (this.currentTechniqueIndex + 1) % list.length;
    return this.getCurrentTechnique();
  }

  setTechniqueById(id) {
    const list = this.getCurrentTechniqueList();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.currentTechniqueIndex = idx;
      return list[idx];
    }
    // 다른 벨트 목록에 있는 경우 모드를 샌드박스로 유연하게 조정
    const globalIdx = BJJ_TECHNIQUES.findIndex(t => t.id === id);
    if (globalIdx !== -1) {
      return BJJ_TECHNIQUES[globalIdx];
    }
    return this.getCurrentTechnique();
  }

  recordSuccess(technique) {
    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    // 기본 점수 100점 + 콤보 보너스 + 벨트 난이도 보너스
    const base = 100;
    const comboBonus = (this.combo - 1) * 30;
    const diffBonus = (technique.difficulty || 1) * 50;
    const earnedPoints = base + comboBonus + diffBonus;

    this.score += earnedPoints;
    this.clearedTechniqueIds.add(technique.id);

    if (this.mode === 'time_attack') {
      this.timeAttackScore += earnedPoints;
      if (this.timeAttackScore > this.timeAttackHighscore) {
        this.timeAttackHighscore = this.timeAttackScore;
      }
    }

    // 벨트 승급 체크 (Career 모드인 경우)
    let promotedBelt = null;
    const nextBelt = this.getNextBelt();
    if (nextBelt && this.clearedTechniqueIds.size >= nextBelt.reqStars) {
      this.currentBeltIndex++;
      promotedBelt = this.getCurrentBelt();
    }

    this.saveState();

    return {
      earnedPoints,
      combo: this.combo,
      promotedBelt,
      totalCleared: this.clearedTechniqueIds.size
    };
  }

  recordFailure() {
    this.combo = 0;
  }

  startTimeAttack(onTick, onFinish) {
    this.mode = 'time_attack';
    this.timeRemaining = 60;
    this.timeAttackScore = 0;
    this.combo = 0;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      onTick(this.timeRemaining);

      if (this.timeRemaining <= 0) {
        this.stopTimeAttack();
        onFinish(this.timeAttackScore, this.timeAttackHighscore);
      }
    }, 1000);
  }

  stopTimeAttack() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetAllStats() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.currentBeltIndex = 0;
    this.clearedTechniqueIds.clear();
    this.timeAttackHighscore = 0;
    this.saveState();
  }
}
