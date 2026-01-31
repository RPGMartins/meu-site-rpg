import {
    getBackground,
    getClass,
    getClassFeatures,
    getFeat,
    getRace,
    getRaceFeatures,
    getSubClass,
    getSubclassFeatures,
    getSubrace,
    getSubraceFeatures
} from "../data/dataRegistry.js";

import { CharacterState } from "../state/characterState.js";

/* =========================================================
 * RESOLVE PRINTABLE DATA
 * ======================================================= */
export function resolvePrintableFeatures() {

    const classBase = getClass(
        CharacterState.generalClass.class,
        CharacterState.generalClass.edition,
        CharacterState.generalClass.source
    );

    const subclassBase = getSubClass(
        CharacterState.generalClass.class,
        CharacterState.generalClass.edition,
        CharacterState.generalClass.source,
        CharacterState.generalClass.subclass
    );

    const raceBase = getRace(
        CharacterState.generalRace.edition,
        CharacterState.generalRace.source,
        CharacterState.generalRace.race
    );

    const subRaceBase = getSubrace(
        CharacterState.generalRace.edition,
        CharacterState.generalRace.source,
        CharacterState.generalRace.race,
        CharacterState.generalRace.subRace
    );

    const backgroundBase = getBackground(
        CharacterState.generalBackground.edition,
        CharacterState.generalBackground.source,
        CharacterState.generalBackground.background
    );

    const classFeatures = getClassFeatures(
        CharacterState.generalClass.class,
        CharacterState.generalClass.edition,
        CharacterState.generalClass.source
    );

    const subclassFeatures = getSubclassFeatures(
        CharacterState.generalClass.class,
        CharacterState.generalClass.subclass,
        CharacterState.generalClass.edition,
        CharacterState.generalClass.source
    );

    const raceFeatures = [
        ...getRaceFeatures(
            CharacterState.generalRace.race,
            CharacterState.generalRace.edition,
            CharacterState.generalRace.source
        ),
        ...getSubraceFeatures(
            CharacterState.generalRace.race,
            CharacterState.generalRace.subRace,
            CharacterState.generalRace.edition,
            CharacterState.generalRace.source
        )
    ];

    /* ================= FEATS ================= */
    const featPool = CharacterState.generalFeats.feats
        .map(f => getFeat(f.featName, CharacterState.generalFeats.edition, f.source))
        .filter(Boolean);

    /* ================= SELECTED (ORDER SAFE) ================= */

    const selectedClassFeatures = extractSelected(
        classFeatures,
        CharacterState.generalPrint.classFeatures
    );

    const selectedSubClassFeatures = extractSelected(
        subclassFeatures,
        CharacterState.generalPrint.subclassFeatures
    );

    const selectedRaceFeatures = extractSelected(
        raceFeatures,
        CharacterState.generalPrint.subclassFeatures
    );

    const selectedBackgroundFeatures =
        CharacterState.generalPrint.background && backgroundBase
            ? [backgroundBase]
            : [];

    return {    
        classBase,
        subClassBase: subclassBase,
        raceBase,
        subRaceBase,
        bgBase: backgroundBase,

        classFeatures: selectedClassFeatures,
        subclassFeatures: selectedSubClassFeatures,
        raceFeatures: selectedRaceFeatures,
        bgFeatures: selectedBackgroundFeatures,
        featFeatures: featPool
    };
}

/* =========================================================
 * HELPERS
 * ======================================================= */
function extractSelected(featurePool, selectedIndexes = []) {
    if (!Array.isArray(featurePool) || !Array.isArray(selectedIndexes)) {
        return [];
    }

    return selectedIndexes
        .slice()              // não muta o state
        .sort((a, b) => a - b) // ORDEM REAL DAS FEATURES
        .map(i => featurePool[i])
        .filter(Boolean);
}
