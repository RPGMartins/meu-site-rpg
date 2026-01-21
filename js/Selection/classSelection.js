import { ALL_CLASSES, getAvailableClassEditions, getAvailableClassSources, getAvailableSubclasses, getClass} from "../data/dataRegistry.js";
import {fillSelect} from "./uiUtils.js";
import {classSelected, classEditionSelected, classSourceSelected, subClassSelected} from "./characterState.js"

const classSelect    = document.getElementById("classSelect");
const editionSelect  = document.getElementById("editionSelect");
const sourceSelect   = document.getElementById("sourceSelect");
const subclassSelect = document.getElementById("subclassSelect");

classSelect.addEventListener("change", () => classSelectedEvent(classSelect.value));
editionSelect.addEventListener("change", () => classEditionSelectedEvent(classSelect.value, editionSelect.value));
sourceSelect.addEventListener("change", () => classSourceSelectedEvent(classSelect.value, editionSelect.value, sourceSelect.value));
subclassSelect.addEventListener("change", () => subClasslectedEvent(subclassSelect.value));


export function initClassUI() {
  const classKeys = Object.keys(ALL_CLASSES);
  fillSelect(classSelect, classKeys);
}

function classSelectedEvent(classValue)
{
    const classKey = classValue;

    fillSelect(editionSelect, []);
    fillSelect(sourceSelect, []);
    fillSelect(subclassSelect, []);


    fillSelect(editionSelect, getAvailableClassEditions(classKey));
    classSelected(classKey);
}

function classEditionSelectedEvent(classValue,editionValue)
{
    const classKey = classSelect.value;
    const edition = editionSelect.value;

    fillSelect(sourceSelect, []);
    fillSelect(subclassSelect, []);


    fillSelect(sourceSelect, getAvailableClassSources(classKey,edition));
    classEditionSelected(edition);
}

function classSourceSelectedEvent(classValue,editionValue,sourceValue)
{
    const classKey = classValue;
    const edition = editionValue;
    const source  = sourceValue;

    fillSelect(subclassSelect, []);

    const subclasses = getAvailableSubclasses(classKey, edition, source);
    fillSelect(subclassSelect, subclasses);
    classSourceSelected(source);
}

function subClasslectedEvent(subClassValue)
{
  const subclassName = ssubClassValue;
  if (!subclassName) return;
    subClassSelected(subclassName)
}
