import { ALL_RACES } from "../data/dataRegistry.js";
import { fillSelect } from "./uiUtils.js";
import { getSourceDisplayName } from "../data/sourceNames.js";
import { raceSelected, raceEditionSelected,  raceSourceSelected,  subRaceSelected} from "../state/characterState.js";

  let raceEditionSelect;
  let raceSourceSelect;
  let raceSelect;
  let subRaceSelect;

export function initRaceSelection()
{
  raceEditionSelect  = document.getElementById("EditionSelect");
  raceSourceSelect   = document.getElementById("raceSourceSelect");
  raceSelect         = document.getElementById("raceSelect");
  subRaceSelect      = document.getElementById("subRaceSelect");

  raceEditionSelect.addEventListener("change", () => {
    editionSelectedEvent(raceEditionSelect.value);
  });

  raceSourceSelect.addEventListener("change", () => {
    sourceSelectedEvent(
      raceEditionSelect.value,
      raceSourceSelect.value
    );
  });

  raceSelect.addEventListener("change", () => {
    raceSelectedEvent(
      raceEditionSelect.value,
      raceSourceSelect.value,
      raceSelect.value
    );
  });

  subRaceSelect.addEventListener("change", () => {
    subRaceSelectedEvent(subRaceSelect.value);
  });
}

export function initRaceUI() {
  const editions = Object.keys(ALL_RACES);

  fillSelect(raceEditionSelect, editions);
  fillSelect(raceSourceSelect, []);
  fillSelect(raceSelect, []);
  fillSelect(subRaceSelect, []);
}

// ===============================
// LOAD CHARACTER
// ===============================

export function loadRace(raceState) {
  raceEditionSelect.value = raceState.edition;
  editionSelectedEvent(raceState.edition);

  raceSourceSelect.value = raceState.source;
  sourceSelectedEvent(raceState.edition, raceState.source);

  raceSelect.value = raceState.race;
  raceSelectedEvent(
    raceState.edition,
    raceState.source,
    raceState.race
  );

  subRaceSelect.value = raceState.subRace;
  subRaceSelectedEvent(raceState.subRace);
}

// ===============================
// HANDLERS
// ===============================

function editionSelectedEvent(edition) {
  fillSelect(raceSourceSelect, []);
  fillSelect(raceSelect, []);
  fillSelect(subRaceSelect, []);

  if (!edition) return;

  const sources = Object.keys(ALL_RACES[edition] ?? {});

  const sourceOptions = sources.map(src => ({
    value: src,
    label: `${src} — ${getSourceDisplayName(src)}`
  }));

  fillSelect(raceSourceSelect, sourceOptions);

  raceEditionSelected(edition);
}

function sourceSelectedEvent(edition, source) {
  fillSelect(raceSelect, []);
  fillSelect(subRaceSelect, []);

  if (!edition || !source) return;

  const races = Object.keys(
    ALL_RACES?.[edition]?.[source] ?? {}
  );

  fillSelect(raceSelect, races);
  raceSourceSelected(source);
}

function raceSelectedEvent(edition, source, raceKey) {
  fillSelect(subRaceSelect, []);

  if (!edition || !source || !raceKey) return;

  const subraces =
    ALL_RACES?.[edition]?.[source]?.[raceKey]?.subraces;

  fillSelect(subRaceSelect, Object.keys(subraces ?? {}));
  raceSelected(raceKey);
}

function subRaceSelectedEvent(subraceKey) {
  if (!subraceKey) return;
  subRaceSelected(subraceKey);
}
