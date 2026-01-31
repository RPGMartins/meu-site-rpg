import {
    getBackground,
    getClass,
    getClassFeatures, getFeat,
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

    const subclassFeatures = getSubclassFeatures(
        CharacterState.generalClass.class,
        CharacterState.generalClass.subclass,
        CharacterState.generalClass.edition,
        CharacterState.generalClass.source,
    );

    const subclassRaceFeatures = [
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

    var featPool = [];
    for (const feat of CharacterState.generalFeats.feats)
    {
        var x = getFeat(feat.featName,CharacterState.generalFeats.edition,feat.source);
        if(!x)
        {
            continue;
        }
        featPool.push(x);

    }

    /* ================= SELECTED FEATURES ================= */
    const selectedClassFeatures = CharacterState.generalPrint.classFeatures
        .map(i => classFeatures[i])
        .filter(Boolean);

    const selectedSubClassFeatures = CharacterState.generalPrint.subclassFeatures
        .map(i => subclassFeatures[i])
        .filter(Boolean);

    const selectedRaceFeatures = CharacterState.generalPrint.subclassFeatures
        .map(i => subclassRaceFeatures[i])
        .filter(Boolean);

    const selectedBackgroundFeatures =
        CharacterState.generalPrint.background && backgroundBase
            ? [backgroundBase]
            : [];

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
        subclassFeatures: selectedSubClassFeatures,
        raceFeatures: selectedRaceFeatures,
        bgFeatures: selectedBackgroundFeatures,
        featFeatures: featPool
    };
}
