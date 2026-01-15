var buttonListID = "ButtonsEditions";

var raceListID = "raceGeneral";
var subRaceID = "subRace";
var raceInfoID = "raceInfo";

let RACES_ONE = [];
let RACES_UPDATED = [];
let RACES_ORIGINAL = [];

let ALL_SUBRACES = [];


(async function init() {
  const data = await loadRacesData();

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
  CleanContainer(buttonListID);

  const container = document.getElementById(buttonListID);

  const title = document.createElement("h2");
  title.textContent = "Raças";
  container.appendChild(title);

  const buttons = [
    { label: "One D&D", data: RACES_ONE },
    { label: "Atualizadas", data: RACES_UPDATED },
    { label: "Originais", data: RACES_ORIGINAL }
  ];

  buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.label;
    btn.style.display = "block";

    btn.onclick = () => 
      {
      CleanContainer(raceListID);
      CleanContainer(subRaceID);
      CleanContainer(raceInfoID);

      renderRaceList(b.data);
    };

    container.appendChild(btn);
  });
}

function renderRaceList(races) {
  const container = document.getElementById(raceListID);

  races.forEach(race => {
    const btn = document.createElement("button");
    btn.textContent = race.name;
    btn.style.display = "block";

    btn.onclick = () => {

      CharacterState.race = race;
      CharacterState.subrace = null;

      UpdateRaceHeader();

      CleanContainer(subRaceID);
      CleanContainer(raceInfoID);

      const subraces = getSubRacesFor(race, ALL_SUBRACES);

      if (subraces.length > 0) {
        renderSubRaceList(race, subraces);
      } else {
        renderRaceInfo(race);
      }
    };

    container.appendChild(btn);
  });
}



function getSubRacesFor(race, subraces) {
  return subraces.filter(sr =>
    sr.raceName === race.name &&
    sr.raceSource === race.source
  );
}


function renderSubRaceList(race, subraces) {
  CleanContainer(subRaceID);

  const title = document.createElement("h3");
  title.textContent = `Sub-raças de ${race.name}`;

  const container = document.getElementById(subRaceID);
  container.appendChild(title);

  subraces.forEach(sr => {
    const btn = document.createElement("button");
    btn.textContent = sr.name;
    btn.style.display = "block";

    btn.onclick = () => 
    {
      CharacterState.subrace = sr;

      UpdateRaceHeader();

      CleanContainer(raceInfoID);
      renderSubRaceInfo(sr);
    };

    container.appendChild(btn);
  });
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

function getRaceKey(race) {
  return race.name;
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
