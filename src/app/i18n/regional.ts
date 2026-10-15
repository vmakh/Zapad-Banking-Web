/** Shared Ijekavian banking terminology, with explicit regional vocabulary differences. */
const croatianWords: Record<string, string> = {
  podešavanja: "postavke", podešavanje: "postavljanje", sačuvaj: "spremi", sačuvano: "spremljeno",
  sačuvan: "spremljen", sačuvana: "spremljena", sačuvani: "spremljeni", sačuvane: "spremljene", sačuvanim: "spremljenim",
  sačuvati: "spremiti", sačuvate: "spremite", sačuvaju: "spreme", čuvanje: "spremanje", čuvanja: "spremanja",
  sačuvanom: "spremljenom", sačuvanog: "spremljenog", čuva: "sprema", sačuva: "spremi",
  istorija: "povijest", istoriji: "povijesti", istorije: "povijesti", istoriju: "povijest", istorijski: "povijesni",
  primalac: "primatelj", primaoca: "primatelja", primaocu: "primatelju", primaoci: "primatelji", primaoce: "primatelje",
  prenos: "prijenos", prenosa: "prijenosa", prenosu: "prijenosu",
  prenosilac: "prenositelj", provjeri: "provjeri", obavještenja: "obavijesti", obavještenje: "obavijest", obavještenju: "obavijesti",
  obavještenjima: "obavijestima", bezbjednost: "sigurnost", bezbjednosti: "sigurnosti", bezbjednosna: "sigurnosna", bezbjednosne: "sigurnosne",
  lični: "osobni", lična: "osobna", lično: "osobno", lične: "osobne", ličnih: "osobnih", ličnog: "osobnog",
  korišćenje: "korištenje", korišćenja: "korištenja", korišćenjem: "korištenjem", korišćeni: "korišteni", korišćen: "korišten",
  sopstveni: "vlastiti", sopstvene: "vlastite", sopstvenih: "vlastitih", sopstvenu: "vlastitu",
  nijesu: "nisu", uslovi: "uvjeti", uslova: "uvjeta", uslove: "uvjete", uslovima: "uvjetima",
  mjesečno: "mjesečno", opšti: "opći", opšta: "opća", opšte: "opće", preduzeće: "poduzeće", preduzeća: "poduzeća",
  kancelarije: "ureda", kancelarija: "ured", ažuriraj: "ažuriraj", podrazumijevano: "zadano", decembar: "prosinac",
  decembra: "prosinca", april: "travanj", aprila: "travnja", maj: "svibanj", maja: "svibnja",
  kreiraj: "izradi", kreiranje: "izrada", kreiran: "izrađen", kreirana: "izrađena", kreirano: "izrađeno",
  otkaži: "odustani", odštampaj: "ispiši", štampanje: "ispis", štampe: "ispisa", dugme: "gumb", dugmeta: "gumba",
  šifra: "šifra", sedmica: "tjedan", sedmice: "tjedna", sedmicu: "tjedan", sedmično: "tjedno",
  nedjelje: "tjedna", nedjelju: "tjedan", nedjelja: "tjedan", hartije: "papiri",
};

function replaceWords(text: string, words: Record<string, string>) {
  return text.replace(/\{\w+\}|[\p{L}]+/gu, word => {
    if (word.startsWith("{")) return word;
    const replacement = words[word.toLowerCase()];
    if (!replacement) return word;
    return word[0] === word[0].toUpperCase() ? replacement[0].toUpperCase() + replacement.slice(1) : replacement;
  });
}

export function regionalText(text: string, region: "sr" | "bs" | "hr"): string {
  if (region === "hr") return replaceWords(text, croatianWords);
  return replaceWords(text, region === "bs" ? { nijesu: "nisu", opšti: "opći", opšta: "opća", opšte: "opće" } : { nijesu: "nisu" });
}

const latin = "a b v g d đ e ž z i j k l m n o p r s t ć u f h c č š ś ź".split(" ");
const cyrillic = "а б в г д ђ е ж з и ј к л м н о п р с т ћ у ф х ц ч ш с́ з́".split(" ");
const alphabet = Object.fromEntries(latin.map((letter, i) => [letter, cyrillic[i]]));

/** Transliterate catalog copy only. Placeholders, brands and financial acronyms stay intact. */
export function toCyrillic(text: string): string {
  const protectedTokens = /\{\w+\}|ZapadBanka|Zapad Banka|Demo Corp DOO|Demo Corp|iPhone|Apple Pay|Google Pay|Mastercard|Visa|SEPA|SWIFT|BIC|POS|IBAN|APY|APR|EUR|USD|GBP|PDF|CSV|HTML|CVV|ATM|QR|ETF|INV-\d+|LN-\d+-\d+|DOO|d\.o\.o\.|Alfa doo|Techno|John Sample|Client|EPCG|Netflix/g;
  const convert = (value: string) => value.replace(/dž|lj|nj|[a-zčćđšžśź]/gi, letter => {
    const lower = letter.toLowerCase();
    const converted = ({ dž: "џ", lj: "љ", nj: "њ" } as Record<string, string>)[lower] ?? alphabet[lower] ?? letter;
    return letter[0] === letter[0].toUpperCase() ? converted.toUpperCase() : converted;
  });
  let result = "";
  let offset = 0;
  for (const match of text.matchAll(protectedTokens)) {
    result += convert(text.slice(offset, match.index)) + match[0];
    offset = match.index! + match[0].length;
  }
  return result + convert(text.slice(offset));
}
