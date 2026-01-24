import { openClassOverlay } from "../ui/overlay.js";
import { CharacterState } from "../state/characterState.js"
import { ALL_RACES, getRaceFeatures, getSubraceFeatures,} from "../data/dataRegistry.js";
import { renderRaceFeatures } from "./baseOverlay.js";

export function showRaceDetailsOverlay()
{
    const raceSelection = ALL_RACES[CharacterState.generalRace.edition][CharacterState.generalRace.source][CharacterState.generalRace.race];
    const selectedRace = raceSelection.race;
    const selectedSubRace = raceSelection.subraces[CharacterState.generalRace.subRace];

    if (!selectedRace) 
        return;

    let html = `
    <p><strong>Classe:</strong> ${selectedRace.name}</p>
    <p><strong>Fonte:</strong> ${selectedRace.source}</p>

    <hr>

    ${prepareRaceFeatures()}`;

    if (!selectedSubRace)
    {
        openClassOverlay(selectedRace.name, html);
        return;
    } 

    debugger
    html += `
    <p><strong>SubClasse:</strong> ${selectedSubRace.name}</p>
    <p><strong>Fonte:</strong> ${selectedSubRace.source}</p>

    <hr>

    ${prepareSubRaceFeatures()} `;
    
    openClassOverlay(selectedRace.name + "-" + selectedSubRace.name, html);
}

function prepareRaceFeatures() {

  if (!CharacterState.generalRace.race) 
    return "";

  return renderRaceFeatures(getRaceFeatures(CharacterState.generalRace.race, CharacterState.generalRace.edition, CharacterState.generalRace.source));
}

function prepareSubRaceFeatures() {

  if (!CharacterState.generalRace.subRace) 
    return "";

  return renderRaceFeatures(getSubraceFeatures(CharacterState.generalRace.race,CharacterState.generalRace.subRace, CharacterState.generalRace.edition, CharacterState.generalRace.source));
}