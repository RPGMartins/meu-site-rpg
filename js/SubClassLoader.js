var subClassListID = "subClassSection";
var subClassInfoID = "subClassInfo"

var selectedSubClass = null;

function CleanSubClass()
{
    CleanContainer(subClassListID);
    CleanContainer(subClassInfoID);
}

function RenderSubClassList(subcls) 
{
    CleanSubClass();
    const container = document.getElementById(subClassListID);
    OrganizeSubclasses(subcls).forEach(sc => 
    {
        const btn = document.createElement("button");
        btn.textContent = sc.name;
        btn.style.display = "block";
        btn.style.backgroundColor = "LightGray";

        btn.onclick = () => 
        {
            CleanContainer(subClassInfoID);
            RenderSubClassDetails(sc,btn)
        };

    container.appendChild(btn);
    });
}


function RenderSubClassDetails(subcls,btn) 
{
    var subclass;
    var source = "One";
    
    if(subcls.classic)
    {
        subclass = subcls.classic;
        source = subclass.source;
    }
    else
    {
        subclass = subcls.one;
    }

    if(CharacterState.subclass)
    {
        selectedSubClass.style.backgroundColor = "LightGray";

        if(CharacterState.subclass.name == subcls.name && CharacterState.subclass.source == subcls.source)
        {
            CharacterState.subclass = null;
            UpdateClassHeader();
            return;
        }
    }

    const div = document.createElement("h2");
    div.style.marginTop = "20px";
    div.innerHTML = `
        <h3>${subcls.name}</h3>
        <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(source)}</p>
    `;
    const container = document.getElementById(subClassInfoID);

    btn.style.backgroundColor = "green";
    CharacterState.subclass = subcls;
    selectedSubClass = btn;
    UpdateClassHeader();
    container.appendChild(div);
}

function OrganizeSubclasses(subclasses) {
  const map = new Map();

  subclasses.forEach(sc => 
    {
        if (sc._copy) return;

        const key = `${sc.name}|${sc.className}`;

        if (!map.has(key)) 
        {
            map.set(key, 
            {
                name: sc.name,
                className: sc.className,
                classic: null,
                one: null
            });
        }

        if (sc.edition === "one") 
        {
            map.get(key).one = sc;
        } 
        else
        {
            map.get(key).classic = sc;
        }
    });

  return [...map.values()];
}
