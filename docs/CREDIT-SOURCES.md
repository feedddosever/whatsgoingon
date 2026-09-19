# Cheap credit, and the accreditation trap

Reference for what is in `data/us/alt-credit.ts`, and why it is worded the way
it is. Compiled largely from the [Degree Forum wiki](https://degreeforum.miraheze.org/wiki/Several_Sources_Of_Cheap_Credit),
which tracks these providers more closely than anyone — and which is neither the
provider nor anybody's registrar, so every row is `needs_check`.

**Study plans are deliberately not imported.** The wiki's degree plans are built
for the "Big 3" completion-degree model, which is a different product from
planning general education at a named public campus. Copying them in would mean
shipping advice we cannot price, cannot source per campus, and did not write.

## The rule that decides everything

Credit from these providers is posted to **the provider's own transcript**, not
a college's. So the receiving institution is not asking *"was that course any
good?"* — it is asking *"do we accept this company's paperwork?"*.

Those are different questions with different answers, and the second one is the
one that costs money.

**ACE and NCCRS recommend credit. Neither is an accreditor, and neither can make
any college award anything.** Reading "ACE recommended" as "counts everywhere"
is the single most expensive misunderstanding in this category, which is why the
app prints the recommendation next to the price, in the words "a recommendation,
not a guarantee".

## What is in the dataset

| Provider | Price | Recommended by | Notes |
|---|---|---|---|
| **Sophia Learning** | $99 / month, unlimited courses | ACE | No proctoring fee. A fast student clears several courses on one month's subscription. |
| **Study.com** (College Saver) | $95 / month | **ACE and NCCRS** | The only dual-recommended row, which widens the set of colleges that may take it. Finals are open-book, unproctored, graded instantly. |
| **StraighterLine** | ~$99 / month **plus** ~$79 per course | ACE | Priced differently — the arithmetic only works taking few courses slowly. Some finals proctored. Larger partner network. |
| **Saylor Academy** | Free; ~$5 proctored final | ACE and NCCRS | Non-profit. The cheapest credit in the dataset by a wide margin. |
| **TEEX** | Free | ACE | Texas A&M Engineering Extension Service, up to ~13 credits, unproctored. Genuinely free and genuinely narrow — fills gaps, not a degree. |
| **Modern States** | Free | — | The odd one out and the best deal. Issues no credit itself: it gives a free prep course and a voucher covering the **CLEP exam fee**. The credit therefore arrives as CLEP on a College Board score report, judged by your college's CLEP policy rather than by any third-party transcript rule — so it works in places Sophia and Study.com do not. |

Prices are mostly monthly subscriptions, so real cost depends on how fast the
student works — something this app cannot know. Each row prices **one month**
and says so.

## DSST, and who it is actually for

DSST costs $100 to the test-maker plus a test-centre administration fee commonly
in the $25–$50 range. For **eligible active-duty service members at a
DANTES-funded site both are waived** — the exam is genuinely free, for the first
attempt at each test.

That makes DSST the cheapest credit available to military-connected students,
who are among the people this app should serve best. It also makes it the
family with the widest spread in value: a Cal State will award it toward a
degree, and the University of California awards nothing for it at all. Florida
is the opposite again — DSST is named in the same binding statewide table as AP
and CLEP, and no Florida public university gets a vote.

## Regional vs national accreditation: say this carefully

Students are still told to sort schools into "regionally accredited" (good) and
"nationally accredited" (bad). That framing is out of date as a matter of
federal law:

- A 2019 Department of Education rule, **effective 1 July 2020**, removed
  geographic scope from federal recognition and collapsed both categories into a
  single classification: **institutional accreditation**.
- The Department has since issued further guidance on the use of the words
  "national" and "regional" by recognised accrediting agencies, on the grounds
  that continued use of the old labels drives confusion, cost, and
  *"discriminatory transfer credit policies"*.

**But the behaviour did not stop when the categories did.** Institutions still
discriminate between accreditors when deciding what to accept, and that is what
actually costs a student money. So the app:

- does **not** repeat "regional vs national" as though it were current;
- does **not** pretend the distinction stopped mattering;
- tells the student to ask about **the specific provider, by name**, rather than
  about accreditation in the abstract.

The one place this appears in the product is the block above the third-party
rows in the credit picker, where the money is about to be spent.

## The "Big 3"

Thomas Edison State University, Excelsior University and Charter Oak State
College are the three institutionally-accredited schools built around accepting
large volumes of transfer and exam credit. They are **not in the dataset**,
because this app plans routes to a named public campus in a state, which is a
different question from completing a degree by assembling credit.

They are worth knowing about, and two details are worth stating precisely
because they cut against the usual summary:

- TESU accepts credit from nationally-accredited schools where the credit is
  ACE- or NCCRS-recommended.
- **Charter Oak no longer accepts that credit at all**, recommendation or not.

Which is the whole thesis of this project in one line: two schools in the same
category, with opposite answers, and a student cannot tell from the outside.

## Sources

- [Several Sources Of Cheap Credit — Degree Forum wiki](https://degreeforum.miraheze.org/wiki/Several_Sources_Of_Cheap_Credit)
- [Free Sources of Credit — Degree Forum wiki](https://degreeforum.miraheze.org/wiki/Free_Sources_of_Credit)
- [Accreditation — Degree Forum wiki](https://degreeforum.miraheze.org/wiki/Accreditation)
- [The Big Three — Degree Forum wiki](https://degreeforum.miraheze.org/wiki/The_Big_Three)
- [ED: proposed interpretive rule on "regional" accrediting agencies](https://www.ed.gov/about/news/press-release/us-department-of-education-issues-proposed-interpretive-rule-eliminate-use-of-regional-accrediting-agencies)
- ["Regional accreditation" is no longer a federal classification — AACRAO](https://www.aacrao.org/news/regional-accreditation-is-no-longer-a-federal-classification/)
- [Federal Register: clarification of the terms "national" and "regional"](https://www.federalregister.gov/documents/2026/02/17/2026-03074/clarification-of-the-appropriate-use-of-terms-national-and-regional-by-recognized-accrediting)
- [Modern States](https://modernstates.org/)
