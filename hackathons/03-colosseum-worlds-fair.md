# Colosseum Crypto World's Fair — 10 Ideas

**Closes Oct 12 (25 days) · $840k prizes + $2.5M seed · solo OK · highest competition**

## The rubric — this one is different

Colosseum does **not** judge like a normal hackathon. From their own materials:

> Prizes are awarded to teams who intend to build **full-time** and develop
> products with **potentially viable business models**.

Plus:
- Judged **only on work completed during the hackathon** (prior context allowed).
- **Under-3-minute video** is the first thing judges see. Hundreds of submissions.
- There is always an award for the **best public good**.
- There is a **university prize** — the GBSB angle, if it applies.
- Winners feed the accelerator: **$250k pre-seed**.

**Translation:** this is a seed pitch, not a demo. Judges are asking "would I
fund this?" Novelty and code quality matter far less than a credible business
and a story told in 180 seconds. **The video is ~40% of the outcome here** —
budget two full days for it, not two hours.

**Money structure:** $30k grand prize · $300k split ~20 ways (~$15k each) ·
Solana and Tempo tracks $100k each · four Ethereum tracks ~$25k each
(Base, Robinhood Chain, Arbitrum, ETH L1) · public-goods and university prizes.

**The ~$15k × 20 pool is the realistic target.** One of twenty is a far better
bet than one of ~2,800 for the grand prize, and it pays more than most
whole hackathons on the list.

---

## Ideas 1–3 — the stacking plays (recommended)

### 1. AgentEscrow → Ethereum/Arbitrum track
Same core as Arbitrum #1, resubmitted with meaningful in-window additions.

- **Why here:** Colosseum's Arbitrum track means your Oct 4 build is already ecosystem-eligible. Add multi-chain settlement + a real paying design partner between Oct 4 and Oct 12.
- **Business model:** take rate on settled volume. Easy to state in the video.
- **Full-time story:** "agent payment rails" is a fundable category, not a weekend project.
- **Risk:** must show *new* work built in-window. Keep a clean commit boundary at Oct 4 so the delta is provable.

### 2. Guardrail → Ethereum L1 track
Agent spend limits, pitched as infrastructure.

- **Why here:** security infra reads as fundable, and L1 is where the institutional agent money will custody.
- **Business model:** per-seat SaaS for teams running agent fleets, plus an enterprise tier.
- **Risk:** needs a sharper "who pays" answer than AgentEscrow.

### 3. Agent-payments protocol spec → public-goods prize
Ship the receipt/settlement standard from #1 as an MIT-licensed spec plus a
reference implementation, deliberately unmonetised.

- **Why here:** the public-goods prize is a **separate, far less contested pool**, and this is a genuine second entry from the same codebase.
- **Business model:** none by design — that's the point of the category.
- **Risk:** don't submit this *and* #1 as competing entries in the same track; pick different pools.

---

## Ideas 4–7 — ecosystem-targeted

### 4. Tempo track — merchant settlement for stablecoin payments
Tempo is payments-focused and carries a **$100k pool**.

- **Build:** settlement contract + reconciliation ledger + merchant dashboard; batch netting so a merchant settles once daily instead of per-transaction.
- **Business model:** basis points on settled volume — the most legible model in the whole list.
- **Why it scores:** biggest pool, and payments is exactly Tempo's thesis, so track fit is unambiguous.
- **Risk:** Tempo is new to me; budget a day on docs before committing.

### 5. Hyperliquid track — agent-run market-making vault with hard risk limits
Depositors fund a vault, an agent runs strategy, but position limits and
drawdown stops are enforced **in the contract**, not in the agent.

- **Build:** ERC-4626 vault + risk module + strategy agent + live testnet PnL.
- **Business model:** performance fee. Obvious and proven.
- **Why it scores:** "agent trades, contract constrains it" is a clean, fundable thesis.
- **Risk:** live trading demos fail on stage. Record a backup run.

### 6. Zcash track — privacy-preserving contractor payroll
Salaries shouldn't be public. Shielded disbursement with a selective-disclosure
receipt for the employer's accountant.

- **Build:** shielded payout flow + viewing-key-scoped audit export.
- **Business model:** per-employee SaaS.
- **Why it scores:** Zcash track is almost certainly the **least contested** of the eight — most entrants default to Solana.
- **Risk:** ZK tooling learning curve is real. Highest technical risk on this page.

### 7. Base track — consumer agent wallet with social recovery
A normal-person wallet where an agent handles gas, swaps, and subscriptions, with
guardian-based recovery.

- **Build:** smart wallet + agent executor + onboarding flow with no seed phrase.
- **Business model:** interchange/spread on in-wallet swaps.
- **Why it scores:** Base judges reward consumer UX over protocol novelty.
- **Risk:** consumer wallets are the single most crowded category in crypto. Needs a genuinely distinct hook or skip it.

---

## Ideas 8–10 — different pools, different odds

### 8. University prize — same product, student framing
If the GBSB enrolment is current, submit a primary idea into the university pool.

- **Why:** dramatically smaller field for the same build. **Pure upside** — no extra engineering, just a different submission form.
- **Risk:** verify eligibility before counting on it. This is a question for you, not something I can confirm.

### 9. Solana track — onchain subscription primitive
Recurring payments are still awkward on Solana. Delegate-based pull subscriptions
with a merchant SDK.

- **Build:** Anchor program + SDK + demo merchant.
- **Business model:** per-transaction fee.
- **Why it scores:** $100k pool, real infrastructure gap.
- **Risk:** **Solana is the most contested track** (last edition: 2,857 submissions overall, heavily Solana-weighted) and Anchor/Rust is a context switch off the Solidity stack. Worst effort-to-odds ratio here despite the big pool.

### 10. Robinhood Chain track — tokenised equity corporate actions
Handle dividends, splits, and voting for tokenised equities — the unglamorous
plumbing that makes tokenised stock actually usable.

- **Build:** corporate-actions registry + distribution contract + holder claim UI.
- **Business model:** infrastructure licensing to issuers.
- **Why it scores:** a new, thin track with few entrants, and it's the real unsolved problem in tokenised equity.
- **Risk:** least information available about this track's requirements.

---

## My ranking for this event

1. **#1 AgentEscrow (Arbitrum track)** — the stacking play. Near-zero marginal cost after Oct 4, and it lands in a $25k track rather than the bloodbath.
2. **#4 Tempo merchant settlement** — $100k pool, cleanest business model, strong track fit.
3. **#3 Public-goods spec** — a second shot from the same code into an uncontested pool.

**Deliberately avoid #9 (Solana).** Biggest pool, worst odds, and a language
switch. The whole edge here is that Colosseum went cross-ecosystem this year —
take the thin tracks, not the famous one.

**Budget reality:** at ~2,800 submissions last edition, treat Colosseum as the
lottery ticket you buy with work already done for Arbitrum — not as the event
you build *for*.
