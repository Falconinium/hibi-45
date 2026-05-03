/**
 * HIBI 45 — Daily proverbs
 *
 * One authentic Japanese proverb (kotowaza) or classical saying for each day
 * of the program. Displayed at the top of the daily dashboard, beneath the
 * day number.
 *
 * Source: traditional Japanese kotowaza, Zen aphorisms, and a few lines from
 * classical literature (Bashō, the Hagakure, Dōgen). English renderings are
 * intentionally simple — these are old sayings, not aphorisms invented for
 * a wellness app.
 */

export type Proverb = {
  jp: string;       // Original Japanese
  romaji: string;   // Romanized reading
  en: string;       // English translation
};

/**
 * PROVERBS[dayNumber - 1] returns the proverb for that day.
 */
export const PROVERBS: Proverb[] = [
  /* Day 1 */
  { jp: '千里の道も一歩から', romaji: 'Senri no michi mo ippo kara',
    en: 'A journey of a thousand ri begins with a single step.' },

  /* Day 2 */
  { jp: '七転び八起き', romaji: 'Nanakorobi yaoki',
    en: 'Fall seven times, rise eight.' },

  /* Day 3 */
  { jp: '案ずるより産むが易し', romaji: 'Anzuru yori umu ga yasashi',
    en: 'Doing is easier than worrying about it.' },

  /* Day 4 */
  { jp: '一日一善', romaji: 'Ichinichi ichizen',
    en: 'One day, one good deed.' },

  /* Day 5 */
  { jp: '雨垂れ石を穿つ', romaji: 'Amadare ishi wo ugatsu',
    en: 'Steady drops of water bore through stone.' },

  /* Day 6 */
  { jp: '急がば回れ', romaji: 'Isogaba maware',
    en: 'When in a hurry, take the long way.' },

  /* Day 7 — One week */
  { jp: '日々是好日', romaji: 'Hibi kore kōjitsu',
    en: 'Every day is a good day.' },

  /* Day 8 */
  { jp: '塵も積もれば山となる', romaji: 'Chiri mo tsumoreba yama to naru',
    en: 'Even dust, when piled, becomes a mountain.' },

  /* Day 9 */
  { jp: '石の上にも三年', romaji: 'Ishi no ue ni mo sannen',
    en: 'Sit on a stone for three years and it grows warm.' },

  /* Day 10 */
  { jp: '始めが大事', romaji: 'Hajime ga daiji',
    en: 'The beginning matters.' },

  /* Day 11 */
  { jp: '鉄は熱いうちに打て', romaji: 'Tetsu wa atsui uchi ni ute',
    en: 'Strike the iron while it is hot.' },

  /* Day 12 */
  { jp: '善は急げ', romaji: 'Zen wa isoge',
    en: 'When the deed is good, hurry.' },

  /* Day 13 */
  { jp: '弱きを知り強くなる', romaji: 'Yowaki wo shiri tsuyoku naru',
    en: 'To know one’s weakness is to become strong.' },

  /* Day 14 — Two weeks */
  { jp: '一期一会', romaji: 'Ichi-go ichi-e',
    en: 'One time, one meeting. This moment will not return.' },

  /* Day 15 */
  { jp: '笑う門には福来る', romaji: 'Warau kado ni wa fuku kitaru',
    en: 'Fortune comes through a laughing gate.' },

  /* Day 16 */
  { jp: '明日は明日の風が吹く', romaji: 'Ashita wa ashita no kaze ga fuku',
    en: 'Tomorrow’s wind will blow tomorrow.' },

  /* Day 17 */
  { jp: '猿も木から落ちる', romaji: 'Saru mo ki kara ochiru',
    en: 'Even monkeys fall from trees.' },

  /* Day 18 */
  { jp: '木を見て森を見ず', romaji: 'Ki wo mite mori wo mizu',
    en: 'Looking at the tree, you miss the forest.' },

  /* Day 19 */
  { jp: '沈黙は金', romaji: 'Chinmoku wa kin',
    en: 'Silence is gold.' },

  /* Day 20 */
  { jp: '縁の下の力持ち', romaji: 'En no shita no chikara mochi',
    en: 'The strength that holds up the floor, unseen.' },

  /* Day 21 — Three weeks */
  { jp: '雨降って地固まる', romaji: 'Ame futte ji katamaru',
    en: 'After the rain, the earth hardens.' },

  /* Day 22 */
  { jp: '待てば海路の日和あり', romaji: 'Mateba kairo no hiyori ari',
    en: 'If you wait, fair weather for the voyage will come.' },

  /* Day 23 */
  { jp: '井の中の蛙大海を知らず', romaji: 'I no naka no kawazu taikai wo shirazu',
    en: 'The frog in the well knows nothing of the great ocean.' },

  /* Day 24 */
  { jp: '二兎を追う者は一兎をも得ず', romaji: 'Nito wo ou mono wa itto wo mo ezu',
    en: 'Chase two rabbits, catch none.' },

  /* Day 25 */
  { jp: '一寸先は闇', romaji: 'Issun saki wa yami',
    en: 'One inch ahead lies darkness.' },

  /* Day 26 */
  { jp: '諦めは心の養生', romaji: 'Akirame wa kokoro no yōjō',
    en: 'Letting go is nourishment for the heart.' },

  /* Day 27 */
  { jp: '親しき仲にも礼儀あり', romaji: 'Shitashiki naka ni mo reigi ari',
    en: 'Even between close friends, there is courtesy.' },

  /* Day 28 — Four weeks */
  { jp: '人事を尽くして天命を待つ', romaji: 'Jinji wo tsukushite tenmei wo matsu',
    en: 'Do all that you can, then wait for heaven.' },

  /* Day 29 */
  { jp: '三人寄れば文殊の知恵', romaji: 'Sannin yoreba Monju no chie',
    en: 'Three heads together hold the wisdom of Manjushri.' },

  /* Day 30 — Two thirds */
  { jp: '苦労は買ってでもしろ', romaji: 'Kurō wa katte demo shiro',
    en: 'Buy hardship, if you must — but seek it while young.' },

  /* Day 31 */
  { jp: '出る杭は打たれる', romaji: 'Deru kui wa utareru',
    en: 'The stake that stands up is hammered down.' },

  /* Day 32 */
  { jp: '弘法も筆の誤り', romaji: 'Kōbō mo fude no ayamari',
    en: 'Even Kōbō’s brush makes mistakes.' },

  /* Day 33 */
  { jp: '喉元過ぎれば熱さを忘れる', romaji: 'Nodomoto sugireba atsusa wo wasureru',
    en: 'Once past the throat, the heat is forgotten.' },

  /* Day 34 */
  { jp: '蛙の子は蛙', romaji: 'Kaeru no ko wa kaeru',
    en: 'A frog’s child is a frog.' },

  /* Day 35 — Five weeks */
  { jp: '心頭滅却すれば火もまた涼し', romaji: 'Shintō mekkyaku sureba hi mo mata suzushi',
    en: 'When the mind is extinguished, even fire is cool.' },

  /* Day 36 */
  { jp: '知らぬが仏', romaji: 'Shiranu ga hotoke',
    en: 'Not knowing is Buddha.' },

  /* Day 37 */
  { jp: '花より団子', romaji: 'Hana yori dango',
    en: 'Dumplings rather than flowers — substance over show.' },

  /* Day 38 */
  { jp: '義を見てせざるは勇無きなり', romaji: 'Gi wo mite sezaru wa yū naki nari',
    en: 'To see what is right and not do it is to lack courage.' },

  /* Day 39 */
  { jp: '老いては子に従え', romaji: 'Oite wa ko ni shitagae',
    en: 'In old age, follow the young.' },

  /* Day 40 — Six weeks */
  { jp: '月日は百代の過客', romaji: 'Tsukihi wa hyakudai no kakaku',
    en: 'The days and months are travelers of a hundred generations.' },

  /* Day 41 */
  { jp: '諸行無常', romaji: 'Shogyō mujō',
    en: 'All things pass.' },

  /* Day 42 */
  { jp: '物の哀れ', romaji: 'Mono no aware',
    en: 'The quiet sorrow of things passing.' },

  /* Day 43 */
  { jp: '無心', romaji: 'Mushin',
    en: 'No-mind. The action without the thinker.' },

  /* Day 44 */
  { jp: '初心忘るべからず', romaji: 'Shoshin wasuru bekarazu',
    en: 'Do not forget the beginner’s heart.' },

  /* Day 45 — The arrival */
  { jp: '道を求めて止まず', romaji: 'Michi wo motomete yamazu',
    en: 'Seek the way, and do not stop.' },
];

// Sanity check
if (PROVERBS.length !== 45) {
  throw new Error(`HIBI proverbs must have 45 entries, got ${PROVERBS.length}`);
}