const STORAGE_KEY = "rpgbuilder.homebrew";

// ===============================
// LOAD
// ===============================

export function loadStoredHomebrews() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    console.warn("Homebrew storage corrompido, limpando");
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

// ===============================
// SAVE
// ===============================

export function saveHomebrew(homebrewEntry) {
  const list = loadStoredHomebrews();

  // evita duplicar
  if (list.some(h => h.id === homebrewEntry.id)) return;

  list.push(homebrewEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ===============================
// REMOVE
// ===============================

export function removeHomebrew(homebrewId) {
  const list = loadStoredHomebrews()
    .filter(h => h.id !== homebrewId);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ===============================
// CLEAR (opcional)
// ===============================

export function clearAllHomebrew() {
  localStorage.removeItem(STORAGE_KEY);
}
