/* ==========================================================================
   LocalStorage Save & Load Handler
   ========================================================================== */

const SAVE_KEY = "GOURMET_TYCOON_SAVE_DATA_V1";

export function saveGame(state) {
  try {
    const dataStr = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, dataStr);
    return true;
  } catch (err) {
    console.error("Save failed:", err);
    return false;
  }
}

export function loadGame() {
  try {
    const dataStr = localStorage.getItem(SAVE_KEY);
    if (!dataStr) return null;
    return JSON.parse(dataStr);
  } catch (err) {
    console.error("Load failed:", err);
    return null;
  }
}

export function resetGameSave() {
  localStorage.removeItem(SAVE_KEY);
}
