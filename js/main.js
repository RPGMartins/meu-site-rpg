import { initClassLoader } from "./ClassLoader.js";
import { initClassUI, loadCharacter } from "./Selection/classSelection.js";
import { downloadCharacterState, uploadCharacterState } from "./state/statePersistance.js"

await initClassLoader();
initClassUI();


document.getElementById("btnSave").onclick = () => {
  downloadCharacterState();
};

document.getElementById("btnLoad").onclick = () => {
    callLoadCharacter();
};

async function callLoadCharacter() {
  const state = await uploadCharacterState();

  if (!state) return;

  loadCharacter(state.generalClass);
}