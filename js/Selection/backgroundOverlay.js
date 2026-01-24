import { openClassOverlay } from "../ui/overlay.js";
import { CharacterState } from "../state/characterState.js";
import { ALL_BACKGROUNDS } from "../data/dataRegistry.js";
import { renderRaceFeatures } from "./baseOverlay.js";

export function showBackgroundDetailsOverlay()
{
  const bgState = CharacterState.generalBackground;

  if (!bgState.background)
    return;

  const bg =
    ALL_BACKGROUNDS
      ?.[bgState.edition]
      ?.[bgState.source]
      ?.[bgState.background];

  if (!bg)
    return;

  let html = `
    <p><strong>Background:</strong> ${bg.name}</p>
    <p><strong>Fonte:</strong> ${bg.source}</p>

    <hr>

    ${prepareBackgroundFeatures(bg)}
  `;

  openClassOverlay(bg.name, html);
}

function prepareBackgroundFeatures(background)
{
  if (!background.entries)
    return "";

  return renderRaceFeatures(background.entries);
}
