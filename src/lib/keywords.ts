// Normalisation canonique d'un mot-clé : minuscules + trim + espaces simples.
// Les accents sont conservés (ex: "étanchéité"), seule la casse est ramenée
// à la forme minuscule pour éviter les doublons "Toiture" / "toiture".
export const normalizeKeyword = (s: string): string =>
  s
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

// Forme insensible aux accents et à la casse, utilisée uniquement pour la
// comparaison/recherche (autocomplétion, déduplication). Ne JAMAIS stocker
// cette forme — c'est un identifiant de comparaison.
export const foldKeyword = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

// Déduplique un tableau de mots-clés en gardant la 1ère orthographe rencontrée
// pour chaque clé normalisée.
export const dedupeKeywords = (kws: string[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of kws) {
    const norm = normalizeKeyword(raw);
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    out.push(norm);
  }
  return out;
};
