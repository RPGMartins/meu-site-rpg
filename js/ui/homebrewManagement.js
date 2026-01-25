import {  SOURCE_REGISTRY,  loadHomebrewFromFile,  removeHomebrew} from "../data/dataRegistry.js";
import { fillSelect } from ".././Selection/uiUtils.js";
import { initClassUI } from ".././Selection/classSelection.js";
import {  uploadCharacterState } from "../state/statePersistance.js"
import {  reloadUI } from "../main.js"

const overlay = document.getElementById("homebrewOverlay");
const closeBtn = document.getElementById("closeHomebrewOverlay");

const select = document.getElementById("homebrewSelect");
const importBtn = document.getElementById("btnImportHomebrewOverlay");
const removeBtn = document.getElementById("btnRemoveHomebrew");
const fileInput = document.getElementById("homebrewFileInput");



// ===============================
// OPEN / CLOSE
// ===============================

export function openHomebrewManagement()
{
  overlay.classList.remove("hidden");
  refreshHomebrewList();
}


closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// ===============================
// IMPORT
// ===============================

importBtn.addEventListener("click", () => {
  callLoadHomebrew();
});

async function callLoadHomebrew() {
  const state = await uploadCharacterState();
  await loadHomebrewFromFile(state);
  refreshHomebrewList();
}

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const text = await file.text();
  const json = JSON.parse(text);

  await loadHomebrewFromFile(json, initClassUI);
  refreshHomebrewList();

  fileInput.value = "";
});

// ===============================
// REMOVE
// ===============================

removeBtn.addEventListener("click", () => {
  const source = select.value;
  if (!source) return;

  removeHomebrew(source);
  refreshHomebrewList();
  initClassUI();
});

// ===============================
// SELECT
// ===============================

select.addEventListener("change", () => {
  removeBtn.disabled = !select.value;
});

// ===============================
// UI UPDATE
// ===============================

function refreshHomebrewList() {
  const homebrews = Object.values(SOURCE_REGISTRY.homebrew);

  fillSelect(
    select,
    homebrews.map(hb => ({
      value: hb.id,
      label: hb.name
    })),
    "— Nenhuma —"
  );

  removeBtn.disabled = true;
  reloadUI();
}
