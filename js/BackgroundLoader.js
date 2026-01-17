var backgroundListID = "backgroundContainer";
var backgroundInfoID = "backgroundInfo";

var selectedBackground = null;

let ALL_BACKGROUNDS = [];

(async function initBackgroundLoader() 
{
  ALL_BACKGROUNDS = await loadBackgrounds();
  renderBackgroundList(ALL_BACKGROUNDS);
})();

async function loadBackgrounds() 
{
  const res = await fetch("./data/backgrounds.json");
  const data = await res.json();
  return data.background;
}

function renderBackgroundList(backgrounds) 
{
  CleanContainer(backgroundListID);
  CleanContainer(backgroundInfoID);

  const container = document.getElementById(backgroundListID);

  backgrounds
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(bg => {
      const btn = document.createElement("button");
      btn.textContent = bg.name;
      btn.style.display = "block";

      btn.onclick = () => selectBackground(bg,btn);
      btn.style.backgroundColor = "LightGray";

      container.appendChild(btn);
    });
}

function selectBackground(bg,btn) 
{
 if(CharacterState.background)
 {
    selectedBackground.style.backgroundColor = "LightGray";

    if(CharacterState.background.name == bg.name && CharacterState.background.source == bg.source)
    {
      CharacterState.background = null;
      UpdateBackgroundHeader();
      return;
    }
 }
  
  btn.style.backgroundColor = "green";

  selectedBackground = btn;
  CharacterState.background = 
  {
    name: bg.name,
    source: bg.source
  };

  renderBackgroundDetails(bg);
  UpdateBackgroundHeader();
}

function renderBackgroundDetails(bg) {
  CleanContainer(backgroundInfoID);

  const container = document.getElementById(backgroundInfoID);

  const div = document.createElement("div");
  div.innerHTML = `
    <h3>${bg.name}</h3>
    <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(bg.source)}</p>
  `;

  container.appendChild(div);
}

function renderBgArray(title, arr) {
  if (!arr || arr.length === 0) return "";

  return `
    <p><strong>${title}:</strong> ${arr.join(", ")}</p>
  `;
}

