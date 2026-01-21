import { ALL_CLASSES, getAvailableClassEditions, getAvailableClassSources, getAvailableSubclasses } from "../data/dataRegistry.js";
import { fillSelect } from "./uiUtils.js";
import { classSelected, classEditionSelected, classSourceSelected, subClassSelected } from "../state/characterState.js"

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

export function loadCharacter(classGeneral)
{
    classSelect.value = classGeneral.class;
    classSelectedEvent(classGeneral.class);

    editionSelect.value = classGeneral.edition;
    classEditionSelectedEvent(classGeneral.class, classGeneral.edition);

    sourceSelect.value = classGeneral.source;
    classSourceSelectedEvent(classGeneral.class, classGeneral.edition, classGeneral.source);

    subclassSelect.value = classGeneral.subclass;
    subClasslectedEvent(classGeneral.subclass);
}

function classSelectedEvent(classValue)
{
    const classKey = classValue;

    fillSelect(editionSelect, []);
    fillSelect(sourceSelect, []);
    fillSelect(subclassSelect, []);

    if(classValue == false)
        return;

    fillSelect(editionSelect, getAvailableClassEditions(classKey));
    classSelected(classKey);
}

function classEditionSelectedEvent(classValue,editionValue)
{
    const classKey = classValue;
    const edition = editionValue;

    fillSelect(sourceSelect, []);
    fillSelect(subclassSelect, []);

    if(classValue == false || editionValue == false)
        return;

    fillSelect(sourceSelect, getAvailableClassSources(classKey,edition));
    classEditionSelected(edition);
}

function classSourceSelectedEvent(classValue,editionValue,sourceValue)
{
    const classKey = classValue;
    const edition = editionValue;
    const source  = sourceValue;

    fillSelect(subclassSelect, []);

    if(classValue == false || editionValue == false || sourceValue == false)
        return;

    fillSelect(subclassSelect, getAvailableSubclasses(classKey, edition, source));
    classSourceSelected(source);
}

function subClasslectedEvent(subClassValue)
{
    if (subClassValue == false)
        return 
    subClassSelected(subClassValue)
}