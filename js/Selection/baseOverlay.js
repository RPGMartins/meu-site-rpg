import { parse5eText } from "../parse/parseText.js";

export function renderClassFeatures(classFeatures)
{
    if(!classFeatures)
        return "";
    var textToReturn = classFeatures.map(f => `
    <details class="class-feature">
      <summary class="class-feature-title">
        ${+ f.level + " :"+f.name}
      </summary>
      <div class="class-feature-body">
        ${parse5eText(f.entries.join(" "))}
      </div>
    </details>
  `).join("");

  return textToReturn;
} 

export function renderRaceFeatures(raceFeatures)
{
    if(!raceFeatures)
        return "";
    var textToReturn = raceFeatures.map(f => `
    <details class="class-feature">
      <summary class="class-feature-title">
        ${f.name}
      </summary>
      <div class="class-feature-body">
        ${parse5eText(f.entries.join(" "))}
      </div>
    </details>
  `).join("");

  return textToReturn;
} 