# Deadline Board — as of Sept 17, 2026

Sorted by how soon they close. KeeperHub excluded per request.

## Verification status (read this first)

This container's egress proxy **blocks every official hackathon domain**
(`colosseum.com`, `hackathon.monad.xyz`, `*.hackquest.io`, `devpost.com`,
`dorahacks.io`, `kaggle.com`, `arcprize.org`, `lablab.ai` — all return `000`).
So deadlines and rubrics below were reconstructed from **web-search results, not
the live pages**.

| Confidence | Item |
|---|---|
| High — confirmed in search | Colosseum Sept 14–Oct 12 · Monad Oct 13 (judging Oct 14–27, winners Nov 3) · Arbitrum Buildathon 3 weeks from Sept 14 · RevenueCat store-release window Aug 1–Sept 30 |
| Medium — one source | Arbitrum rubric (4 named criteria) · HackCanton 5-week/Oct 14 |
| Low — master list only | Nimiq, Midnight, emma, RYO-CHAN, Convex "closing soon" |

**Reconfirm on the official page before committing build time.**

---

## The ranking

| # | Hackathon | Closes | Days left | Verdict |
|---|---|---|---|---|
| 1 | Bittensor Subnet — *proposal* | Sept 20 | **3** | Cheap lottery ticket |
| 2 | XRPL Make Waves | Sept 21 | **4** | ❌ Not viable |
| 3 | Kaggle Kaggriculture (reg) | Sept 23 | **6** | ❌ Wrong discipline |
| 4 | RevenueCat Shipaton | Sept 30 | **13** | ⚠️ One narrow path only |
| 5 | ARC-AGI-3 Milestone 2 | Sept 30 | **13** | ❌ Not winnable |
| 6 | **Arbitrum Open House SG** | **Oct 4** | **17** | ✅ **Primary** |
| 7 | **Colosseum World's Fair** | **Oct 12** | **25** | ✅ **Primary** |
| 8 | **Monad Metropolis** | **Oct 13** | **26** | ✅ **Primary** |
| 9 | **HackCanton S3** | **Oct 14** | **27** | ✅ **Best odds** |
| 10 | AMD ACT III | Oct 18 | 31 | Side option (Italy on-site) |
| 11 | Bittensor — full impl | Oct 19 | 32 | Only if #1 lands |

---

## Why the five nominally-closer ones are excluded

**XRPL Make Waves (Sept 21).** Scores on *real mainnet volume and active users*
from a live app. Four days is not enough to deploy, get users, and generate
volume. You'd be submitting an empty app against 90-day incumbents.

**Kaggriculture (Sept 23) and ARC-AGI-3 (Sept 30).** Both are ML leaderboard
competitions, not build hackathons — a different skill from Solidity+agents.
ARC-AGI-3 in particular: frontier models score **under 1%**, and Claude/GPT APIs
are *excluded at eval*. The $700k grand prize is unclaimable by construction.

**RevenueCat Shipaton (Sept 30) — the important nuance.** Main prizes require
first store release between Aug 1 and Sept 30, and RevenueCat itself says submit
for review **a week early**. Ship a new app, pass App Store review, and show
growth metrics in 13 days — no.
**But the student "Next Gen Award" is judged on video + open-source code with
no store release required.** If the GBSB student angle holds, that's a real,
cheap shot. Flagging it as your call — say the word and I'll work it up.

**Bittensor proposal (Sept 20).** Three days, and it's *only a proposal* —
mechanism design write-up, no implementation until Oct 19. Low cost, low
probability, Python not Solidity. Worth 3–4 hours if you want a free option;
not worth displacing the Oct cluster.

---

## The actual answer

The closest deadlines that are **both near and winnable** are the
**Oct 4 → Oct 14 cluster**: Arbitrum, Colosseum, Monad, HackCanton.

That clustering is the opportunity, not a scheduling problem. Arbitrum and
Colosseum both explicitly allow existing projects, and Colosseum has an
Arbitrum ecosystem track. **One core codebase can feed three submissions** —
build for Arbitrum first (earliest deadline, forces a working MVP), then fork
deployments and demos for Colosseum and Monad.

Each program requires the *submitted* work to be built in-window. Shared
libraries are fine; program-specific deployments and demos are mandatory.

HackCanton sits apart — Daml, not Solidity — so it's a genuine either/or
against the stack. Its compensation is the weakest field of the four.
