import { ALL_CLASSES } from "../data/dataRegistry.js";
import { fillSelect } from "./uiUtils.js";
import {
  classSelected,
  classEditionSelected,
  classSourceSelected,
  subClassSelected
} from "../state/characterState.js";

const classSelect    = document.getElementById("classSelect");
const editionSelect  = document.getElementById("editionSelect");
const sourceSelect   = document.getElementById("sourceSelect");
const subclassSelect = document.getElementById("subclassSelect");

// ===============================
// EVENTOS
// ===============================

editionSelect.addEventListener("change", () => {
  editionSelectedEvent(editionSelect.value);
});

sourceSelect.addEventListener("change", () => {
  sourceSelectedEvent(editionSelect.value, sourceSelect.value);
});

classSelect.addEventListener("change", () => {
  classSelectedEvent(
    editionSelect.value,
    sourceSelect.value,
    classSelect.value
  );
});

subclassSelect.addEventListener("change", () => {
  subClassSelectedEvent(subclassSelect.value);
});

// ===============================
// INIT
// ===============================

export function initClassUI() {
  const editions = Object.keys(ALL_CLASSES);
  fillSelect(editionSelect, editions);

  fillSelect(sourceSelect, []);
  fillSelect(classSelect, []);
  fillSelect(subclassSelect, []);
}

// ===============================
// LOAD CHARACTER
// ===============================

export function loadCharacter(classGeneral) {
  editionSelect.value = classGeneral.edition;
  editionSelectedEvent(classGeneral.edition);

  sourceSelect.value = classGeneral.source;
  sourceSelectedEvent(classGeneral.edition, classGeneral.source);

  classSelect.value = classGeneral.class;
  classSelectedEvent(
    classGeneral.edition,
    classGeneral.source,
    classGeneral.class
  );

  subclassSelect.value = classGeneral.subclass;
  subClassSelectedEvent(classGeneral.subclass);
}

// ===============================
// HANDLERS
// ===============================

function editionSelectedEvent(edition) {
  fillSelect(sourceSelect, []);
  fillSelect(classSelect, []);
  fillSelect(subclassSelect, []);

  if (!edition) return;

  const sources = Object.keys(ALL_CLASSES[edition] ?? {});
  fillSelect(sourceSelect, sources);

  classEditionSelected(edition);
}

function sourceSelectedEvent(edition, source) {
  fillSelect(classSelect, []);
  fillSelect(subclassSelect, []);

  if (!edition || !source) return;

  const classes = Object.keys(
    ALL_CLASSES?.[edition]?.[source] ?? {}
  );

  fillSelect(classSelect, classes);
  classSourceSelected(source);
}

function classSelectedEvent(edition, source, classKey) {
  fillSelect(subclassSelect, []);

  if (!edition || !source || !classKey) return;

  const subclasses =
    ALL_CLASSES?.[edition]?.[source]?.[classKey]?.subclasses;

  fillSelect(subclassSelect, Object.keys(subclasses ?? {}));
  classSelected(classKey);
}

function subClassSelectedEvent(subclassKey) {
  if (!subclassKey) return;
  subClassSelected(subclassKey);
}
