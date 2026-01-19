window.CharacterState = 
{
    meta: 
    {
        toolVersion: "0.1",
        createdAt: () => new Date().toISOString()
    },

  class: null,
  subclass: null,
  race: null,
  subrace: null,
  feats: [],
  background: null,
  classFeature: null
};

function UpdateClassHeader() 
{
  const container = document.getElementById("HeaderClasse");
  CleanContainer("HeaderClasse");

  if (!CharacterState.class) return;

  let html = `<strong>Classe:</strong> ${CharacterState.class.name}`;

  if (CharacterState.subclass) 
  {
    html += `<br><strong>Subclasse:</strong> ${CharacterState.subclass.name}`;
  }

  container.innerHTML = html;
}

function UpdateRaceHeader() 
{
  const container = document.getElementById("HeaderRaca");
  CleanContainer("HeaderRaca");

  if (!CharacterState.race) return;

  let html = `<strong>Raça:</strong> ${CharacterState.race.name}`;

  if (CharacterState.subrace)
  {
    html += `<br><strong>Sub-raça:</strong> ${CharacterState.subrace.name}`;
  }

  container.innerHTML = html;
}

function UpdateFeatHeader() 
{
  const div = document.getElementById("HeaderFeats");
  CleanContainer("HeaderFeats");

  if (!CharacterState.feats.length) return;

  div.textContent =
    "Feats: " + CharacterState.feats.map(f => f.name).join(", ");
}

function UpdateBackgroundHeader() 
{
  CleanContainer("headerBackground");

  if (!CharacterState.background) return;

  const container = document.getElementById("headerBackground");

  const p = document.createElement("p");
  p.textContent = `Background: ${CharacterState.background.name}`;

  container.appendChild(p);
}

function HasCharacterProgress() {
  return (
    CharacterState.class ||
    CharacterState.subclass ||
    CharacterState.race ||
    CharacterState.subrace ||
    CharacterState.background ||
    (Array.isArray(CharacterState.feats) && CharacterState.feats.length > 0)
  );
}
