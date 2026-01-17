var classListID    = "classGeneral";
var classInfoID    = "classInfo";

var selectedClass = null;

(
  async function init() 
  {
    const index = await loadRacesIndex();
    renderClassList(index);
  }
)();


async function loadRacesIndex() 
{
  const res = await fetch("./data/class/index.json");
  const index = await res.json();
  return index;
}

function renderClassList(classIndex) 
{
  CleanContainer(classListID);
  const container = document.getElementById(classListID);

  
  Object.keys(classIndex).forEach(key => 
  {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.style.display = "block";
    btn.style.backgroundColor = "LightGray";

    btn.onclick = () => 
      {

        CleanContainer(classInfoID);
        LoadSubClass(classIndex,key,btn)
      };

    container.appendChild(btn);
  });
}


async function LoadSubClass(index,key,btn) 
{
  const file = index[key];

  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();

  const cls = data.class[0];
  const subcls = data.subclass;


  if(CharacterState.class)
  {
    selectedClass.style.backgroundColor = "LightGray";

    if(CharacterState.class.name == cls.name && CharacterState.class.source == cls.source)
    {
      CharacterState.class = null;
      CharacterState.subclass = null;
      RenderClassDetails(null,null);
      UpdateClassHeader();
      return;
    }
  }

  CharacterState.class = cls;
  CharacterState.subclass = null;
  btn.style.backgroundColor = "green";
  selectedClass = btn;
  RenderClassDetails(cls,subcls);
  UpdateClassHeader();
}


function RenderClassDetails(cls,subcls) 
{
  CleanSubClass();
  CleanContainer(classInfoID);

  if(cls == null)
  {
    return;
  }

  let hitDice = "—";

  if (cls.hd && cls.hd.faces) 
  {
    hitDice = `d${cls.hd.faces}`;
    
  }


  const div = document.createElement("h2");
  div.style.marginTop = "20px";
  div.innerHTML = `
    <h3>${cls.name}</h3>
    <p><strong>Hit Dice:</strong> ${hitDice}</p>
    <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(cls.source)}</p>
  `;
  const container = document.getElementById(classInfoID);
  container.appendChild(div);

  RenderSubClassList(subcls);
}
