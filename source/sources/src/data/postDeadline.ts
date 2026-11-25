// Detects biographies that describe events AFTER the game's deadline (July 2, 1776).
//
// The game runs from June 7, 1776 to July 2, 1776. Most delegate biographies were written
// as full historical accounts and therefore mention what happened afterwards — signing the
// Declaration (July 4), later offices, presidencies, deaths. That material is kept, because it
// is genuinely educational, but the interface labels it clearly as hindsight rather than
// letting the player read it as knowledge their character already has.
//
// The patterns mirror tools/audit_delegate_bios.py, which lists the affected delegates.

export const POST_DEADLINE_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: 'signing the Declaration', pattern: /\bsign(ed|ing|ature|ed)\b|affix|present the Declaration/i },
  { label: 'mentions the Declaration', pattern: /Declaration of Independence|the Declaration\b/i },
  { label: 'a later office or presidency', pattern: /\bPresident\b|\bgovernor\b|\bGovernor\b|\bSenator\b|Senate\b|Supreme Court|Continental Congress|Congress\b/i },
  { label: 'events in the 1780s or later', pattern: /\b17(8[0-9]|9[0-9])\b/i },
  { label: 'death or later life', pattern: /\bdied\b|\bdeath\b|passed away|buried/i },
  { label: 'life after the war', pattern: /after the war|after the Revolution|postwar|after independence|years later/i },
  { label: 'events in a later century', pattern: /\b1[89][0-9]{2}\b/i },
]

// True when the text mentions anything the player could not know by July 2, 1776.
export function hasPostDeadlineContent(text: string | undefined | null): boolean {
  if (!text) return false
  return POST_DEADLINE_PATTERNS.some(p => p.pattern.test(text))
}
