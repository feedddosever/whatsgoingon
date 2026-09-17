# Monad Metropolis — 10 Ideas

**Closes Oct 13 (26 days) · judging Oct 14–27 · winners Nov 3 · solo OK**

## The rubric

No public point-scoring rubric was found. What *is* confirmed:

- **Submission = working product + public profile + demo + short write-up + code link.**
- **"Judges need to be able to verify what you built during the six weeks."**
- Open-sourcing encouraged, not required.
- Judged **per track**.

**Money:** four tracks × $30k, **split evenly between 3 teams = $10k each**
(so **12 winners**), plus a **$25k grand champion**, plus sponsor bounties on top.

**Two things follow from that structure:**

1. **12 paid slots is the most winnable headline prize on the whole board.** Target a track placement, not the champion slot.
2. **Sponsor bounties stack.** Chainlink, Privy, Nansen, Kuru, Agora. Every idea below names which bounties it can claim — that's where a $10k result becomes $20k.

**Monad-specific:** it's a parallel EVM optimised for high throughput and cheap
execution. A project that would work identically on any L2 wastes the venue.
**Every idea below needs many cheap onchain writes to make sense** — that's the
"why here" judges will look for.

**Tracks:** Onchain Finance & Trading · Consumer & Payments ·
Social/Attention/Culture · **Trust, Identity & AI Infrastructure**

---

## Track: Trust, Identity & AI Infrastructure (best fit)

### 1. AgentLedger — every agent action attested onchain
An append-only registry where an autonomous agent writes a signed attestation for
each action it takes. Reputation is computed from the verifiable history.

- **Build:** `AttestationRegistry.sol`, agent SDK middleware, reputation indexer, explorer UI.
- **Why Monad:** this is **only economically possible on a cheap parallel chain** — thousands of writes per agent per day. The strongest "why here" of any idea on this page.
- **Bounties:** Privy (agent identity/auth), Nansen (reputation analytics).
- **Risk:** "registry" projects read as thin. The reputation scoring must be substantive, not a row count.

### 2. Guardrail (Monad build) — onchain spend limits for agents
Same core as Arbitrum #2, redeployed with per-action onchain accounting rather
than periodic checkpoints.

- **Why Monad:** cheap writes let you enforce limits **per action** instead of per epoch — a materially better product, not just a redeploy.
- **Bounties:** Privy (embedded wallets + policy).
- **Risk:** reviewers may spot the Arbitrum entry. Keep the in-window delta real and documented.

### 3. ProofOfPrompt — verifiable AI inference receipts
Commit prompt+model+output hashes onchain so an agent's claims can be audited
after the fact. Challenge window where anyone can dispute a receipt.

- **Why Monad:** one receipt per inference is only viable at Monad's cost profile.
- **Bounties:** Chainlink (external verification), Privy.
- **Risk:** you can't prove the model actually ran — only that someone committed to a claim. **Say this plainly in the write-up.** Judges punish overclaiming far harder than limited scope.

### 4. SybilGate — agent-vs-human gating for onchain actions
Composable modifier that lets a protocol price or restrict actions by whether the
caller is a verified human, a registered agent, or unknown.

- **Why Monad:** high-throughput chains get flooded by bots; this is a native problem.
- **Bounties:** Privy (identity), Nansen (wallet clustering).
- **Risk:** depends on an external personhood provider — be upfront about the dependency.

---

## Track: Onchain Finance & Trading

### 5. KuruBot — strategy vault on Kuru's orderbook
Depositors fund an ERC-4626 vault; a market-making agent quotes on Kuru with
drawdown limits enforced in the contract.

- **Why Monad:** onchain orderbook market-making needs constant quote updates — the canonical use for a fast chain.
- **Bounties:** **Kuru (direct)**, Nansen (analytics).
- **Risk:** live trading demos break. Record a backup run and show testnet PnL over days, not minutes.

### 6. LiquidGuard — per-block liquidation protection
Monitors positions every block and auto-deleverages *before* liquidation rather
than after.

- **Why Monad:** per-block monitoring and intervention is infeasible on slower chains. Excellent "why here".
- **Bounties:** Chainlink (price feeds), Kuru (execution venue).
- **Risk:** needs a lending protocol to integrate against. Fork one and be explicit that it's a controlled environment.

### 7. FlowDesk — intent-based recurring DCA with onchain execution proof
Users set an intent; solvers compete to fill; every fill is proven onchain.

- **Why Monad:** frequent small fills are cost-prohibitive elsewhere.
- **Bounties:** Kuru, Chainlink, Agora.
- **Risk:** intent architectures are fashionable and crowded. Differentiate on the execution-proof piece.

---

## Track: Consumer & Payments

### 8. TapPay — offline-capable micropayments
Sub-cent payments that batch and settle onchain, for streaming, tipping, and
pay-per-use APIs.

- **Why Monad:** micropayments are the textbook case for cheap execution.
- **Bounties:** Privy (onboarding), Agora (stablecoin rails).
- **Risk:** weakest technical novelty of the set. Wins on execution and UX or not at all.

---

## Track: Social / Attention / Culture

### 9. Provenance — a feed where every post carries an AI-disclosure attestation
Posts are signed; AI-generated content is declared onchain; readers filter by
provenance. Lying is slashable.

- **Why Monad:** one attestation per post only works at very low cost.
- **Bounties:** Privy, Nansen.
- **Risk:** social apps die without users. Demo with seeded activity and **don't fake engagement** — judges spot it.

### 10. Curate — stake-weighted content curation with real payouts
Curators stake on content; accurate early curation earns a share of attention
revenue; bad calls get slashed.

- **Why Monad:** continuous per-interaction settlement.
- **Bounties:** Nansen, Agora.
- **Risk:** token-incentive designs are easy to game; expect a mechanism-design challenge from judges and have the answer ready.

---

## My ranking for this event

1. **#1 AgentLedger** — strongest "why Monad" on the page, lands in the track that matches the Solidity+AI profile, and stacks Privy + Nansen bounties.
2. **#5 KuruBot** — direct sponsor bounty from Kuru on top of a $10k track slot, and a finance-track field that rewards working systems.
3. **#6 LiquidGuard** — best pure engineering story; per-block intervention is a genuinely Monad-shaped product.

**Strategy note:** the four tracks are judged separately and each pays three
winners. **Pick the track with the weakest field, not the one with the best
idea.** Trust/Identity/AI is the newest of the four and the likeliest to be
thin — but check the submission counts on the public profiles before the
deadline and move if one track is visibly emptier.

**#2 Guardrail is the stacking candidate** (Arbitrum → Colosseum → Monad), but
it's the one most exposed to a "you submitted this elsewhere" objection.
Only run it if the per-action-accounting rework is real.
