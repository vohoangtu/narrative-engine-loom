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

// =====================================================================
// Story Pack & Media Kit — sample artifacts for Studio output expansion
// =====================================================================

export interface POVVariant {
  character: string;
  role: string;
  accent: "primary" | "warning" | "info";
  excerpt: string;
}

export const SAMPLE_POV_VARIANTS: POVVariant[] = [
  {
    character: "Lord Aelric",
    role: "Người kế vị",
    accent: "primary",
    excerpt:
      "Tuyết rơi trên vai ta như một lời thề chưa được nói. Ta không khóc cha — ta khóc cho cái triều đại mà ông để lại trong tay ta, mỏng như một lưỡi dao đã mòn.",
  },
  {
    character: "Maester Corvain",
    role: "Cố vấn già",
    accent: "info",
    excerpt:
      "Ta đã chứng kiến ba lễ kế vị trong đời. Lễ này lặng nhất — và vì thế, nguy hiểm nhất. Khi các thần im lặng, con người bắt đầu nói thay họ, và lời nói của con người luôn có giá.",
  },
  {
    character: "Envoy Tysan",
    role: "Sứ giả Sáu Vương Quốc",
    accent: "warning",
    excerpt:
      "Trong áo lông của ta có ba con dao và một bức thư. Bức thư là quà mừng. Những con dao là dành cho trường hợp lời chia buồn không đủ thuyết phục.",
  },
];

export interface CodexEntry {
  id: string;
  type: "Faction" | "Character" | "Location" | "Artifact";
  title: string;
  summary: string;
  body: string;
}

export const SAMPLE_CODEX: CodexEntry[] = [
  {
    id: "house_veyrith",
    type: "Faction",
    title: "Nhà Veyrith",
    summary: "Gia tộc cai trị [[Tháp Bạc]] qua ba thế kỷ.",
    body: "Nhà Veyrith được sáng lập bởi [[Aelric Đệ Nhất]], người đầu tiên đúc [[Vương Miện Sắt]]. Châm ngôn: \"Im lặng là vương quốc của ta.\" Liên minh truyền thống với [[Nhà Tysan]], thù địch với [[Hội Đồng Đỏ]].",
  },
  {
    id: "silver_tower",
    type: "Location",
    title: "Tháp Bạc",
    summary: "Pháo đài tổ tiên của [[Nhà Veyrith]], xây trên vách đá Bắc.",
    body: "Tháp Bạc cao 312 bậc, mỗi bậc khắc tên một lãnh chúa đã ngồi trên ngai. Người ta nói khi tuyết phủ đỉnh tháp, các thần đang lắng nghe. Lá cờ trên đỉnh chỉ hạ xuống ba lần trong lịch sử.",
  },
  {
    id: "iron_crown",
    type: "Artifact",
    title: "Vương Miện Sắt",
    summary: "Biểu tượng quyền lực — nặng, lạnh, và không bao giờ sáng.",
    body: "Đúc từ thanh kiếm gãy của kẻ thù đầu tiên của [[Nhà Veyrith]]. Mang vương miện đồng nghĩa với việc gánh tất cả những lời thề chưa hoàn thành của các đời trước. Trọng lượng: 2.4kg.",
  },
  {
    id: "maester_corvain",
    type: "Character",
    title: "Maester Corvain",
    summary: "Cố vấn lâu năm, chứng nhân của ba triều đại.",
    body: "Sinh ra ở [[Đảo Học Giả]], phục vụ [[Nhà Veyrith]] từ năm 17 tuổi. Biết bảy ngôn ngữ chết. Người duy nhất biết chìa khóa của thư viện ngầm dưới [[Tháp Bạc]].",
  },
];

export interface DialogueLine {
  type: "direction" | "speech";
  speaker?: string;
  text: string;
}

export const SAMPLE_DIALOGUE: DialogueLine[] = [
  { type: "direction", text: "Đỉnh tháp Bạc. Tuyết. AELRIC đứng quay lưng về phía cầu thang. CORVAIN xuất hiện, thở dốc." },
  { type: "speech", speaker: "CORVAIN", text: "Ngài đã sẵn sàng chưa, thưa lãnh chúa?" },
  { type: "direction", text: "AELRIC không quay lại. Một khoảng lặng dài. Tiếng tuyết rơi." },
  { type: "speech", speaker: "AELRIC", text: "Sẵn sàng cho cái gì, Corvain? Cho việc trở thành vua, hay cho việc trở thành cái cớ?" },
  { type: "speech", speaker: "CORVAIN", text: "(nhẹ giọng) Cho cả hai. Cha ngài cũng từng hỏi tôi câu đó. Bốn mươi năm trước." },
  { type: "speech", speaker: "AELRIC", text: "Và ông trả lời sao?" },
  { type: "speech", speaker: "CORVAIN", text: "Tôi nói: \"Một lãnh chúa không cần sẵn sàng. Chỉ cần đứng dậy khi tuyết rơi.\"" },
  { type: "direction", text: "AELRIC quay lại. Lần đầu tiên, chúng ta thấy mặt anh — trẻ hơn ta tưởng, và mệt hơn ta sợ." },
  { type: "speech", speaker: "AELRIC", text: "Ta sẵn sàng." },
];

export const SAMPLE_VERSE = `Khi tuyết phủ tháp, các thần ngừng nói,
Khi gió ngừng kêu, vương miện trở nặng.
Sáu sứ giả tới — sáu lưỡi dao chờ,
Sáu lời chia buồn, sáu lời dối trá.

Một lãnh chúa trẻ đứng trên đá lạnh,
Bóng cha đè vai, bóng con chưa sinh.
Mùa đông năm ấy đến sớm hơn thường —
Vì lịch sử biết, nó không thể chờ.

Nghe đi, hỡi người đang đọc dòng này,
Im lặng của thần là khúc dạo đầu.
Khi các vương quốc chia nhau một cái xác,
Kẻ sống sót cuối cùng sẽ là tuyết.`;

export interface StoryboardPanel {
  shot: string;
  angle: string;
  description: string;
  mood: string; // hsl color
}

export const SAMPLE_STORYBOARD: StoryboardPanel[] = [
  { shot: "Wide",    angle: "High",      description: "Tháp Bạc giữa cơn bão tuyết. Lá cờ Veyrith hạ xuống chậm rãi.",   mood: "220 60% 25%" },
  { shot: "Medium",  angle: "Eye-level", description: "Aelric nhìn xuống thành phố, lưng xoay về phía cầu thang.",       mood: "230 40% 35%" },
  { shot: "Close-up",angle: "Low",       description: "Bàn tay Aelric siết quanh bao kiếm, khớp ngón tay trắng.",        mood: "0 35% 30%" },
  { shot: "Wide",    angle: "Eye-level", description: "Sảnh đá. Sáu sứ giả đứng yên, áo lông phủ tuyết vai.",            mood: "30 25% 40%" },
  { shot: "Insert",  angle: "Top-down",  description: "Một con dao găm thấp thoáng dưới lớp lông của Envoy Tysan.",      mood: "0 60% 35%" },
  { shot: "Close-up",angle: "Eye-level", description: "Aelric quay lại. Lần đầu tiên, ánh mắt rõ ràng.",                  mood: "200 50% 45%" },
];

export interface SocialPack {
  twitter: string[];
  instagram: { caption: string; visual: string }[];
  tiktok: string[];
}

export const SAMPLE_SOCIAL: SocialPack = {
  twitter: [
    "Mùa đông năm ấy đến sớm hơn thường lệ. 🧵 Một dòng truyền thừa kết thúc không bằng kiếm — mà bằng im lặng.",
    "Khi lá cờ Nhà Veyrith hạ xuống khỏi Tháp Bạc, không một tiếng kèn. Chỉ có tuyết. Và sáu sứ giả.",
    "Sáu vương quốc gửi sáu lời chia buồn. Trong áo lông của họ — sáu con dao găm.",
    "\"Sẵn sàng cho cái gì? Cho việc trở thành vua, hay cho việc trở thành cái cớ?\" — Aelric Veyrith",
    "Maester Corvain biết chìa khóa của thư viện ngầm. Ông cũng biết: triều đại này không kết thúc bằng máu, mà bằng một bức thư.",
    "Khi các thần im lặng, con người bắt đầu nói thay họ. Lời nói của con người luôn có giá.",
    "Đọc đầy đủ trên Aetheria Chronicle 👇",
    "#NarrativeLoom #Aetheria #MùaĐôngVeyrith",
  ],
  instagram: [
    { caption: "Tháp Bạc · Đêm kế vị",          visual: "linear-gradient(135deg, hsl(220 60% 20%), hsl(230 40% 30%))" },
    { caption: "Sáu sứ giả · Sáu con dao",       visual: "linear-gradient(135deg, hsl(0 35% 25%), hsl(30 25% 35%))" },
    { caption: "Aelric Veyrith · Lãnh chúa thứ 23", visual: "linear-gradient(135deg, hsl(200 50% 30%), hsl(220 40% 40%))" },
    { caption: "Maester Corvain · Người chứng",  visual: "linear-gradient(135deg, hsl(45 30% 30%), hsl(20 25% 35%))" },
    { caption: "Đọc toàn bộ chronicle →",        visual: "linear-gradient(135deg, hsl(280 40% 25%), hsl(220 50% 35%))" },
  ],
  tiktok: [
    "POV: Cha bạn vừa mất, và sáu vương quốc gửi 'lời chia buồn' kèm dao găm 🗡️",
    "Khi Maester nói 'Ngài đã sẵn sàng chưa?' — câu trả lời chỉ có một, dù bạn không sẵn sàng.",
    "Ba trăm năm Nhà Veyrith. Một đêm tuyết. Bạn sẽ không tin chuyện gì xảy ra tiếp theo.",
  ],
};

export const SAMPLE_VOICEOVER = `<speak>
  <prosody rate="92%" pitch="-1st">
    Mùa đông năm ấy <break time="400ms"/> đến sớm hơn thường lệ.
  </prosody>
  <break time="800ms"/>
  <prosody rate="88%">
    Khi những lá cờ của Nhà Veyrith được hạ xuống khỏi <emphasis level="moderate">tháp Bạc</emphasis>,
    không một tiếng kèn nào vang lên —
    <break time="500ms"/>
    chỉ có tiếng tuyết rơi, <break time="200ms"/> đều và lạnh.
  </prosody>
  <break time="700ms"/>
  <prosody pitch="-2st" rate="85%">
    Lãnh chúa Aelric đứng trên đỉnh tháp,
    <break time="300ms"/>
    <emphasis level="strong">một mình</emphasis>,
    và hiểu rằng triều đại của cha mình đã kết thúc
    <break time="400ms"/>
    không phải bởi lưỡi kiếm,
    <break time="300ms"/>
    mà bởi <emphasis level="strong">sự im lặng của các thần</emphasis>.
  </prosody>
</speak>`;

export interface CoverBrief {
  prompt: string;
  palette: { name: string; hsl: string }[];
  references: string[];
  aspectRatio: string;
}

export const SAMPLE_COVER_BRIEF: CoverBrief = {
  prompt:
    "A lone young lord in dark fur cloak standing at the top of a snow-covered silver tower at dusk, back to camera, six dark figures emerging from the staircase below. Painterly, dramatic chiaroscuro, muted blues and silver, falling snow, mythic atmosphere. Inspired by Caspar David Friedrich and Frank Frazetta.",
  palette: [
    { name: "Iron Blue",   hsl: "220 45% 22%" },
    { name: "Tower Silver",hsl: "210 15% 75%" },
    { name: "Blood Mark",  hsl: "0 55% 35%" },
    { name: "Snow Veil",   hsl: "200 25% 92%" },
  ],
  references: ["Wanderer above the Sea of Fog", "Death Dealer (Frazetta)", "Game of Thrones · S1 promo"],
  aspectRatio: "2:3 (book cover)",
};
