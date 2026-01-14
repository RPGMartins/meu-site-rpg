function renderSubClassList(subcls) 
{
    const subclassTitle = "subClassTitle" 

    Clean(subclassTitle);

    const title = document.createElement(subclassTitle);
    title.textContent = "Sub Classes disponíveis";
    document.body.appendChild(title);


    organizeSubclasses(subcls).forEach(sc => 
    {

    });

}


function organizeSubclasses(subclasses) {
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
