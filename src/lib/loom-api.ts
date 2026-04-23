// Mock API client simulating per-artifact regeneration endpoints.
// In production these would be REST calls to:
//   POST /loom/v1/narrative/artifacts/{artifact}:generate
// For the demo we return mutated mock payloads after a simulated latency.

import {
  SAMPLE_POV_VARIANTS,
  SAMPLE_CODEX,
  SAMPLE_DIALOGUE,
  SAMPLE_VERSE,
  SAMPLE_STORYBOARD,
  SAMPLE_SOCIAL,
  SAMPLE_VOICEOVER,
  SAMPLE_COVER_BRIEF,
  type POVVariant,
  type CodexEntry,
  type DialogueLine,
  type StoryboardPanel,
  type SocialPack,
  type CoverBrief,
} from "./loom-data";

export type ArtifactKind =
  | "pov"
  | "codex"
  | "dialogue"
  | "verse"
  | "storyboard"
  | "social"
  | "voiceover"
  | "cover";

export interface ArtifactEndpoint {
  kind: ArtifactKind;
  method: "POST";
  path: string;
  agent: string;
  avgDurationMs: number;
}

export const ARTIFACT_ENDPOINTS: Record<ArtifactKind, ArtifactEndpoint> = {
  pov:        { kind: "pov",        method: "POST", path: "/loom/v1/narrative/artifacts/pov-variants:generate", agent: "Wordsmith Fork",   avgDurationMs: 4200 },
  codex:      { kind: "codex",      method: "POST", path: "/loom/v1/narrative/artifacts/codex:generate",        agent: "Lorekeeper",       avgDurationMs: 5800 },
  dialogue:   { kind: "dialogue",   method: "POST", path: "/loom/v1/narrative/artifacts/dialogue:generate",     agent: "Playwright",       avgDurationMs: 6400 },
  verse:      { kind: "verse",      method: "POST", path: "/loom/v1/narrative/artifacts/verse:generate",        agent: "Oracle",           avgDurationMs: 4700 },
  storyboard: { kind: "storyboard", method: "POST", path: "/loom/v1/narrative/artifacts/storyboard:generate",   agent: "Director",         avgDurationMs: 7300 },
  social:     { kind: "social",     method: "POST", path: "/loom/v1/narrative/artifacts/social-pack:generate",  agent: "Social Strategist", avgDurationMs: 3200 },
  voiceover:  { kind: "voiceover",  method: "POST", path: "/loom/v1/narrative/artifacts/voiceover:generate",    agent: "Wordsmith",        avgDurationMs: 3900 },
  cover:      { kind: "cover",      method: "POST", path: "/loom/v1/narrative/artifacts/cover-brief:generate",  agent: "VFX Director",     avgDurationMs: 2800 },
};

export interface GenerateRequest {
  taskId: string;
  worldId?: string;
  pov?: string;
  tone?: string;
  noise?: number;
  /** Optional caller hint to seed variation. */
  seed?: number;
}

export interface GenerateResponse<T> {
  artifact: ArtifactKind;
  payload: T;
  meta: {
    requestId: string;
    endpoint: string;
    agent: string;
    durationMs: number;
    revision: number;
    generatedAt: string;
  };
}

function rid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

async function simulate<T>(kind: ArtifactKind, build: () => T): Promise<GenerateResponse<T>> {
  const ep = ARTIFACT_ENDPOINTS[kind];
  // Simulate network/agent latency with a little jitter.
  const jitter = 0.6 + Math.random() * 0.6;
  const dur = Math.round(ep.avgDurationMs * jitter);
  // Cap latency in the mock to keep UI snappy.
  await new Promise((r) => setTimeout(r, Math.min(dur, 1800)));
  return {
    artifact: kind,
    payload: build(),
    meta: {
      requestId: rid("req"),
      endpoint: `${ep.method} ${ep.path}`,
      agent: ep.agent,
      durationMs: dur,
      revision: 1 + Math.floor(Math.random() * 3),
      generatedAt: new Date().toISOString(),
    },
  };
}

// ----- Per-artifact mutators (mock variation) -----

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const loomApi = {
  endpoints: ARTIFACT_ENDPOINTS,

  generatePOV(req: GenerateRequest = { taskId: "tsk_7c2b41" }) {
    return simulate<POVVariant[]>("pov", () =>
      shuffle(SAMPLE_POV_VARIANTS).map((v, i) => ({
        ...v,
        excerpt: i === 0 ? `${v.excerpt} (rev ${req.seed ?? Date.now() % 99})` : v.excerpt,
      })),
    );
  },

  generateCodex(_req: GenerateRequest = { taskId: "tsk_7c2b41" }) {
    return simulate<CodexEntry[]>("codex", () => SAMPLE_CODEX);
  },

  generateDialogue(_req: GenerateRequest = { taskId: "tsk_7c2b41" }) {
    return simulate<DialogueLine[]>("dialogue", () => SAMPLE_DIALOGUE);
  },

  generateVerse(_req: GenerateRequest = { taskId: "tsk_7c2b41" }) {
    return simulate<string>("verse", () => SAMPLE_VERSE);
  },

  generateStoryboard(_req: GenerateRequest = { taskId: "tsk_7c2b41" }) {
    return simulate<StoryboardPanel[]>("storyboard", () => shuffle(SAMPLE_STORYBOARD));
  },

  generateSocial(_req: GenerateRequest = { taskId: "tsk_7c2b41" }) {
    return simulate<SocialPack>("social", () => SAMPLE_SOCIAL);
  },

  generateVoiceover(_req: GenerateRequest = { taskId: "tsk_7c2b41" }) {
    return simulate<string>("voiceover", () => SAMPLE_VOICEOVER);
  },

  generateCover(_req: GenerateRequest = { taskId: "tsk_7c2b41" }) {
    return simulate<CoverBrief>("cover", () => SAMPLE_COVER_BRIEF);
  },
};

export type LoomApi = typeof loomApi;
