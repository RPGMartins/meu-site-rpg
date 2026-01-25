import {  loadHomebrewFromFile} from "../data/dataRegistry.js";

import {  loadStoredHomebrews,  saveHomebrew,  removeHomebrew} from "../hoemebrew/homebrewStorage.js";

import { fillSelect } from "../Selection/uiUtils.js";
import { initClassUI } from "../Selection/classSelection.js";
import { reloadUI } from "../main.js";

  let overlay   = document.getElementById("homebrewOverlay");
  let closeBtn  = document.getElementById("closeHomebrewOverlay");
  let select    = document.getElementById("homebrewSelect");
  let importBtn = document.getElementById("btnImportHomebrewOverlay");
  let removeBtn = document.getElementById("btnRemoveHomebrew");
  let fileInput = document.getElementById("homebrewFileInput");

export function initHomebrewManagement()
{
  overlay   = document.getElementById("homebrewOverlay");
  closeBtn  = document.getElementById("closeHomebrewOverlay");

  select    = document.getElementById("homebrewSelect");
  importBtn = document.getElementById("btnImportHomebrewOverlay");
  removeBtn = document.getElementById("btnRemoveHomebrew");
  fileInput = document.getElementById("homebrewFileInput");


  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });


  importBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const text = await file.text();
    const json = JSON.parse(text);

    const meta = json._meta;
    const source = meta?.sources?.[0];

    if (!source) {
      alert("Homebrew inválido (sem _meta.sources)");
      return;
    }

    saveHomebrew({
      id: source.json,
      name: source.full,
      edition: meta.edition ?? "classic",
      data: json
    });

    loadHomebrewFromFile(json, initClassUI);
    refreshHomebrewList();

    fileInput.value = "";
  });


  removeBtn.addEventListener("click", () => {
    const id = select.value;
    if (!id) return;

    removeHomebrew(id);

    // recarrega tudo do zero
    reloadUI();
    refreshHomebrewList();
  });



  select.addEventListener("change", () => {
    removeBtn.disabled = !select.value;
  });
}

export function openHomebrewManagement() {
  overlay.classList.remove("hidden");
  refreshHomebrewList();
}

export function loadHomebrewFromLocalStorage()
{
  const homebrews = loadStoredHomebrews();

    homebrews.forEach(homebrew => {
        loadHomebrewFromFile(homebrew.data, initClassUI);
    });
}

function refreshHomebrewList() {
  const homebrews = loadStoredHomebrews();
  fillSelect(
    select,
    homebrews.map(hb => hb.id),
    "— Nenhuma —",
    id => {
      const hb = homebrews.find(h => h.id === id);
      return hb ? hb.name : id;
    }
  );

  removeBtn.disabled = true;
}