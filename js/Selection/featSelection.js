// js/Selection/featSelection.js

import { ALL_FEATS } from "../data/dataRegistry.js";
import { fillSelect } from "./uiUtils.js";
import { getSourceDisplayName } from "../data/sourceNames.js";
import { featEditionSelected,featSourceSelected,featsSelected} from "../state/characterState.js";

const featEditionSelect = document.getElementById("featEditionSelect");
const featSourceSelect  = document.getElementById("featSourceSelect");
const featSelect        = document.getElementById("featSelect");

// ===============================
// EVENTOS
// ===============================

featEditionSelect.addEventListener("change", () => {
  editionSelectedEvent(featEditionSelect.value);
});

featSourceSelect.addEventListener("change", () => {
  sourceSelectedEvent(
    featEditionSelect.value,
    featSourceSelect.value
  );
});

featSelect.addEventListener("change", () => {
  const selected = Array.from(featSelect.selectedOptions)
    .map(o => o.value);

  featsSelected(selected);
});

// ===============================
// INIT
// ===============================

export function initFeatUI() {
  const editions = Object.keys(ALL_FEATS);

  fillSelect(featEditionSelect, editions);
  fillSelect(featSourceSelect, []);
  featSelect.innerHTML = "";
}

export function loadFeats(featState)
{
  featEditionSelect.value = featState.edition;
  editionSelectedEvent(featState.edition);

  featSourceSelect.value = featState.source;
  sourceSelectedEvent(
    featState.edition,
    featState.source
  );

  if (!Array.isArray(featState.feats))
    return;

  const selectedFeats = new Set(featState.feats);

  Array.from(featSelect.options).forEach(opt => {
    opt.selected = selectedFeats.has(opt.value);
  });

  featsSelected(featState.feats);
}


// ===============================
// HANDLERS
// ===============================

function editionSelectedEvent(edition) {
  fillSelect(featSourceSelect, []);
  featSelect.innerHTML = "";

  if (!edition) return;

  const sources = Object.keys(ALL_FEATS[edition] ?? {});
  const opts = sources.map(s => ({
    value: s,
    label: `${s} — ${getSourceDisplayName(s)}`
  }));

  fillSelect(featSourceSelect, opts);
  featEditionSelected(edition);
}

function sourceSelectedEvent(edition, source) {
  featSelect.innerHTML = "";

  if (!edition || !source) return;

  const feats = Object.keys(
    ALL_FEATS?.[edition]?.[source] ?? {}
  );

  feats.forEach(f => {
    const o = document.createElement("option");
    o.value = f;
    o.textContent = f;
    featSelect.appendChild(o);
  });

  featSourceSelected(source);
}
