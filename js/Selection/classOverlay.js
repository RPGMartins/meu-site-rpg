import { openClassOverlay } from "../ui/overlay.js";
import { CharacterState } from "../state/characterState.js"
import { ALL_CLASSES, getClassFeatures, getSubclassFeatures,} from "../data/dataRegistry.js";
import { parse5eText } from "../parse/parseText.js";

export function showClassDetailsOverlay() {
  const selectedClass = ALL_CLASSES[CharacterState.generalClass.class][CharacterState.generalClass.edition][CharacterState.generalClass.source].class;
  if (!selectedClass) 
    return;
  debugger

    //TODO colocar os campos da classe
    const html = `
    <p><strong>Classe:</strong> ${selectedClass.name}</p>
    <p><strong>Hit Dice:</strong> d${selectedClass.hd?.faces ?? "—"}</p>
    <p><strong>Fonte:</strong> ${selectedClass.source}</p>

    <hr>

    ${renderClassFeatures()}
  `;

  openClassOverlay(selectedClass.name, html);
}

export function showSubClassDetailsOverlay() {
  const selectedSubClass = ALL_CLASSES[CharacterState.generalClass.class][CharacterState.generalClass.edition][CharacterState.generalClass.source].subclasses[CharacterState.generalClass.subclass];
  if (!selectedSubClass) 
    return;

  debugger
    //TODO colocar os campos da classe
    const html = `
    <p><strong>Classe:</strong> ${selectedSubClass.name}</p>
    <p><strong>Fonte:</strong> ${selectedSubClass.source}</p>

    <hr>

    ${rendersubClassFeatures()}
  `;

  openClassOverlay(selectedSubClass.name, html);
}

function renderClassFeatures() {

  if (!CharacterState.generalClass.class) 
    return "";

  return renderFeatures(getClassFeatures(CharacterState.generalClass.class, CharacterState.generalClass.edition, CharacterState.generalClass.source));
}

function rendersubClassFeatures() {

  if (!CharacterState.generalClass.subclass) 
    return "";

  return renderFeatures(getSubclassFeatures(CharacterState.generalClass.class,CharacterState.generalClass.subclass, CharacterState.generalClass.edition, CharacterState.generalClass.source));
}

function renderFeatures(classFeatures)
{
    if(!classFeatures)
        return "";
    debugger
    var textToReturn = classFeatures.map(f => `
    <details class="class-feature">
      <summary class="class-feature-title">
        ${+ f.level + " :"+f.name}
      </summary>
      <div class="class-feature-body">
        ${parse5eText(f.entries.join(" "))}
      </div>
    </details>
  `).join("");

  return textToReturn;
} 