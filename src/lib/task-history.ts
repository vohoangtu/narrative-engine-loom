import type { TaskRun } from "./loom-data";

const worlds = [
  { id: "world_aetheria", name: "Aetheria", era: "Age of Iron Crowns" },
  { id: "world_nyxos",    name: "Nyxos",    era: "Twilight Epoch" },
  { id: "world_helios",   name: "Helios",   era: "Solar Concordat" },
  { id: "world_drakmoor", name: "Drakmoor", era: "Wyrmfire Wars" },
  { id: "world_verdan",   name: "Verdan",   era: "Bloomtide" },
  { id: "world_kragmir",  name: "Kragmir",  era: "Stoneborn Era" },
];

const headlines = [
  "Khi Mặt Trăng Vỡ, Các Vị Thần Cũng Cúi Đầu",
  "Hiệp Ước Mặt Trời Và Cái Giá Của Ánh Sáng",
  "Bản Hợp Đồng Của Bóng Tối",
  "Triều Đại Sắt Đã Kết Thúc Trong Im Lặng",
  "Rồng Lửa Trở Lại Sau Một Ngàn Mùa",
  "Nữ Hoàng Của Tro Tàn Lên Ngôi",
  "Cánh Cổng Thứ Bảy Đã Mở",
  "Khi Đại Dương Học Cách Quên",
  "Lời Hứa Cuối Của Người Bất Tử",
  "Bài Thánh Ca Cho Một Vương Quốc Sụp Đổ",
  "Đêm Mà Các Vì Sao Rơi Xuống Kragmir",
  "Người Cuối Cùng Của Nhà Tysan",
  "Cuộc Hôn Phối Của Lửa Và Sương",
  "Khi Cây Thần Khô Héo, Verdan Khóc",
  "Bản Hòa Tấu Của Chiến Tranh",
  "Đứa Con Của Hai Mặt Trời",
  "Lời Thì Thầm Trong Hầm Mộ Helios",
  "Thanh Kiếm Không Bao Giờ Được Rút",
  "Thành Phố Đã Tự Đốt Mình",
  "Sự Trở Về Của Vị Vua Lưu Vong",
];

const eras = ["just now", "5 min ago", "12 min ago", "37 min ago", "1 hour ago", "2 hours ago", "5 hours ago", "yesterday", "2 days ago", "3 days ago", "1 week ago"];
const tiers: TaskRun["epistemicTier"][] = ["Chân Thực", "Mơ Hồ", "Huyền Sử"];
const statuses: TaskRun["status"][] = ["done", "done", "done", "done", "running", "queued", "error"];

function rand<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function hex(n: number) { return n.toString(16).padStart(6, "0"); }

export const ALL_TASKS: TaskRun[] = Array.from({ length: 64 }, (_, i) => {
  const w = rand(worlds, i * 7);
  const status = rand(statuses, i * 3 + 1);
  const tier = rand(tiers, i * 5);
  const isDone = status === "done";
  const isRunning = status === "running";
  const isQueued = status === "queued";
  return {
    id: `tsk_${hex((i + 1) * 91283 % 0xffffff)}`,
    worldId: w.id,
    worldName: w.name,
    era: w.era,
    status,
    progress: isDone ? 1 : isRunning ? 0.3 + (i % 6) * 0.1 : isQueued ? 0 : 0.5 + (i % 4) * 0.12,
    currentNode: isRunning ? ["wordsmith", "director", "historian", "critic"][i % 4] : undefined,
    startedAt: rand(eras, i),
    duration: isDone || status === "error" ? 40 + (i * 7) % 60 + Math.round((i * 13) % 10) / 10 : undefined,
    revisionCount: (i % 5 === 0) ? 1 : (i % 11 === 0) ? 2 : 0,
    epistemicTier: tier,
    noiseLevel: Math.round(((i * 17) % 90 + 5)) / 100,
    headline: isDone ? rand(headlines, i * 3) : undefined,
  };
});
