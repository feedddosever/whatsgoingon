/** Confidence in a data row. Drives the "lowest-risk" route and the UI badge. */
export type Confidence =
  | 'statute'      // guaranteed by state law (e.g. Texas Education Code 61.822)
  | 'published'    // institution's own published policy page
  | 'needs_check'  // plausible but unconfirmed — NEVER shown as a promise
  | 'unverified';  // seeded from model knowledge, not yet checked against source

/** Every factual row carries its provenance. No exceptions — this is the product. */
export interface Provenance {
  source_url: string;
  as_of: string;        // ISO date the source was last read
  confidence: Confidence;
  note?: string;        // what could bite the student
}

/**
 * Two-letter postal code. The unit of jurisdiction: transfer law, fee waivers
 * and general-education frameworks are all set at the state level in the US,
 * and almost nothing about them is federal.
 */
export type StateCode =
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'DC' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD' | 'MA'
  | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ' | 'NM' | 'NY'
  | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC' | 'SD' | 'TN' | 'TX'
  | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY';

/**
 * A public higher-education system, e.g. `UC`, `CSU`, `TX-PUBLIC`, `FL-SUS`.
 *
 * Deliberately an open string rather than a closed union. It was `'UC' | 'CSU'`
 * while the dataset was California-only, which meant every new state was a
 * change to this file — a type that has to be edited to add data is a type that
 * makes adding data expensive. Systems are now declared in the dataset, and the
 * engine resolves them there.
 */
export type SystemId = string;

export interface System {
  id: SystemId;
  /** As a student would say it: "University of California". */
  name: string;
  /** As a chip: "UC". */
  short_name: string;
  state: StateCode;
  /** The general-education framework this system's campuses run on. */
  framework_id: string;
}

/**
 * A statewide general-education framework — Cal-GETC in California, the Texas
 * Core Curriculum, Florida's general education core.
 *
 * These exist because states legislate them, and they are the reason this app
 * can say anything useful at all: without a statewide pattern there is no
 * requirement list to plan against, only 4,000 separate catalogues.
 */
export interface GeFramework {
  id: string;
  /** Printed to the student and to their advisor. */
  name: string;
  /** Expanded once, the first time it appears on a screen. */
  full_name: string;
  state: StateCode;
  /** What the whole pattern totals, in semester units. */
  total_units: number;
  provenance: Provenance;
}

/** A programme that can take a price to zero. Modelled per state. */
export interface AidProgram {
  name: string;
  /** Student-facing. Rendered verbatim. */
  note: string;
  provenance: Provenance;
}

/**
 * One state's rules, as opposed to one campus's.
 *
 * The single most valuable sentence this app has for a student is usually a
 * statewide guarantee — "finish the Texas core anywhere and it transfers whole",
 * "a Florida AA admits you to a state university as a junior". Those are
 * statute, they apply to every campus in the state at once, and they are what a
 * campus-by-campus dataset can never express.
 */
export interface Jurisdiction {
  code: StateCode;
  name: string;
  /** The statewide framework, or null where the state has none we model. */
  framework_id: string | null;
  /** The guarantee, in one sentence a student can act on. Null when there is none. */
  transfer_guarantee: string | null;
  transfer_provenance: Provenance;
  /** Programme that can waive community-college tuition here. */
  fee_waiver: AidProgram | null;
  /** Programme giving high-school students free or cheap college credit here. */
  dual_enrollment: AidProgram | null;
}

export interface Institution {
  id: string;
  name: string;
  system: SystemId;
  /**
   * What this institution charges per unit. Used to price the do-nothing path:
   * what the student pays if they clear every requirement here instead of
   * transferring credit in.
   *
   * This is a DERIVED estimate — neither UC nor CSU charges per unit — so it
   * carries provenance like any other claim. It now drives the headline saving,
   * which makes it the most scrutinised number in the app.
   */
  cost_per_unit_usd: number;
  cost_provenance: Provenance;
  /** Minimum units that must be earned AT this institution to graduate. */
  residency_min_units: number;
  /** Cap on units transferable in from community college, if any. */
  max_transfer_units: number | null;
  /**
   * Credit families this campus has PUBLISHED that it will not award at all.
   *
   * A list rather than one boolean per family, because the families keep
   * arriving: this was `accepts_clep`, then `accepts_clep` plus
   * `accepts_third_party_transcript`, and DSST would have made three booleans
   * that all mean the same thing. UC refuses CLEP, DSST and third-party
   * transcripts while accepting AP and IB, which is one fact about one campus
   * and reads as one field.
   *
   * Membership means a refusal we can point at. **Absence means only "no
   * published refusal on file" — never "they accept it."** Whether a specific
   * exam counts is an acceptance rule, and where we hold none the app says it
   * has no record rather than inventing a policy.
   */
  refuses: CreditKind[];

  /**
   * Provenance is per claim, not per row.
   *
   * These three fields are confirmed independently and were genuinely at
   * different confidence levels: the exam policy is published and checked, while
   * the residency minimum and transfer cap are not. A single row-level record
   * forced the UI to badge a residency warning "Published policy" on the strength
   * of a source that only covered CLEP — implying certainty the data does not
   * support, which is the one thing this product must never do.
   */
  exam_policy_provenance: Provenance;
  residency_provenance: Provenance;
  transfer_cap_provenance: Provenance;
}

/** One requirement in a statewide general-education framework. */
export interface GeArea {
  id: string;
  name: string;
  /**
   * Advisor shorthand, where the framework has one worth printing.
   *
   * "Cal-GETC 1A" is how a Californian advisor and a Californian catalogue both
   * refer to English Composition, so dropping it would cost the student the one
   * token that makes the packet searchable. Texas and Florida have no such
   * shorthand — their areas are called "Communication" — and the ids we give
   * them (`tx-comm`) are our own keys. Printing a key at a student is worse
   * than printing nothing, so this is optional and absent means "just the name".
   */
  code?: string;
  required_units: number;
  /** The framework this area belongs to. Area ids are unique across frameworks. */
  framework_id: string;
  /**
   * Which systems actually require this area. Not every area in a framework
   * applies everywhere — Cal-GETC 1C (Oral Communication) is a CSU requirement
   * and not a UC one — so a UC-bound student must not be told to solve it, and
   * its units must not inflate their baseline.
   *
   * This is also what scopes a national dataset: a Texas campus's system id
   * appears in no Cal-GETC area, so Californian requirements simply never reach
   * a Texas plan.
   */
  applies_to: SystemId[];
  provenance: Provenance;
}

/**
 * A family of credit, not a single exam.
 *
 * Families matter because campuses refuse by family, not by subject: UC awards
 * nothing for CLEP or DSST while accepting AP and IB, and that one sentence
 * decides whether a student's whole plan is worth anything.
 */
export type CreditKind =
  | 'ap' | 'ib' | 'clep' | 'dsst' | 'cc_course' | 'alt_provider';

/**
 * Who has reviewed a third-party course and said what it is worth.
 *
 * Neither body is an accreditor and neither can make a college award anything.
 * ACE and NCCRS *recommend* credit; the receiving institution decides, and a
 * great many decide no. A student who reads "ACE recommended" as "counts
 * everywhere" is making the most expensive mistake in this whole category.
 */
export type CreditRecognition = 'ace' | 'nccrs' | 'ace_and_nccrs';

export interface CreditSource {
  id: string;
  kind: CreditKind;
  name: string;
  /** What it costs the student to obtain, in USD. */
  cost_usd: number;
  /**
   * Who recommends it, for `alt_provider` rows. Absent on AP, CLEP and
   * community-college courses, which do not work this way: an AP score and a
   * college course are evaluated directly, not via a recommending body.
   */
  recognition?: CreditRecognition;
  /**
   * The transcript the credit actually arrives on, for `alt_provider` rows.
   *
   * This is the field that decides whether the credit is worth anything. Credit
   * from Sophia or Study.com is posted to *that provider's* transcript, and a
   * receiving institution is deciding whether to accept a third party's
   * paperwork — which is a different question, with a different answer, from
   * whether to accept a college's.
   */
  transcript_provider?: string;
  provenance: Provenance;
}

/** (institution, credit source) -> what you actually get. The core of the dataset. */
export interface AcceptanceRule {
  institution_id: string;
  credit_source_id: string;
  /** Minimum exam score required, where applicable. */
  min_score: number | null;
  units_granted: number;
  /**
   * The framework areas this rule clears TOGETHER. Empty means the credit counts
   * toward the degree but clears no requirement (CLEP at a CSU).
   *
   * A list because the standard has both cases and they are not the same thing:
   * AP Biology clears 5B **and** the 5C laboratory in one sitting, while AP
   * English Literature clears 1A **or** 3B — the student picks one. "And" is one
   * rule with two areas; "or" is two rules with one area each, and the engine
   * will not let the same exam be spent twice.
   */
  satisfies_areas: string[];
  provenance: Provenance;
}

/** Where the student is in school. Decides which pathways are still open. */
export type SchoolYear =
  | 'grade_9' | 'grade_10' | 'grade_11' | 'grade_12' | 'in_college';

/**
 * Broad field, deliberately few options. This is not career guidance — it exists
 * because some sequences cannot be compressed the way general education can.
 */
export type FieldOfStudy =
  | 'stem' | 'business' | 'health' | 'social_sciences' | 'arts_humanities' | 'undecided';

/**
 * Fee-waiver status, asked without asking about income.
 *
 * This is the highest-leverage question in the app: a state fee waiver (the
 * California College Promise Grant, for one) can waive community-college fees
 * outright, and Modern States covers the CLEP exam fee nationally. Either can
 * take a route to $0 and reorder the results.
 *
 * Which waiver applies is a property of the STATE, not of the student, so the
 * dataset holds the programme and this holds only whether they qualify.
 */
export type WaiverStatus = 'eligible' | 'unsure' | 'not_eligible';

export interface StudentProfile {
  year: SchoolYear;
  field: FieldOfStudy;
  /** What they can actually spend, in USD. Null when they would rather not say. */
  budget_usd: number | null;
  waiver: WaiverStatus;
}

/** What a student chose for one requirement, overriding our recommendation. */
export type AreaChoice = { kind: 'use'; credit_source_id: string } | { kind: 'skip' };

export interface StudentInput {
  /** Answered in onboarding. Personalises pricing and which advice applies. */
  profile: StudentProfile;
  /**
   * The student's own edits to the plan, keyed by framework area id.
   *
   * A generated plan is a starting point, not a verdict — they know things we do
   * not (a course already scheduled, an exam they will not sit). Absent means
   * "use our recommendation", which is why this is optional rather than a map
   * that has to be constructed before anything can be planned.
   */
  plan_overrides?: Record<string, AreaChoice>;
  /** Printed on the advisor packet so the advisor knows who is asking. */
  student_name?: string;
  target_institution_id: string;
  /** Credit source ids the student already holds. */
  held_credit_ids: string[];
  /** Units already earned at the target institution. */
  units_in_residence: number;
}

export interface PlanItem {
  credit_source_id: string;
  /**
   * Carried, not inferred. This used to be recovered from the id prefix
   * (`clep-`, `ap-`, else community college), which was a California-only
   * convention hiding in the engine: the first out-of-state course id that did
   * not start with `ccc-` would still have been classified a course by luck
   * rather than by data. Ids are dataset trivia; the kind is a fact.
   */
  kind: CreditKind;
  label: string;
  cost_usd: number;
  units: number;
  satisfies_areas: string[];
  provenance: Provenance;
}

export type RouteKind = 'cheapest' | 'fastest' | 'lowest_risk';

/**
 * Why a warning fires, as data rather than prose.
 *
 * Screens style these by severity and attach the provenance badge that backs
 * them. An earlier version passed bare strings, which forced the UI to recover
 * severity by matching the engine's wording — so rephrasing a sentence here
 * silently stripped the badge off the app's most consequential claim.
 */
export type WarningKind =
  /** Credit the student holds that will not do the job here. */
  | 'stranded_credit'
  /** Credit that counts toward the degree but clears no general-education requirement. */
  | 'credit_not_toward_ge'
  /** Route exceeds the institution's transfer-unit ceiling. */
  | 'transfer_cap'
  /** Minimum units that must be earned on campus. */
  | 'residency'
  /** We will not stake the student's money on this yet. */
  | 'unverified_data'
  /** This route costs more than the student said they can spend. */
  | 'budget_exceeded'
  /** A saving they are eligible for that this plan has not used. */
  | 'opportunity'
  /** Their field has sequences that general-education planning cannot compress. */
  | 'major_sequence';

export interface RouteWarning {
  kind: WarningKind;
  /** Student-facing. Rendered verbatim, so it is written for a student. */
  message: string;
  /** The row this warning rests on, where one exists. */
  provenance?: Provenance;
}

export interface Route {
  kind: RouteKind;
  items: PlanItem[];
  total_cost_usd: number;
  total_units: number;
  areas_cleared: string[];
  areas_unmet: string[];
  /** Requirements the student chose to handle themselves. Never priced. */
  areas_skipped: string[];
  /** Hard constraints that bind this route — shown to the student verbatim. */
  warnings: RouteWarning[];
}
