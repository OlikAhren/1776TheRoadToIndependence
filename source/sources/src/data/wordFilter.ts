// Starter profanity filter for player-entered names (public beta). Owner can extend BLOCKED_WORDS.
// Rules: (1) lowercase and map common look-alikes (! 1 -> i, 0 -> o, 3 -> e, 4 @ -> a, 5 $ -> s);
// (2) replace every remaining non-letter with a space; (3) compare each token against the list,
// also after stripping a trailing s/es/ing/ed/er/ers ("shits", "fucking", "bitches");
// (4) also check the letters-only joined text for the list's longer words so compounds such as
// "fuckyou" and "shithead" are caught. Short ambiguous words (fag, dick, cock, twat) are
// token-only so names like "Dickinson" or "Hancock" are not rejected.
export const BLOCKED_WORDS: string[] = [
  'fuck', 'shit', 'bitch', 'cunt', 'asshole', 'bastard', 'whore',
  'retard', 'nigger', 'nigga', 'faggot', 'fag', 'slut', 'dick', 'cock', 'pussy', 'twat', 'wanker'
]

const SUFFIXES = ['ers', 'ing', 'es', 'ed', 'er', 's']
// Words short/ambiguous enough that substring matching would cause false positives (e.g. "Dickinson", "Hancock")
const TOKEN_ONLY = new Set(['fag', 'dick', 'cock', 'twat'])

const stems = (token: string): string[] => {
  const out = [token]
  for (const s of SUFFIXES) if (token.length > s.length + 2 && token.endsWith(s)) out.push(token.slice(0, -s.length))
  return out
}

export function containsBlockedWord(name: string): boolean {
  const lower = String(name ?? '').toLowerCase().replace(/[!1]/g, 'i').replace(/0/g, 'o').replace(/3/g, 'e').replace(/[4@]/g, 'a').replace(/[5$]/g, 's')
  const spaced = lower.replace(/[^a-z]/g, ' ')
  const tokens = spaced.split(/\s+/).filter(Boolean)
  const blocked = new Set(BLOCKED_WORDS)
  for (const t of tokens) if (stems(t).some(x => blocked.has(x))) return true
  // Compound / obfuscated forms: check the joined letters for strong (non-ambiguous) words
  const joined = lower.replace(/[^a-z]/g, '')
  return BLOCKED_WORDS.some(w => !TOKEN_ONLY.has(w) && joined.includes(w))
}
