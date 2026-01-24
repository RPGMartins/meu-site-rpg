import { initClassLoader } from "./loader/ClassLoader.js";
import { initRaceLoader} from "./loader/raceLoader.js"
import { initClassUI, loadCharacter } from "./Selection/classSelection.js";
import { downloadCharacterState, uploadCharacterState } from "./state/statePersistance.js"
import { showClassDetailsOverlay, showSubClassDetailsOverlay } from "./Selection/classOverlay.js"
import { showRaceDetailsOverlay } from "./Selection/raceOverlay.js"
import { loadHomebrewFromFile, loadFromFile} from "./data/dataRegistry.js"
import { initRaceUI, loadRace } from "./Selection/raceSelection.js"

let ALL_INDEX = null;

await GetEditionIndex();
reloadUI();

document.getElementById("btnSave").onclick = () => {
  downloadCharacterState();
};

document.getElementById("btnLoad").onclick = () => {
    callLoadCharacter();
};

document.getElementById("btnImportHomebrew").onclick = () => {
    callLoadHomebrew();
};

document.getElementById("btnClassDetails").onclick = () => {
    showClassDetailsOverlay();
};
document.getElementById("btnSubClassDetails").onclick = () => {
    showSubClassDetailsOverlay();
};

document.getElementById("btnRaceDetails").onclick = () => {
    showRaceDetailsOverlay();;
};

function reloadUI()
{
  initClassUI();
  initRaceUI();
}

async function GetEditionIndex() {
  const res = await fetch("./index.json");
  ALL_INDEX = await res.json();

  await Promise.all(
    ALL_INDEX.index.map(iniEditions)
  );
}

async function iniEditions(item) {
  await initClassLoader(item.dataPath,item.editionName,item.validSources,loadFromFile);
  await initRaceLoader(item.dataPath,item.editionName,item.validSources,loadFromFile);

}

async function callLoadHomebrew() {

  const state = await uploadCharacterState();
  loadHomebrewFromFile(state,reloadUI);
}

async function callLoadCharacter() {
  const state = await uploadCharacterState();

  if (!state) return;

  loadCharacter(state.generalClass);
  loadRace(state.generalRace);
}