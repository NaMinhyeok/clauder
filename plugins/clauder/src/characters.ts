import type { Rarity, Condition } from './constants.js';

export interface CharacterDef {
  id: string;
  name: string;
  art: Record<Rarity, Record<Condition, string[]>>;
}

// Helper to build a 4-line face from border style + eyes + mouth.
// border: [topLeft, topRight, bottomLeft, bottomRight, side]
// eyes and mouth must be exactly 5 chars each ([...str].length === 5).
// Result: every line is exactly 11 chars wide.
function face(
  border: [string, string, string, string, string],
  eyes: string,
  mouth: string,
): string[] {
  const [tl, tr, bl, br, sd] = border;
  return [
    `${tl}${'─'.repeat(9)}${tr}`,
    `${sd}  ${eyes}  ${sd}`,
    `${sd}  ${mouth}  ${sd}`,
    `${bl}${'─'.repeat(9)}${br}`,
  ];
}

const BORDER_COMMON: [string, string, string, string, string] = ['╭', '╮', '╰', '╯', '│'];
const BORDER_RARE:   [string, string, string, string, string] = ['┌', '┐', '└', '┘', '│'];
const BORDER_EPIC:   [string, string, string, string, string] = ['╔', '╗', '╚', '╝', '║'];

// Each entry is [eyes, mouth], both exactly 5 Unicode chars.
type FaceSet = Record<Condition, [string, string]>;

function buildArt(
  facesCommon: FaceSet,
  facesRare: FaceSet,
  facesEpic: FaceSet,
): Record<Rarity, Record<Condition, string[]>> {
  const build = (
    border: [string, string, string, string, string],
    faces: FaceSet,
  ): Record<Condition, string[]> => ({
    1: face(border, faces[1][0], faces[1][1]),
    2: face(border, faces[2][0], faces[2][1]),
    3: face(border, faces[3][0], faces[3][1]),
    4: face(border, faces[4][0], faces[4][1]),
    5: face(border, faces[5][0], faces[5][1]),
  });
  return {
    common: build(BORDER_COMMON, facesCommon),
    rare:   build(BORDER_RARE,   facesRare),
    epic:   build(BORDER_EPIC,   facesEpic),
  };
}

// ─────────────────────────────────────────────
// MOCHI — 둥글고 말랑한 떡
// ─────────────────────────────────────────────
const mochiFacesCommon: FaceSet = {
  5: ['◕ ‿ ◕', ' ╰─╯ '],
  4: ['◕ ◡ ◕', ' ╰─╯ '],
  3: ['• ‿ •', ' ╰─╯ '],
  2: ['• ︿ •', ' ╭─╮ '],
  1: ['; ︿ ;', ' ╭─╮ '],
};
const mochiFacesRare: FaceSet = {
  5: ['◕ ‿ ◕', '♡╰─╯♡'],
  4: ['◕ ◡ ◕', '♡╰─╯♡'],
  3: ['• ‿ •', '♡╰─╯♡'],
  2: ['• ︿ •', '♡╭─╮♡'],
  1: ['; ︿ ;', '♡╭─╮♡'],
};
const mochiFacesEpic: FaceSet = {
  5: ['✦ ‿ ✦', '★╰─╯★'],
  4: ['◆ ◡ ◆', '★╰─╯★'],
  3: ['◇ ‿ ◇', '★╰─╯★'],
  2: ['◇ ︿ ◇', '★╭─╮★'],
  1: ['◇ ︿ ◇', '★╭─╮★'],
};

const mochiArt = buildArt(mochiFacesCommon, mochiFacesRare, mochiFacesEpic);

// ─────────────────────────────────────────────
// PIXEL — 각진 로봇, bracket-style eyes
// ─────────────────────────────────────────────
const pixelFacesCommon: FaceSet = {
  5: ['[◕‿◕]', '[www]'],
  4: ['[◕◡◕]', '[www]'],
  3: ['[•‿•]', '[---]'],
  2: ['[•︿•]', '[___]'],
  1: ['[;︿;]', '[___]'],
};
const pixelFacesRare: FaceSet = {
  5: ['[◕‿◕]', '[w♡w]'],
  4: ['[◕◡◕]', '[w♡w]'],
  3: ['[•‿•]', '[-♡-]'],
  2: ['[•︿•]', '[_♡_]'],
  1: ['[;︿;]', '[_♡_]'],
};
const pixelFacesEpic: FaceSet = {
  5: ['[✦‿✦]', '[★w★]'],
  4: ['[◆◡◆]', '[★w★]'],
  3: ['[◇‿◇]', '[★-★]'],
  2: ['[◇︿◇]', '[★_★]'],
  1: ['[◇︿◇]', '[★_★]'],
};

const pixelArt = buildArt(pixelFacesCommon, pixelFacesRare, pixelFacesEpic);

// ─────────────────────────────────────────────
// BLOB — 물방울/슬라임, wavy mouth
// ─────────────────────────────────────────────
const blobFacesCommon: FaceSet = {
  5: ['◕ ‿ ◕', '~╰─╯~'],
  4: ['◕ ◡ ◕', '~╰─╯~'],
  3: ['• ‿ •', '~───~'],
  2: ['• ︿ •', '~╭─╮~'],
  1: ['; ︿ ;', '~╭─╮~'],
};
const blobFacesRare: FaceSet = {
  5: ['◕ ‿ ◕', '~♡─♡~'],
  4: ['◕ ◡ ◕', '~♡─♡~'],
  3: ['• ‿ •', '~─♡─~'],
  2: ['• ︿ •', '~╭♡╮~'],
  1: ['; ︿ ;', '~╭♡╮~'],
};
const blobFacesEpic: FaceSet = {
  5: ['✦ ‿ ✦', '~★─★~'],
  4: ['◆ ◡ ◆', '~★─★~'],
  3: ['◇ ‿ ◇', '~─★─~'],
  2: ['◇ ︿ ◇', '~╭★╮~'],
  1: ['◇ ︿ ◇', '~╭★╮~'],
};

const blobArt = buildArt(blobFacesCommon, blobFacesRare, blobFacesEpic);

// ─────────────────────────────────────────────
// NORI — 삼각 김밥, /\/ mouth pattern
// All mouth strings are exactly 5 chars:
//   happy  (4,5): ' /\\/ '  →  space,/,\,/,space   (5)
//   neutral  (3): '>/\\< '  →  >,/,\,<,space       (5)  [note trailing space]
//   Wait — '>/\\<' in TS source = >,/,\,< = only 4 chars.
//   Use '>/\\< ' (with trailing space) for condition 3 neutral mouth.
//   sad    (1,2): ' \\// '  →  space,\,/,/,space   (5)
//
// In TypeScript string literals '\\' = one backslash character.
// So ' /\\/ ' encodes space-/-\-/-space = 5 chars. ✓
// ─────────────────────────────────────────────
const noriFacesCommon: FaceSet = {
  5: ['◕ ‿ ◕', ' /\\/ '],
  4: ['◕ ◡ ◕', ' /\\/ '],
  3: ['• ‿ •', '>/\\< '],
  2: ['• ︿ •', ' \\// '],
  1: ['; ︿ ;', ' \\// '],
};
const noriFacesRare: FaceSet = {
  5: ['◕ ‿ ◕', '♡/\\/♡'],
  4: ['◕ ◡ ◕', '♡/\\/♡'],
  3: ['• ‿ •', '♡/\\<♡'],
  2: ['• ︿ •', '♡\\//♡'],
  1: ['; ︿ ;', '♡\\//♡'],
};
const noriFacesEpic: FaceSet = {
  5: ['✦ ‿ ✦', '★/\\/★'],
  4: ['◆ ◡ ◆', '★/\\/★'],
  3: ['◇ ‿ ◇', '★/\\<★'],
  2: ['◇ ︿ ◇', '★\\//★'],
  1: ['◇ ︿ ◇', '★\\//★'],
};

const noriArt = buildArt(noriFacesCommon, noriFacesRare, noriFacesEpic);

// ─────────────────────────────────────────────
// TORI — 작은 새, >v< mouth pattern
// ─────────────────────────────────────────────
const toriFacesCommon: FaceSet = {
  5: ['◕ ‿ ◕', ' >v< '],
  4: ['◕ ◡ ◕', ' >v< '],
  3: ['• ‿ •', ' >─< '],
  2: ['• ︿ •', ' >^< '],
  1: ['; ︿ ;', ' >^< '],
};
const toriFacesRare: FaceSet = {
  5: ['◕ ‿ ◕', '♡>v<♡'],
  4: ['◕ ◡ ◕', '♡>v<♡'],
  3: ['• ‿ •', '♡>─<♡'],
  2: ['• ︿ •', '♡>^<♡'],
  1: ['; ︿ ;', '♡>^<♡'],
};
const toriFacesEpic: FaceSet = {
  5: ['✦ ‿ ✦', '★>v<★'],
  4: ['◆ ◡ ◆', '★>v<★'],
  3: ['◇ ‿ ◇', '★>─<★'],
  2: ['◇ ︿ ◇', '★>^<★'],
  1: ['◇ ︿ ◇', '★>^<★'],
};

const toriArt = buildArt(toriFacesCommon, toriFacesRare, toriFacesEpic);

// ─────────────────────────────────────────────
// KUMO — 구름, ☁ mouth
// ─────────────────────────────────────────────
const kumoFacesCommon: FaceSet = {
  5: ['◕ ‿ ◕', ' ☁─☁ '],
  4: ['◕ ◡ ◕', ' ☁─☁ '],
  3: ['• ‿ •', ' ☁ ☁ '],
  2: ['• ︿ •', ' ☁~☁ '],
  1: ['; ︿ ;', ' ☁~☁ '],
};
const kumoFacesRare: FaceSet = {
  5: ['◕ ‿ ◕', '♡☁─☁♡'],
  4: ['◕ ◡ ◕', '♡☁─☁♡'],
  3: ['• ‿ •', '♡☁ ☁♡'],
  2: ['• ︿ •', '♡☁~☁♡'],
  1: ['; ︿ ;', '♡☁~☁♡'],
};
const kumoFacesEpic: FaceSet = {
  5: ['✦ ‿ ✦', '★☁─☁★'],
  4: ['◆ ◡ ◆', '★☁─☁★'],
  3: ['◇ ‿ ◇', '★☁ ☁★'],
  2: ['◇ ︿ ◇', '★☁~☁★'],
  1: ['◇ ︿ ◇', '★☁~☁★'],
};

const kumoArt = buildArt(kumoFacesCommon, kumoFacesRare, kumoFacesEpic);

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────

export const CHARACTERS: CharacterDef[] = [
  { id: 'mochi', name: 'Mochi', art: mochiArt },
  { id: 'pixel', name: 'Pixel', art: pixelArt },
  { id: 'blob',  name: 'Blob',  art: blobArt },
  { id: 'nori',  name: 'Nori',  art: noriArt },
  { id: 'tori',  name: 'Tori',  art: toriArt },
  { id: 'kumo',  name: 'Kumo',  art: kumoArt },
];

export function getCharacter(id: string): CharacterDef | undefined {
  return CHARACTERS.find((c) => c.id === id);
}
