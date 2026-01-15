var classTitleID = "classSelection";
var classStatick = "class-details";
(
  async function init() 
  {
    const index = await loadClassIndex();
    renderClassList(index);
  }
)();


async function loadClassIndex() 
{
  const res = await fetch("./data/class/index.json");
  const index = await res.json();
  return index;
}

function renderClassList(classIndex) 
{
  const title = document.createElement("h2");
  title.textContent = "Classes disponíveis";
  const container = document.getElementById(classStatick);
  container.appendChild(title);

  
  Object.keys(classIndex).forEach(key => 
  {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.style.display = "block";

    console.log("ID: "+btn.id);

    btn.onclick = () => 
      {
        CleanContainer(classTitleID);
        LoadSubClass(key)
      };

    container.appendChild(btn);
  });
}


async function LoadSubClass(key) 
{
  const index = await loadClassIndex();
  const file = index[key];

  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();

  const cls = data.class[0];
  const subcls = data.subclass;

  RenderClassDetails(cls,subcls);
}


function RenderClassDetails(cls,subcls) 
{
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
  const container = document.getElementById(classTitleID);
  container.appendChild(div);

  RenderSubClassList(subcls);
}
