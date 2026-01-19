async function gerarFichaHTML() {
  const res = await fetch("./ficha/ficha.html");
  let html = await res.text();

  var textclass = await GetClass();
  var textSubclass = await GetSubclass();
  var textRace = await GetRace(CharacterState.race);
  var textSubrace = await GetSubrace(CharacterState.subrace);
  var textBackground = GetBackground(CharacterState.background,true,true); //Pra tabela aparecer é necessario que o segundo e terceiro seja true
  var featsHTML = GetFeats(CharacterState.feats);

  html = html
  .replace("{{CLASSE}}", textclass || "—")
  .replace("{{SUBCLASSE}}", textSubclass || "—")
  .replace("{{RACA}}", textRace + textSubrace || "—")
  .replace("{{BACKGROUND}}", textBackground || "—")
  .replace("{{FEATS}}", featsHTML || "—");


  baixarArquivo(html, "ficha_personagem.html");
}

function GetBackground(selectedBackground,Characteristics,Table)
{
  if(!CharacterState.background)
  {
    return "";
  }
  const bg = ALL_BACKGROUNDS.find(b =>
  b.name === selectedBackground.name &&
  b.source === selectedBackground.source
  );

  const entries = bg.entries;
  if (!entries || entries.length === 0) return "";

  return entries.map(entry => renderBgEntry(entry,Characteristics,Table)).join("");
}

async function GetSubclass() {
  if (!CharacterState.subclass || !CharacterState.class) {
    return "";
  }

  const classKey = CharacterState.class.name.toLowerCase();
  const subclass = CharacterState.subclass;

  const file = ALL_CLASSES_INDEX[classKey];
  if (!file) return "";

  const res = await fetch(`./data/class/${file}`);
  const data = await res.json();

  const subclassFeatures = data.subclassFeature?.filter(f =>
    f.subclassShortName === subclass.shortName &&
    f.subclassSource === subclass.source
  );

  if (!subclassFeatures || subclassFeatures.length === 0) return "";

  const blocks = collectEntriesText(subclassFeatures);

  return `
    <div class="subclass-block">
      <h2>${subclass.name}</h2>
      ${blocks.map(parse5eText).join("\n")}
    </div>
  `;
}


function renderFeat(feat) {
  const body = feat.entries
    ? feat.entries.map(e => renderFeatEntry(e)).join("")
    : "";

  return `
    <div class="feat-block">
      <h3>${feat.name}</h3>
      ${body}
    </div>
  `;
}

function GetFeats(featRefs) {
  if (!featRefs || featRefs.length === 0) {
    return "<p>—</p>";
  }

  return featRefs.map(ref => {
    const feat = getFeatData(ref);
    if (!feat) return "";

    return renderFeat(feat);
  }).join("");
}

function getFeatData(featRef) {
  return ALL_FEATS.find(f =>
    f.name === featRef.name &&
    f.source === featRef.source
  );
}


function renderFeatEntry(entry) {
  // Texto simples
  if (typeof entry === "string") {
    return `<p>${parse5eText(entry)}</p>`;
  }

  // Item nomeado (como Ambitious Magic)
  if (entry.type === "item") {
    const body = entry.entries
      ? entry.entries.map(e => renderFeatEntry(e)).join("")
      : "";

    return `
      <div class="feat-item">
        <strong>${entry.name}.</strong>
        ${body}
      </div>
    `;
  }

  // Lista
  if (entry.type === "list") {
    return `
      <ul class="feat-list">
        ${entry.items.map(i => `
          <li>${renderFeatEntry(i)}</li>
        `).join("")}
      </ul>
    `;
  }

  // Entries genérico
  if (entry.type === "entries") {
    const body = entry.entries
      ? entry.entries.map(e => renderFeatEntry(e)).join("")
      : "";

    return `
      <div class="feat-sub">
        ${entry.name ? `<strong>${entry.name}</strong>` : ""}
        ${body}
      </div>
    `;
  }

  return "";
}



function renderBgEntry(entry,Characteristics,Table) {
  // Texto simples
  if (typeof entry === "string") {
    return `<p>${parse5eText(entry)}</p>`;
  }

  // Lista (Skill / Languages / Equipment)
  if (entry.type === "list") {
    return `
      <div class="bg-section">
        ${entry.items.map(item => `
          <p>
            <strong>${item.name}</strong>
            ${parse5eText(item.entry)}
          </p>
        `).join("")}
      </div>
    `;
  }

  if(Characteristics == true){
    // Bloco com nome (Feature, Suggested Characteristics)
    if (entry.type === "entries") {
      const body = entry.entries
        ? entry.entries.map(e => renderBgEntry(e,Characteristics,Table)).join("")
        : "";

      return `
        <div class="bg-section">
          ${entry.name ? `<h3>${entry.name}</h3>` : ""}
          ${body}
        </div>
      `;
    }
  }

  if(Table == true){
    // Tabela
    if (entry.type === "table") {
      return renderBgTable(entry);
    }
  }

  return "";
}

function renderBgTable(table) {
  const headers = table.colLabels || [];

  return `
    <table class="bg-table">
      <thead>
        <tr>
          ${headers.map(h => `<th>${h}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${table.rows.map(row => `
          <tr>
            ${row.map(cell => `<td>${parse5eText(cell)}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}



async function GetClass() {
  if(!CharacterState.class)
  {
    return;
  }

  var classKey = CharacterState.class.name.toLowerCase();
  let finalText = "";
  const file = ALL_CLASSES_INDEX[classKey];

  if (file) {
    const res = await fetch(`./data/class/${file}`);
    const data = await res.json();

    const classFeature = data.classFeature;
    const blocks = collectEntriesText(classFeature);

    finalText = blocks.map(parse5eText).join("\n");
  }

  return finalText;
}

function renderBackgroundEntries(entries) {
  if (!entries || entries.length === 0) return "";

  return entries.map(entry => {
    // Caso simples: string
    if (typeof entry === "string") {
      return `<p>${parse5eText(entry)}</p>`;
    }

    // Caso objeto com nome + entries
    if (typeof entry === "object") {
      const body = entry.entries
        ? entry.entries.map(e =>
            typeof e === "string"
              ? parse5eText(e)
              : parse5eText(e.entries?.join(" ") ?? "")
          ).join(" ")
        : "";

      return `
        <p>
          ${entry.name ? `<strong>${entry.name}:</strong> ` : ""}
          ${body}
        </p>
      `;
    }

    return "";
  }).join("");
}

function GetSubRacesFor(raceName,raceSource,nameRace) {
  return ALL_SUBRACES.filter(sr =>
    sr.name === raceName &&
    sr.raceSource === raceSource &&
    sr.raceName === nameRace
  );
}

async function GetSubrace(subrace) {
  
  var finalText="";
  
  if(subrace)
  { 
      var subRaceEntries = GetSubRacesFor(subrace.name,subrace.source,subrace.raceName)      
      finalText =  renderTraits(subRaceEntries[0].entries);
  }

  return finalText;
}

async function GetRace(race) {

  var finalText="";

  if(race)
  {
    ALL_RACES["race"].forEach(element => 
    {
      if(element.source == race.source && element.name == race.name)
      {
        finalText =  renderTraits(element.entries);
      }
    });
  }

  return finalText;
}



function baixarArquivo(conteudo, nomeArquivo) {
  const blob = new Blob([conteudo], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  a.click();

  URL.revokeObjectURL(url);
}


function collectEntriesText(entry, output = []) {
  if (!entry) return output;

  // string simples
  if (typeof entry === "string") {
    output.push(`<p class="class-sub-entry">${entry}</p>`);
    return output;
  }

  // array
  if (Array.isArray(entry)) {
    entry.forEach(e => collectEntriesText(e, output));
    return output;
  }

  // objeto
  if (typeof entry === "object") {
    if (entry.name && entry.entries) {
      const body = [];
      collectEntriesText(entry.entries, body);

      // TEM nível → feature principal
      if (entry.level !== undefined) {
        output.push(
          `<p class="class-feature">
            <strong>${entry.name} (${entry.level}):</strong>
            ${body.join(" ")}
          </p>`
        );
      }
      // NÃO tem nível → sub-bloco
      else {
        output.push(
          `<p class="class-sub-entry">
            <strong>${entry.name}:</strong>
            ${body.join(" ")}
          </p>`
        );
      }

      return output;
    }

    // objeto sem nome
    if (entry.entries) {
      collectEntriesText(entry.entries, output);
      return output;
    }
  }

  return output;
}



function parse5eText(text) {
  if (!text) return "";
  return text.replace(/\{@(\w+)\s([^}]+)\}/gi, (match, tag, content) => {
    return render5eTag(tag.toLowerCase(), content);
  });
}


function render5eTag(tag, content) {
  const parts = content.split("|");

  switch (tag) {
    case "damage":
    case "dice":
      return `<strong>${parts[0]}</strong>`;

    case "skill":
      return `<strong>${capitalize(parts[0])}</strong>`;

    case "ability":
      return `<strong>${abilityToFullName(parts[0])}</strong>`;

    case "spell":
    case "item":
    case "feat":
      return `<strong>${parts[0]}</strong>`;

    case "condition":
      return `<strong>${parts[0]}</strong>`;

    case "variantrule":
      return `<em>${parts[0]}</em>`;

    case "filter":
      // Ex: {@filter Bard spell list|spells|class=Bard}
      return `<strong>${parts[0]}</strong>`;

    case "i": // itálico
      return `<em>${parts[0]}</em>`;

    case "b": // negrito
      return `<strong>${parts[0]}</strong>`;

    default:
      // fallback: remove a tag, mantém o texto humano
      return parts[0];
  }
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function abilityToFullName(abbr) {
  const map = {
    str: "Strength",
    dex: "Dexterity",
    con: "Constitution",
    int: "Intelligence",
    wis: "Wisdom",
    cha: "Charisma"
  };
  return map[abbr.toLowerCase()] ?? abbr;
}



function renderTraits(traits) {
  if (!traits || traits.length === 0) return "";

  const content = traits.map(trait => {
    const entriesText = Array.isArray(trait.entries)
      ? parse5eText(trait.entries.join(" "))
      : parse5eText(trait.entries ?? "");

    return `
      <p>
        <strong>${trait.name}:</strong>
        ${entriesText}
      </p>
    `;
  }).join("");

  return `
    <div class="trait-box">
      ${content}
    </div>
  `;
}
