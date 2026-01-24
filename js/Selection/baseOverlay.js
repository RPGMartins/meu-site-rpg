import { render5e } from "../parse/render5e.js";

export function renderFeatures(features) {
  if(!features)
    return "";

  return features.map(f => render5e(f)).join("");
}
