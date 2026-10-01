# Shipaton 2026 — what is actually left

**Deadline: 30 September 2026, 11:45pm PT.**

> Status, 2026-10-01: the deadline has passed. This file is the plan as it stood
> in the run-up, updated where the app has changed since. The form answers are
> in `docs/DEVPOST.md`.

Run `npm run preflight` rather than reading a list someone wrote down. It checks
what can be checked and says plainly which items need a human. Everything below
explains the items it can only point at.

---

## One thing blocks a store release

**A real, monitored support address.** Set `EXPO_PUBLIC_SUPPORT_EMAIL` and it
fills four places at once — the app's "tell me when my state is ready" button,
`/privacy`, `/terms`, and the store listing. There is no second copy to update.

```
EXPO_PUBLIC_SUPPORT_EMAIL='you@example.com' npm run build:web
```

Unset, the legal pages say there is no address yet rather than printing a
placeholder that looks like one, and the waitlist button does not render at all.
That is the honest failure mode, and it is still a failure: every app store
requires the address, and **the Peace Prize needs the store release.**

Use an address you will actually read for a year. It goes on a public page.

---

## What is already done

| | |
|---|---|
| Public repo, MIT licence | Next Gen's hard requirement — met |
| Devpost copy | `docs/DEVPOST.md`, every figure engine-produced, plus the award-field answers |
| Demo video script | `docs/DEMO-VIDEO.md`, shot list with verified figures |
| Demo video | Recorded with an AI voice-over (local files, not in git) — two beats predate the 2026-10-01 data fixes |
| Icon and splash | Real mark, HTML source in `scripts/art/` |
| Phone screenshots | `docs/store/screenshots/`, captured from the built bundle, not mocked |
| Marketing screenshots | `docs/store/marketing/`, 1080×1920 with captions |
| Thumbnail | `docs/store/thumbnail-3x2.png`, 1500×1000 |
| Link-preview card | `docs/store/og.png` |
| Landing page | `/start` — static, instant, with OG tags |
| Privacy and Terms | Rendered to `/privacy` and `/terms` at build time |
| RevenueCat | Native + web, Paywall and Customer Center |
| APK build path | `.github/workflows/android-apk.yml`; a debug build on the RevenueCat Test Store key, on purpose (README) |
| Data verified | Every state's data re-read against primary sources on 2026-10-01; reports in `data/research/VERIFIED-*.md` |
| #BuildInPublic plan | 33 Reels, `docs/BUILD-IN-PUBLIC.md` |

---

## The categories, in order of expected return

### Next Gen — the anchor

Student-only, **no store release required**. The repo is public and MIT-licensed
already, so what is left is the Devpost entry, a verified academic email on the
profile, and the video.

That is the whole category. Do it first, and do it early enough that a problem
with the email verification is not fatal.

### Peace Prize — the upside

Judged on impact, feasibility and **reach**. Reach is the argument this project
can now make properly: 51 jurisdictions in the dataset, the statewide transfer
rule for every one of them (41 of 46 read at source), campus pricing in five
states — 119 universities — and an app that says which is which.

Needs an in-window store release, which needs the address above.

### #BuildInPublic — cheapest prize in the event

Judged on the journey you posted, not the app. Worth nothing without a posting
history, and last year's winner's own account of how he knew he had won was that
his competition had given up. **Attrition is the opponent.**

### Design Award — live

The dark plan map, the amber "?" badges on unconfirmed data, the one-question-at-a-time
onboarding with its step transitions, and the salad-and-salt "preparing your
plan" scene are the case. Every animation respects the system reduce-motion
setting — say so in the video, judges notice.

### Grand Prize — skip; HAMM — optional

Grand Prize is judged on post-release growth numbers, and there has been no
store release. HAMM costs nothing to enter: `docs/DEVPOST.md` explains the model
honestly, including that the Test Store build has no revenue data.

---

## The video is most of the score

`docs/DEMO-VIDEO.md` is the shot list. The three beats, in order:

1. Three CLEP exams stranded at UC Berkeley.
2. The same three clearing three requirements in Florida — **$2,505 → $1,002**.
3. The lowest-risk route leaving requirements open rather than leaning on a row
   marked "?" — at UT Austin it clears 8 of 14 and prices the rest as courses.

The third beat is the one to enter with. An app that admits it does not know is
the whole argument, and it is what a judge will still remember after the others
blur. (Until 2026-10-01 Texas's lowest-risk route was entirely empty; reading
UT Austin's own chart is what filled it.)

Two production notes that matter more than they sound: Instagram and most judges
watch with sound off, so burn in the spoken numbers; and if the entitlement is
live on a device, **complete a sandbox purchase on camera**. That single cut is
worth more to a RevenueCat judge than any other five seconds in the video.

---

## Be honest about the data — it is a strength here

The instinct is to hide that most rows are `needs_check`. Do the opposite.

Every other entry will claim its data is right. This one shows its confidence
level on every claim, refuses to recommend anything it has not confirmed, and
returned an **empty** conservative route in Texas and Florida until their
sources had been read, rather than relaxing a threshold. That is not a weakness to explain away — it is the
only interesting product decision in the submission, and it is defensible for
exactly the reason the app exists: a student who acts on a wrong transfer-credit
claim loses real money and a real semester.

The corrections ledger is part of the same story. This repo shipped eleven
Florida rows claiming a general-education area they did not clear, found it in
an audit, and fixed it — and the 2026-10-01 verification pass found more in both
directions, including Florida AP sciences priced at a 4 where the state awards
credit at a 3. Say that out loud.

---

## Order of work

1. **Set the support address.** One env var, unblocks the store path.
2. **Devpost entry + video** — Next Gen needs nothing else.
3. **Start posting today.** #BuildInPublic is the only category where late but
   real beats nothing.
4. **Galaxy Store release** — unlocks Peace Prize, Design, Best App for Galaxy.
5. ~~**Read Florida's Rule 6A-10.024 table.**~~ Done 2026-10-01 from the June
   2026 copy; the adopted text still needs opening by hand (see
   `data/research/VERIFIED-FLORIDA.md`).
