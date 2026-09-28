/**
 * The salad bowl and the salt shaker, as a pure function of time.
 *
 * Nothing here keeps a clock: `SaladScene` draws the frame at `t` seconds and
 * whoever renders it decides what `t` is. That keeps the drawing testable, and
 * it is how the preview GIFs were recorded — the same maths, frame by frame.
 *
 * Deliberately flat: two tones per object at most, no gradients, no shine.
 * It is a pause between the last question and the answer, not a showpiece.
 */
import type { ReactElement } from 'react';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from 'react-native-svg';

export type SaladVariant = 'garden' | 'greek';
export const SALAD_VARIANTS: readonly SaladVariant[] = ['garden', 'greek'];

/** One pass of the shaker and the salt settling, in seconds. */
export const LOOP_S = 2.4;

const SHAKE = 0.36;
const SHAKES = 3;
const SHAKE_START = 0.15;
const ROT = -34;              // the cap points down-left, into the bowl
const ORIGIN = [270, 108] as const;
const SCALE = 0.84;
const RAD = (ROT * Math.PI) / 180;
const AXIS = [-Math.cos(RAD), -Math.sin(RAD)] as const; // toward the cap

const G_ACCEL = 980;
// A line across the top of the salad in screen space, tipped with the bowl.
const SLOPE = Math.tan((34 * Math.PI) / 180);
const HEAP_X = 175;
const HEAP_Y = 190;

/* ---------------- the shaker ---------------- */

interface Pose { push: number; tip: number }

/** Three flicks toward the bowl, then stillness while the salt lands. */
export function shakerPose(t: number): Pose {
  const tt = t % LOOP_S;
  const end = SHAKE_START + SHAKE * SHAKES;
  if (tt < SHAKE_START || tt > end) return { push: 0, tip: 0 };
  const p = (tt - SHAKE_START) / SHAKE;
  const phase = p - Math.floor(p);
  const env = Math.min(1, (tt - SHAKE_START) / 0.12, (end - tt) / 0.12);
  return {
    push: 13 * Math.sin(2 * Math.PI * phase) * env,
    tip: 6 * Math.sin(2 * Math.PI * phase + Math.PI / 2) * env,
  };
}

function holeToWorld(t: number, ly: number): readonly [number, number] {
  const { push, tip } = shakerPose(t);
  const a = ((ROT + tip) * Math.PI) / 180;
  const lx = -22 * SCALE;
  const sy = ly * SCALE;
  return [
    ORIGIN[0] + AXIS[0] * push + lx * Math.cos(a) - sy * Math.sin(a),
    ORIGIN[1] + AXIS[1] * push + lx * Math.sin(a) + sy * Math.cos(a),
  ];
}

/* ---------------- the salt ---------------- */

interface Grain { t0: number; ly: number; vx: number; vy: number; land: number; r: number }

/** Seeded, so every playthrough — and every test — sees the same salt. */
const GRAINS: readonly Grain[] = (() => {
  let seed = 7;
  const rnd = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const out: Grain[] = [];
  for (let s = 0; s < SHAKES; s++) {
    // The salt leaves when the flick toward the bowl stops short.
    const burst = SHAKE_START + SHAKE * s + SHAKE * 0.22;
    for (let i = 0; i < 9; i++) {
      const speed = 130 + rnd() * 100;
      const side = (rnd() - 0.5) * 60;
      out.push({
        t0: burst + (rnd() - 0.3) * 0.06,
        ly: (rnd() - 0.5) * 26,
        vx: AXIS[0] * speed - AXIS[1] * side,
        vy: AXIS[1] * speed + AXIS[0] * side * 0.4,
        land: rnd() * 20,
        r: 1.6 + rnd() * 0.9,
      });
    }
  }
  return out;
})();

export interface GrainFrame { x: number; y: number; r: number; opacity: number; justLanded: boolean }

/** Where every grain is at `t`: falling on an arc, then resting and fading. */
export function grainsAt(t: number): GrainFrame[] {
  const tt = t % LOOP_S;
  return GRAINS.map(g => {
    const dt = tt - g.t0;
    if (dt < 0) return { x: 0, y: 0, r: g.r, opacity: 0, justLanded: false };
    const [x0, y0] = holeToWorld(g.t0, g.ly);
    // When the arc meets the top of the heap.
    const a = 0.5 * G_ACCEL;
    const b = g.vy - SLOPE * g.vx;
    const c = y0 - (HEAP_Y + g.land + SLOPE * (x0 - HEAP_X));
    const tLand = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    const tf = Math.min(dt, tLand);
    const after = dt - tLand;
    return {
      x: x0 + g.vx * tf,
      y: y0 + g.vy * tf + 0.5 * G_ACCEL * tf * tf,
      r: g.r,
      opacity: after > 0 ? Math.max(0, 1 - after / 0.3) : 1,
      justLanded: after > 0 && after < 0.12,
    };
  });
}

/* ---------------- the salad ---------------- */

/** A mound of lettuce: a row of overlapping round scallops. */
function mound(y: number, x0: number, x1: number, r: number): string {
  const n = Math.round((x1 - x0) / (r * 1.3));
  let d = `M${x0},${y + r}`;
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const lift = Math.sin((i / n) * Math.PI) * r * 0.9;
    d += ` A${r} ${r * 0.8} 0 0 1 ${x.toFixed(1)},${(y - lift).toFixed(1)}`;
  }
  return `${d} L${x1},${y + 60} L${x0},${y + 60} Z`;
}

const MOUNDS: ReadonlyArray<readonly [string, string]> = [
  [mound(206, 48, 292, 28), '#15803D'],
  [mound(224, 52, 288, 24), '#22C55E'],
  [mound(244, 60, 280, 20), '#4ADE80'],
];

type Topping =
  | { kind: 'tomato' | 'cucumber' | 'crouton' | 'olive' | 'feta'; x: number; y: number; rot: number };

const TOPPINGS: Record<SaladVariant, readonly Topping[]> = {
  garden: [
    { kind: 'tomato', x: 118, y: 206, rot: 10 },
    { kind: 'cucumber', x: 170, y: 196, rot: -8 },
    { kind: 'tomato', x: 226, y: 204, rot: 9 },
    { kind: 'crouton', x: 140, y: 230, rot: 12 },
    { kind: 'cucumber', x: 204, y: 232, rot: 10 },
  ],
  greek: [
    { kind: 'olive', x: 118, y: 206, rot: -10 },
    { kind: 'feta', x: 168, y: 198, rot: 10 },
    { kind: 'tomato', x: 224, y: 204, rot: 10 },
    { kind: 'cucumber', x: 140, y: 230, rot: -6 },
    { kind: 'feta', x: 206, y: 232, rot: -12 },
    { kind: 'olive', x: 252, y: 222, rot: 30 },
  ],
};

function ToppingShape({ kind }: { kind: Topping['kind'] }): ReactElement {
  switch (kind) {
    case 'tomato':
      return (
        <>
          <Circle r={11} fill="#EF4444" />
          <Path d="M-3.9,-8.3 L0,-6.1 L3.9,-8.3" stroke="#15803D" strokeWidth={2.4}
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'cucumber':
      return (
        <>
          <Ellipse rx={13} ry={7.5} fill="#166534" />
          <Ellipse rx={10} ry={5.5} fill="#D9F99D" />
        </>
      );
    case 'crouton':
      return <Rect x={-6.5} y={-6.5} width={13} height={13} rx={3} fill="#E0A553" />;
    case 'olive':
      return (
        <>
          <Ellipse rx={8} ry={6} fill="#3B1333" />
          <Circle cx={2.5} cy={0} r={2} fill="#0B0F14" />
        </>
      );
    case 'feta':
      return <Rect x={-7} y={-7} width={14} height={14} rx={2.5} fill="#FFFFFF" />;
  }
}

/* ---------------- the frame ---------------- */

export function SaladScene(
  { t, variant, size }: { t: number; variant: SaladVariant; size: number },
): ReactElement {
  const tt = t % LOOP_S;
  const { push, tip } = shakerPose(tt);
  const grains = grainsAt(tt);
  // The toppings give a touch as the salt lands on them.
  const give = Math.min(1, grains.filter(g => g.justLanded).length / 5);

  return (
    <Svg width={size} height={(size * 380) / 400} viewBox="0 0 400 380">
      <G transform="translate(-10 14) rotate(34 170 250)">
        <Defs>
          {/* The opening, plus the mound of salad rising out of it. */}
          <ClipPath id="saladHeap">
            <Path d="M48,235 A122 36 0 0 0 292 235 C286 150 54 150 48 235 Z" />
          </ClipPath>
        </Defs>
        <Ellipse cx={170} cy={235} rx={122} ry={36} fill="#D9CDB6" />
        <G clipPath="url(#saladHeap)">
          {MOUNDS.map(([d, fill]) => <Path key={fill} d={d} fill={fill} />)}
          {TOPPINGS[variant].map((top, i) => {
            const bob = Math.sin(tt * 10 + i) * 1.1 * give;
            return (
              <G key={i} transform={
                `translate(${top.x} ${(top.y + bob).toFixed(2)}) rotate(${top.rot}) scale(1.35)`
              }>
                <ToppingShape kind={top.kind} />
              </G>
            );
          })}
        </G>
        <Path d="M48,235 A122 36 0 0 0 292 235 C288 305 232 348 170 348 C108 348 52 305 48 235 Z"
          fill="#F4EDE0" />
        <Path d="M48,235 A122 36 0 0 0 292 235" fill="none" stroke="#FFFFFF" strokeWidth={4}
          strokeLinecap="round" />
      </G>

      {grains.map((g, i) => (
        <Circle key={i} cx={g.x} cy={g.y} r={g.r} fill="#FFFFFF" opacity={g.opacity} />
      ))}

      <G transform={
        `translate(${(ORIGIN[0] + AXIS[0] * push).toFixed(2)} ${(ORIGIN[1] + AXIS[1] * push).toFixed(2)}) ` +
        `rotate(${(ROT + tip).toFixed(2)}) scale(${SCALE})`
      }>
        <Rect x={0} y={-24} width={118} height={48} rx={12} fill="#F4F6F8" />
        <Rect x={44} y={-24} width={24} height={48} fill="#4ADE80" />
        <Rect x={-20} y={-27} width={26} height={54} rx={8} fill="#94A3B8" />
        {[[-12, -12], [-12, 0], [-12, 12], [-4, -6], [-4, 6]].map(([cx, cy]) => (
          <Circle key={`${cx},${cy}`} cx={cx} cy={cy} r={2.2} fill="#334155" />
        ))}
      </G>
    </Svg>
  );
}
