# BRIEF: jamarimyers.com

Self-authored under explicit creative delegation. Jamari's words: "mine should feel powerful
and driven, but clear to follow", "interactive, visually appealing, not AI slop", reference
wodniack.dev (could not be fetched from this environment; borrowed only its reputation for
animation-led, award-grade pacing), "any pressing decisions come up just do what is recommended".

## 1. Vibe
Controlled intensity. Powerful, driven, legible. References: a pregame locker-room before the
noise starts; a pitch book's first page; a boxing gym at 6am. Not a creative-developer showreel.

## 2. The journey, in order
1. Who this is, in one screen, both halves of him visible at once.
2. Discipline: where each half was trained (field / desk).
3. The noticing: the morning recovery score with nothing to do about it.
4. The turn: the gap was the intervention layer. Osmo.
5. What he is building, concretely, and where it stands.
6. One action: email him.

## 3. Energy curve
Calm and heavy at the top. Builds through 2. Quiet in 3 (the silence before the peak).
Peak at 4 (the collapse). Settles in 5. Resolves in 6.

## 4. Feeling curve (one line per act, emotion then cause)
```
1  Recognition   two grounds split down the middle, one name across both, both readable at once
2  Respect       the ledger of what each half cost (hours, seasons, summers), landing in columns
3  Unease        the quiet act: a recovery score arrives with no instruction, copy in first person
4  Resolve       the divider travels and the dark side takes the whole frame. One company.
5  Confidence    the plain facts of Osmo on one calm ground, no pitch, with the stack and the status
6  Readiness     the page stops. One email address. The footer lives inside the last stage.
```

## 5. The peak
Act 4. The visitor would say: "the page was split in two the whole way down, and then the line
slid across and the two halves became one thing, and it was the company."

## 6. The signature move: the handle
The divider between the two grounds is a draggable handle the whole page long. On desktop the
pointer can grab it and pull either side to full width at any scroll position; release and it
springs back to where the scroll says it should be. Each side's copy responds to how much room it
has (the headline weight and width follow the handle through Archivo's width axis). At the
peak the scroll takes the handle away from the visitor and finishes the move itself. On touch
the handle is a horizontal drag anywhere on the stage. Coded in page JS from --sc-p, no engine edit.

## 7. Tell-someone sentence
It's the site where you can pull the line between the athlete and the analyst, and at the end
the page pulls it for you.

## 8. Range
Editorial-brutalist. High contrast, two hard grounds, no cards, no gradients. Far from
premium-minimal in structure, close to it in restraint.

## 9. One world or distinct scenes
Distinct. Two grounds held in tension, resolved once.

## 10. Assets
None supplied (a zip exists on Jamari's Windows machine, unreachable from this environment).
Build is typographic plus CSS-drawn structure. Leave a clearly marked slot for a portrait
(act 1, dark side) and for an Osmo app screenshot (act 5) to drop in later.

## Grammar: Split stage (uniqueness.md §2.7)
Why the other seven lost: filmic one-shot needs footage and hides seams (none to hide here);
chaptered editorial reads as a document, which is the opposite of "powerful and driven";
live surface requires the product to run in the page (it is a native app); continuous world
needs generated clips; typographic poster would be loud but has no persistent nav, and "clear
to follow" needs chrome; gallery is for a range of objects (he is one person); rhythmic cutlist
bans the hold the peak needs. Split stage IS the story: two halves, resolved by scroll.

Nav: no bar. The divider is the chrome, carrying the two side labels and the act progress.
Hero: 50/50 split, both headlines readable at once, name set across the seam.
Close: the collapse, then the CTA inside the winning column; footer inside the final stage.

## Fingerprint row (to append after shipping)
| Grammar | Nav | Hero | Act shape | Close | Signature |
| Split stage | divider-as-chrome with side labels and progress | 50/50 dual-ground split, name across seam | pin, reveal, pin (quiet), pin (collapse), flow, pin: 6 acts, ~11vh | divider collapses, CTA in winning column | draggable handle that scroll takes over at the peak |

## Authored silence
Act 3 opens with ~0.3 of its span showing only the two grounds and a single number before
copy arrives. That is intentional, not dead scroll.

## Score table
| Beat | Device | Why |
|---|---|---|
| 1 Recognition | `pin` + split driven from --sc-p (hold at 50/50) | both sides must be read before anything moves |
| 2 Respect | `reveal` per side + `count` on real figures | columns landing is the comparison |
| 3 Unease | `pin`, long, mostly empty, then first-person copy | the silence before the peak |
| 4 Resolve | `pin`, largest span, divider driven to 100/0 | the collapse is the peak |
| 5 Confidence | `flow` + `in` | administrative facts, compressed |
| 6 Readiness | `pin`, short, one-value cues | resolves and holds |

Checks: pin, reveal, pin, pin, flow, pin. "pin" appears in 3 and 4 adjacent: 3 is a near-empty
hold and 4 is the collapse, different feelings, different devices on screen (nothing vs the
divider travelling). Four families: pin, reveal, count, flow. No scrub (grammar allows one; none
needed). Total ~11vh, outside the 13.6 to 13.8 band.

## Copy constraints
See CONTENT.md. Real numbers only, each one traceable. No em dashes anywhere. One CTA label
everywhere: "Email Jamari".
