import {
  ALL_FEATS,
  VIRTUAL_SOURCES,
  getAvailableFeatSources,
  getAvailableFeats
} from "../data/dataRegistry.js";

import { fillSelect } from "./uiUtils.js";
import { getSourceDisplayName } from "../data/sourceNames.js";
import {
  featEditionSelected,
  featSourceSelected,
  featsSelected
} from "../state/characterState.js";

let featEditionSelect;
let featSourceSelect;
let featAvailableSelect;
let featSelectedSelect;
let btnAddFeat;
let btnRemoveFeat;

// 🔹 estado real
let selectedFeats = [];

// ===============================
// INIT
// ===============================

export function initFeatSelection() {
  featEditionSelect   = document.getElementById("EditionSelect");
  featSourceSelect    = document.getElementById("featSourceSelect");
  featAvailableSelect = document.getElementById("featAvailableSelect");
  featSelectedSelect  = document.getElementById("featSelectedSelect");
  btnAddFeat          = document.getElementById("btnAddFeat");
  btnRemoveFeat       = document.getElementById("btnRemoveFeat");

  featEditionSelect.addEventListener("change", () => {
    editionSelectedEvent(featEditionSelect.value);
  });

  featSourceSelect.addEventListener("change", () => {
    sourceSelectedEvent(
      featEditionSelect.value,
      featSourceSelect.value
    );
  });

  btnAddFeat.addEventListener("click", addFeat);
  btnRemoveFeat.addEventListener("click", removeFeat);
}

export function initFeatUI() {
  const editions = Object.keys(ALL_FEATS);
  fillSelect(featEditionSelect, editions);

  fillSelect(featSourceSelect, []);
  featAvailableSelect.innerHTML = "";
  featSelectedSelect.innerHTML = "";
}

// ===============================
// LOAD CHARACTER
// ===============================

export function loadFeats(featState) {
  selectedFeats = Array.isArray(featState.feats)
    ? [...featState.feats]
    : [];

  featEditionSelect.value = featState.edition;
  editionSelectedEvent(featState.edition);

  refreshSelectedList();
  featsSelected(selectedFeats);
}

// ===============================
// HANDLERS
// ===============================

function editionSelectedEvent(edition) {
  fillSelect(featSourceSelect, []);
  featAvailableSelect.innerHTML = "";

  if (!edition) return;

  const sources = getAvailableFeatSources(edition);

  fillSelect(
    featSourceSelect,
    sources,
    "— Fonte —",
    s => formatFeatSourceLabel(s)
  );

  featEditionSelected(edition);
}

function sourceSelectedEvent(edition, source) {
  featAvailableSelect.innerHTML = "";

  if (!edition || !source) return;

  const feats = getAvailableFeats(edition, source);

  feats.forEach(f => {
    const alreadySelected = selectedFeats.some(
      sf => sf.featName === f.featName && sf.source === f.source
    );

    if (alreadySelected) return;

    const opt = document.createElement("option");
    opt.value = f.featName; // 🔹 valor limpo
    opt.dataset.source = f.source;
    opt.textContent = `${f.featName} — ${getSourceDisplayName(f.source)}`;

    featAvailableSelect.appendChild(opt);
  });

  featSourceSelected(source);
}

// ===============================
// ACTIONS
// ===============================

function addFeat() {
  const opt = featAvailableSelect.selectedOptions[0];
  if (!opt) return;

  const feat = {
    featName: opt.value,
    source: opt.dataset.source
  };

  const exists = selectedFeats.some(
    f => f.featName === feat.featName && f.source === feat.source
  );

  if (exists) return;

  selectedFeats.push(feat);

  refreshSelectedList();
  sourceSelectedEvent(featEditionSelect.value, featSourceSelect.value);
  featsSelected(selectedFeats);
}

function removeFeat() {
  const opt = featSelectedSelect.selectedOptions[0];
  if (!opt) return;

  const featName = opt.value;
  const source   = opt.dataset.source;

  selectedFeats = selectedFeats.filter(
    f => !(f.featName === featName && f.source === source)
  );

  refreshSelectedList();
  sourceSelectedEvent(featEditionSelect.value, featSourceSelect.value);
  featsSelected(selectedFeats);
}

// ===============================
// UI
// ===============================

function refreshSelectedList() {
  featSelectedSelect.innerHTML = "";

  selectedFeats.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.featName;
    opt.dataset.source = f.source;
    opt.textContent = `${f.featName} — ${getSourceDisplayName(f.source)}`;

    featSelectedSelect.appendChild(opt);
  });
}

function formatFeatSourceLabel(source) {
  switch (source) {
    case VIRTUAL_SOURCES.ALL:
      return "Todos os Feats";
    case VIRTUAL_SOURCES.ALL_BASE:
      return "Oficiais";
    case VIRTUAL_SOURCES.ALL_HOMEBREW:
      return "Homebrews";
    default:
      return `${source} — ${getSourceDisplayName(source)}`;
  }
}
