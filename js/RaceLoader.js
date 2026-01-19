var raceListID    = "raceGeneral";
var subRaceListID = "raceSub";
var raceInfoID    = "raceInfo";

let raceVersionButtons = []; // { btn, races }
let raceButtons = [];        // { race, btn }
let subRaceButtons = [];     // { subrace, btn }

let selectedRaceBtn = null;
let selectedSubRaceBtn = null;
let selectedVersionBtn = null;

let RACES_ONE = [];
let RACES_UPDATED = [];
let RACES_ORIGINAL = [];
let ALL_SUBRACES = [];
let ALL_RACES = [];

(async function init() {
  const data = await loadRacesData();
  ALL_RACES = data;
  ALL_SUBRACES = data.subrace ?? [];

  const deduped = dedupeRaces(data.race);

  RACES_ONE = deduped.filter(r => r.edition === "one");

  RACES_UPDATED = deduped.filter(r =>
    r.edition !== "one" &&
    (r._copy || r.reprintedAs)
  );

  RACES_ORIGINAL = deduped.filter(r =>
    !r.edition &&
    !r._copy &&
    !r.reprintedAs
  );

  renderRaceVersionButtons();
})();

async function loadRacesData() {
  const res = await fetch("./data/races.json");
  return await res.json();
}



function renderRaceVersionButtons() {
  const container = document.getElementById("raceToggle");

  const versions = [
    { label: "One D&D", races: RACES_ONE },
    { label: "Atualizadas", races: RACES_UPDATED },
    { label: "Originais", races: RACES_ORIGINAL }
  ];

  versions.forEach(v => {
    const btn = document.createElement("button");
    btn.textContent = v.label;

    clearRaceButton(btn);

    btn.onclick = e => {
      e.stopPropagation();
      onRaceVersionClicked(v, btn);
    };

    container.appendChild(btn);
    raceVersionButtons.push({ btn, races: v.races });
  });
}

function onRaceVersionClicked(version, btn) {
  if (selectedVersionBtn === btn) {
    clearAllRaceVersionButtons();
    clearAllRaceUI();
    return;
  }

  clearAllRaceVersionButtons();
  markRaceButton(btn);
  selectedVersionBtn = btn;

  clearAllRaceUI();
  renderRaceList(version.races);
}


function renderRaceList(races) {
  CleanContainer(raceListID);
  raceButtons = [];

  const container = document.getElementById(raceListID);

  races.forEach(race => {
    const btn = document.createElement("button");
    btn.textContent = race.name;

    clearRaceButton(btn);

    btn.onclick = () => onRaceClicked(race, btn);

    container.appendChild(btn);
    raceButtons.push({ race, btn });
  });

  syncRaceButtonsFromState();
}

function onRaceClicked(race, btn) {
  CleanContainer(subRaceListID);
  CleanContainer(raceInfoID);

  if (
    CharacterState.race &&
    CharacterState.race.name === race.name &&
    CharacterState.race.source === race.source
  ) {
    CharacterState.race = null;
    CharacterState.subrace = null;
    clearAllRaceButtons();
    UpdateRaceHeader();
    return;
  }

  CharacterState.race = race;
  CharacterState.subrace = null;

  clearAllRaceButtons();
  markRaceButton(btn);
  selectedRaceBtn = btn;

  UpdateRaceHeader();

  const subraces = getSubRacesFor(race, ALL_SUBRACES);

  if (subraces.length > 0) {
    renderSubRaceList(race, subraces);
  } else {
    renderRaceInfo(race);
  }
}

function getSubRacesFor(race, subraces) {
  return subraces.filter(sr =>
    sr.raceName === race.name &&
    sr.raceSource === race.source
  );
}


function renderSubRaceList(race, subraces) {
  CleanContainer(subRaceListID);
  subRaceButtons = [];

  const container = document.getElementById(subRaceListID);

  subraces.forEach(sr => {
    const btn = document.createElement("button");
    btn.textContent = sr.name;

    clearRaceButton(btn);

    btn.onclick = () => onSubRaceClicked(sr, btn);

    container.appendChild(btn);
    subRaceButtons.push({ subrace: sr, btn });
  });

  syncSubRaceButtonsFromState();
}

function onSubRaceClicked(sr, btn) {
  CleanContainer(raceInfoID);

  if (
    CharacterState.subrace &&
    CharacterState.subrace.name === sr.name &&
    CharacterState.subrace.source === sr.source
  ) {
    CharacterState.subrace = null;
    clearAllSubRaceButtons();
    UpdateRaceHeader();
    return;
  }

  CharacterState.subrace = sr;

  clearAllSubRaceButtons();
  markRaceButton(btn);
  selectedSubRaceBtn = btn;

  UpdateRaceHeader();
  renderSubRaceInfo(sr);
}


function renderRaceInfo(race) {
  CleanContainer(raceInfoID);

  const div = document.createElement("div");
  div.innerHTML = `
    <h3>${race.name}</h3>
    <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(race.source)}</p>
  `;

  document.getElementById(raceInfoID).appendChild(div);
}


function renderSubRaceInfo(sr) {
  CleanContainer(raceInfoID);

  const div = document.createElement("div");
  div.innerHTML = `
    <h3>${sr.name}</h3>
    <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(sr.source)}</p>
  `;

  document.getElementById(raceInfoID).appendChild(div);
}

function clearRaceButton(btn) {
  if (!btn) return;
  btn.style.backgroundColor = "LightGray";
}

function markRaceButton(btn) {
  if (!btn) return;
  btn.style.backgroundColor = "green";
}

function ClearAllBackgroundButtonsRaces()
{
  clearAllRaceButtons();
  clearAllSubRaceButtons();
  clearAllRaceVersionButtons();
  clearAllRaceUI();
}

function clearAllRaceButtons() {
  raceButtons.forEach(({ btn }) => clearRaceButton(btn));
  selectedRaceBtn = null;
}

function clearAllSubRaceButtons() {
  subRaceButtons.forEach(({ btn }) => clearRaceButton(btn));
  selectedSubRaceBtn = null;
}

function clearAllRaceVersionButtons() {
  raceVersionButtons.forEach(({ btn }) => clearRaceButton(btn));
  selectedVersionBtn = null;
}

function clearAllRaceUI() {
  CleanContainer(raceListID);
  CleanContainer(subRaceListID);
  CleanContainer(raceInfoID);

  raceButtons = [];
  subRaceButtons = [];

  selectedRaceBtn = null;
  selectedSubRaceBtn = null;
}

function syncRaceButtonsFromState() {
  if (!CharacterState.race) return;

  raceButtons.forEach(({ race, btn }) => {
    if (
      race.name === CharacterState.race.name &&
      race.source === CharacterState.race.source
    ) {
      markRaceButton(btn);
      selectedRaceBtn = btn;
    }
  });
}

function syncSubRaceButtonsFromState() {
  if (!CharacterState.subrace) return;

  subRaceButtons.forEach(({ subrace, btn }) => {
    if (
      subrace.name === CharacterState.subrace.name &&
      subrace.source === CharacterState.subrace.source
    ) {
      markRaceButton(btn);
      selectedSubRaceBtn = btn;
    }
  });
}

function dedupeRaces(races) {
  const map = new Map();

  races.forEach(race => {
    // ignora cópias internas
    if (race._copy) return;

    const key = getRaceKey(race);

    // só pega a primeira ocorrência
    if (!map.has(key)) {
      map.set(key, race);
    }
  });

  return [...map.values()];
}

function getRaceKey(race) {
  return race.name;
}