var subclassTitleID = "subClassSelection" ;
var subclasStatick = "subClass-details" ;


function RenderSubClassList(subcls) 
{
    CleanContainer(subclasStatick);
    CleanContainer(subclassTitleID);

    const title = document.createElement("h3");
    title.textContent = "Sub Classes disponíveis";
    const container = document.getElementById(subclasStatick);

    container.appendChild(title);


    OrganizeSubclasses(subcls).forEach(sc => 
    {
        const btn = document.createElement("button");
        btn.textContent = sc.name;
        btn.style.display = "block";

        btn.onclick = () => 
        {
            CharacterState.subclass = sc;
            updateClassHeader();
            
            CleanContainer(subclassTitleID);
            RenderSubClassDetails(sc)
        };

    container.appendChild(btn);
    });
}


function RenderSubClassDetails(subcls) 
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

    console.log("AA" +subclass)
    const div = document.createElement("h2");
    div.style.marginTop = "20px";
    div.innerHTML = `
        <h3>${subcls.name}</h3>
        <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(source)}</p>
    `;
    const container = document.getElementById(subclassTitleID);

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
