# HackCanton League Season 3 — 10 Ideas

**Grand Final Oct 14 (27 days) · up to $50k · 5-week online program · solo/team**

## Read this before anything else

**This is not Solidity.** Canton uses **Daml**, a functional contract language
with a different execution model: contracts are records with signatories and
observers, and **privacy is enforced per-party at the ledger level** — parties
only see sub-transactions they're entitled to.

Honest assessment of whether I can implement it: **yes, with a caveat.** Daml is
learnable in a few days — it's closer to Haskell than Solidity, strongly typed,
and the tooling (Daml Studio, Navigator, scripts) is good. But I have far less
practice with it than with Solidity, so **budget 4–5 days for ramp-up**, and
expect the code to be less idiomatic than my EVM work. It is a real either/or
against the Oct 4–14 EVM stack, not an add-on.

**Why it might still be worth it:** the master list rates the field as
**low-to-medium competition**, and it's a **single narrow track** — the best
odds-per-unit-effort on the whole board.

## The rubric

No published point rubric was found. Confirmed framing:

- **"Business-first"** — pick a *real problem*, ship a **production-style MVP**.
- Single track: **Real-World Asset & Business Workflows**.
- Explicitly: **end-to-end workflows for issuance, state changes, transfers, and audit.**
- Judged by people who actually build in the Canton ecosystem.

**Translation:** they want a complete business workflow, not a clever primitive.
The four named verbs — **issuance → state change → transfer → audit** — are
effectively the rubric. **Every idea below closes all four loops.** An entry that
only does issuance loses to a duller one that does all four.

And **privacy is Canton's whole reason to exist.** If your workflow would work
fine on a public chain, you've picked the wrong workflow.

---

### 1. Trade finance — letters of credit
Issuer bank, exporter, importer, and inspector each see only their slice.

- **Four verbs:** issue LC → amend/confirm shipment → transfer on presentation of documents → regulator audit view.
- **Why Canton:** counterparties are commercial rivals who must not see each other's terms. **Textbook fit.**
- **Risk:** domain complexity. Model one narrow LC type, not the whole UCP 600.

### 2. Private syndicated loan servicing
Agent bank distributes interest across lenders who can't see each other's holdings.

- **Four verbs:** originate → rate reset/drawdown → secondary transfer of participations → audit trail for the agent.
- **Why Canton:** lender positions are strictly confidential. Impossible on a public ledger.
- **Risk:** needs a clear demo narrative or it looks like spreadsheets.

### 3. Supply-chain receivables with selective disclosure
Supplier proves an invoice is genuine to a financier without revealing the buyer relationship.

- **Four verbs:** issue receivable → approve/discount → transfer to financier → audit.
- **Why Canton:** disclosure is the product.
- **Risk:** overlaps FactorFi (Arbitrum #3). **That's an advantage** — same domain knowledge, two events.

### 4. Carbon credit registry with retirement
Issuance from a verifier, transfer between holders, permanent retirement, public audit of totals with private holdings.

- **Four verbs:** all four are native to the asset class.
- **Why Canton:** holdings private, aggregate supply public — a split public chains handle badly.
- **Risk:** crowded narrative; needs a sharp anti-double-counting story.

### 5. Fund subscription and redemption workflow
Investor subscribes, administrator validates, units issue, NAV updates, redemption settles.

- **Four verbs:** clean mapping, and it's a genuine back-office pain point.
- **Why Canton:** investor registers are confidential by law in most jurisdictions.
- **Risk:** the least visually exciting idea here. Wins on completeness, not demo flash.

### 6. Repo / collateral management
Collateral pledged, substituted mid-term, recalled, with a regulator view.

- **Four verbs:** especially strong on *state change* — substitution is the hard part and shows real domain depth.
- **Why Canton:** bilateral terms are private, exposure reporting is not.
- **Risk:** hardest domain to model correctly. High ceiling, high effort.

### 7. Tokenised invoice-to-cash for SMEs
Full order → invoice → financing → settlement chain for small businesses.

- **Four verbs:** natural fit end to end.
- **Why Canton:** SME financials are private, financier needs verified facts.
- **Risk:** similar to #3; pick one, not both.

### 8. Insurance claims workflow
Policy issuance, claim submission, adjuster state changes, payout transfer, audit.

- **Four verbs:** maps almost perfectly.
- **Why Canton:** claimant medical/loss detail must stay private from other parties.
- **Risk:** payout leg needs a cash rail — stub it and say so.

### 9. Royalty distribution for licensed IP
Rights issuance, usage reporting, waterfall distribution, statement audit.

- **Four verbs:** good, though "transfer" is the weakest leg.
- **Why Canton:** per-rightsholder confidentiality with an auditable aggregate.
- **Risk:** the waterfall maths is where it gets interesting — make that the demo.

### 10. Regulatory reporting fabric
Sits across any of the above: participants keep private state, the regulator gets a continuously provable view without a data warehouse.

- **Four verbs:** audit is the *entire product* — strongest on that leg, weakest on the other three.
- **Why Canton:** this is arguably what Canton was built for.
- **Risk:** **infrastructure, not a business** — and they asked for business-first. Pair it with one concrete asset class rather than shipping it standalone.

---

## My ranking for this event

1. **#1 Trade finance LC** — the most legible "real business problem" on the page, and privacy is load-bearing rather than decorative.
2. **#3 Supply-chain receivables** — shares domain work with the Arbitrum factoring idea, cutting total effort across two events.
3. **#6 Repo/collateral** — best impression on ecosystem judges who know the domain, if the ramp-up goes well.

**The honest call:** HackCanton has the best win probability on the board and the
worst fit with everything else. Doing it properly means **not** doing the Oct
4–14 EVM stack. Doing both means doing both badly.
