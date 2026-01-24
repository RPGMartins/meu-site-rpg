import { openClassOverlay } from "../ui/overlay.js";
import { CharacterState } from "../state/characterState.js"
import { ALL_CLASSES, getClassFeatures, getSubclassFeatures,} from "../data/dataRegistry.js";
import { renderFeatures } from "./baseOverlay.js";

export function showClassDetailsOverlay() {
  const selectedClass = ALL_CLASSES[CharacterState.generalClass.edition][CharacterState.generalClass.source][CharacterState.generalClass.class].class;
  if (!selectedClass) 
    return;

    //TODO colocar os campos da classe
    const html = `
    <p><strong>Classe:</strong> ${selectedClass.name}</p>
    <p><strong>Hit Dice:</strong> d${selectedClass.hd?.faces ?? "—"}</p>
    <p><strong>Fonte:</strong> ${selectedClass.source}</p>

    <hr>

    ${prepareClassFeatures()}
  `;

  openClassOverlay(selectedClass.name, html);
}

export function showSubClassDetailsOverlay() {
  const selectedSubClass = ALL_CLASSES[CharacterState.generalClass.edition][CharacterState.generalClass.source][CharacterState.generalClass.class].subclasses[CharacterState.generalClass.subclass];
  if (!selectedSubClass) 
    return;

    //TODO colocar os campos da subcclasse
    const html = `
    <p><strong>Classe:</strong> ${selectedSubClass.name}</p>
    <p><strong>Fonte:</strong> ${selectedSubClass.source}</p>

    <hr>

    ${preparesubClassFeatures()}
  `;

  openClassOverlay(selectedSubClass.name, html);
}

function prepareClassFeatures() {

  if (!CharacterState.generalClass.class) 
    return "";

  return renderFeatures(getClassFeatures(CharacterState.generalClass.class, CharacterState.generalClass.edition, CharacterState.generalClass.source));
}

function preparesubClassFeatures() {

  if (!CharacterState.generalClass.subclass) 
    return "";

  return renderFeatures(getSubclassFeatures(CharacterState.generalClass.class,CharacterState.generalClass.subclass, CharacterState.generalClass.edition, CharacterState.generalClass.source));
}