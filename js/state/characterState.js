// characterState.js

// ─────────────────────────────────────────
// STATE PRINCIPAL
// ─────────────────────────────────────────

export const CharacterState = {
  generalClass: {
    class: null,
    edition: null,
    source: null,
    subclass: null,
  },

  generalRace: {
    race: null,
    edition: null,
    source: null,
    subRace: null,
  },

  generalBackground: {
    background: null,
    edition: null,
    source: null,
  },
  
  generalFeats: {
    edition: null,
    source: null,
    feats: [],
  },

  // ─────────────────────────────────────
  // ESTADO DE IMPRESSÃO / OVERLAY
  // ─────────────────────────────────────
  generalPrint: {
    classFeatures: [],        // indices
    subclassFeatures: [],     // indices (subclass + race + subrace)
    raceFeatures: [],         // reservado
    background: null,         // key
    feats: {}                 // { featKey: true }
  }
};

// ─────────────────────────────────────────
// UTIL
// ─────────────────────────────────────────

function toggleIndex(arr, index) {
  const i = arr.indexOf(index);
  if (i === -1) arr.push(index);
  else arr.splice(i, 1);
}

// ─────────────────────────────────────────
// CLASS SELECTION
// ─────────────────────────────────────────

export function classEditionSelected(selection) {
  CharacterState.generalClass.edition = selection;
  CharacterState.generalClass.source = null;
  CharacterState.generalClass.class = null;
  CharacterState.generalClass.subclass = null;
  clearClassPrint();
}

export function classSourceSelected(selection) {
  CharacterState.generalClass.source = selection;
  CharacterState.generalClass.class = null;
  CharacterState.generalClass.subclass = null;
  clearClassPrint();
}

export function classSelected(selection) {
  CharacterState.generalClass.class = selection;
  CharacterState.generalClass.subclass = null;
  clearClassPrint();
}

export function subClassSelected(selection) {
  CharacterState.generalClass.subclass = selection;
  CharacterState.generalPrint.subclassFeatures = [];
}

// ─────────────────────────────────────────
// RACE SELECTION
// ─────────────────────────────────────────

export function raceEditionSelected(selection) {
  CharacterState.generalRace.edition = selection;
  CharacterState.generalRace.source = null;
  CharacterState.generalRace.race = null;
  CharacterState.generalRace.subRace = null;
  clearRacePrint();
}

export function raceSourceSelected(selection) {
  CharacterState.generalRace.source = selection;
  CharacterState.generalRace.race = null;
  CharacterState.generalRace.subRace = null;
  clearRacePrint();
}

export function raceSelected(selection) {
  CharacterState.generalRace.race = selection;
  CharacterState.generalRace.subRace = null;
  clearRacePrint();
}

export function subRaceSelected(selection) {
  CharacterState.generalRace.subRace = selection;
  CharacterState.generalPrint.subclassFeatures = [];
}

// ─────────────────────────────────────────
// BACKGROUND SELECTION
// ─────────────────────────────────────────

export function backgroundEditionSelected(selection) {
  CharacterState.generalBackground.edition = selection;
  CharacterState.generalBackground.source = null;
  CharacterState.generalBackground.background = null;
  CharacterState.generalPrint.background = null;
}

export function backgroundSourceSelected(selection) {
  CharacterState.generalBackground.source = selection;
  CharacterState.generalBackground.background = null;
  CharacterState.generalPrint.background = null;
}

export function backgroundSelected(selection) {
  CharacterState.generalBackground.background = selection;
  CharacterState.generalPrint.background = null;
}

// ─────────────────────────────────────────
// FEATS SELECTION (GERAL)
// ─────────────────────────────────────────

export function featEditionSelected(selection) {
  CharacterState.generalFeats.edition = selection;
  CharacterState.generalFeats.source = null;
  CharacterState.generalFeats.feats = [];
  CharacterState.generalPrint.feats = {};
}

export function featSourceSelected(selection) {
  CharacterState.generalFeats.source = selection;
  CharacterState.generalFeats.feats = [];
  CharacterState.generalPrint.feats = {};
}

export function featsSelected(featList) {
  CharacterState.generalFeats.feats = [...featList];
}

export function clearFeats() {
  CharacterState.generalFeats.feats = [];
  CharacterState.generalPrint.feats = {};
}

export function hasFeat(featName) {
  return CharacterState.generalFeats.feats.includes(featName);
}

// ─────────────────────────────────────────
// PRINT / OVERLAY TOGGLES
// ─────────────────────────────────────────

// Class Features
export function toggleClassFeature(index) {
  toggleIndex(CharacterState.generalPrint.classFeatures, index);
}

export function hasClassFeature(index) {
  return CharacterState.generalPrint.classFeatures.includes(index);
}

// Subclass / Race / Subrace Features
export function toggleSubclassFeature(index) {
  toggleIndex(CharacterState.generalPrint.subclassFeatures, index);
}

export function hasSubclassFeature(index) {
  return CharacterState.generalPrint.subclassFeatures.includes(index);
}

// Background (single)
export function togglePrintBackground(key) {
  CharacterState.generalPrint.background =
    CharacterState.generalPrint.background === key ? null : key;
}

export function hasPrintBackground(key) {
  return CharacterState.generalPrint.background === key;
}

// Feats (multi)
export function togglePrintFeat(key) {
  CharacterState.generalPrint.feats[key]
    ? delete CharacterState.generalPrint.feats[key]
    : CharacterState.generalPrint.feats[key] = true;
}

export function hasPrintFeat(key) {
  return !!CharacterState.generalPrint.feats[key];
}

// ─────────────────────────────────────────
// CLEAR HELPERS
// ─────────────────────────────────────────

function clearClassPrint() {
  CharacterState.generalPrint.classFeatures = [];
  CharacterState.generalPrint.subclassFeatures = [];
}

function clearRacePrint() {
  CharacterState.generalPrint.subclassFeatures = [];
}
