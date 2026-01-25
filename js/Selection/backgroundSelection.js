
import { ALL_BACKGROUNDS } from "../data/dataRegistry.js";
import { fillSelect } from "./uiUtils.js";
import { getSourceDisplayName } from "../data/sourceNames.js";
import { backgroundSelected,backgroundEditionSelected,backgroundSourceSelected} from "../state/characterState.js";

  let bgEditionSelect;
  let bgSourceSelect;
  let bgSelect;

export function initBackgroundSelection()
{
  bgEditionSelect = document.getElementById("EditionSelect");
  bgSourceSelect  = document.getElementById("bgSourceSelect");
  bgSelect        = document.getElementById("bgSelect");

  bgEditionSelect.addEventListener("change", () => {
    editionSelectedEvent(bgEditionSelect.value);
  });

  bgSourceSelect.addEventListener("change", () => {
    sourceSelectedEvent(bgEditionSelect.value, bgSourceSelect.value);
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

export function loadBackground(backgroundState)
{
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
