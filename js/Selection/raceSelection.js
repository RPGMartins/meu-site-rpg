import {  ALL_RACES,  getAvailableRaceSources,  getAvailableRaces,  getRace,  VIRTUAL_SOURCES} from "../data/dataRegistry.js";

import { fillSelect } from "./uiUtils.js";
import { getSourceDisplayName } from "../data/sourceNames.js";

import {
  raceSelected,
  raceEditionSelected,
  raceSourceSelected,
  subRaceSelected
} from "../state/characterState.js";

let raceEditionSelect;
let raceSourceSelect;
let raceSelect;
let subRaceSelect;

// cache local das raças listadas (para índice → objeto)
let currentRaceList = [];

// ===============================
// INIT
// ===============================

export function initRaceSelection() {
  raceEditionSelect = document.getElementById("EditionSelect");
  raceSourceSelect  = document.getElementById("raceSourceSelect");
  raceSelect        = document.getElementById("raceSelect");
  subRaceSelect     = document.getElementById("subRaceSelect");

  raceEditionSelect.addEventListener("change", () => {
    editionSelectedEvent(raceEditionSelect.value);
  });

  raceSourceSelect.addEventListener("change", () => {
    sourceSelectedEvent(
      raceEditionSelect.value,
      raceSourceSelect.value
    );
  });

  raceSelect.addEventListener("change", () => {
    raceSelectedEvent(raceSelect.value);
  });

  subRaceSelect.addEventListener("change", () => {
    subRaceSelectedEvent(subRaceSelect.value);
  });
}

export function initRaceUI() {
  const editions = Object.keys(ALL_RACES);

  fillSelect(raceEditionSelect, editions);
  fillSelect(raceSourceSelect, []);
  fillSelect(raceSelect, []);
  fillSelect(subRaceSelect, []);
}

// ===============================
// LOAD CHARACTER
// ===============================

export function loadRace(raceState) {
  raceEditionSelect.value = raceState.edition;
  editionSelectedEvent(raceState.edition);

  raceSourceSelect.value = raceState.source;
  sourceSelectedEvent(raceState.edition, raceState.source);

  // encontra índice correto (nome + source)
  const idx = currentRaceList.findIndex(
    r =>
      r.raceName === raceState.race &&
      r.source === raceState.source
  );

  if (idx !== -1) {
    raceSelect.value = String(idx);
    raceSelectedEvent(idx);
  }

  subRaceSelect.value = raceState.subRace;
  subRaceSelectedEvent(raceState.subRace);
}

// ===============================
// HANDLERS
// ===============================

function editionSelectedEvent(edition) {
  fillSelect(raceSourceSelect, []);
  fillSelect(raceSelect, []);
  fillSelect(subRaceSelect, []);
  currentRaceList = [];

  if (!edition) return;

  const sources = getAvailableRaceSources(edition);

  fillSelect(
    raceSourceSelect,
    sources,
    "— Fonte —",
    formatRaceSourceLabel
  );

  raceEditionSelected(edition);
}

function sourceSelectedEvent(edition, sourceFilter) {
  fillSelect(raceSelect, []);
  fillSelect(subRaceSelect, []);
  currentRaceList = [];

  if (!edition || !sourceFilter) return;

  const races = getAvailableRaces(edition, sourceFilter);
  currentRaceList = races;

  fillSelect(
    raceSelect,
    races.map((_, i) => i),
    "— Raça —",
    i => {
      const r = races[i];
      return `${r.raceName} (${getSourceDisplayName(r.source)})`;
    }
  );

  raceSourceSelected(sourceFilter);
}

function raceSelectedEvent(index) {
  fillSelect(subRaceSelect, []);

  const raceEntry = currentRaceList[index];
  if (!raceEntry) return;

  const raceData = getRace(
    raceEditionSelect.value,
    raceEntry.source,
    raceEntry.raceName
  );

  if (!raceData) return;

  fillSelect(
    subRaceSelect,
    Object.keys(raceData.subraces ?? {})
  );

  raceSelected(raceEntry.raceName);
}

function subRaceSelectedEvent(subraceKey) {
  if (!subraceKey) return;
  subRaceSelected(subraceKey);
}

// ===============================
// LABELS
// ===============================

function formatRaceSourceLabel(source) {
  switch (source) {
    case VIRTUAL_SOURCES.ALL:
      return "Todas as Raças";
    case VIRTUAL_SOURCES.ALL_BASE:
      return "Oficiais";
    case VIRTUAL_SOURCES.ALL_HOMEBREW:
      return "Homebrews";
    default:
      return `${source} — ${getSourceDisplayName(source)}`;
  }
}
