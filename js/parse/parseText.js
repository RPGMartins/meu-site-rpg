export function parse5eText(text) {
  if (!text) return "";

  return text.replace(/\{@(\w+)\s([^}]+)\}/gi, (match, tag, content) => {
    if (!content) return "";
    return render5eTag(tag.toLowerCase(), content);
  });
}

function render5eTag(tag, content) {
  const [label] = content.split("|");

  switch (tag) {
    case "damage":
    case "dice":
    case "hit":
    case "d20":
      return `<strong>${label}</strong>`;

    case "skill":
      return `<strong>${capitalize(label)}</strong>`;

    case "ability":
      return `<strong>${abilityToFullName(label)}</strong>`;

    case "spell":
    case "item":
    case "feat":
    case "race":
    case "class":
      return `<strong>${label}</strong>`;

    case "condition":
      return `<strong>${capitalize(label)}</strong>`;

    case "variantrule":
    case "i":
      return `<em>${label}</em>`;

    case "b":
      return `<strong>${label}</strong>`;

    case "filter":
      return `<strong>${label}</strong>`;

    default:
      return label;
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
