import { initClassLoader } from "./ClassLoader.js";
import { initClassUI } from "./Selection/classSelection.js";

await initClassLoader();
initClassUI();