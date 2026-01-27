import { openClassOverlay } from "../ui/overlay.js";
import { CharacterState } from "../state/characterState.js";
import { ALL_FEATS } from "../data/dataRegistry.js";
import { renderFeatures } from "./baseOverlay.js";

export function showFeatsDetailsOverlay()
{
  const featsState = CharacterState.generalFeats;

  if (!featsState.feats || featsState.feats.length === 0)
    return;

  let html = "";

  featsState.feats.forEach(featKey => {

    const feat =
      ALL_FEATS
        ?.[featsState.edition]
        ?.[featsState.source]
        ?.[featKey.featName];
  debugger

    if (!feat)
      return;

    html += `
      <h3>${feat.name}</h3>
      <p><strong>Fonte:</strong> ${feat.source}</p>

      ${feat.prerequisite ? `
        <p><strong>Pré-requisito:</strong> ${feat.prerequisite}</p>
      ` : ""}

      <hr>

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
