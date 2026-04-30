export interface BibleBook {
  id: number;
  pt: string;
  en: string;
  abbr: string;
  chapters: number;
  testament: 'AT' | 'NT';
}

export const BIBLE_BOOKS: BibleBook[] = [
  // ── Antigo Testamento ──────────────────────
  { id: 1,  pt: 'Gênesis',           en: 'genesis',          abbr: 'Gn',  chapters: 50,  testament: 'AT' },
  { id: 2,  pt: 'Êxodo',             en: 'exodus',           abbr: 'Ex',  chapters: 40,  testament: 'AT' },
  { id: 3,  pt: 'Levítico',          en: 'leviticus',        abbr: 'Lv',  chapters: 27,  testament: 'AT' },
  { id: 4,  pt: 'Números',           en: 'numbers',          abbr: 'Nm',  chapters: 36,  testament: 'AT' },
  { id: 5,  pt: 'Deuteronômio',      en: 'deuteronomy',      abbr: 'Dt',  chapters: 34,  testament: 'AT' },
  { id: 6,  pt: 'Josué',             en: 'joshua',           abbr: 'Js',  chapters: 24,  testament: 'AT' },
  { id: 7,  pt: 'Juízes',            en: 'judges',           abbr: 'Jz',  chapters: 21,  testament: 'AT' },
  { id: 8,  pt: 'Rute',              en: 'ruth',             abbr: 'Rt',  chapters: 4,   testament: 'AT' },
  { id: 9,  pt: '1 Samuel',          en: '1+samuel',         abbr: '1Sm', chapters: 31,  testament: 'AT' },
  { id: 10, pt: '2 Samuel',          en: '2+samuel',         abbr: '2Sm', chapters: 24,  testament: 'AT' },
  { id: 11, pt: '1 Reis',            en: '1+kings',          abbr: '1Rs', chapters: 22,  testament: 'AT' },
  { id: 12, pt: '2 Reis',            en: '2+kings',          abbr: '2Rs', chapters: 25,  testament: 'AT' },
  { id: 13, pt: '1 Crônicas',        en: '1+chronicles',     abbr: '1Cr', chapters: 29,  testament: 'AT' },
  { id: 14, pt: '2 Crônicas',        en: '2+chronicles',     abbr: '2Cr', chapters: 36,  testament: 'AT' },
  { id: 15, pt: 'Esdras',            en: 'ezra',             abbr: 'Ed',  chapters: 10,  testament: 'AT' },
  { id: 16, pt: 'Neemias',           en: 'nehemiah',         abbr: 'Ne',  chapters: 13,  testament: 'AT' },
  { id: 17, pt: 'Ester',             en: 'esther',           abbr: 'Et',  chapters: 10,  testament: 'AT' },
  { id: 18, pt: 'Jó',                en: 'job',              abbr: 'Jó',  chapters: 42,  testament: 'AT' },
  { id: 19, pt: 'Salmos',            en: 'psalms',           abbr: 'Sl',  chapters: 150, testament: 'AT' },
  { id: 20, pt: 'Provérbios',        en: 'proverbs',         abbr: 'Pv',  chapters: 31,  testament: 'AT' },
  { id: 21, pt: 'Eclesiastes',       en: 'ecclesiastes',     abbr: 'Ec',  chapters: 12,  testament: 'AT' },
  { id: 22, pt: 'Cantares',          en: 'song+of+solomon',  abbr: 'Ct',  chapters: 8,   testament: 'AT' },
  { id: 23, pt: 'Isaías',            en: 'isaiah',           abbr: 'Is',  chapters: 66,  testament: 'AT' },
  { id: 24, pt: 'Jeremias',          en: 'jeremiah',         abbr: 'Jr',  chapters: 52,  testament: 'AT' },
  { id: 25, pt: 'Lamentações',       en: 'lamentations',     abbr: 'Lm',  chapters: 5,   testament: 'AT' },
  { id: 26, pt: 'Ezequiel',          en: 'ezekiel',          abbr: 'Ez',  chapters: 48,  testament: 'AT' },
  { id: 27, pt: 'Daniel',            en: 'daniel',           abbr: 'Dn',  chapters: 12,  testament: 'AT' },
  { id: 28, pt: 'Oséias',            en: 'hosea',            abbr: 'Os',  chapters: 14,  testament: 'AT' },
  { id: 29, pt: 'Joel',              en: 'joel',             abbr: 'Jl',  chapters: 3,   testament: 'AT' },
  { id: 30, pt: 'Amós',              en: 'amos',             abbr: 'Am',  chapters: 9,   testament: 'AT' },
  { id: 31, pt: 'Obadias',           en: 'obadiah',          abbr: 'Ob',  chapters: 1,   testament: 'AT' },
  { id: 32, pt: 'Jonas',             en: 'jonah',            abbr: 'Jn',  chapters: 4,   testament: 'AT' },
  { id: 33, pt: 'Miquéias',          en: 'micah',            abbr: 'Mq',  chapters: 7,   testament: 'AT' },
  { id: 34, pt: 'Naum',              en: 'nahum',            abbr: 'Na',  chapters: 3,   testament: 'AT' },
  { id: 35, pt: 'Habacuque',         en: 'habakkuk',         abbr: 'Hc',  chapters: 3,   testament: 'AT' },
  { id: 36, pt: 'Sofonias',          en: 'zephaniah',        abbr: 'Sf',  chapters: 3,   testament: 'AT' },
  { id: 37, pt: 'Ageu',              en: 'haggai',           abbr: 'Ag',  chapters: 2,   testament: 'AT' },
  { id: 38, pt: 'Zacarias',          en: 'zechariah',        abbr: 'Zc',  chapters: 14,  testament: 'AT' },
  { id: 39, pt: 'Malaquias',         en: 'malachi',          abbr: 'Ml',  chapters: 4,   testament: 'AT' },
  // ── Novo Testamento ───────────────────────
  { id: 40, pt: 'Mateus',            en: 'matthew',          abbr: 'Mt',  chapters: 28,  testament: 'NT' },
  { id: 41, pt: 'Marcos',            en: 'mark',             abbr: 'Mc',  chapters: 16,  testament: 'NT' },
  { id: 42, pt: 'Lucas',             en: 'luke',             abbr: 'Lc',  chapters: 24,  testament: 'NT' },
  { id: 43, pt: 'João',              en: 'john',             abbr: 'Jo',  chapters: 21,  testament: 'NT' },
  { id: 44, pt: 'Atos',              en: 'acts',             abbr: 'At',  chapters: 28,  testament: 'NT' },
  { id: 45, pt: 'Romanos',           en: 'romans',           abbr: 'Rm',  chapters: 16,  testament: 'NT' },
  { id: 46, pt: '1 Coríntios',       en: '1+corinthians',    abbr: '1Co', chapters: 16,  testament: 'NT' },
  { id: 47, pt: '2 Coríntios',       en: '2+corinthians',    abbr: '2Co', chapters: 13,  testament: 'NT' },
  { id: 48, pt: 'Gálatas',           en: 'galatians',        abbr: 'Gl',  chapters: 6,   testament: 'NT' },
  { id: 49, pt: 'Efésios',           en: 'ephesians',        abbr: 'Ef',  chapters: 6,   testament: 'NT' },
  { id: 50, pt: 'Filipenses',        en: 'philippians',      abbr: 'Fp',  chapters: 4,   testament: 'NT' },
  { id: 51, pt: 'Colossenses',       en: 'colossians',       abbr: 'Cl',  chapters: 4,   testament: 'NT' },
  { id: 52, pt: '1 Tessalonicenses', en: '1+thessalonians',  abbr: '1Ts', chapters: 5,   testament: 'NT' },
  { id: 53, pt: '2 Tessalonicenses', en: '2+thessalonians',  abbr: '2Ts', chapters: 3,   testament: 'NT' },
  { id: 54, pt: '1 Timóteo',         en: '1+timothy',        abbr: '1Tm', chapters: 6,   testament: 'NT' },
  { id: 55, pt: '2 Timóteo',         en: '2+timothy',        abbr: '2Tm', chapters: 4,   testament: 'NT' },
  { id: 56, pt: 'Tito',              en: 'titus',            abbr: 'Tt',  chapters: 3,   testament: 'NT' },
  { id: 57, pt: 'Filemom',           en: 'philemon',         abbr: 'Fm',  chapters: 1,   testament: 'NT' },
  { id: 58, pt: 'Hebreus',           en: 'hebrews',          abbr: 'Hb',  chapters: 13,  testament: 'NT' },
  { id: 59, pt: 'Tiago',             en: 'james',            abbr: 'Tg',  chapters: 5,   testament: 'NT' },
  { id: 60, pt: '1 Pedro',           en: '1+peter',          abbr: '1Pe', chapters: 5,   testament: 'NT' },
  { id: 61, pt: '2 Pedro',           en: '2+peter',          abbr: '2Pe', chapters: 3,   testament: 'NT' },
  { id: 62, pt: '1 João',            en: '1+john',           abbr: '1Jo', chapters: 5,   testament: 'NT' },
  { id: 63, pt: '2 João',            en: '2+john',           abbr: '2Jo', chapters: 1,   testament: 'NT' },
  { id: 64, pt: '3 João',            en: '3+john',           abbr: '3Jo', chapters: 1,   testament: 'NT' },
  { id: 65, pt: 'Judas',             en: 'jude',             abbr: 'Jd',  chapters: 1,   testament: 'NT' },
  { id: 66, pt: 'Apocalipse',        en: 'revelation',       abbr: 'Ap',  chapters: 22,  testament: 'NT' },
];

export const AT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'AT');
export const NT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'NT');
