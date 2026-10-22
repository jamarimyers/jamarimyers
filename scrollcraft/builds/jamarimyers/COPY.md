# COPY: jamarimyers.com

Final page copy, merged 2026-10-22 from the fact-checker's and the de-AI editor's corrected versions of the same draft. Every figure traces to CONTENT.md. One CTA label everywhere: "Email Jamari". Slot names match the build's structured output.

## Act 1 Recognition

hero_field_headline: Noticed on the field

hero_desk_headline: Built at the desk

hero_support: Osmo, the company I started, gives college athletes one next move each morning.

## Act 2 Respect

act2_heading_field: Two seasons on the field, 2023 and 2024

act2_heading_desk: Three summers at the desk, 2024 to 2026

act2_field_ledger:

| Label | Fact |
|---|---|
| Brown Bears | Defensive back, Division I, August 2023 to January 2025 |
| Seasons | Two. Stopped playing after sophomore year |
| 2024 | 5 games, 4.0 tackles, 1 pass breakup |
| St. Paul's School | Concord, New Hampshire, Class of 2023 |
| 2022 | First Team All-Evergreen Conference, All-NEPSAC Honorable Mention |
| Hometown | Allen, Texas |

act2_desk_ledger:

| Label | Fact |
|---|---|
| J.P. Morgan | Investment banking, New York, summers 2025 and 2026 |
| Decatur Street Capital | Search fund summer analyst in the fitness and sports training industry, summer 2024 |
| BLK Capital Management | Sponsorship Chair. Partnerships across 30+ financial-services firms and an automated resume book built from 600+ member responses |
| Black in Business at Brown | Chair of Finance. A panel of 7 student founders and a personal-finance workshop for 40 high-school students |
| Fellowships | Roark Capital Investment Fellow, SEO Career, Make-A-Play Foundation King's Court Fellow |
| Brown University | B.A. Business Economics, Entrepreneurship track, Class of 2027 |

## Act 3 Unease

act3_line1: Every morning you know your recovery score. It arrives with strain and sleep quality, and no context.

act3_line2: A low number does not produce a better decision. It produces another thing to worry about before practice has even started.

act3_line3: Nobody gives you anything for the mornings you wake up flat before a game.

## Act 4 Resolve

act4_turn_line: The gap was never measurement. Osmo is the move after the number.

act4_belief_line: Physical performance is trained. Emotional performance should be too.

## Act 5 Confidence

act5_osmo_paragraph: Osmo is an emotional performance platform for college athletes, sold to athletic departments. It gives each athlete a short morning check-in, optional wearable context and one next move for today.

act5_honest_answers: Built for honest answers. Athletes choose what is shared, and coaches see a simple readiness label, never journals or raw biometrics.

act5_research: The research is early and I call it exploratory. In fall 2025 I ran 11 interviews and a 48-person student-athlete survey. Of those surveyed, 90% want structured guidance and 43% say what they do now works (n=48).

act5_status: App built; in release testing with early athletes. The stack is TypeScript, React Native, Expo, Node.js and Supabase.

act5_elsewhere: I spent a semester in Rome and negotiated four brand partnerships while I was there. I speak intermediate Mandarin and elementary Italian.

## Act 6 Readiness

act6_heading: Write to me

cta_label: Email Jamari

footer_line: Jamari Myers, Brown University ’27, 2026

## Page head

meta_description: Jamari Myers, founder of Osmo, is building what comes after the recovery score for college athletes. He played Division I football at Brown and spent summers 2025 and 2026 in investment banking at J.P. Morgan in New York.

## Changes made by the panel

Both reviewers returned ok=false on the merged draft. Their corrected versions agreed on every slot except meta_description, act5_research and act5_status.

### Fact-check problems

- meta_description asserted a founding chronology ("founded Osmo ... after Division I football at Brown and two summers at J.P. Morgan") that CONTENT.md does not contain. No founding date exists in the source, and the Osmo research is dated fall 2025, which comes before the summer 2026 J.P. Morgan stint, so "after two summers" was untraceable and most likely wrong. Fixed by stating the founding and the two histories as separate facts with no sequencing, the shape POSITIONING section 5 uses for the conference bio.
- meta_description said "two summers at J.P. Morgan" without the investment banking fact. The only approved J.P. Morgan wording is investment banking, New York, summers 2025 and 2026 (CONTENT.md line 15). Fixed so the mention carries the approved fact.
- Verified by inference and accepted: "two seasons" and "Seasons: Two" (August 2023 to January 2025, stopped after sophomore year); "three summers" (Decatur 2024, J.P. Morgan 2025 and 2026); first-person "I ran 11 interviews" (sanctioned by POSITIONING section 5); "40 high-school students" (CONTENT.md says 40 high-school Black Student Union members, a true broadening).
- Mechanical scan passed: no em or en dashes (the only non-ASCII character is the apostrophe in ’27), no banned Osmo words, no "not X, but Y", no jersey number, no retired creator figures.
- Non-blocking note for the designer: act2_heading_field is scoped to 2023 and 2024 while that ledger also carries the 2022 honors and the St. Paul's and Hometown lines. The facts are correct; a cold reader may expect the heading to cover the whole column.

### De-AI problems

- meta_description was the LinkedIn-headline template (X founded Y, a Z for W, after A and B) and could sit on any founder page, on top of the chronology error. Rewritten to lead with the POSITIONING section 1 line (Osmo as subject, "what comes after the recovery score"), with the history as evidence and no sequencing claim. The first sentence is under 100 characters so it survives truncation.
- Act 5 cadence: three consecutive blocks opened with a short fragment and a full stop ("Built for honest answers." / "Early research, exploratory." / "Where it stands."). One run-in head is a design choice; three in a row is a slide-deck rhythm. "Built for honest answers." stays as the single run-in head because it is approved wording; act5_research and act5_status now open as sentences. The approved status line "App built; in release testing with early athletes." is untouched and the stack still follows it as its own sentence.
- act5_research read as a data sheet: a tag ("Early research, exploratory.") followed by a semicolon-joined statistics clause. Recast in first person about his own study, with the exploratory label and the n=48 label kept and every figure unchanged (fall 2025, 11, 48, 90%, 43%).

### Merge decisions

- act5_research and act5_status: de-AI editor's wording taken (voice only, facts identical in both versions, approved status line intact).
- meta_description: the de-AI editor's first sentence (the POSITIONING section 1 line) carries the voice; the second sentence takes the fact-checker's shape (two separate facts, no sequencing, a full sentence rather than the de-AI editor's semicolon list) and spells out all elements of the approved J.P. Morgan fact (investment banking, New York, summers 2025 and 2026), since the task's hard rule names that string as the only J.P. Morgan wording and the fact-checker's "two summers in investment banking at J.P. Morgan" left out New York and the years.
- Every other slot was identical in both corrected versions and is carried unchanged.
