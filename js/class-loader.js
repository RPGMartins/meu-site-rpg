async function loadClasses() {
  const res = await fetch("./data/class/index.json");
  const data = await res.json();

  console.log("Classes disponíveis:", data.class);

  data.class.forEach(cls => {
    const div = document.createElement("div");
    div.textContent = `${cls.name} – ${Parser.sourceJsonToAbv(cls.source)}`;
    document.body.appendChild(div);
  });
}

loadClasses();
