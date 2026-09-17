# whatsgoingon — hackathon planning

Working notes for picking and shipping hackathon entries.
Kept in git so the context survives between sessions.

## Contents

| File | What's in it |
|---|---|
| [`hackathons/00-source-master-list.md`](hackathons/00-source-master-list.md) | The original research sweep (Sept 17, 2026) — full tier list of ~40 events |
| [`hackathons/01-deadline-board.md`](hackathons/01-deadline-board.md) | Deadlines ranked, what's excluded and why, verification confidence |
| [`hackathons/02-arbitrum-singapore.md`](hackathons/02-arbitrum-singapore.md) | Oct 4 · 10 ideas · rubric = contract quality / PMF / innovation / real problem |
| [`hackathons/03-colosseum-worlds-fair.md`](hackathons/03-colosseum-worlds-fair.md) | Oct 12 · 10 ideas · judged as a seed pitch |
| [`hackathons/04-monad-metropolis.md`](hackathons/04-monad-metropolis.md) | Oct 13 · 10 ideas · 12 paid slots + sponsor bounties |
| [`hackathons/05-hackcanton-s3.md`](hackathons/05-hackcanton-s3.md) | Oct 14 · 10 ideas · Daml, not Solidity |

## The decision

The nearest winnable deadlines are the **Oct 4 → Oct 14 cluster**. Everything
closing sooner is either not viable (XRPL needs live mainnet volume in 4 days),
the wrong discipline (Kaggle, ARC-AGI), or effectively closed (RevenueCat needs
a shipped App Store release — **except** its student Next Gen Award).

Two mutually exclusive paths:

**Path A — the EVM stack (higher ceiling).**
One codebase, three submissions. Build for Arbitrum (Oct 4, earliest deadline
forces a working MVP), then extend for Colosseum (Oct 12) and Monad (Oct 13).
Colosseum has an Arbitrum ecosystem track, so the Oct 4 work is already
eligible. Each event needs *new in-window work* — keep a clean commit boundary
at each deadline so the delta is provable.

**Path B — HackCanton (higher probability).**
Weakest field of the four, single narrow track, but it's Daml rather than
Solidity and needs ~5 days of ramp-up. Doing this properly means not doing
Path A.

Doing both means doing both badly.

## Caveats

Deadlines and rubrics were reconstructed from **web search, not the official
pages** — this container's egress proxy blocks every hackathon domain.
Confidence levels are tabulated in the deadline board. **Reconfirm on the
official page before committing build time.**
