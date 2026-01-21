import { ALL_CLASSES, getAvailableClassEditions, getAvailableClassSources, getAvailableSubclasses} from "../data/dataRegistry.js";
import {fillSelect} from "./uiUtils.js";

const classSelect    = document.getElementById("classSelect");
const editionSelect  = document.getElementById("editionSelect");
const sourceSelect   = document.getElementById("sourceSelect");
const subclassSelect = document.getElementById("subclassSelect");


export function initClassUI() {
    debugger
  const classKeys = Object.keys(ALL_CLASSES);
  fillSelect(classSelect, classKeys);
}


classSelect.addEventListener("change", () => {
  const classKey = classSelect.value;

  if (!classKey) {
    fillSelect(editionSelect, []);
    fillSelect(sourceSelect, []);
    fillSelect(subclassSelect, []);
    return;
  }

  const editions = Object.keys(ALL_CLASSES[classKey]);
  fillSelect(editionSelect, editions);
});

editionSelect.addEventListener("change", () => {
  const classKey = classSelect.value;
  const edition = editionSelect.value;

  if (!edition) {
    fillSelect(sourceSelect, []);
    fillSelect(subclassSelect, []);
    return;
  }

  const sources = Object.keys(ALL_CLASSES[classKey][edition]);
  fillSelect(sourceSelect, sources);
});

sourceSelect.addEventListener("change", () => {
  const classKey = classSelect.value;
  const edition = editionSelect.value;
  const source  = sourceSelect.value;

  if (!source) {
    fillSelect(subclassSelect, []);
    return;
  }

  const subclasses = getAvailableSubclasses(classKey, edition, source);
  fillSelect(subclassSelect, subclasses);

  const cls = getClass({ classKey, edition, source });
  renderClassInfo(cls);
});

subclassSelect.addEventListener("change", () => {
  const subclassName = subclassSelect.value;
  if (!subclassName) return;
  console.log("SELECIONOU");
});
