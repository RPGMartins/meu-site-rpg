import { initClassLoader } from "./ClassLoader.js";
import { initClassUI, loadCharacter } from "./Selection/classSelection.js";
import { downloadCharacterState, uploadCharacterState } from "./state/statePersistance.js"
import { showClassDetailsOverlay, showSubClassDetailsOverlay } from "./Selection/classOverlay.js"

let ALL_INDEX = null;

await GetEditionIndex();
initClassUI();

document.getElementById("btnSave").onclick = () => {
  downloadCharacterState();
};

document.getElementById("btnLoad").onclick = () => {
    callLoadCharacter();
};

document.getElementById("btnClassDetails").onclick = () => {
    showClassDetailsOverlay();
};
document.getElementById("btnSubClassDetails").onclick = () => {
    showSubClassDetailsOverlay();
};



async function GetEditionIndex() {
  const res = await fetch("./index.json");
  ALL_INDEX = await res.json();

  await Promise.all(
    ALL_INDEX.index.map(iniEditions)
  );
}

async function iniEditions(item) {
  await initClassLoader(item.dataPath,item.editionName,item.validSources);
}




async function callLoadCharacter() {
  const state = await uploadCharacterState();

  if (!state) return;

  loadCharacter(state.generalClass);
}