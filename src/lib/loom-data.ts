// Mock data for Narrative Loom UI demo

export type AgentCategory = "engine" | "creative" | "quality" | "output";
export type NodeStatus = "idle" | "running" | "done" | "error" | "queued";

export interface PipelineNode {
  id: string;
  name: string;
  vi: string;
  category: AgentCategory;
  phase: 1 | 2;
  description: string;
  model?: string;
  avgDuration: number; // seconds
}

export const PIPELINE_NODES: PipelineNode[] = [
  // Phase 1 — Engines
  { id: "event_normalizer", name: "Event Normalizer", vi: "Chuẩn hóa sự kiện", category: "engine", phase: 1, description: "Chuẩn hóa raw events thành schema thống nhất", model: "gpt-4o-mini", avgDuration: 2.1 },
  { id: "universe_bridge",  name: "Universe Bridge",  vi: "Cầu nối vũ trụ",  category: "engine", phase: 1, description: "Kết nối context của universe và era", model: "gpt-4o-mini", avgDuration: 1.4 },
  { id: "entropy_engine",   name: "Entropy Engine",   vi: "Cỗ máy hỗn loạn", category: "engine", phase: 1, description: "Tính độ hỗn loạn / entropy của thế giới", model: "claude-3.5-haiku", avgDuration: 1.8 },
  { id: "style_analyzer",   name: "Style Analyzer",   vi: "Phân tích phong cách", category: "engine", phase: 1, description: "Phát hiện tone & phong cách narrative phù hợp", model: "claude-3.5-haiku", avgDuration: 2.3 },
  { id: "attractor_engine", name: "Attractor Engine", vi: "Lực hút sự kiện", category: "engine", phase: 1, description: "Phát hiện cluster các sự kiện có lực hút", model: "gpt-4o-mini", avgDuration: 3.1 },
  { id: "dramatic_arc",     name: "Dramatic Arc",     vi: "Cung kịch tính", category: "engine", phase: 1, description: "Xác định cung kịch tính (rising / climax / falling)", model: "gpt-4o", avgDuration: 2.7 },
  { id: "phase_engine",     name: "Phase Engine",     vi: "Giai đoạn narrative", category: "engine", phase: 1, description: "Xác định phase hiện tại của narrative", model: "gpt-4o-mini", avgDuration: 1.2 },
  { id: "singularity_engine", name: "Singularity Engine", vi: "Điểm kỳ dị", category: "engine", phase: 1, description: "Phát hiện các điểm kỳ dị / bước ngoặt lớn", model: "gpt-4o", avgDuration: 2.5 },

  // Phase 2 — Agents
  { id: "chief_editor",  name: "Chief Editor",  vi: "Tổng biên tập", category: "creative", phase: 2, description: "Đặt góc nhìn, theme, chỉ thị tổng thể", model: "gpt-4o", avgDuration: 4.2 },
  { id: "historian",     name: "Historian",     vi: "Sử gia",        category: "creative", phase: 2, description: "Viết dàn ý lịch sử dạng JSON structured", model: "claude-3.5-sonnet", avgDuration: 6.8 },
  { id: "mythologist",   name: "Mythologist",   vi: "Nhà huyền thoại", category: "creative", phase: 2, description: "Bổ sung yếu tố huyền thoại, biểu tượng", model: "claude-3.5-sonnet", avgDuration: 5.4 },
  { id: "psychologist",  name: "Psychologist",  vi: "Nhà tâm lý",    category: "creative", phase: 2, description: "Phân tích tâm lý nhân vật chính", model: "gpt-4o", avgDuration: 5.1 },
  { id: "director",      name: "Director",      vi: "Đạo diễn",      category: "creative", phase: 2, description: "Tạo storyboard, scenes, camera angles", model: "gpt-4o", avgDuration: 7.3 },
  { id: "wordsmith",     name: "Wordsmith",     vi: "Người dệt chữ", category: "creative", phase: 2, description: "Viết prose cuối cùng, văn phong tiểu thuyết", model: "claude-3.5-sonnet", avgDuration: 12.5 },
  { id: "critic",        name: "Critic",        vi: "Nhà phê bình",  category: "quality",  phase: 2, description: "Đánh giá chất lượng, trigger revision nếu fail", model: "gpt-4o", avgDuration: 3.6 },
  { id: "archivist",     name: "Archivist",     vi: "Người lưu trữ", category: "output",   phase: 2, description: "Lưu trữ kết quả vào kho narrative", model: "gpt-4o-mini", avgDuration: 1.1 },
  { id: "news_anchor",   name: "News Anchor",   vi: "Người dẫn tin", category: "output",   phase: 2, description: "Tạo headline ngắn gọn, gợi mở", model: "gpt-4o-mini", avgDuration: 1.5 },
  { id: "vfx_director",  name: "VFX Director",  vi: "Giám đốc VFX",  category: "output",   phase: 2, description: "Tạo config hiệu ứng visual cho frontend", model: "gpt-4o-mini", avgDuration: 2.0 },
  // Phase 2 — Add-on agents (Story Pack + Media Kit)
  { id: "lorekeeper",        name: "Lorekeeper",        vi: "Người giữ truyền thuyết", category: "creative", phase: 2, description: "Sinh entry codex / wiki cho world-building", model: "claude-3.5-sonnet", avgDuration: 5.8 },
  { id: "playwright",        name: "Playwright",        vi: "Nhà soạn kịch",            category: "creative", phase: 2, description: "Chuyển scene thành kịch bản đối thoại", model: "gpt-4o", avgDuration: 6.4 },
  { id: "oracle",            name: "Oracle",            vi: "Tiên tri",                  category: "creative", phase: 2, description: "Sinh thơ tiên tri, ballad có vần điệu", model: "claude-3.5-sonnet", avgDuration: 4.7 },
  { id: "social_strategist", name: "Social Strategist", vi: "Chiến lược MXH",           category: "output",   phase: 2, description: "Đóng gói output cho social distribution", model: "gpt-4o-mini", avgDuration: 3.2 },
];

export interface TaskRun {
  id: string;
  worldId: string;
  worldName: string;
  era: string;
  status: "queued" | "running" | "done" | "error";
  progress: number;
  currentNode?: string;
  startedAt: string;
  duration?: number;
  headline?: string;
  revisionCount: number;
  epistemicTier: "Chân Thực" | "Mơ Hồ" | "Huyền Sử";
  noiseLevel: number;
}

export const TASKS: TaskRun[] = [
  { id: "tsk_8f3a92", worldId: "world_aetheria", worldName: "Aetheria", era: "Age of Iron Crowns", status: "running", progress: 0.62, currentNode: "wordsmith", startedAt: "2 min ago", revisionCount: 0, epistemicTier: "Chân Thực", noiseLevel: 0.18, headline: undefined },
  { id: "tsk_7c2b41", worldId: "world_nyxos",    worldName: "Nyxos",    era: "Twilight Epoch",     status: "done",    progress: 1.0, startedAt: "12 min ago", duration: 64.3, revisionCount: 1, epistemicTier: "Mơ Hồ", noiseLevel: 0.42, headline: "Khi Mặt Trăng Vỡ, Các Vị Thần Cũng Cúi Đầu" },
  { id: "tsk_6a91d0", worldId: "world_helios",   worldName: "Helios",   era: "Solar Concordat",    status: "done",    progress: 1.0, startedAt: "37 min ago", duration: 58.1, revisionCount: 0, epistemicTier: "Chân Thực", noiseLevel: 0.09, headline: "Hiệp Ước Mặt Trời Và Cái Giá Của Ánh Sáng" },
  { id: "tsk_5b48fe", worldId: "world_aetheria", worldName: "Aetheria", era: "Age of Iron Crowns", status: "queued",  progress: 0,   startedAt: "just now", revisionCount: 0, epistemicTier: "Chân Thực", noiseLevel: 0.21 },
  { id: "tsk_4e1c08", worldId: "world_drakmoor", worldName: "Drakmoor", era: "Wyrmfire Wars",      status: "error",   progress: 0.74, startedAt: "1 hour ago", duration: 41.2, revisionCount: 2, epistemicTier: "Huyền Sử", noiseLevel: 0.71 },
  { id: "tsk_3d9e22", worldId: "world_nyxos",    worldName: "Nyxos",    era: "Twilight Epoch",     status: "done",    progress: 1.0, startedAt: "2 hours ago", duration: 71.9, revisionCount: 0, epistemicTier: "Mơ Hồ", noiseLevel: 0.38, headline: "Bản Hợp Đồng Của Bóng Tối" },
];

export const SAMPLE_PROSE = `Mùa đông năm ấy đến sớm hơn thường lệ.

Khi những lá cờ của Nhà Veyrith được hạ xuống khỏi tháp Bạc, không một tiếng kèn nào vang lên — chỉ có tiếng tuyết rơi, đều và lạnh, lên những phiến đá đã chứng kiến ba trăm mùa đăng quang. Lãnh chúa Aelric đứng trên đỉnh tháp, một mình, và hiểu rằng triều đại của cha mình đã kết thúc không phải bởi lưỡi kiếm, mà bởi sự im lặng của các thần.

Phía dưới, trong sảnh đá, các sứ giả của Sáu Vương Quốc đã chờ đợi từ rạng sáng. Họ mang theo những lời chia buồn được khắc trên đồng, những món quà bằng vàng và bạc, và — sâu trong lớp áo lông — những con dao găm.

"Ngài đã sẵn sàng chưa, thưa lãnh chúa?" — giọng của Maester Corvain vang lên từ cầu thang.

Aelric không quay lại. Anh nhìn về phía chân trời, nơi những đám mây xám đang cuộn lên như một đạo quân không tướng. *Sẵn sàng cho cái gì?* — anh nghĩ. *Cho việc trở thành vua, hay cho việc trở thành cái cớ để các vương quốc khác xé Veyrith ra thành từng mảnh?*

"Ta sẵn sàng," anh nói, vì đó là điều người ta phải nói.`;

export const SAMPLE_OUTLINE = [
  { act: "I", title: "Sự im lặng của các thần", beats: ["Lãnh chúa cũ băng hà", "Aelric kế vị trong nghi lễ ngắn", "Sáu sứ giả tới Tháp Bạc"] },
  { act: "II", title: "Những con dao trong áo lông", beats: ["Tiệc kế vị, ám sát hụt", "Maester Corvain phát hiện thư mật", "Aelric chọn liên minh với Nhà Tysan"] },
  { act: "III", title: "Mùa đông của Veyrith", beats: ["Cuộc bao vây Tháp Bạc", "Aelric xuất hiện trên thành lũy", "Những lá cờ được kéo lên trở lại"] },
];

export const SAMPLE_LOGS = [
  { t: "00:00.12", level: "info",  agent: "system",        msg: "Pipeline started for tsk_8f3a92 (world: Aetheria)" },
  { t: "00:00.34", level: "info",  agent: "event_normalizer", msg: "Normalized 247 raw events into 89 narrative beats" },
  { t: "00:02.41", level: "info",  agent: "entropy_engine", msg: "Computed entropy=0.18 — world considered stable" },
  { t: "00:04.02", level: "info",  agent: "dramatic_arc",   msg: "Arc detected: rising → climax (act II)" },
  { t: "00:06.78", level: "warn",  agent: "singularity_engine", msg: "Singularity candidate: 'Mặt Trăng Vỡ' (confidence 0.71)" },
  { t: "00:09.15", level: "info",  agent: "chief_editor",   msg: "Theme set: 'Sự im lặng của các thần' / POV: omniscient" },
  { t: "00:14.62", level: "info",  agent: "historian",      msg: "Outline drafted (3 acts, 9 beats)" },
  { t: "00:21.08", level: "info",  agent: "mythologist",    msg: "Injected 4 mythic motifs (silence, snow, iron, crown)" },
  { t: "00:28.44", level: "info",  agent: "director",       msg: "Storyboard: 12 scenes, 38 shots" },
  { t: "00:31.20", level: "info",  agent: "wordsmith",      msg: "Streaming prose… (target ~1800 words)" },
];

export const STATS = {
  tasksToday: 47,
  tasksTrend: +12,
  avgDuration: 64.2,
  durationTrend: -8,
  successRate: 94.3,
  successTrend: +1.4,
  activeAgents: 18,
  totalAgents: 18,
};
