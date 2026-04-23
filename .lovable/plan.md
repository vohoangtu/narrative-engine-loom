

# Brainstorm: Mở Rộng Output Products của Narrative Loom

Hiện tại pipeline chỉ xuất **5 outputs** trong Studio: Prose · Outline · Headline+VFX · State · Critic. Dưới đây là **20+ ý tưởng** mở rộng kho output, chia theo 6 nhóm — mỗi cái là một "tab" hoặc "agent output" mới có thể plug vào Narrative Studio.

---

## 1. Narrative Artifacts (văn bản mở rộng)

| # | Output | Agent đề xuất | Mô tả |
|---|--------|---------------|-------|
| 1 | **Chapter Pack** | Wordsmith × N | Tự động chia prose dài thành 3-5 chương, mỗi chương có title + epigraph |
| 2 | **Multi-POV Variants** | Wordsmith Fork | Cùng sự kiện, viết lại từ POV của 3 nhân vật khác nhau (Lord / Maester / Envoy) |
| 3 | **Lore Codex Entry** | Lorekeeper *(new)* | Wiki-style entry: faction, character, artifact, location — markdown có cross-link |
| 4 | **Dialogue Script** | Playwright *(new)* | Định dạng kịch bản sân khấu: nhân vật, lời thoại, stage directions |
| 5 | **Epistolary Pack** | Scribe *(new)* | Thư tay, hịch, sắc lệnh, nhật ký — viết theo voice của từng nhân vật |
| 6 | **Prophecy & Verse** | Oracle *(new)* | Thơ tiên tri, ballad, bài hát dân gian — có vần điệu |

## 2. Visual Artifacts

| # | Output | Mô tả |
|---|--------|-------|
| 7 | **Cover Art Brief** | Prompt + reference palette để gen cover image (DALL-E/Imagen) — preview trực tiếp trong tab |
| 8 | **Storyboard Frames** | 6-12 panel cards, mỗi panel có: shot type, camera angle, mô tả, mood color |
| 9 | **Map / Cartography** | SVG map tự sinh: thành, vương quốc, đường đi của nhân vật chính |
| 10 | **Character Portraits** | Stat sheet + portrait prompt cho mỗi nhân vật chính |
| 11 | **Timeline Infographic** | Horizontal timeline visual của các tick → events → consequences |

## 3. Audio / Multimedia Briefs

| # | Output | Mô tả |
|---|--------|-------|
| 12 | **Voiceover Script** | Prose chia thành đoạn ≤ 30s, có SSML tags (pause, emphasis, tone) |
| 13 | **Soundtrack Cues** | Per-scene: tempo, instruments, mood, reference track |
| 14 | **SFX Sheet** | Danh sách hiệu ứng âm thanh per shot (snow falling, sword, crowd) |

## 4. Distribution / Publishing

| # | Output | Mô tả |
|---|--------|-------|
| 15 | **Social Media Pack** | Twitter thread (8 tweets), IG carousel (5 slides), TikTok hook (3 versions) |
| 16 | **Newsletter Edition** | Email-ready HTML: hero, headline, prose excerpt, CTA |
| 17 | **Podcast Show Notes** | Episode title, 3-bullet summary, timestamps, guest quotes |
| 18 | **SEO Pack** | Meta title/desc, JSON-LD article schema, 10 keywords, slug |

## 5. Game / Interactive Hooks

| # | Output | Mô tả |
|---|--------|-------|
| 19 | **Quest JSON** | Game-ready: objectives, rewards, NPC dialogue, branching outcomes |
| 20 | **Choice-based Variant** | Twine/Ink-style: 3 decision points với consequences cho mỗi lựa chọn |
| 21 | **Tarot Spread** | 5 lá bài tượng trưng cho diễn biến, mỗi lá có tên & ý nghĩa |

## 6. Analysis / Meta

| # | Output | Mô tả |
|---|--------|-------|
| 22 | **Translation Pack** | Prose dịch sang EN / ES / JP, giữ proper nouns |
| 23 | **Reading Level Variants** | YA / Adult / Academic — cùng nội dung 3 độ phức tạp |
| 24 | **Themes & Symbols** | Bảng phân tích motif (snow=silence, iron=duty, crown=burden) — link tới câu cụ thể |
| 25 | **Foreshadow Map** | Đoạn nào đang setup cho event nào ở tương lai — kèm confidence |

---

## Đề xuất MVP để build ngay (1 lượt)

Chọn **6 outputs giá trị cao, dễ trình diễn nhất**, gom thành 2 expansion groups trong Studio:

### Group A — "Story Pack" (mở rộng văn bản)
- **Multi-POV Variants** (#2)
- **Lore Codex** (#3)
- **Dialogue Script** (#4)
- **Prophecy & Verse** (#6)

### Group B — "Media Kit" (cho distribution)
- **Storyboard Frames** (#8) — visual cards
- **Social Pack** (#15) — Twitter thread + IG carousel
- **Voiceover Script** (#12) — SSML preview
- **Cover Art Brief** (#7) — prompt + palette swatch

---

## UI changes

### Trong `Studio.tsx`
- Tabs hiện tại (5) → tổ chức lại thành **2 nhóm**:
  - **Core**: Prose · Outline · State · Critic
  - **Story Pack**: POV Variants · Codex · Dialogue · Verse
  - **Media Kit**: Headline & VFX · Storyboard · Social · Voiceover · Cover
- Thêm dropdown **"Generate add-ons…"** ở header card (chọn outputs nào cần sinh thêm) để không generate tất cả mặc định
- Mỗi tab mới có nút **Copy** + **Download** + **Regenerate** riêng

### Data layer
- Mở rộng `src/lib/loom-data.ts` với mock data cho 8 outputs mới: `SAMPLE_POV_VARIANTS`, `SAMPLE_CODEX`, `SAMPLE_DIALOGUE`, `SAMPLE_VERSE`, `SAMPLE_STORYBOARD`, `SAMPLE_SOCIAL`, `SAMPLE_VOICEOVER`, `SAMPLE_COVER_BRIEF`
- Update `PIPELINE_NODES` thêm 4 agents mới: **Lorekeeper, Playwright, Oracle, Social Strategist** → tổng 22 nodes (cập nhật cả Workshop "18 agents" → "22 agents")

### Visual treatment per tab (để mỗi tab cảm giác khác nhau, không bị nhàm)
- **POV Variants**: 3 cột song song, mỗi cột tô màu nhẹ theo nhân vật
- **Codex**: layout wiki, sidebar entries + main content có cross-link `[[Tháp Bạc]]`
- **Dialogue**: format kịch bản — tên nhân vật in hoa, thoại lùi vào, stage direction in nghiêng giữa dấu ngoặc
- **Verse**: căn giữa, font display lớn, line breaks giữ nguyên
- **Storyboard**: grid 3×2 panel cards, mỗi card có aspect-ratio 16:9 (gradient placeholder + meta)
- **Social**: mockup Twitter card thật + IG carousel slider
- **Voiceover**: monospace với SSML highlight syntax + nút "Play" giả lập
- **Cover Brief**: 3 swatch chips + textarea prompt + "Send to image gen" button

### Header indicator
Card output header hiện tại có "1 revision" — thêm chip **"12 artifacts"** hiển thị tổng số output đã sinh, click để mở popover liệt kê.

---

## Files sẽ thay đổi (phase build)

- `src/lib/loom-data.ts` — thêm types + mock data + 4 agents mới
- `src/pages/Studio.tsx` — restructure tabs thành 3 groups, thêm 8 TabsContent mới
- `src/components/loom/StoryPackTabs.tsx` *(new)* — 4 tab con của Story Pack
- `src/components/loom/MediaKitTabs.tsx` *(new)* — 4 tab con của Media Kit
- `src/pages/Workshop.tsx` — update count "18 agents" → "22 agents"

Approve plan này thì mình build full 8 outputs trong 1 lượt.

