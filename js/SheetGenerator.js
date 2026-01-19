async function gerarFichaHTML() {
  const res = await fetch("./ficha/ficha.html");
  let html = await res.text();


  const classKey = CharacterState.class.name.toLowerCase();

  var textclass = await GetClass(classKey);
  var textRace = await GetRace(CharacterState.race);

  html = html
  .replace("{{CLASSE}}", textclass || "—")
  .replace("{{RACA}}", textRace || "—");

  baixarArquivo(html, "ficha_personagem.html");
}


async function GetClass(classKey) {
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

  return traits.map(trait => {
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
}