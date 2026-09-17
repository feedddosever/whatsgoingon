# Arbitrum Open House Singapore — 10 Ideas

**Closes Oct 4 (17 days) · $115k ($40k/$20k/$10k + $15k promising + $30k grants) · solo OK · existing projects allowed**

## The rubric (all four must be hit)

| Criterion | What judges actually want |
|---|---|
| **Smart contract quality** | Best practices, logical structure, efficient, **minimal security vulnerabilities** |
| **Product-Market Fit** | Clear potential to attract *and retain* users |
| **Innovation & Creativity** | Original approach that pushes boundaries |
| **Real Problem Solving** | Addresses a genuine market need |

**Read the room:** top 3 get a seat at Founder House (Oct 23–25, Singapore).
Judges are picking *founders*, not demos. Workshop topics were product, GTM, UX,
**agentic commerce**, wallet infra, **emerging markets** — that telegraphs what
they want to fund. Every idea below is aimed at that signal.

Because "smart contract quality" is an explicit criterion, **every submission
ships with a Foundry test suite, fuzz/invariant tests, and a short threat
model in the README.** That's cheap for me and most entrants won't do it.

---

### 1. AgentEscrow — pay-per-call settlement for AI-agent commerce
Agent deposits USDC into an escrow; the service returns an EIP-712 signed
delivery receipt; funds settle per call. 24h dispute window with a slashable bond.

- **Build:** `Escrow.sol` + `ReceiptVerifier.sol`, a TS SDK middleware wrapping any HTTP API, demo agent that buys 100 calls live.
- **Contract quality:** tiny surface, pull-payments, reentrancy-guarded, invariant test "sum of balances == deposits − settled".
- **PMF:** every agent framework needs metered payment; retention is structural — once your API meters through it, you stay.
- **Innovation:** receipts are batched and settled in one tx, so per-call cost is amortised.
- **Real problem:** agents cannot hold credit cards. This is the workshop's own "agentic commerce" theme.
- **Risk:** crowded space — differentiate on the dispute/slashing mechanism, which most x402 clones skip.

### 2. Guardrail — spend limits for autonomous agents
An ERC-7702/4337 module that caps what an agent wallet can spend per period,
allowlists call targets, and requires human co-sign above a threshold.

- **Build:** validator module + revocation registry + a dashboard showing a live agent hitting its ceiling and stopping.
- **Contract quality:** this *is* a security product — the test suite is the pitch. Fuzz the limit accounting.
- **PMF:** the #1 blocker to funding an agent wallet is "what if it drains me".
- **Innovation:** limits enforced at the validation layer, so a compromised agent key still can't exceed the cap.
- **Real problem:** direct, and every judge feels it.
- **Risk:** 7702 tooling maturity. Mitigate by shipping a 4337-module fallback.

### 3. FactorFi — invoice factoring for freelancers
Tokenize an unpaid invoice, an LP pool advances 85% USDC immediately, the payer
settles onchain and the pool takes the spread.

- **Build:** `InvoiceNFT.sol`, `FactorPool.sol` (ERC-4626), simple underwriting oracle stub, payer checkout page.
- **Contract quality:** ERC-4626 is a well-trodden, auditable base; add default-waterfall invariants.
- **PMF:** freelancers wait 30–90 days to get paid — the pain is acute and recurring.
- **Innovation:** credit priced from onchain payment history instead of KYC paperwork.
- **Real problem:** SEA/emerging-market cross-border freelancing is squarely in their stated focus.
- **Risk:** real-world default is unmodellable in 17 days. Scope the demo to a closed set of whitelisted payers and *say so* — judges respect a stated boundary more than a fake one.

### 4. StylusRisk — a Rust/Stylus margin engine as a public good
Portfolio VaR and options pricing are too gas-expensive in Solidity. Implement
them in Stylus, expose as a contract any protocol can call.

- **Build:** Rust Stylus contract + Solidity adapter + gas benchmark table vs. a Solidity reference impl.
- **Contract quality:** the benchmark *is* the quality evidence — measured, not claimed.
- **PMF:** infrastructure other teams adopt; land 2–3 design partners during the buildathon and say so on stage.
- **Innovation:** **highest-scoring idea here.** Stylus is Arbitrum's actual differentiator and almost nobody uses it well.
- **Real problem:** undercollateralised lending is bottlenecked on cheap risk math.
- **Risk:** Rust/Stylus toolchain is the one genuinely new thing for me. Budget 3 days for a spike before committing.

### 5. Sentinel — AI anomaly watcher with an onchain circuit breaker
An off-chain model watches protocol state, signs an anomaly attestation, and a
contract auto-pauses on a quorum of watcher signatures.

- **Build:** `PauseGuard.sol` with threshold signatures, a watcher daemon, and a **live replay of a real historical exploit** where the pause fires before the drain completes.
- **Contract quality:** pause logic is security-critical and judges will inspect it closely — this cuts both ways, so keep it minimal and heavily tested.
- **PMF:** every protocol wants it; hard to build in-house.
- **Innovation:** the exploit replay is the demo that gets remembered.
- **Real problem:** billions lost to exploits that a 30-second pause would have contained.
- **Risk:** governance objection — "who watches the watchers". Answer it pre-emptively with a decentralised quorum and a timelocked unpause.

### 6. Remit — streaming stablecoin payroll for contractors
Per-second salary streaming in USDC, with a batch off-ramp hook.

- **Build:** streaming contract (Sablier-like but batched for payroll), employer dashboard, contractor claim page.
- **Contract quality:** straightforward, so win on rigor — full invariant coverage on stream accounting.
- **PMF:** strong and recurring; employers churn slowly.
- **Innovation:** weakest axis here — needs an angle. Suggest: **FX-hedged streams** so the contractor receives a local-currency-pegged amount.
- **Real problem:** cross-border payroll to SEA is slow and expensive.
- **Risk:** Sablier/Superfluid already exist. Only run this with the FX hedge angle; otherwise it reads as a clone.

### 7. ParamCover — parametric uptime insurance for infra providers
Underwrite RPC/API SLAs. Oracle-fed downtime measurement, automatic payout, no
claims process.

- **Build:** `Policy.sol` + `UnderwriterPool.sol`, multi-prober downtime oracle, live demo killing a probe target to trigger payout.
- **Contract quality:** clean actuarial accounting, capital-adequacy invariant (pool can always cover open policies).
- **PMF:** B2B, real budgets, contractual renewal.
- **Innovation:** parametric insurance without an adjuster.
- **Real problem:** SLA credits today are manual, slow, and capped.
- **Risk:** oracle manipulation is the obvious attack — address it explicitly with multi-prober quorum and geographic spread.

### 8. CreditGraph — portable undercollateralised credit score
Derive a score from onchain repayment history, publish as an attestation,
let lenders subscribe and underwrite against it.

- **Build:** scoring indexer, attestation issuer, `LendingPool.sol` that reads scores, borrower dashboard.
- **Contract quality:** clean separation between scoring (off-chain) and enforcement (on-chain).
- **PMF:** unlocks the largest unmet need in DeFi.
- **Innovation:** portability across protocols is the novel bit, not the score itself.
- **Real problem:** overcollateralisation excludes exactly the emerging-market users they named.
- **Risk:** sybil resistance. Be honest that v1 requires a proof-of-personhood dependency.

### 9. OpenDesk — automatic revenue-share for open-source dependencies
Read a project's manifest, resolve maintainers, split incoming revenue down the
dependency tree. Agents auto-pay for the libraries they consume.

- **Build:** manifest parser, `Splitter.sol` with recursive weights, claim UI, demo splitting a real payment across a live repo's deps.
- **Contract quality:** gas-bounded recursion is the interesting engineering problem — depth caps and merkle claims.
- **PMF:** moderate. Funding OSS is famously hard to monetise.
- **Innovation:** high — dependency-tree-weighted splits are genuinely novel.
- **Real problem:** real, but judges may read it as a public good rather than a business.
- **Risk:** **PMF is the weak leg** and PMF is an explicit criterion. Only pick this if you'd rather target Colosseum's public-goods prize.

### 10. CheckoutKit — gasless USDC checkout for small merchants
A drop-in widget: customer pays USDC, paymaster covers gas, merchant settles to
a local off-ramp. Stripe-simple.

- **Build:** paymaster config, `Settlement.sol`, embeddable JS widget, a real demo storefront taking a live payment.
- **Contract quality:** settlement accounting + refund path, fully tested.
- **PMF:** the clearest retention story of any idea here — merchants integrate once and stay.
- **Innovation:** lowest of the ten; it's execution and UX, not novelty.
- **Real problem:** very real for emerging-market SMBs.
- **Risk:** innovation is an explicit criterion and this scores worst on it. Strong fallback, weak headliner.

---

## My ranking for this event

1. **#2 Guardrail** — hits all four criteria evenly, and "security product" plays directly into the contract-quality criterion.
2. **#1 AgentEscrow** — best PMF + on-theme with agentic commerce; also the best candidate to **stack into Colosseum and Monad**.
3. **#4 StylusRisk** — highest ceiling on innovation, highest execution risk. Only if the Rust spike goes well.

**#6 and #10 are weak on innovation; #9 is weak on PMF.** With four equally
weighted criteria, an idea that fails one leg loses to a rounder one.
