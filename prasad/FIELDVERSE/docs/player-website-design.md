# FIELDVERSE – Phase 2: Player Website Screen-by-Screen Design Specification

> **Target Platform:** FIELDVERSE Player Website (`FIELDVERSE/player/`)  
> **Visual Identity:** Outdoor Natural Sports Ground (Clay Brown `#C6A47B`, Warm Beige `#E8D8BC`, Olive Green `#78916A`, Dark Earthy Green `#303C32`, Warm Off-White `#F5F0E6`)  
> **Figma Page:** `02 – Player Website`  
> **Base Desktop Frame Size:** `1440px` width (Canvas background `#F5F0E6`, Container `1280px` centered, 12-column grid with 80px margins and 24px gutters).

---

## 1. Overview of the 16 Player Website Screens

The Player Website is the primary consumer-facing visual showcase for FIELDVERSE. Every screen is meticulously structured below with exact pixel coordinates, layout hierarchy, component tokens, and interactions:

1. **Screen 01:** Splash / 3D Intro Experience
2. **Screen 02:** Home Page (Hero, 3D Viewport, Live Ticker, Featured Tournaments, GroundPulse Spotlight)
3. **Screen 03:** Discover Events (Filters, Sport Toggle, Search Bar, Tournament Grid)
4. **Screen 04:** Search & Filter Events (Active Chips, Zero State Fallback)
5. **Screen 05:** Event Details Page (Cover, Rules, Schedule, Sticky Booking Sidebar)
6. **Screen 06:** Team Registration Modal (Multi-Step Form: Team, Captain, Squad, Review)
7. **Screen 07:** My Arena (Player Hub: Active Matches, Quick Stats, Schedule)
8. **Screen 08:** Upcoming Matches (Detailed Fixture Cards, Ground Directions)
9. **Screen 09:** Match History & Detailed Scorecard (Batting/Bowling Tables, MVP)
10. **Screen 10:** Live Match Centre (Real-Time Telemetry, Ball-by-Ball Feed, Field Map)
11. **Screen 11:** Leaderboard & Standings (Podium, Net Run Rate, Points Table)
12. **Screen 12:** Player Profile (Stats Radar, Badges, Match Archive)
13. **Screen 13:** Notifications Drawer (Schedule Alerts, Registrations)
14. **Screen 14:** Signature Feature – GroundPulse™ 3D Interactive Venue (360° Orbit, Hotspots)
15. **Screen 15:** Login & Registration (Split-Screen Athletic Identity)
16. **Screen 16:** Account Settings (Preferences, Security)

---

## 2. Step-by-Step Screen Layout Specifications

---

### SCREEN 01: Splash / 3D Intro Experience (`Frame: 1440 x 900 px`)
- **Figma Frame Name:** `Player_01_Splash`
- **Background Fill:** Deep Forest Earth (`#1A221C`)
- **Key Concept:** A short, skippable cinematic entrance that immerses the user into the natural outdoor arena.
- **Layers & Hierarchy:**
  1. **Top Bar (Padding: 32px 48px):**
     - Left: Logo icon only (60px) in `#E8D8BC`.
     - Right: "Skip Intro [Esc]" subtle text button (Inter Medium 13px, `#C6A47B`, border 1px solid `#78916A` at 40%).
  2. **Center 3D Stage (Absolute Center, 600 x 600 px):**
     - Three.js procedural sphere representing a dual textured sports orb (half cricket leather seam, half football pentagonal tessellation) floating over a stylized natural turf ring.
     - Particle aura: Soft ambient glowing dust particles in Warm Beige (`#E8D8BC`).
  3. **Bottom Hero Content (Y = 640px, Center-Aligned):**
     - Overline Tag: `WELCOME TO THE ARENA` (Inter SemiBold 12px, letter-spacing +20%, color `#C6A47B`).
     - Headline: `FIELDVERSE` (Outfit Bold 64px, color `#F5F0E6`).
     - Subline: `The Ultimate Sports Event Universe` (Outfit Light 20px, color `#E8D8BC`).
     - Loading / Progress Bar: Width `240px`, Height `4px`, Background `rgba(255,255,255,0.1)`, Active fill `#C6A47B` animated to 100%.
     - Primary Button: `Enter the Ground →` (Clay Hero Button, Width 220px, Height 48px).

---

### SCREEN 02: Home Page (`Frame: 1440 x 3800 px`)
- **Figma Frame Name:** `Player_02_Home`
- **Background Fill:** Warm Off-White (`#F5F0E6`)
- **Sections (Top to Bottom):**

#### 1. Global Navigation Bar (`Sticky, 1440 x 80 px`, Fill: `rgba(245, 240, 230, 0.95)`, Backdrop Blur: `12px`, Border-bottom: `1px solid rgba(48, 60, 50, 0.08)`):
- Left (`X: 80px`): `FIELDVERSE_Logo_Primary` (Width 160px).
- Center (`X: 380px`): Navigation Links (Auto Layout Horizontal, Gap: `32px`):
  - `Home` (Active: Outfit SemiBold 15px, `#303C32`, with 3px bottom indicator `#C6A47B`).
  - `Discover Events` (Inter Medium 15px, `#556358`).
  - `GroundPulse™ 3D` (Inter Medium 15px, `#556358`, with small `3D` pill badge in Olive Green).
  - `My Arena` (Inter Medium 15px, `#556358`).
  - `Leaderboard` (Inter Medium 15px, `#556358`).
- Right (`X: 1120px`):
  - Search trigger icon (20px).
  - Notification bell with unread dot.
  - Primary Action: `Sign In / Register` (Clay Brown Button, Height: 40px, Padding: 16px).

#### 2. Hero Section (`Height: 680px`, Grid Container `1280px`):
- **Left Column (Width: 620px, Y: 140px):**
  - Sport Switcher Pill: Two-tab segmented switch (`🏏 Cricket` | `⚽ Football`) with smooth active sliding pill in `#303C32`.
  - Main Headline (Outfit Bold 56px, Line-height 64px, `#303C32`):  
    *Turn Local Grounds Into Legendary Arenas.*
  - Subtitle (Inter Regular 18px, Line-height 28px, `#556358`, Margin-top: 16px):  
    *Discover verified open tournaments, register squads in seconds, track ball-by-ball live stats, and explore real grounds in interactive 3D.*
  - Button Row (Gap 16px, Margin-top: 32px):
    - Button 1: `Explore Tournaments →` (Primary Clay Button, Height 52px, Padding 28px).
    - Button 2: `Explore GroundPulse™ 3D` (Olive Outlined Button with 3D cube icon).
  - Trust Badges Row (Margin-top: 48px): "120+ Active Tournaments" • "50+ Verified Grounds" • "Real-Time Scoring".
- **Right Column (Width: 580px, Height: 540px, Y: 100px):**
  - 3D Interactive Canvas Container: Rounded frame (Radius 24px) with subtle clay soil border and drop shadow.
  - Interactive 3D Ball & Turf model with day/night floodlight toggle switch floating in top-right.

#### 3. Live Match Ticker (`Height: 120px`, Margin-top: 40px):
- Background: `#303C32` (Dark Earthy Green).
- Header: Live Pulsing Dot + `MATCHES IN PLAY NOW`.
- Horizontal Scrolling Cards (Width: 320px, Height: 80px each, Gap: 16px):
  - Card 1: `City Hawks 142/4 (16.2 ov)` vs `Strikers CC` • *Need 28 off 22 balls* • `Watch Live →`
  - Card 2: `Spartans FC 2 - 1 United Boys` • *74' 2nd Half* • `View Match →`

#### 4. Featured Tournaments Section (`Height: 720px`):
- Header Row: Left: `Featured Championships` (Outfit Bold 36px), Right: `View All 42 Events →` link.
- 3-Column Grid of Event Cards (`Card/EventCard`, Width 380px each, Height 430px).

#### 5. Signature GroundPulse™ Teaser Section (`Height: 640px`):
- Full-width dark container (`#1A221C`) with earth contour lines.
- Left: Feature overview, clickable zone list (Pitch, Pavilion, Medical, Gate).
- Right: Large interactive 3D venue viewport with rotation handles and "Launch Full Experience" CTA.

#### 6. Why FIELDVERSE Section & Footer (`Height: 600px`).

---

### SCREEN 03: Discover Events (`Frame: 1440 x 1800 px`)
- **Figma Frame Name:** `Player_03_Discover`
- **Page Header:**
  - Title: `Find Your Next Tournament` (Outfit Bold 40px).
  - Global Search Bar (Width: 1280px, Height: 56px, Corner Radius: 12px, Background: `#FFFFFF`, Border: `1px solid #E8D8BC`):
    - Left: Search icon + Input `Search by tournament name, ground, or city...`
    - Right: Location filter pill (`Near Sector 5, Bengaluru`) + `Search` Button.
- **Sticky Filter Bar (`Height: 64px`, Background: `#FFFFFF`, Border: `1px solid rgba(48,60,50,0.06)`):
  - Filter 1: Sport Dropdown (`All Sports`, `Cricket`, `Football`).
  - Filter 2: Format (`Knockout`, `League Round-Robin`, `Box Cricket`).
  - Filter 3: Entry Fee Range (`Free`, `< ₹1,000`, `₹1,000 - ₹3,000`, `₹3,000+`).
  - Filter 4: Date Range Picker (`This Weekend`, `Next 7 Days`, `Custom Date`).
  - Filter 5: Ground Surface (`Natural Turf`, `Clay`, `Artificial Matting`).
  - Right: Results count (`Showing 28 Tournaments`) + Sort dropdown (`Starting Soonest`).
- **Events Grid:**
  - 3 Columns x 4 Rows = 12 Event Cards per page.
  - Responsive pagination at bottom: `← Previous` `[1]` `2` `3` `Next →`.

---

### SCREEN 04: Search & Filter Events – Active & Zero States (`Frame: 1440 x 1200 px`)
- **Figma Frame Name:** `Player_04_Search_States`
- **Active Filter Chips Row:**
  - Displays selected filters as removable chips:
    - `[Cricket ✕]` `[Knockout ✕]` `[Under ₹2,000 ✕]` + `Clear All Filters` link.
- **Empty State Illustration & Container (Centered, Width: 600px, Y: 300px):**
  - Icon / Graphic: Stylized empty sports bench on turf with a lone ball.
  - Headline: `No Tournaments Found` (Outfit Bold 24px, `#303C32`).
  - Supporting text: `We couldn't find any tournaments matching your current filter combination. Try expanding your search radius or clearing specific filters.`
  - Action: `Reset Filters` (Primary Clay Button) + `Request / Suggest a Venue` (Ghost Link).

---

### SCREEN 05: Event Details Page (`Frame: 1440 x 2400 px`)
- **Figma Frame Name:** `Player_05_Event_Details`
- **Hero Banner (`Height: 360px`):**
  - High-resolution turf cover background with dark vignette overlay.
  - Sport Badge (`CRICKET • T20 KNOCKOUT`) in Olive Green pill.
  - Title: `Grand Monsoon Cricket Championship 2026` (Outfit Bold 44px, `#FFFFFF`).
  - Metadata: Date & Time (`Sat, 24 Nov 2026 • 08:00 AM IST`) • Venue (`Apex International Turf, Ground B`).
  - Organizer verification pill: `Organized by Bangalore Sports Club` + Blue verified checkmark.
- **Two-Column Layout (Content Grid):**
  - **Left Column (Width: 800px):**
    - Section 1: **Tournament Overview & Rules** (Overs, ball type: Red Leather 4-Piece, dress code, spikes allowed).
    - Section 2: **GroundPulse™ 3D Interactive Venue Preview** (Embedded 3D ground canvas with interactive hotspot pins and full-screen trigger).
    - Section 3: **Prize Pool & Honors** (Winner Trophy + ₹50,000, Runner-up + ₹25,000, MVP Kit).
    - Section 4: **Match Schedule & Format Breakdown** (Single elimination bracket overview).
    - Section 5: **Confirmed Teams List** (Shows 12 registered team badges out of 16 slots).
  - **Right Column (Sticky Sidebar, Width: 420px):**
    - **Registration Card (`Background: #FFFFFF`, Corner Radius: 16px, Padding: 28px, Shadow: Elevated):**
      - Entry Fee: `₹2,500` per team.
      - Slots Progress: `12 of 16 Slots Filled` (Visual progress bar in Clay Brown).
      - Deadline: `Registration closes in 2 days, 14 hours`.
      - Primary CTA: `Register Your Team →` (Clay Hero Button, full width, 52px height).
      - Sub-text: `Instant confirmation • 100% refund if cancelled 48h prior`.
      - Organizer Support: Direct WhatsApp / Call inquiry buttons.

---

### SCREEN 06: Team Registration Modal (`Frame: 1440 x 900 px with Modal Overlay`)
- **Figma Frame Name:** `Player_06_Registration_Modal`
- **Overlay:** Background `#1A221C` at `70%` opacity with backdrop blur.
- **Modal Window:** Width `720px`, Max-height `800px`, Background `#FFFFFF`, Radius `20px`, Padding `32px`.
- **4-Step Stepper Header:**
  - Step 1: `Team Details` (Active)
  - Step 2: `Captain Info`
  - Step 3: `Squad Roster`
  - Step 4: `Confirmation & Pay`
- **Step 1 Form Content:**
  - Input: Team Name (`e.g., Koramangala Knights`).
  - Team Crest / Logo upload zone (Drag & Drop or browse file).
  - City / Area (`Bengaluru South`).
  - Team Jersey Color (`Primary: Navy Blue, Secondary: Gold`).
- **Footer Navigation:**
  - Left: `Cancel` (Ghost button).
  - Right: `Continue to Captain Info →` (Primary Clay Button).

---

### SCREEN 07: My Arena (Player Hub) (`Frame: 1440 x 1400 px`)
- **Figma Frame Name:** `Player_07_My_Arena`
- **Dashboard Header:**
  - Welcome Banner: `Welcome back, Rahul Sharma!` + Player Role Tag (`All-Rounder • Captain of Tigers CC`).
- **Quick Metric Cards Row (4 Cards, Width: 290px each, Height: 120px):**
  - Metric 1: `Tournaments Entered: 6`
  - Metric 2: `Matches Played: 24`
  - Metric 3: `Win Ratio: 71%`
  - Metric 4: `Player MVP Awards: 5 🏆`
- **Active Match Countdown Card:**
  - Large focus card with ground location, weather forecast, reporting time (`Today at 3:30 PM`), and "Open Team Lineup".
- **Tabs:** `Upcoming Matches` | `My Teams` | `Tournament History` | `Awards & Badges`.

---

### SCREEN 08: Upcoming Matches (`Frame: 1440 x 1200 px`)
- **Figma Frame Name:** `Player_08_Upcoming_Matches`
- **Fixture List:**
  - Match Card with Team A Crest vs Team B Crest.
  - Date, Exact Toss Time, Allocated Ground & Pitch Number (`GroundPulse Pitch 2`).
  - Weather condition alert (`Sunny, 27°C, Wind 12 km/h`).
  - Action Buttons: `View Ground Map (GroundPulse)` • `Confirm Team Squad` • `Share Match Link`.

---

### SCREEN 09: Match History & Detailed Scorecard (`Frame: 1440 x 1600 px`)
- **Figma Frame Name:** `Player_09_Scorecard`
- **Match Result Banner:**
  - `Tigers CC won by 18 runs` (Outfit Bold 28px).
  - Match Summary: `Tigers CC: 178/6 (20 ov)` vs `Strikers CC: 160/9 (20 ov)`.
- **Tabbed Scorecard:**
  - `Innings 1 (Tigers CC)` | `Innings 2 (Strikers CC)` | `Match Highlights` | `Wagon Wheel`.
- **Batting Table (Clean Table Component):**
  - Columns: Batsman, Dismissal Method, Runs (R), Balls (B), 4s, 6s, Strike Rate (SR).
- **Bowling Table:**
  - Columns: Bowler, Overs (O), Maidens (M), Runs (R), Wickets (W), Economy (Econ).
- **Match MVP Award Card:** Player photo, stats (`64 runs off 38 balls & 2/22`).

---

### SCREEN 10: Live Match Centre (`Frame: 1440 x 1800 px`)
- **Figma Frame Name:** `Player_10_Live_Match_Centre`
- **Live Match Telemetry Banner (`Height: 180px`, Background: `#1A221C`):**
  - Pulsing Red/Green `LIVE` Indicator.
  - Team Score in JetBrains Mono Bold 36px: `148/4` in `16.3 overs`.
  - Current Batsmen: `R. Sharma (54* off 32)` & `V. Patel (18 off 12)`.
  - Current Bowler: `A. Khan (3.3-0-28-2)`.
  - Recent Deliveries Over-Strip: `[1] [4] [0] [W] [6] [2]`.
- **Two-Column Live Feed:**
  - Left (Width: 780px): Real-time ball-by-ball commentary with color-coded event badges (Green for boundaries, Red for wickets).
  - Right (Width: 460px): Mini 2D/3D Pitch Map showing where the ball was played (Field placement & Wagon Wheel).

---

### SCREEN 11: Leaderboard & Standings (`Frame: 1440 x 1400 px`)
- **Figma Frame Name:** `Player_11_Leaderboard`
- **Tournament Selector & Sport Filter.**
- **Top 3 Podium (Visual Illustration / Cards):**
  - 1st Place: Gold Trophy badge + Team Crest + 12 Pts.
  - 2nd Place: Silver Trophy badge.
  - 3rd Place: Bronze Trophy badge.
- **Full Standings Table:**
  - Rank, Team Name, Matches Played (P), Won (W), Lost (L), Tied (T), Net Run Rate (NRR) / Goal Difference (GD), Points (PTS), Last 5 Matches Form (`W W L W W`).

---

### SCREEN 12: Player Profile (`Frame: 1440 x 1400 px`)
- **Figma Frame Name:** `Player_12_Profile`
- **Profile Header Card:**
  - Avatar (120px circular portrait with Olive green border).
  - Name: `Rahul Sharma` + Nationality / City.
  - Role: `Right-Hand Batsman • Right-Arm Fast Medium`.
  - Jersey Number: `#18`.
- **Performance Radar Chart:** Batting, Bowling, Fielding, Fitness, Consistency.
- **Career Highlights Showcase:** Most runs in a match, Best bowling figures, Tournament trophies.

---

### SCREEN 13: Notifications Drawer (`Frame: 1440 x 900 px with Drawer`)
- **Figma Frame Name:** `Player_13_Notifications`
- **Slide-out Drawer from Right:** Width `440px`, Height `100%`, Background `#FFFFFF`, Shadow `0 0 40px rgba(0,0,0,0.15)`.
- **Sections:**
  - `Today` (e.g. "Match Schedule confirmed: Tigers CC vs Panthers CC at 4:00 PM").
  - `Yesterday` (e.g. "Your team registration was verified by the organizer").
  - `Earlier this week`.
- **Notification Item:** Icon, Title, Timestamp, Read/Unread state dot, Action link.

---

### SCREEN 14: Signature Feature – GroundPulse™ 3D Interactive Venue (`Frame: 1440 x 900 px Full Screen`)
- **Figma Frame Name:** `Player_14_GroundPulse_3D`
- **Concept:** An interactive 3D digital twin of the sports ground.
- **Viewport:** Full-screen 3D Three.js canvas with ground surface, boundary ropes, pitch, pavilion, entry gates, and lighting towers.
- **Floating HUD (Heads-Up Display) Elements:**
  - Top-Left: Ground Name (`Apex International Turf`), Pitch Surface (`Natural Red Clay`), Weather (`28°C Clear Skies`).
  - Top-Right: `Exit Fullscreen ✕` & `Audio Atmosphere (Crowd/Turf) 🔊`.
  - Bottom-Center Control Bar (Pill container, Background `rgba(30,36,32,0.85)`, Backdrop blur):
    - `360° Free Orbit` • `Top-Down Tactical View` • `Day / Night Floodlights` • `Reset View`.
- **Interactive 3D Hotspot Pins (Clickable in Prototype):**
  1. `Pin 1: The Pitch`: Click opens Pitch Report (Bounce, moisture, average first innings score).
  2. `Pin 2: Dugout & Pavilion`: Click shows Team benches, hydration cooler, gear storage.
  3. `Pin 3: North Spectator Gate`: Click shows entry pass QR scanners & parking zones.
  4. `Pin 4: First Aid Station`: Click shows medical personnel & defibrillator location.
  5. `Pin 5: Refreshment Zone`: Click shows drinking water refill stations.
- **Hotspot Detail Flyout (Right Drawer, Width: 360px):**
  - Slides in when any pin is clicked with full photos, descriptions, and directions.

---

### SCREEN 15: Login & Registration (`Frame: 1440 x 900 px`)
- **Figma Frame Name:** `Player_15_Auth`
- **Split Screen Layout:**
  - **Left Showcase (Width: 640px, Background: `#1A221C`):**
    - High-impact graphic of sports ground under evening floodlights with glowing FIELDVERSE emblem.
    - Quote: *"Where every local match feels like a world final."*
  - **Right Form Container (Width: 800px, Background: `#FFFFFF`, Padding: 80px 120px):**
    - Logo header.
    - Title: `Welcome to FIELDVERSE`.
    - Tab switch: `Sign In` | `Create Account`.
    - Social Auth: `Continue with Google` (Full-width button with Google G icon).
    - Divider: `— Or continue with email —`.
    - Form inputs: Email Address, Password.
    - Checkbox: `Remember me` & `Forgot password?` link.
    - Primary CTA: `Sign In to My Arena →` (Clay Hero Button).
    - Role notice at bottom: `Are you a Tournament Organizer? Visit Organizer Portal →`.

---

### SCREEN 16: Account Settings (`Frame: 1440 x 1100 px`)
- **Figma Frame Name:** `Player_16_Settings`
- **Sidebar (Width: 280px):**
  - `Profile Information` (Active)
  - `Sport Preferences`
  - `Team Management`
  - `Notification Settings`
  - `Password & Security`
- **Content Area (Width: 800px):**
  - Edit Profile Form: Name, Phone, Email, Playing Role, Bio.
  - Notification toggles: Match reminders (Email/SMS/Push), Toss alerts, Score updates.
  - Save Changes button.

---

## 3. Recommended Figma Layout Arrangement on Page `02 – Player Website`

To keep your Figma canvas beautifully organized, arrange the frames in a 4x4 clean grid:

| Row | Screen A | Screen B | Screen C | Screen D |
| :--- | :--- | :--- | :--- | :--- |
| **Row 1 (Y: 0px)** | `01_Splash` (1440x900) | `02_Home` (1440x3800) | `03_Discover` (1440x1800) | `04_Search_States` (1440x1200) |
| **Row 2 (Y: 4000px)** | `05_Event_Details` (1440x2400) | `06_Registration_Modal` (1440x900) | `07_My_Arena` (1440x1400) | `08_Upcoming_Matches` (1440x1200) |
| **Row 3 (Y: 6600px)** | `09_Scorecard` (1440x1600) | `10_Live_Match_Centre` (1440x1800) | `11_Leaderboard` (1440x1400) | `12_Profile` (1440x1400) |
| **Row 4 (Y: 8600px)** | `13_Notifications` (1440x900) | `14_GroundPulse_3D` (1440x900) | `15_Auth` (1440x900) | `16_Settings` (1440x1100) |

*(Leave a 100px horizontal gap between columns: `X: 0`, `X: 1540`, `X: 3080`, `X: 4620`).*
