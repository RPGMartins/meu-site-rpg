var classListID    = "classGeneral";
var classInfoID    = "classInfo";

let ALL_CLASSES_INDEX = null;

let classButtons = []; // { key, btn }
let selectedClassBtn = null;

(async function initClassLoader() {
  ALL_CLASSES_INDEX = await loadClassesIndex();
  renderClassList(ALL_CLASSES_INDEX);
})();



async function loadClassesIndex() {
  const res = await fetch("./data/class/index.json");
  return await res.json();
}


function renderClassList(classIndex) {
  CleanContainer(classListID);
  classButtons = [];

  const container = document.getElementById(classListID);

  Object.keys(classIndex).forEach(key => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.style.display = "block";

    clearClassButton(btn);

    btn.onclick = () => onClassClicked(classIndex, key, btn);

    container.appendChild(btn);
    classButtons.push({ key, btn });
  });

  syncClassButtonsFromState();
}

async function onClassClicked(index, key, btn) {
  CleanContainer(classInfoID);

  const file = index[key];
  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();

  const cls = data.class[0];
  const subcls = data.subclass;

  // Toggle off
  if (
    CharacterState.class &&
    CharacterState.class.name === cls.name &&
    CharacterState.class.source === cls.source
  ) {
    CharacterState.class = null;
    CharacterState.subclass = null;
    CharacterState.classFeature = null;

    ClearAllBackgroundButtonsClass();
    RenderClassDetails(null, null);
    UpdateClassHeader();
    return;
  }

  // Select new class
  CharacterState.classFeature = data.classFeature;
  CharacterState.class = cls;
  CharacterState.subclass = null;

  ClearAllBackgroundButtonsClass();
  markClassButton(btn);

  selectedClassBtn = btn;

  RenderClassDetails(cls, subcls);
  UpdateClassHeader();
}

function clearClassButton(btn) {
  if (!btn) return;
  btn.style.backgroundColor = "LightGray";
}
function markClassButton(btn) {
  if (!btn) return;
  btn.style.backgroundColor = "green";
}
function ClearAllBackgroundButtonsClass() {
  classButtons.forEach(({ btn }) => clearClassButton(btn));
  selectedClassBtn = null;
}
function syncClassButtonsFromState() {
  if (!CharacterState.class) {
    ClearAllBackgroundButtonsClass();
    return;
  }

  classButtons.forEach(({ key, btn }) => {
    if (key === CharacterState.class.name) {
      markClassButton(btn);
      selectedClassBtn = btn;
    } else {
      clearClassButton(btn);
    }
  });
}

function RenderClassDetails(cls, subcls) {
  CleanSubClass();
  CleanContainer(classInfoID);

  if (!cls) return;

  let hitDice = "—";
  if (cls.hd && cls.hd.faces) {
    hitDice = `d${cls.hd.faces}`;
  }

  const div = document.createElement("div");
  div.style.marginTop = "20px";
  div.innerHTML = `
    <h3>${cls.name}</h3>
    <p><strong>Hit Dice:</strong> ${hitDice}</p>
    <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(cls.source)}</p>
  `;

  document.getElementById(classInfoID).appendChild(div);

  RenderSubClassList(subcls);
}
