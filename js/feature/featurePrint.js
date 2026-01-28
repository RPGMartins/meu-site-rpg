import {
    getBackground,
    getClass,
    getClassFeatures,
    getRace,
    getRaceFeatures, getSubClass,
    getSubclassFeatures,
    getSubrace,
    getSubraceFeatures
} from "../data/dataRegistry.js";

import { CharacterState } from "../state/characterState.js";

/* =========================================================
 * RESOLVE PRINTABLE DATA (STRUCTURED)
 * ======================================================= */
export function resolvePrintableFeatures() {

    /* ================= BASE OBJECTS ================= */
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

    /* ================= FEATURE POOLS ================= */
    const classFeatures = getClassFeatures(
        CharacterState.generalClass.class,
        CharacterState.generalClass.edition,
        CharacterState.generalClass.source
    );

    const subclassRaceFeatures = [
        ...getSubclassFeatures(
            CharacterState.generalClass.class,
            CharacterState.generalClass.edition,
            CharacterState.generalClass.source,
            CharacterState.generalClass.subclass
        ),
        ...getRaceFeatures(
            CharacterState.generalRace.race,
            CharacterState.generalRace.edition,
            CharacterState.generalRace.source
        ),
        ...getSubraceFeatures(
            CharacterState.generalRace.race,
            CharacterState.generalRace.edition,
            CharacterState.generalRace.source,
            CharacterState.generalRace.subRace
        )
    ];

    const featPool = CharacterState.generalFeats.feats ?? [];

    /* ================= SELECTED FEATURES ================= */
    const selectedClassFeatures = CharacterState.generalPrint.classFeatures
        .map(i => classFeatures[i])
        .filter(Boolean);

    const selectedSubclassFeatures = CharacterState.generalPrint.subclassFeatures
        .map(i => subclassRaceFeatures[i])
        .filter(Boolean);

    const selectedBackgroundFeatures =
        CharacterState.generalPrint.background && backgroundBase
            ? [backgroundBase]
            : [];

    const selectedFeatFeatures = featPool.filter(
        feat => CharacterState.generalPrint.feats?.[feat.featName]
    );

    /* ================= FINAL OBJECT ================= */
    return {
        /* Bases */
        classBase,
        subClassBase: subclassBase,
        raceBase,
        subRaceBase,
        bgBase: backgroundBase,

        /* Selected Features */
        classFeatures: selectedClassFeatures,
        subclassFeatures: selectedSubclassFeatures,
        bgFeatures: selectedBackgroundFeatures,
        featFeatures: selectedFeatFeatures
    };
}
