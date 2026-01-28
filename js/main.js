import { initClassLoader } from "./loader/ClassLoader.js";
import { initRaceLoader} from "./loader/raceLoader.js"
import { initBackgroundLoader} from "./loader/backgroundLoader.js"
import { initFeatLoader} from "./loader/featLoader.js"

import { showClassDetailsOverlay, showSubClassDetailsOverlay } from "./Selection/classOverlay.js"
import { showRaceDetailsOverlay } from "./Selection/raceOverlay.js"
import { showBackgroundDetailsOverlay } from "./Selection/backgroundOverlay.js"
import { showFeatsDetailsOverlay } from "./Selection/featsOverlay.js"


import { initClassSelection,initClassUI, loadCharacter } from "./Selection/classSelection.js";
import { initRaceSelection, initRaceUI, loadRace } from "./Selection/raceSelection.js"
import { initBackgroundSelection, initBackgroundUI, loadBackground} from "./Selection/backgroundSelection.js"
import { initFeatSelection, initFeatUI, loadFeats} from "./Selection/featSelection.js"

import { downloadCharacterState, uploadCharacterState } from "./state/statePersistance.js"
import { loadFromFile } from "./data/dataRegistry.js"
import { initHomebrewManagement ,openHomebrewManagement, loadHomebrewFromLocalStorage } from "./ui/homebrewManagement.js"

import {openFeatureOverlay, closeFeatureOverlay, initFeatureOverlay} from "./feature/featureOverlay.js";
import {applyLoadedPrintState} from "./feature/featureRender.js";
import { loadPartial } from "./ui/loadPartials.js";
import { initOverlay } from "./ui/overlay.js";
import { waitAllElements } from "./domUtils.js";

let ALL_INDEX = null;


async function mainInit(){
  await loadPartial("appHeader", "partials/header.html");

  await loadPartial("appMain", "partials/classPanel.html");
  await loadPartial("appMain", "partials/racePanel.html");
  await loadPartial("appMain", "partials/backgroundPanel.html");
  await loadPartial("appMain", "partials/featPanel.html");

  await loadPartial("overlays", "overlays/homebrewOverlay.html");
  await loadPartial("overlays", "overlays/classOverlay.html");

  await loadPartial("features", "overlays/featureOverlay.html");


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

  document.getElementById("btnFeatures").onclick = () => {
      openFeatureOverlay();
  };

    document.getElementById("closeFeatureOverlay").onclick = () => {
      closeFeatureOverlay();
  };


  await waitAllElements();

  await GetEditionIndex();
  init();
  reloadUI();

}

mainInit();


function init()
{
  initOverlay()
  initHomebrewManagement();
  initClassSelection();
  initRaceSelection();
  initBackgroundSelection();
  initFeatSelection();
}

export function reloadUI()
{
  loadHomebrewFromLocalStorage();
  initClassUI();
  initRaceUI();
  initBackgroundUI();
  initFeatUI();
  initFeatureOverlay();
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
  applyLoadedPrintState(state.generalPrint);
}

function waitForElement(id) {
  return new Promise(resolve => {
    const el = document.getElementById(id);
    if (el) return resolve(el);

    const obs = new MutationObserver(() => {
      const el = document.getElementById(id);
      if (el) {
        obs.disconnect();
        resolve(el);
      }
    });

    obs.observe(document.body, { childList: true, subtree: true });
  });
}