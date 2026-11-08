# FIELDVERSE – Phase 1: Brand Identity & Design System Specification

> **Platform Tagline:** *The Ultimate Sports Event Universe*  
> **Architecture Principle:** Three independent frontend portals (`player`, `organizer`, `admin`) connected to a unified Supabase database.  
> **Status:** Phase 1 – Approved Design System & Figma Blueprint

---

## 1. Tool Status & Figma Setup Overview

### Tool Availability Check
- **Figma API / Live Plugin:** No direct programmatic Figma write session is currently authenticated in the local environment.
- **Methodology:** We follow the zero-guesswork, Figma-ready specification methodology. This document gives exact pixel dimensions, hex codes, typography weights, Auto-Layout rules, and step-by-step clicks so that anyone—even a complete beginner—can recreate the exact professional design inside Figma without ambiguity.

---

## 2. Figma Project Structure & Setup (Step-by-Step)

Follow these exact steps inside Figma:

### Step 2.1: Create a New Figma File
1. Open [Figma](https://www.figma.com/) (desktop app or in your browser).
2. Click **New design file** (`Ctrl + N` on Windows).
3. In the top-center title bar, double-click the name `Untitled` and rename it to:  
   `FIELDVERSE – Master Design System`

### Step 2.2: Create the 7 Designated Pages
On the left sidebar, locate the **Pages** section:
1. Rename `Page 1` to: `00 – Brand Identity`
2. Click the `+` icon next to Pages and create:
   - `01 – Design System`
   - `02 – Player Website`
   - `03 – Organizer Website`
   - `04 – Admin Website`
   - `05 – Interactive Prototypes`
   - `06 – Responsive Designs`

---

## 3. Brand Identity (Page: `00 – Brand Identity`)

### 3.1 Brand Mission & Personality
- **Mission:** Bring the visceral, tactile excitement of real-world outdoor sports into an effortless digital tournament ecosystem.
- **Tone:** Grounded, athletic, authentic, premium, cutting-edge yet organic.
- **Key Visual Metaphor:** **The Turf & The Orbit** — Combining natural outdoor ground soil/turf with modern digital telemetry (the "Universe").

### 3.2 Logo System: "The Orbital Turf"

#### Logo Structure:
1. **The Icon (Mark):** An athletic, open stadium ellipse/orbit (representing the "Verse") intersecting a sharp 22-degree athletic angle (representing an outfield boundary / cricket crease / football pitch demarcation).
2. **The Wordmark:** `FIELDVERSE` written in bold geometric uppercase, with `FIELD` in solid high-contrast and `VERSE` accented in the primary brand color.
3. **The Sub-Mark:** `The Ultimate Sports Event Universe` in tracking +120% uppercase.

#### Step-by-Step: How to draw the FIELDVERSE Logo in Figma
1. Select the `00 – Brand Identity` page.
2. Press `F` to create a Frame. In the right sidebar, set Width = `800`, Height = `500`. Set Fill to Warm Off-White (`#F5F0E6`).
3. Press `O` for Ellipse. Hold `Shift` and drag an ellipse of `80 x 80 px`.
4. Set Fill to `None`, and add a **Stroke** of `8px` with color `#303C32` (Dark Earthy Green).
5. Draw a second inner Ellipse of `52 x 52 px`, center-aligned, with a stroke of `6px` and color `#78916A` (Olive Green).
6. Press `L` (Line) and draw a diagonal line at 45° across the bottom-right corner of the outer circle with stroke `8px`, color `#C6A47B` (Clay Brown) and rounded end-caps.
7. Press `T` (Text) and click to the right of the icon:
   - Font: **Outfit**
   - Weight: **Bold (700)**
   - Size: **36px**
   - Letter Spacing: **-1%**
   - Content: Type `FIELD` in color `#303C32` and `VERSE` in color `#78916A`.
8. Underneath the wordmark, press `T`:
   - Font: **Inter**
   - Weight: **Medium (500)**
   - Size: **12px**
   - Letter Spacing: **+15%** (Type `15%` or `1.8px`)
   - Text Case: **Uppercase**
   - Color: `#C6A47B` (Clay Brown)
   - Content: `THE ULTIMATE SPORTS EVENT UNIVERSE`
9. Select all elements and press `Ctrl + G` to group them. Name the group `FIELDVERSE_Logo_Primary`.

---

## 4. Typography System (Page: `01 – Design System`)

We use two Google Fonts accessible directly in Figma without installing external files:
1. **Headings & Display:** **Outfit** (Geometric, dynamic, athletic, modern).
2. **Body & UI Elements:** **Inter** (Industry-standard legibility, clean neutral).
3. **Scores & Live Telemetry:** **JetBrains Mono** (Tactical, monospaced for timers, overs, scores, and statistics).

### Typography Scale Table

| Token Name | Font Family | Weight | Size (px) | Line Height | Letter Spacing | Intended Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-2xl` | Outfit | Bold (700) | 64px | 72px (112%) | -2% | Hero statement headlines |
| `display-xl` | Outfit | Bold (700) | 48px | 56px (116%) | -1.5% | Page titles / Major section headers |
| `display-lg` | Outfit | SemiBold (600) | 36px | 44px (122%) | -1% | Modal titles, Section headers |
| `heading-md` | Outfit | SemiBold (600) | 24px | 32px (133%) | -0.5% | Card titles, Widget headers |
| `heading-sm` | Outfit | Medium (500) | 20px | 28px (140%) | 0% | Sub-sections, List titles |
| `body-lg` | Inter | Regular (400) | 18px | 28px (155%) | 0% | Featured introductions, Hero sub-text |
| `body-md` | Inter | Regular (400) | 15px | 24px (160%) | 0% | Standard body paragraphs, form inputs |
| `body-sm` | Inter | Medium (500) | 13px | 20px (153%) | +0.5% | Metadata, secondary hints, table cells |
| `caption` | Inter | SemiBold (600) | 11px | 16px (145%) | +3% | Badges, tags, micro-labels (Caps) |
| `data-mono-lg`| JetBrains Mono | Bold (700) | 32px | 36px (112%) | -1% | Live Match Scores (e.g. `184/4`) |
| `data-mono-sm`| JetBrains Mono | Medium (500) | 14px | 20px (142%) | 0% | Match timers, overs, odds |

---

## 5. Distinct Color Systems for the Three Websites

To ensure each portal has a distinct, purposeful identity while sharing common athletic DNA, we define three separate color palettes:

### A. PLAYER WEBSITE – The Natural Earth Showcase
*Concept:* Entering an outdoor sports ground with real turf, clay pitches, and natural sunlight.

| Color Name | Hex Code | Figma Variable Name | Purpose |
| :--- | :--- | :--- | :--- |
| **Warm Off-White** | `#F5F0E6` | `player/bg-canvas` | Main website background (light, breathable, natural) |
| **Warm Beige** | `#E8D8BC` | `player/bg-surface` | Card surfaces, container backgrounds, subtle headers |
| **Clay Brown** | `#C6A47B` | `player/accent-clay` | Pitch borders, primary buttons, sport accents |
| **Olive Green** | `#78916A` | `player/accent-turf` | Active states, interactive tabs, turf highlights |
| **Dark Earthy Green** | `#303C32` | `player/text-primary` | High-contrast typography, hero deep cards, footer |
| **Deep Forest Earth** | `#1A221C` | `player/surface-dark` | Inverted hero widgets, 3D viewport backdrop |
| **Vibrant Turf Green** | `#4EA157` | `player/state-live` | Live match pulse badge, success alerts |
| **Sunburst Amber** | `#D9822B` | `player/state-warning` | Upcoming registration closing soon |

### B. ORGANIZER WEBSITE – The Tactical Command Centre
*Concept:* Dark, high-precision tactical operations room for tournament coordinators.

| Color Name | Hex Code | Figma Variable Name | Purpose |
| :--- | :--- | :--- | :--- |
| **Command Void** | `#0D1117` | `organizer/bg-canvas` | Deep dark cockpit background |
| **Tactical Slate** | `#161B22` | `organizer/bg-surface` | Card surface, table background |
| **Border Wire** | `#27303D` | `organizer/border-subtle` | Precision 1px grid divider lines |
| **Tactical Emerald** | `#10B981` | `organizer/accent-action` | Primary actions, fixture generate button, success |
| **Radar Cyan** | `#06B6D4` | `organizer/accent-info` | Bracket nodes, analytics graphs, venue pins |
| **Warning Gold** | `#F59E0B` | `organizer/state-warning` | Conflict warning, reschedule notification |
| **Pure White** | `#FFFFFF` | `organizer/text-primary` | Primary high-legibility headings |
| **Subdued Slate** | `#8B949E` | `organizer/text-muted` | Metadata, disabled indicators, table headers |

### C. ADMIN WEBSITE – The Executive Control Panel
*Concept:* High-level governance, financial/user oversight, clean corporate elegance.

| Color Name | Hex Code | Figma Variable Name | Purpose |
| :--- | :--- | :--- | :--- |
| **Executive Obsidian**| `#0A0E17` | `admin/bg-canvas` | Clean executive dark base |
| **Executive Card** | `#111827` | `admin/bg-surface` | Tables, KPI metric containers |
| **Executive Border** | `#1F2937` | `admin/border` | Clean architectural separators |
| **Royal Indigo** | `#6366F1` | `admin/accent-primary` | Master approvals, navigation active state |
| **Cobalt Trust** | `#3B82F6` | `admin/accent-secondary`| User roles, verified badges |
| **Audit Rose** | `#F43F5E` | `admin/state-danger` | Revoke organizer, suspend user, reject event |
| **Executive Pearl** | `#F9FAFB` | `admin/text-primary` | Executive headers and figures |
| **Muted Steel** | `#9CA3AF` | `admin/text-muted` | Timestamp logs, system versions |

---

## 6. Spacing Scale & Elevation (8-Point Grid)

Every spacing value in FIELDVERSE is a multiple of 4 or 8 to guarantee mathematical harmony:

| Token Name | Pixel Value | Typical Application |
| :--- | :--- | :--- |
| `space-1` | `4px` | Badge vertical padding, micro icon margins |
| `space-2` | `8px` | Space between label and input, tag gaps |
| `space-3` | `12px` | Compact button padding, card micro-padding |
| `space-4` | `16px` | Standard button padding, form input vertical padding |
| `space-5` | `20px` | Medium card inner padding (mobile) |
| `space-6` | `24px` | Standard card inner padding, grid gutters |
| `space-8` | `32px` | Section margins, space between filter and card grid |
| `space-12` | `48px` | Gap between major page rows |
| `space-16` | `64px` | Hero bottom margin, section dividers |
| `space-24` | `96px` | Major page section padding top/bottom |

### Elevation & Shadow Tokens

1. **Natural Soft (Player):**  
   `box-shadow: 0px 8px 24px -4px rgba(48, 60, 50, 0.08), 0px 2px 6px -1px rgba(48, 60, 50, 0.04);`  
   *In Figma:* Drop Shadow → X: `0`, Y: `8`, Blur: `24`, Spread: `-4`, Color: `#303C32` at `8%`.
2. **Elevated Card (Player):**  
   `box-shadow: 0px 16px 36px -6px rgba(48, 60, 50, 0.12), 0px 4px 12px -2px rgba(48, 60, 50, 0.06);`  
   *In Figma:* Drop Shadow → X: `0`, Y: `16`, Blur: `36`, Spread: `-6`, Color: `#303C32` at `12%`.
3. **Tactical Glow (Organizer):**  
   `box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.6), inset 0px 1px 0px rgba(255, 255, 255, 0.07);`  
   *In Figma:* Drop Shadow (X: 0, Y: 12, Blur: 30, `#000000` 60%) + Inner Shadow (X: 0, Y: 1, Blur: 0, `#FFFFFF` 7%).
4. **Executive Float (Admin):**  
   `box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);`

---

## 7. Core Components Specification (Figma Master Components)

### Component 1: Action Buttons (`Button/Player`)

#### 1. Primary Button (Clay Hero)
- **Container:** Auto Layout (`Shift + A`), Direction: Horizontal.
- **Padding:** Left/Right `24px`, Top/Bottom `14px`.
- **Corner Radius:** `10px` (Modern softened athletic corner, not full pill).
- **Background Fill:** `#C6A47B` (Clay Brown).
- **Typography:** Outfit, SemiBold (600), `15px`, Color: `#FFFFFF` (or `#1B241C` for highest AA contrast).
- **Hover State:** Fill `#B89366`, Drop Shadow `0 6px 16px rgba(198, 164, 123, 0.35)`.
- **Active State:** Scale 98%, Fill `#AA8355`.

#### 2. Secondary Button (Olive Turf Outlined)
- **Container:** Auto Layout, Padding: Left/Right `22px`, Top/Bottom `12px`.
- **Corner Radius:** `10px`.
- **Fill:** `Transparent`.
- **Stroke:** `2px` inside, color `#78916A` (Olive Green).
- **Typography:** Outfit, SemiBold (600), `15px`, Color: `#303C32`.
- **Hover State:** Fill `#78916A` at `10%` opacity.

#### 3. Ghost / Subtle Button
- **Container:** Auto Layout, Padding: Left/Right `16px`, Top/Bottom `10px`.
- **Typography:** Inter, Medium (500), `14px`, Color: `#303C32`.
- **Hover State:** Fill `#E8D8BC` (Warm Beige) at 50% opacity, Corner Radius: `8px`.

---

### Component 2: Status Badges & Pills (`Badge/Status`)

- **Live Match:**
  - Background: `#FEE2E2` (light crimson tint) or Dark Green with green glowing dot.
  - Dot: `8 x 8 px` circle, Fill `#10B981` (pulsing animation indicator).
  - Text: `LIVE NOW`, JetBrains Mono, Bold, `11px`, Color `#047857`.
  - Padding: `4px 10px`, Corner Radius: `999px` (Full Pill).
- **Registration Open:**
  - Background: `#E8F5E9`, Text: `REGISTRATION OPEN`, Color `#2E7D32`.
- **Knockout Bracket:**
  - Background: `#E8D8BC`, Text: `KNOCKOUT`, Color `#303C32`.
- **League Format:**
  - Background: `#D1E7DD`, Text: `LEAGUE ROUND-ROBIN`, Color `#146C43`.

---

### Component 3: The Event Card (`Card/EventCard`)

This is the cornerstone card on the Player Website (Discover, Home, Search).

#### Dimensions & Structure:
- **Card Frame:** Width = `380px`, Height = Auto (Approx `420px`).
- **Auto Layout:** Vertical, Gap = `0px`.
- **Corner Radius:** `16px`.
- **Border:** `1px solid rgba(48, 60, 50, 0.08)`.
- **Background Fill:** `#FFFFFF` (Clean card over the `#F5F0E6` canvas).
- **Shadow:** Natural Soft (`0 8px 24px rgba(48, 60, 50, 0.08)`).

#### Internal Layers (Top to Bottom):
1. **Media / Cover Frame (`180px` height):**
   - Shows stylized sport grass pitch / 3D ball texture.
   - Top-Left Floating Badge: Sport Pill (`CRICKET` or `FOOTBALL`) in `#303C32` with white text.
   - Top-Right Floating Badge: Status Pill (`12 TEAMS SLOTS LEFT` or `LIVE`).
2. **Body Frame (`Auto Layout`, Padding: `20px`, Gap: `12px`):**
   - **Date & Category Row:** `SUN, 18 NOV • OPEN MEN'S TOURNAMENT` (Inter Medium, 12px, Color `#78916A`).
   - **Title:** `Premier Monsoon Cricket Championship 2026` (Outfit SemiBold, 20px, Line-height 26px, Color `#303C32`).
   - **Venue Row:** Location pin icon + `Central Turf Arena, Sector 4` (Inter Regular, 14px, Color `#556358`).
   - **Metadata Pill Row:**
     - Fee: `₹2,500 / Team`
     - Format: `8 Overs • Knockout`
   - **Divider Line:** `1px solid #E8D8BC`.
   - **Footer Action Row:**
     - Left: Registered Teams count indicator (`8 / 16 Teams Confirmed`).
     - Right: Primary CTA button: `View & Register →`.

---

### Component 4: GroundPulse 3D Quick-Viewer Widget (`Widget/GroundPulsePreview`)

- **Purpose:** A teaser component embedded on Event Details that communicates the signature interactive 3D venue experience.
- **Card Container:** Width `100%` (or `600px`), Height `280px`, Background `#1A221C` (Dark Earth Ground).
- **Visual:** Stylized 3D Pitch Wireframe with glowing pulse markers at:
  - `Zone A: Pitch / Playing Field`
  - `Gate 1: North Spectator Entry`
  - `Gate 2: Team Dugout & Pavilion`
  - `Station 1: First Aid & Hydration`
- **Overlay UI:**
  - Badge top-left: `✦ GROUNDPULSE™ 3D INTERACTIVE VENUE`
  - Control Pill bottom-center: `Drag to Rotate 360° • Click Pins for Details`
  - Button bottom-right: `Launch Full-Screen GroundPulse ↗`

---

## 8. Summary of Deliverables & Next Steps

This Phase 1 specification defines the complete visual DNA, typography rules, color palettes, and component blueprints for FIELDVERSE.

### Ready for Next Phase:
With the design system and brand identity fully detailed and locked:
- **Phase 2 (Next):** Complete design and user journeys for the **Player Website** (Desktop 1440px & Mobile 390px screens: Splash, Home, Discover, Event Details, Team Registration, My Arena, Match Center, and GroundPulse).
- Review the specifications above and let me know if you would like any color or font adjustments before we generate the full screen-by-screen layouts for the Player Website.
