function RenderSubClassList(subcls) 
{
    const subclassTitle = "subClassTitle" 

    Clean(subclassTitle);

    const title = document.createElement(subclassTitle);
    title.textContent = "Sub Classes disponíveis";
    document.body.appendChild(title);


    OrganizeSubclasses(subcls).forEach(sc => 
    {
        const btn = document.createElement("button");
        btn.textContent = sc.name;
        btn.style.display = "block";

        btn.onclick = () => 
        {
            const tagName = "subClassSelection"

            Clean(tagName)
            RenderSubClassDetails(tagName,sc)
        };

    document.body.appendChild(btn);
    });
}


function RenderSubClassDetails(tagName,subcls) 
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
    const div = document.createElement(tagName);
    div.style.marginTop = "20px";
    div.innerHTML = `
        <h3>${subcls.name}</h3>
        <p><strong>Fonte:</strong> ${Parser.sourceJsonToAbv(source)}</p>
    `;

    document.body.appendChild(div);
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
