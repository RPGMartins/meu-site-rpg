var raceListID    = "raceGeneral";
var subRaceListID = "raceSub";
var raceInfoID    = "raceInfo";

var selectedButton;
var selectedRace;
var selectedSubRace;


let RACES_ONE = [];
let RACES_UPDATED = [];
let RACES_ORIGINAL = [];

let ALL_SUBRACES = [];


(async function init() 
{
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
  const container = document.getElementById("raceToggle");
  const buttons = [
    { label: "One D&D", data: RACES_ONE },
    { label: "Atualizadas", data: RACES_UPDATED },
    { label: "Originais", data: RACES_ORIGINAL }
  ];

  buttons.forEach(b => 
    {
    const btn = document.createElement("button");
    btn.textContent = b.label;
    btn.style.display = "block";
    btn.style.backgroundColor = "LightGray";

    btn.onclick = (e) => 
    {
      e.stopPropagation();
      if(selectedButton && selectedButton == btn)
      {
        selectedButton = null;

        CleanContainer(raceListID);
        CleanContainer(subRaceListID);
        CleanContainer(raceInfoID);
        btn.style.backgroundColor = "LightGray";

        return;
      }
      else
      {
        if(selectedButton)
        {
          selectedButton.style.backgroundColor = "LightGray";
        }
        
        btn.style.backgroundColor = "green";
      }
      selectedButton = btn;

      CleanContainer(raceListID);
      CleanContainer(subRaceListID);
      CleanContainer(raceInfoID);

      renderRaceList(b.data);
    };

    container.appendChild(btn);
  });
}


function renderRaceList(races) 
{
  const container = document.getElementById(raceListID);

  races.forEach(race => 
    {
    const btn = document.createElement("button");
    btn.textContent = race.name;
    btn.style.display = "block";
    btn.style.backgroundColor = "LightGray";

    btn.onclick = () => 
    {
     
      const subraces = getSubRacesFor(race, ALL_SUBRACES);

      CleanContainer(subRaceListID);
      CleanContainer(raceInfoID);


      if(CharacterState.race)
      {
          selectedRace.style.backgroundColor = "LightGray";

          if(CharacterState.race.name == race.name && CharacterState.race.source == race.source)
          {
              CharacterState.race = null;
              UpdateRaceHeader();
              return;
          }
      }

      btn.style.backgroundColor = "green";
      
      CharacterState.race = race;
      CharacterState.subrace = null;

      selectedRace = btn;
      UpdateRaceHeader();


      if (subraces.length > 0) 
      {
        renderSubRaceList(race, subraces);
      } 
      else 
      {
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
  CleanContainer(subRaceListID);

  const title = document.createElement("h3");
  title.textContent = `Sub-raças de ${race.name}`;

  const container = document.getElementById(subRaceListID);
  container.appendChild(title);

  subraces.forEach(sr => {
    const btn = document.createElement("button");
    btn.textContent = sr.name;
    btn.style.display = "block";
    btn.style.backgroundColor = "LightGray";

    btn.onclick = () => 
    {
      if(CharacterState.subrace)
      {
        selectedSubRace.style.backgroundColor = "LightGray";

        if(CharacterState.subrace.name == sr.name && CharacterState.subrace.source == sr.source)
        {
            CharacterState.subrace = null;
            UpdateRaceHeader();
            CleanContainer(raceInfoID);
            return;
        }
      }

      selectedSubRace = btn
      btn.style.backgroundColor = "green";

      CharacterState.subrace = sr;

      UpdateRaceHeader();

      CleanContainer(raceInfoID);
      renderSubRaceInfo(sr,btn);
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

function renderSubRaceInfo(sr,btn) 
{
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
