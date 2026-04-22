import imgAetheria from "@/assets/world-aetheria.jpg";
import imgNyxos from "@/assets/world-nyxos.jpg";
import imgHelios from "@/assets/world-helios.jpg";
import imgDrakmoor from "@/assets/world-drakmoor.jpg";
import imgVerdan from "@/assets/world-verdan.jpg";
import imgKragmir from "@/assets/world-kragmir.jpg";

export type WorldStatus = "active" | "stable" | "volatile" | "dormant";
export type WorldTier = "Chân Thực" | "Mơ Hồ" | "Huyền Sử";

export interface WorldEra {
  name: string;
  range: string;
  status: "past" | "current" | "upcoming";
  summary: string;
}

export interface ChronicleSource {
  id: string;
  name: string;
  type: "simulation" | "webhook" | "manual" | "api";
  endpoint: string;
  events: number;
  lastSync: string;
  enabled: boolean;
}

export type FactionAlignment = "lawful" | "neutral" | "chaotic";
export type FactionRelation = "ally" | "neutral" | "enemy" | "self";

export interface Faction {
  id: string;
  name: string;
  leader: string;
  leaderTitle: string;
  members: number;
  alignment: FactionAlignment;
  influence: number; // 0..1
  motto: string;
  description: string;
  color: "primary" | "info" | "success" | "warning" | "destructive" | "agent-creative";
}

export interface FactionCharacter {
  name: string;
  role: string;
  status: "alive" | "exiled" | "deceased" | "missing";
}

export interface FactionTerritory {
  name: string;
  type: "capital" | "fortress" | "outpost" | "sanctuary" | "ruin";
  population: number;
  control: number; // 0..1
}

export interface FactionEvent {
  id: string;
  date: string;
  type: "battle" | "treaty" | "betrayal" | "decree" | "ritual" | "discovery";
  title: string;
  summary: string;
  impact: "low" | "medium" | "high" | "catastrophic";
}

export interface FactionDetail {
  bio: string;
  founded: string;
  capital: string;
  characters: FactionCharacter[];
  territories: FactionTerritory[];
  events: FactionEvent[];
}

export interface FactionGraph {
  factions: Faction[];
  /** matrix[i][j] = relation of factions[i] toward factions[j] */
  matrix: FactionRelation[][];
}

export interface World {
  id: string;
  name: string;
  era: string;
  cover: string;
  status: WorldStatus;
  tier: WorldTier;
  entropy: number;
  description: string;
  lore: string;
  factions: string[];
  eras: WorldEra[];
  /** entropy samples over the last N ticks (oldest → newest) */
  entropyHistory: number[];
  sources: ChronicleSource[];
}

export const WORLDS: World[] = [
  {
    id: "world_aetheria",
    name: "Aetheria",
    era: "Age of Iron Crowns",
    cover: imgAetheria,
    status: "active",
    tier: "Chân Thực",
    entropy: 0.18,
    description: "Một vương quốc của những hòn đảo bay, nơi các Nhà quý tộc tranh giành Vương Miện Sắt giữa các tầng mây.",
    lore: "Aetheria được sinh ra từ tàn tích của một thế giới cũ, khi các pháp sư cổ đại nâng những mảnh đất lên trời để thoát khỏi Đại Hồng Thủy. Ba trăm mùa đăng quang đã trôi qua, và Vương Miện Sắt vẫn nặng trên đầu Nhà Veyrith — nhưng tuyết năm nay đến sớm.",
    factions: ["Nhà Veyrith", "Nhà Tysan", "Hội Maester"],
    eras: [
      { name: "Era of Ascension",   range: "Y0 – Y120",   status: "past",     summary: "Các pháp sư nâng đảo lên trời, lập nền móng cho vương quốc." },
      { name: "Silver Concord",     range: "Y120 – Y260", status: "past",     summary: "Sáu Nhà ký hiệp ước Bạc, chia nhau các đảo trung tâm." },
      { name: "Age of Iron Crowns", range: "Y260 – nay",  status: "current",  summary: "Nhà Veyrith giữ Vương Miện Sắt; căng thẳng với Nhà Tysan leo thang." },
      { name: "The Long Winter",    range: "dự báo",      status: "upcoming", summary: "Tiên tri về một mùa đông không hồi kết, các thần im lặng." },
    ],
    entropyHistory: [0.12, 0.14, 0.13, 0.15, 0.16, 0.14, 0.17, 0.19, 0.18, 0.21, 0.18, 0.18],
    sources: [
      { id: "src_sim_aetheria",  name: "Aetheria Simulation",   type: "simulation", endpoint: "/loom/v1/sim/aetheria",       events: 12480, lastSync: "2 min ago",  enabled: true },
      { id: "src_court_log",     name: "Court Chronicles Feed", type: "webhook",    endpoint: "https://veyrith.court/hook",  events: 342,   lastSync: "12 min ago", enabled: true },
      { id: "src_maester_codex", name: "Maester Codex API",     type: "api",        endpoint: "/loom/v1/codex/maester",      events: 89,    lastSync: "1 hour ago", enabled: false },
    ],
  },
  {
    id: "world_nyxos",
    name: "Nyxos",
    era: "Twilight Epoch",
    cover: imgNyxos,
    status: "volatile",
    tier: "Mơ Hồ",
    entropy: 0.42,
    description: "Vương quốc hoàng hôn vĩnh cửu, nơi mặt trăng đã vỡ và các vị thần học cách im lặng.",
    lore: "Sau khi Mặt Trăng Vỡ, ánh sáng không còn rõ ràng nữa — và sự thật cũng vậy. Nyxos sống trong vùng xám giữa ngày và đêm, nơi mọi lời tiên tri đều có hai nghĩa.",
    factions: ["Giáo phái Bóng Tối", "Liên minh Trăng Vỡ"],
    eras: [
      { name: "Lunar Age",        range: "Y0 – Y500",   status: "past",    summary: "Thời đại của Mặt Trăng nguyên vẹn và các vị thần lên tiếng." },
      { name: "The Shattering",   range: "Y500",        status: "past",    summary: "Mặt Trăng vỡ trong một đêm, các thần im lặng từ đó." },
      { name: "Twilight Epoch",   range: "Y500 – nay",  status: "current", summary: "Hoàng hôn vĩnh cửu; các giáo phái tranh giành mảnh trăng." },
    ],
    entropyHistory: [0.30, 0.32, 0.35, 0.34, 0.38, 0.40, 0.39, 0.41, 0.43, 0.45, 0.42, 0.42],
    sources: [
      { id: "src_sim_nyxos",     name: "Nyxos Simulation",      type: "simulation", endpoint: "/loom/v1/sim/nyxos",          events: 8921, lastSync: "5 min ago",   enabled: true },
      { id: "src_cult_whisper",  name: "Cult Whispers Webhook", type: "webhook",    endpoint: "https://shadow.cult/hook",    events: 217,  lastSync: "37 min ago",  enabled: true },
    ],
  },
  {
    id: "world_helios",
    name: "Helios",
    era: "Solar Concordat",
    cover: imgHelios,
    status: "stable",
    tier: "Chân Thực",
    entropy: 0.09,
    description: "Đế quốc Mặt Trời với đền thờ vàng giữa sa mạc cháy. Hiệp ước giữ hòa bình — nhưng có cái giá.",
    lore: "Sun-King ký Hiệp Ước Mặt Trời với các bộ tộc sa mạc, đổi lấy hòa bình bằng những hiến tế hàng năm. Không ai dám hỏi cái giá đó là gì.",
    factions: ["Triều đình Sun-King", "Hội Tư Tế"],
    eras: [
      { name: "Pre-Concord",       range: "Y0 – Y80",   status: "past",    summary: "Các bộ tộc sa mạc tranh chấp đẫm máu." },
      { name: "Solar Concordat",   range: "Y80 – nay",  status: "current", summary: "Hiệp ước hòa bình dưới sự bảo trợ của Sun-King." },
    ],
    entropyHistory: [0.10, 0.09, 0.10, 0.08, 0.09, 0.09, 0.10, 0.08, 0.09, 0.09, 0.08, 0.09],
    sources: [
      { id: "src_sim_helios",    name: "Helios Simulation",     type: "simulation", endpoint: "/loom/v1/sim/helios",         events: 5432, lastSync: "1 min ago",   enabled: true },
      { id: "src_temple_log",    name: "Temple Daily Log",      type: "manual",     endpoint: "manual upload",               events: 64,   lastSync: "yesterday",   enabled: true },
    ],
  },
  {
    id: "world_drakmoor",
    name: "Drakmoor",
    era: "Wyrmfire Wars",
    cover: imgDrakmoor,
    status: "volatile",
    tier: "Huyền Sử",
    entropy: 0.71,
    description: "Vùng đất rồng lửa và đá obsidian. Sau một ngàn mùa, các con rồng đã trở lại — và chúng nhớ rất rõ.",
    lore: "Một ngàn mùa trước, loài người đuổi rồng vào lòng núi lửa. Bây giờ chúng đã thức dậy, và Drakmoor đang cháy.",
    factions: ["Chúa tể Rồng", "Hội Săn Rồng", "Bộ tộc Tro"],
    eras: [
      { name: "First Flight",       range: "Y-1000 – Y0", status: "past",    summary: "Thời kỳ rồng tự do bay lượn trên Drakmoor." },
      { name: "The Long Sleep",     range: "Y0 – Y990",   status: "past",    summary: "Rồng bị đuổi vào núi lửa, ngủ đông một ngàn mùa." },
      { name: "Wyrmfire Wars",      range: "Y990 – nay",  status: "current", summary: "Rồng thức dậy, chiến tranh tổng lực bùng nổ." },
    ],
    entropyHistory: [0.55, 0.58, 0.62, 0.65, 0.68, 0.70, 0.69, 0.72, 0.75, 0.73, 0.71, 0.71],
    sources: [
      { id: "src_sim_drakmoor",  name: "Drakmoor Simulation",   type: "simulation", endpoint: "/loom/v1/sim/drakmoor",       events: 18234, lastSync: "just now",   enabled: true },
      { id: "src_dragon_telem",  name: "Dragon Telemetry",      type: "api",        endpoint: "/loom/v1/dragons/telem",      events: 1872,  lastSync: "3 min ago",  enabled: true },
      { id: "src_hunter_report", name: "Hunter Field Reports",  type: "webhook",    endpoint: "https://hunters.dk/report",   events: 89,    lastSync: "2 hours ago", enabled: false },
    ],
  },
  {
    id: "world_verdan",
    name: "Verdan",
    era: "Bloomtide",
    cover: imgVerdan,
    status: "active",
    tier: "Mơ Hồ",
    entropy: 0.31,
    description: "Khu rừng thần linh với Cây Thế Giới đang khô héo. Mỗi chiếc lá rụng là một lời tiên tri.",
    lore: "Cây Thế Giới đứng vững từ thuở khai thiên — nhưng năm nay nó bắt đầu rụng lá. Các Druid không dám nói lý do.",
    factions: ["Druids of Verdan", "Liên minh Hoa Lửa"],
    eras: [
      { name: "Seedling Age",      range: "Y0 – Y200",  status: "past",    summary: "Cây Thế Giới đâm chồi, rừng lan rộng khắp Verdan." },
      { name: "Verdant Reign",     range: "Y200 – Y800", status: "past",   summary: "Druid cai trị trong hòa bình với muôn loài." },
      { name: "Bloomtide",         range: "Y800 – nay",  status: "current", summary: "Cây bắt đầu khô; những bông hoa lửa nở khắp rừng." },
      { name: "Withering",         range: "dự báo",      status: "upcoming", summary: "Tiên tri: nếu Cây chết, rừng sẽ trở thành tro." },
    ],
    entropyHistory: [0.20, 0.22, 0.24, 0.25, 0.27, 0.28, 0.30, 0.32, 0.31, 0.33, 0.31, 0.31],
    sources: [
      { id: "src_sim_verdan",    name: "Verdan Simulation",     type: "simulation", endpoint: "/loom/v1/sim/verdan",         events: 7621, lastSync: "8 min ago",   enabled: true },
      { id: "src_druid_circle",  name: "Druid Circle Reports",  type: "manual",     endpoint: "manual upload",               events: 124,  lastSync: "5 hours ago", enabled: true },
    ],
  },
  {
    id: "world_kragmir",
    name: "Kragmir",
    era: "Stoneborn Era",
    cover: imgKragmir,
    status: "dormant",
    tier: "Chân Thực",
    entropy: 0.12,
    description: "Vương quốc đá khắc trong vách núi tuyết. Người Stoneborn đã ngủ đông — nhưng các vì sao đang rơi.",
    lore: "Người Stoneborn ngủ đông mỗi nghìn năm để chờ một dấu hiệu từ trời. Năm nay, các vì sao đã bắt đầu rơi xuống Kragmir.",
    factions: ["Nhà Stoneborn", "Hội Thợ Khắc"],
    eras: [
      { name: "Forging Age",       range: "Y0 – Y400",  status: "past",    summary: "Stoneborn khắc thành phố vào lòng núi." },
      { name: "Stoneborn Era",     range: "Y400 – nay", status: "current", summary: "Hầu hết dân số ngủ đông; chỉ còn lại Hội Thợ Khắc canh giữ." },
      { name: "Starfall",          range: "dự báo",     status: "upcoming", summary: "Sao rơi báo hiệu Stoneborn sắp thức dậy." },
    ],
    entropyHistory: [0.10, 0.11, 0.10, 0.11, 0.12, 0.11, 0.12, 0.13, 0.12, 0.12, 0.13, 0.12],
    sources: [
      { id: "src_sim_kragmir",   name: "Kragmir Simulation",    type: "simulation", endpoint: "/loom/v1/sim/kragmir",        events: 2103, lastSync: "1 hour ago",  enabled: true },
      { id: "src_starwatch",     name: "Starwatch Observatory", type: "api",        endpoint: "/loom/v1/stars/kragmir",      events: 47,   lastSync: "12 min ago",  enabled: true },
    ],
  },
];

export const STATUS_MAP: Record<WorldStatus, { label: string; cls: string; dot: string }> = {
  active:   { label: "Active",   cls: "bg-success/15 text-success border-success/20",       dot: "bg-success" },
  stable:   { label: "Stable",   cls: "bg-info/15 text-info border-info/20",                dot: "bg-info" },
  volatile: { label: "Volatile", cls: "bg-warning/15 text-warning border-warning/20",       dot: "bg-warning" },
  dormant:  { label: "Dormant",  cls: "bg-muted text-muted-foreground border-border",       dot: "bg-muted-foreground" },
};

export const TIER_MAP: Record<WorldTier, string> = {
  "Chân Thực": "bg-success/10 text-success border-success/20",
  "Mơ Hồ":     "bg-warning/10 text-warning border-warning/20",
  "Huyền Sử":  "bg-agent-creative/10 text-agent-creative border-agent-creative/20",
};

export function getWorld(id: string): World | undefined {
  return WORLDS.find(w => w.id === id);
}

// --- Factions per world ---

const FACTIONS_BY_WORLD: Record<string, FactionGraph> = {
  world_aetheria: {
    factions: [
      { id: "veyrith",  name: "Nhà Veyrith",  leader: "Aelric Veyrith",   leaderTitle: "Lãnh chúa Tháp Bạc", members: 4200, alignment: "lawful",  influence: 0.78, motto: "Sắt không cúi đầu",        description: "Hoàng tộc giữ Vương Miện Sắt qua ba trăm mùa đăng quang.",       color: "primary" },
      { id: "tysan",    name: "Nhà Tysan",    leader: "Lyra Tysan",       leaderTitle: "Nữ công tước Phương Đông", members: 2850, alignment: "neutral", influence: 0.62, motto: "Gió đổi chiều, đất không đổi", description: "Đối thủ truyền kiếp của Veyrith, kiểm soát các đảo Đông.",       color: "info" },
      { id: "maester",  name: "Hội Maester",  leader: "Corvain",          leaderTitle: "Đại Maester",          members: 380,  alignment: "lawful",  influence: 0.41, motto: "Tri thức là ánh sáng",      description: "Học giả trung lập, cố vấn cho cả các Nhà.",                       color: "agent-creative" },
    ],
    matrix: [
      ["self",   "enemy",  "ally"],
      ["enemy",  "self",   "neutral"],
      ["ally",   "neutral","self"],
    ],
  },
  world_nyxos: {
    factions: [
      { id: "shadow", name: "Giáo phái Bóng Tối",  leader: "Vael",           leaderTitle: "Đại Tư Tế Bóng",      members: 1820, alignment: "chaotic", influence: 0.71, motto: "Im lặng là lời cầu nguyện", description: "Thờ phụng các vị thần đã câm lặng từ Đêm Mặt Trăng Vỡ.", color: "agent-creative" },
      { id: "lunar",  name: "Liên minh Trăng Vỡ", leader: "Mireth Sólven",  leaderTitle: "Sứ giả Mảnh Trăng",   members: 940,  alignment: "neutral", influence: 0.54, motto: "Thu thập từng mảnh",         description: "Tìm cách ghép lại Mặt Trăng để khôi phục tiếng nói thần thánh.",  color: "info" },
    ],
    matrix: [
      ["self",  "enemy"],
      ["enemy", "self"],
    ],
  },
  world_helios: {
    factions: [
      { id: "sunking", name: "Triều đình Sun-King", leader: "Solavar III",  leaderTitle: "Sun-King",         members: 5600, alignment: "lawful",  influence: 0.84, motto: "Ánh sáng là luật",            description: "Hoàng triều thiết lập Hiệp Ước Mặt Trời.",       color: "warning" },
      { id: "priest",  name: "Hội Tư Tế",          leader: "Maelora",       leaderTitle: "Tư Tế Tối Cao",    members: 1200, alignment: "lawful",  influence: 0.58, motto: "Lửa thanh tẩy",               description: "Quản lý các lễ hiến tế của Hiệp Ước.",            color: "destructive" },
    ],
    matrix: [
      ["self",  "ally"],
      ["ally",  "self"],
    ],
  },
  world_drakmoor: {
    factions: [
      { id: "wyrm",    name: "Chúa tể Rồng",   leader: "Vhagar Đỏ",     leaderTitle: "Rồng Cổ Đại",        members: 47,    alignment: "chaotic", influence: 0.91, motto: "Chúng ta nhớ rất rõ",       description: "Bốn mươi bảy con rồng cổ đại vừa thức dậy sau một ngàn mùa.", color: "destructive" },
      { id: "hunters", name: "Hội Săn Rồng",   leader: "Karn Ironbrow", leaderTitle: "Đại sư phụ",         members: 320,   alignment: "lawful",  influence: 0.48, motto: "Một mũi giáo cho mỗi cánh", description: "Thợ săn rồng cha truyền con nối, vũ khí huyền thoại.",        color: "primary" },
      { id: "ash",     name: "Bộ tộc Tro",     leader: "Mọ Khô",        leaderTitle: "Tộc trưởng",         members: 2100,  alignment: "neutral", influence: 0.39, motto: "Sống trong tro, chết trong lửa", description: "Dân du mục sống trên các đồng tro do rồng để lại.",       color: "warning" },
    ],
    matrix: [
      ["self",   "enemy",  "neutral"],
      ["enemy",  "self",   "ally"],
      ["neutral","ally",   "self"],
    ],
  },
  world_verdan: {
    factions: [
      { id: "druid",  name: "Druids of Verdan",   leader: "Eldreth Lá Bạc", leaderTitle: "Đại Druid",       members: 680,  alignment: "neutral", influence: 0.73, motto: "Cây nói, ta nghe",        description: "Bảo vệ Cây Thế Giới qua mọi mùa Bloomtide.",        color: "success" },
      { id: "bloom",  name: "Liên minh Hoa Lửa", leader: "Veska Tro Hồng", leaderTitle: "Nữ tướng",          members: 1450, alignment: "chaotic", influence: 0.51, motto: "Hoa nở trong lửa",         description: "Tin rằng Cây phải cháy để tái sinh — Druids gọi họ là dị giáo.", color: "destructive" },
    ],
    matrix: [
      ["self",  "enemy"],
      ["enemy", "self"],
    ],
  },
  world_kragmir: {
    factions: [
      { id: "stoneborn", name: "Nhà Stoneborn", leader: "Dvarn Núi Cũ",   leaderTitle: "Vua Khắc Đá",      members: 12000, alignment: "lawful",  influence: 0.65, motto: "Đá nhớ tất cả",         description: "Hầu hết đang ngủ đông, chờ dấu hiệu sao rơi.",     color: "info" },
      { id: "carvers",   name: "Hội Thợ Khắc",  leader: "Brenna Tay Sắt", leaderTitle: "Trưởng Hội",        members: 540,    alignment: "lawful",  influence: 0.36, motto: "Mỗi nhát búa, một lời thề", description: "Canh giữ thành phố và đánh thức Stoneborn khi tới giờ.", color: "primary" },
    ],
    matrix: [
      ["self", "ally"],
      ["ally", "self"],
    ],
  },
};

export function getFactionGraph(worldId: string): FactionGraph | undefined {
  return FACTIONS_BY_WORLD[worldId];
}