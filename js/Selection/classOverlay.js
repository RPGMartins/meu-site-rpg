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
    
     <p class="starting-equipment">
      <strong> Perícias Iniciais </strong>
      ${startingSkillsToDisplayString(selectedClass.startingProficiencies)}
    </p>
    
    <p class="starting-equipment">
      <strong>Equipamento Inicial:</strong>
      ${startingEquipmentToDisplayString(selectedClass.startingEquipment)}
    </p>

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

export function startingEquipmentToDisplayString(startingEquipment) {
  if (!startingEquipment) return "";

  const blocks = [];

  if (Array.isArray(startingEquipment.default)) {
    startingEquipment.default.forEach(entry => {
      if (typeof entry === "string") {
        blocks.push(
            `• ${formatChoice(clean5eText(entry))}`
        );
      }
    });
  }

  if (startingEquipment.goldAlternative) {
    blocks.push(
        `\n💰 Alternatively, you may start with ${clean5eText(startingEquipment.goldAlternative)} gp.`
    );
  }

  if (startingEquipment.additionalFromBackground) {
    blocks.push(
        `\n📜 You also gain the starting equipment from your background.`
    );
  }

  return blocks.join("\n\n");
}


function formatChoice(text) {
  return text
      // espaço antes de (a), (b), etc
      .replace(/\s*\((a|b|c|d)\)\s*/gi, "\n  ↳ ($1) ");
}


function clean5eText(text) {
  if (typeof text !== "string") return "";

  return text
      .replace(/\{@item\s+([^|}]+)(\|[^}]+)?\}/g, "$1")
      .replace(/\{@filter\s+([^|}]+)\|[^}]+\}/g, "$1")
      .replace(/\{@dice\s+([^|}]+)(\|[^}]+)?\}/g, "$1")
      .replace(/\{@[^}]+\}/g, "")
      .replace(/\s+/g, " ")
      .trim();
}

export function startingSkillsToDisplayString(startingProficiencies) {
  if (!startingProficiencies?.skills?.length) return "";

  const parts = [];

  startingProficiencies.skills.forEach(skillBlock => {
    if (!skillBlock.choose) return;

    const { count, from } = skillBlock.choose;

    if (!Array.isArray(from) || !count) return;

    const skills = from.map(formatSkillName).join(", ");

    parts.push(
        `• Escolha ${count} entre: ${skills}`
    );
  });

  if (!parts.length) return "";

  return `\n${parts.join("\n")}`;
}

function formatSkillName(skill) {
  if (typeof skill !== "string") return "";

  const map = {
    athletics: "Atletismo",
    acrobatics: "Acrobacia",
    sleightOfHand: "Prestidigitação",
    stealth: "Furtividade",
    arcana: "Arcanismo",
    history: "História",
    investigation: "Investigação",
    nature: "Natureza",
    religion: "Religião",
    animalHandling: "Adestrar Animais",
    insight: "Intuição",
    medicine: "Medicina",
    perception: "Percepção",
    survival: "Sobrevivência",
    deception: "Enganação",
    intimidation: "Intimidação",
    performance: "Atuação",
    persuasion: "Persuasão"
  };

  return map[skill] ?? skill;
}
