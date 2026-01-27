import {  ALL_BACKGROUNDS,  VIRTUAL_SOURCES,  getAvailableBackgroundSources,  getAvailableBackgrounds} from "../data/dataRegistry.js";

import { fillSelect } from "./uiUtils.js";
import { getSourceDisplayName } from "../data/sourceNames.js";
import {  backgroundSelected,  backgroundEditionSelected,  backgroundSourceSelected} from "../state/characterState.js";


  let bgEditionSelect;
let bgSourceSelect;
let bgSelect;

export function initBackgroundSelection() {
  bgEditionSelect = document.getElementById("EditionSelect");
  bgSourceSelect  = document.getElementById("bgSourceSelect");
  bgSelect        = document.getElementById("bgSelect");

  bgEditionSelect.addEventListener("change", () => {
    editionSelectedEvent(bgEditionSelect.value);
  });

  bgSourceSelect.addEventListener("change", () => {
    sourceSelectedEvent(
      bgEditionSelect.value,
      bgSourceSelect.value
    );
  });

  bgSelect.addEventListener("change", () => {
    backgroundSelected(bgSelect.value);
  });
}

export function initBackgroundUI() {
  const editions = Object.keys(ALL_BACKGROUNDS);

  fillSelect(bgEditionSelect, editions);
  fillSelect(bgSourceSelect, []);
  fillSelect(bgSelect, []);
}

// ===============================
// LOAD CHARACTER
// ===============================

export function loadBackground(backgroundState) {
  bgEditionSelect.value = backgroundState.edition;
  editionSelectedEvent(backgroundState.edition);

  bgSourceSelect.value = backgroundState.source;
  sourceSelectedEvent(
    backgroundState.edition,
    backgroundState.source
  );

  bgSelect.value = backgroundState.background;
  backgroundSelected(backgroundState.background);
}

// ===============================
// HANDLERS
// ===============================

function editionSelectedEvent(edition) {
  fillSelect(bgSourceSelect, []);
  fillSelect(bgSelect, []);

  if (!edition) return;

  const sources = getAvailableBackgroundSources(edition);

  fillSelect(
    bgSourceSelect,
    sources,
    "— Fonte —",
    src => formatBackgroundSourceLabel(src)
  );

  backgroundEditionSelected(edition);
}

function sourceSelectedEvent(edition, source) {
  fillSelect(bgSelect, []);

  if (!edition || !source) return;

  const backgrounds = getAvailableBackgrounds(edition, source);

  fillSelect(
    bgSelect,
    backgrounds.map(bg => bg.backgroundName), // ✅ VALUE LIMPO
    "— Background —",
    name => {
      const bg = backgrounds.find(b => b.backgroundName === name);
      return `${name} — ${getSourceDisplayName(bg.source)}`;
    }
  );

  backgroundSourceSelected(source);
}

// ===============================
// LABELS
// ===============================

function formatBackgroundSourceLabel(source) {
  switch (source) {
    case VIRTUAL_SOURCES.ALL:
      return "Todos os Backgrounds";
    case VIRTUAL_SOURCES.ALL_BASE:
      return "Oficiais";
    case VIRTUAL_SOURCES.ALL_HOMEBREW:
      return "Homebrews";
    default:
      return `${source} — ${getSourceDisplayName(source)}`;
  }
}
