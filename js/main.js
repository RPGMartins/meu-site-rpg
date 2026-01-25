import { initClassLoader } from "./loader/ClassLoader.js";
import { initRaceLoader} from "./loader/raceLoader.js"
import { initBackgroundLoader} from "./loader/backgroundLoader.js"
import { initFeatLoader} from "./loader/featLoader.js"

import { showClassDetailsOverlay, showSubClassDetailsOverlay } from "./Selection/classOverlay.js"
import { showRaceDetailsOverlay } from "./Selection/raceOverlay.js"
import { showBackgroundDetailsOverlay } from "./Selection/backgroundOverlay.js"
import { showFeatsDetailsOverlay } from "./Selection/featsOverlay.js"


import { initClassUI, loadCharacter } from "./Selection/classSelection.js";
import { initRaceUI, loadRace } from "./Selection/raceSelection.js"
import { initBackgroundUI, loadBackground} from "./Selection/backgroundSelection.js"
import { initFeatUI, loadFeats} from "./Selection/featSelection.js"

import { downloadCharacterState, uploadCharacterState } from "./state/statePersistance.js"
import { loadHomebrewFromFile, loadFromFile} from "./data/dataRegistry.js"
import { openHomebrewManagement} from "./ui/homebrewManagement.js"

let ALL_INDEX = null;

await GetEditionIndex();
reloadUI();

document.getElementById("btnSave").onclick = () => {
  downloadCharacterState();
};

document.getElementById("btnLoad").onclick = () => {
    callLoadCharacter();
};

document.getElementById("btnManageHomebrew").onclick = () => {
    openHomebrewManagement();
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

document.getElementById("btnBackgroundDetails").onclick = () => {
    showBackgroundDetailsOverlay();;
};

document.getElementById("btnFeatsDetails").onclick = () => {
    showFeatsDetailsOverlay();;
};

export function reloadUI()
{
  initClassUI();
  initRaceUI();
  initBackgroundUI();
  initFeatUI();
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
  await initBackgroundLoader(item.dataPath,item.editionName,item.validSources,loadFromFile);
  await initFeatLoader(item.dataPath,item.editionName,item.validSources,loadFromFile);
}

async function callLoadCharacter() {
  const state = await uploadCharacterState();

  if (!state) return;

  loadCharacter(state.generalClass);
  loadRace(state.generalRace);
  loadBackground(state.generalBackground);
  loadFeats(state.generalFeats);
}