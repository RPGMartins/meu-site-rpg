
import { ALL_BACKGROUNDS } from "../data/dataRegistry.js";
import { fillSelect } from "./uiUtils.js";
import { getSourceDisplayName } from "../data/sourceNames.js";
import { backgroundSelected,backgroundEditionSelected,backgroundSourceSelected} from "../state/characterState.js";

const bgEditionSelect = document.getElementById("bgEditionSelect");
const bgSourceSelect  = document.getElementById("bgSourceSelect");
const bgSelect        = document.getElementById("bgSelect");

// ===============================
// EVENTOS
// ===============================

bgEditionSelect.addEventListener("change", () => {
  editionSelectedEvent(bgEditionSelect.value);
});

bgSourceSelect.addEventListener("change", () => {
  sourceSelectedEvent(bgEditionSelect.value, bgSourceSelect.value);
});

bgSelect.addEventListener("change", () => {
  backgroundSelected(bgSelect.value);
});

// ===============================
// INIT
// ===============================

export function initBackgroundUI() {
  const editions = Object.keys(ALL_BACKGROUNDS);

  fillSelect(bgEditionSelect, editions);
  fillSelect(bgSourceSelect, []);
  fillSelect(bgSelect, []);
}

// ===============================
// HANDLERS
// ===============================

function editionSelectedEvent(edition) {
  fillSelect(bgSourceSelect, []);
  fillSelect(bgSelect, []);

  if (!edition) return;

  const sources = Object.keys(ALL_BACKGROUNDS[edition] ?? {});
  const opts = sources.map(s => ({
    value: s,
    label: `${s} — ${getSourceDisplayName(s)}`
  }));

  fillSelect(bgSourceSelect, opts);
  backgroundEditionSelected(edition);
}

function sourceSelectedEvent(edition, source) {
  fillSelect(bgSelect, []);

  if (!edition || !source) return;

  const backgrounds = Object.keys(
    ALL_BACKGROUNDS?.[edition]?.[source] ?? {}
  );

  fillSelect(bgSelect, backgrounds);
  backgroundSourceSelected(source);
}
