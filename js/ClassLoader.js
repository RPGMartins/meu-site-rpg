var classListID    = "classGeneral";
var classInfoID    = "classInfo";

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
  const title = document.createElement("h2");
  title.textContent = "Classes disponíveis";
  const container = document.getElementById(classListID);
  container.appendChild(title);

  
  Object.keys(classIndex).forEach(key => 
  {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.style.display = "block";

    console.log("ID: "+btn.id);

    btn.onclick = () => 
      {

        CleanContainer(classInfoID);
        LoadSubClass(classIndex,key)
      };

    container.appendChild(btn);
  });
}


async function LoadSubClass(index,key) 
{
  const file = index[key];

  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();

  const cls = data.class[0];
  const subcls = data.subclass;

  CharacterState.class = cls;
  CharacterState.subclass = null;
  UpdateClassHeader();

  RenderClassDetails(cls,subcls);
}


function RenderClassDetails(cls,subcls) 
{
  CleanContainer(classInfoID);
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
