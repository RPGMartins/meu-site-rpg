import { openClassOverlay } from "../ui/overlay.js";
import { CharacterState } from "../state/characterState.js";
import {ALL_FEATS, VIRTUAL_SOURCES} from "../data/dataRegistry.js";
import { renderFeatures } from "./baseOverlay.js";
import {renderFeatMeta} from "../feature/renderFeature.js";

export function showFeatsDetailsOverlay()
{
  const featsState = CharacterState.generalFeats;

  if (!featsState.feats || featsState.feats.length === 0)
    return;

  let html = "";

  featsState.feats.forEach(featKey => {

    let sourceTouse = featsState.source;

    if(!featsState.source || featsState.source == VIRTUAL_SOURCES.ALL|| featsState.source == VIRTUAL_SOURCES.ALL_BASE|| featsState.source == VIRTUAL_SOURCES.ALL_HOMEBREW)
    {
      sourceTouse = featKey.source;
    }

    const feat =
      ALL_FEATS
        ?.[featsState.edition]
        ?.[sourceTouse]
        ?.[featKey.featName];

    if (!feat)
      return;
    let abilityText = "";
    if(feat.ability)
    {
      abilityText = abilityToDisplayString(feat.ability);
    }

    html += `
      <h3>${feat.name}</h3>
      <p><strong>Fonte:</strong> ${feat.source}</p>

      <hr>
      ${renderFeatMeta(feat)}
      ${prepareFeatFeatures(feat)}

      <hr>
    `;
  });

  openClassOverlay("Feats", html);
}

function prepareFeatFeatures(feat)
{
  if (!feat.entries)
    return "";

  return renderFeatures(feat.entries);
}

function formatAbility(abbr) {
  const map = {
    str: "Força",
    dex: "Destreza",
    con: "Constituição",
    int: "Inteligência",
    wis: "Sabedoria",
    cha: "Carisma"
  };

  return map[abbr] ?? abbr;
}
function abilityToDisplayString(ability) {
  if (!Array.isArray(ability)) return "";

  const parts = [];

  ability.forEach(block => {
    if (!block.choose) return;

    const { amount, from } = block.choose;
    if (!amount || !Array.isArray(from)) return;

    const abilities = from.map(formatAbility).join(" ou ");

    parts.push(`• Aumente ${amount} atributo: ${abilities}`);
  });

  return parts.join("\n");
}