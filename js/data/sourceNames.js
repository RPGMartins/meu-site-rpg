 const SOURCE_NAMES = {
    PHB: "Player’s Handbook",
    MM: "Monster Manual",
    DMG: "Dungeon Master’s Guide",

    Screen: "Dungeon Master’s Screen",
    ScreenDungeonKit: "Dungeon Master’s Screen: Dungeon Kit",
    ScreenWildernessKit: "Dungeon Master’s Screen: Wilderness Kit",
    ScreenSpelljammer: "Dungeon Master’s Screen: Spelljammer",

    SCAG: "Sword Coast Adventurer’s Guide",

    "PS-Z": "Plane Shift: Zendikar",
    "PS-I": "Plane Shift: Innistrad",
    "PS-K": "Plane Shift: Kaladesh",
    "PS-A": "Plane Shift: Amonkhet",
    "PS-X": "Plane Shift: Ixalan",
    "PS-D": "Plane Shift: Dominaria",

    AL: "Adventurers League",
    SAC: "Sage Advice Compendium",

    VGM: "Volo’s Guide to Monsters",
    MTF: "Mordenkainen’s Tome of Foes",
    MPMM: "Mordenkainen Presents: Monsters of the Multiverse",

    XGE: "Xanathar’s Guide to Everything",
    TCE: "Tasha’s Cauldron of Everything",
    FTD: "Fizban’s Treasury of Dragons",
    SCC: "Strixhaven: Curriculum of Chaos",
    VRGR: "Van Richten’s Guide to Ravenloft",
    BGG: "Bigby Presents: Glory of the Giants",

    GGR: "Guildmasters’ Guide to Ravnica",
    ERLW: "Eberron: Rising from the Last War",
    EGW: "Explorer’s Guide to Wildemount",
    MOT: "Mythic Odysseys of Theros",

    AI: "Acquisitions Incorporated",
    AAG: "Astral Adventurer’s Guide",
    BAM: "Boo’s Astral Menagerie",
    DoD: "Domains of Delight",
    MaBJoV: "Minsc and Boo’s Journal of Villainy",

    OGA: "One Grung Above",
    AWM: "Adventure with Muk",
    RMR: "The Rise of Modron",
    HF: "Heroes’ Feast",
    MGELFT: "Muk’s Guide to Everything He Learned from Tasha",
    TD: "Tyranny of Dragons",

    SatO: "Sigil and the Outlands",
    MPP: "Monstrous Planar Parade",
    AATM: "Atlas of the Astral Multiverse",
    "HAT-TG": "Honor Among Thieves: Thieves’ Gallery",
    HFFotM: "Heroes’ Feast: Flavors of the Multiverse",
    BMT: "Book of Many Things",
    DMTCRG: "Dungeon Master’s Toolkit: Creature Reference Guide",

    MCV4EC: "Monstrous Compendium Vol. 4: Eldraine Creatures",

    XPHB: "Player’s Handbook (2024)",
    EFA: "Unearthed Arcana: Expert Classes",
    FRHof: "Forgotten Realms: Heroes of the Forgotten Realms"
  };

export function getSourceDisplayName(source) {
  return SOURCE_NAMES[source] ?? source;
}
