import {  loadHomebrewFromFile , removeHomebrewDataRegistry} from "../data/dataRegistry.js";

import {  loadStoredHomebrews,  saveHomebrew,  removeHomebrewLocalStorage} from "../hoemebrew/homebrewStorage.js";

import { initClassUI } from "../Selection/classSelection.js";
import { reloadUI } from "../main.js";

const HOMEBREW_BASE_URL =
  "https://raw.githubusercontent.com/TheGiddyLimit/homebrew/refs/heads/master/";

  let overlay;
  let closeBtn;
  let select;
  let importBtn;
  let removeBtn;
  let fileInput;
  let selectedNameInput;
  let remoteSelect;
  let downloadBtn;
  let importByUrlBtn;
  let refreshHomebrewListBtn;
  let remoteHomebrews = [];

export function initHomebrewManagement() {
  overlay   = document.getElementById("homebrewOverlay");
  closeBtn  = document.getElementById("closeHomebrewOverlay");

  select    = document.getElementById("homebrewSelect");
  importBtn = document.getElementById("btnImportHomebrewOverlay");
  removeBtn = document.getElementById("btnRemoveHomebrew");
  fileInput = document.getElementById("homebrewFileInput");
  refreshHomebrewListBtn = document.getElementById("btnRefreshHomebrewList");

  selectedNameInput = document.getElementById("selectedHomebrewName");

  remoteSelect = document.getElementById("homebrewRemoteSelect");
  downloadBtn  = document.getElementById("btnDownloadHomebrew");

  importByUrlBtn = document.getElementById("btnImportHomebrewByUrl");
  /* ===============================
     FECHAR OVERLAY
  ================================ */
  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  /* ===============================
     IMPORTAR ARQUIVO
  ================================ */
  importBtn.addEventListener("click", () => {
    fileInput.click();
  });


    refreshHomebrewListBtn.addEventListener("click", () => {
    refreshRemoteList();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const text = await file.text();
    const json = JSON.parse(text);

    importHomebrewJson(json);
    fileInput.value = "";
  });

  /* ===============================
     REMOVER HOMEBREW
  ================================ */
  removeBtn.addEventListener("click", () => {
    const id = select.value;
    if (!id) return;

    removeHomebrewLocalStorage(id);
    removeHomebrewDataRegistry(id);

    refreshHomebrewList();
    reloadUI();
  });

  /* ===============================
     SELEÇÃO LOCAL
  ================================ */
  select.addEventListener("change", () => {
    const id = select.value;
    const homebrews = loadStoredHomebrews();
    const hb = homebrews.find(h => h.id === id);

    if (hb) {
      selectedNameInput.value = hb.name;
      removeBtn.disabled = false;
    } else {
      selectedNameInput.value = "";
      removeBtn.disabled = true;
    }
  });

  /* ===============================
     DOWNLOAD REMOTO
  ================================ */
  remoteSelect.addEventListener("change", () => {
  downloadBtn.disabled = !remoteSelect.value;
  });


  downloadBtn.addEventListener("click", async () => {
    const idx = Number(remoteSelect.value);
    if (Number.isNaN(idx)) return;

    const hb = remoteHomebrews[idx];
    if (!hb) return;

    const res = await fetch(hb.url);
    if (!res.ok) {
      alert("Falha ao baixar homebrew");
      return;
    }

    const json = await res.json();
    importHomebrewJson(json);
  });



  /* ===============================
     IMPORTAR VIA URL
  ================================ */
  importByUrlBtn.addEventListener("click", async () => {
    const url = prompt("Cole a URL do JSON:");
    if (!url) return;

    const res = await fetch(url);
    const json = await res.json();

    importHomebrewJson(json);
  });
}

function importHomebrewJson(json) {
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
  refreshRemoteList();
  reloadUI();
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

async function refreshRemoteList() {
  const installedIds = loadStoredHomebrews().map(h => h.id);

  const res = await fetch(
    "https://raw.githubusercontent.com/TheGiddyLimit/homebrew/refs/heads/master/_generated/index-sources.json"
  );

  const index = await res.json();

  remoteHomebrews = Object.entries(index)
    .filter(([id]) => !installedIds.includes(id))
    .map(([id, relativePath]) => {
      return {
        id,
        path: relativePath,
        name: prettifyHomebrewName(relativePath),
        url: HOMEBREW_BASE_URL + encodeURI(relativePath)
      };
    });

  fillSelect(
    remoteSelect,
    remoteHomebrews.map((_, i) => String(i)),
    "— Selecione —",
    i => remoteHomebrews[Number(i)]?.name ?? ""
  );

  downloadBtn.disabled = true;
}



function prettifyHomebrewName(path) {
  return path
    .split("/")
    .pop()                  // arquivo
    .replace(".json", "")
    .replace(/;/g, " — ");
}

export function fillSelect(select, values, placeholder, labelFn) {
  select.innerHTML = "";

  if (placeholder) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholder;
    select.appendChild(opt);
  }

  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v; // 🔴 ISSO PRECISA EXISTIR
    opt.textContent = labelFn ? labelFn(v) : v;
    select.appendChild(opt);
  });
}
