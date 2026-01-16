let FeatCache = null;

var featControlsID = "featControls";
var featListID     = "featContainer";

(
    async function initFeatLoader() 
    {
        const feats = await loadAllFeats();
        renderFeatCategories(feats);
    }
)();

async function loadAllFeats() {
  if (FeatCache) return FeatCache;

  const res = await fetch("./data/feats.json");
  const json = await res.json();

  FeatCache = json.feat;
  return FeatCache;
}

function renderFeatCategories(feats) {
  CleanContainer(featControlsID);

  const categories = 
  {
    All: feats,
    Origin: feats.filter(f => f.category === "Origin"),
    Racial: feats.filter(f => f.raceName),
    Half: feats.filter(f => f.ability)
  };

  Object.keys(categories).forEach(cat => 
    {
    const btn = document.createElement("button");
    btn.textContent = cat;

    btn.onclick = () => renderFeatList(categories[cat]);

    document.getElementById(featControlsID).appendChild(btn);
  });
}

function renderFeatList(feats) {
  CleanContainer(featListID);

  feats.forEach(feat => {

    const btn = document.createElement("button");
    btn.textContent = feat.name;
    btn.style.display = "block";

    if (isFeatSelected(feat)) 
    {
      btn.classList.add("selected");
    }

    btn.onclick = () => toggleFeat(feat,btn);
    btn.style.backgroundColor = "LightGray";

    document.getElementById(featListID).appendChild(btn);
  });
}

function toggleFeat(feat,btn) 
{
  const idx = CharacterState.feats.findIndex(f =>
    f.name === feat.name && f.source === feat.source
  );

  if (idx >= 0) 
  {
    CharacterState.feats.splice(idx, 1);
    btn.style.backgroundColor = "LightGray";

  } 
  else 
    {
      btn.style.backgroundColor = "green";
      CharacterState.feats.push({
      name: feat.name,
      source: feat.source,
    });
  }

  UpdateFeatHeader();
}

function isFeatSelected(feat) {
  return CharacterState.feats.some(f =>
    f.name === feat.name && f.source === feat.source
  );
}
