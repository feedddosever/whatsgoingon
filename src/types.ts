/** Confidence in a data row. Drives the "lowest-risk" route and the UI badge. */
export type Confidence =
  | 'statute'      // guaranteed by CA law (e.g. SB 1440 ADT junior standing)
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

export type SystemId = 'UC' | 'CSU' | 'CCC';

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
  /** Whether this campus accepts CLEP at all. */
  accepts_clep: boolean;

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

/** A Cal-GETC area (the GE pattern that replaced IGETC / CSU GE Breadth). */
export interface GeArea {
  id: string;
  name: string;
  required_units: number;
  /**
   * Which systems actually require this area. Not every Cal-GETC area applies
   * everywhere — 1C (Oral Communication) is a CSU requirement and not a UC one —
   * so a UC-bound student must not be told to solve it, and its units must not
   * inflate their baseline.
   */
  applies_to: SystemId[];
  provenance: Provenance;
}

export type CreditKind = 'clep' | 'ap' | 'ccc_course';

export interface CreditSource {
  id: string;
  kind: CreditKind;
  name: string;
  /** What it costs the student to obtain, in USD. */
  cost_usd: number;
  provenance: Provenance;
}

/** (institution, credit source) -> what you actually get. The core of the dataset. */
export interface AcceptanceRule {
  institution_id: string;
  credit_source_id: string;
  /** Minimum exam score required, where applicable. */
  min_score: number | null;
  units_granted: number;
  /** Cal-GETC area cleared, or null if it lands as unassigned elective credit. */
  satisfies_area: string | null;
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
 * This is the highest-leverage question in the app: the California College
 * Promise Grant waives the CCC $46/unit fee outright, and Modern States covers
 * the CLEP exam fee. Either can take a route to $0 and reorder the results.
 */
export type WaiverStatus = 'eligible' | 'unsure' | 'not_eligible';

export interface StudentProfile {
  year: SchoolYear;
  field: FieldOfStudy;
  /** What they can actually spend, in USD. Null when they would rather not say. */
  budget_usd: number | null;
  waiver: WaiverStatus;
}

export interface StudentInput {
  /** Answered in onboarding. Personalises pricing and which advice applies. */
  profile: StudentProfile;
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
  label: string;
  cost_usd: number;
  units: number;
  satisfies_area: string | null;
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
  /** Credit that counts toward the degree but clears no Cal-GETC requirement. */
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
  /** Hard constraints that bind this route — shown to the student verbatim. */
  warnings: RouteWarning[];
}
