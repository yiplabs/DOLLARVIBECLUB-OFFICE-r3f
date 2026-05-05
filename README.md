# DVC Cowork

**Habbo-style 3D virtual cowork space for vibe coders.** Multiplayer extension of [dollarvibeclub.com](https://dollarvibeclub.com).

`Next.js 15` · `React 19` · `TypeScript` · `react-three-fiber v9` · `drei v10` · `Supabase` · `Drizzle` · `Tailwind 4`

---

## What this is

A 3D isometric coworking space. Click a building on the campus map → enter a themed room → click the floor to walk → say hi. Runs 2–100 concurrent users via Supabase Realtime.

Six themed rooms:

- **The Lounge** — chill, social, default vibe
- **Deep Focus** — quiet work, lo-fi
- **The Arena** — 1v1 build-offs
- **Brainstorm** — sticky notes everywhere
- **The Stage** — talks, $1 ship-or-die
- **Mentor Row** — open-door office hours

---

## Setup

```bash
git clone <this repo>
cd dvc-cowork
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# DATABASE_URL (pooled Supavisor), DIRECT_URL (direct Postgres)
npm run dev
```

App boots at `http://localhost:3000`.

> Without Supabase env vars the app still runs — it falls back to **demo mode** (single-player, ephemeral chat).

### Database

```bash
npm run db:generate            # creates ./drizzle/0000_*.sql
# Open the generated file. If it contains `CREATE SCHEMA "auth"`, DELETE that line —
# Supabase already owns auth. Then:
npm run db:migrate
```

After Drizzle migrations, run `drizzle/0001_seed.sql` in the **Supabase SQL editor**. It:

- creates the `handle_new_user()` trigger that auto-inserts a profile row when an auth user signs up
- seeds the 6 rooms
- enables RLS + base policies

---

## Required 3D assets (CC0)

Both packs are public domain. The app falls back to tinted box primitives if assets are missing — but it looks much better with the real models.

### Kenney Furniture Kit

Download: <https://kenney.nl/assets/furniture-kit>

Drop these GLB files into `public/models/furniture/` (from the pack's `Models/GLB/` folder):

```
desk · deskCorner · chairDesk · chairCushion · computerScreen · computerKeyboard
laptop · bookcaseClosed · bookcaseOpen · loungeSofa · loungeSofaCorner
pottedPlant · plantSmall · coffeeTable · lampSquareTable · rugRectangle · rugRound
kitchenFridge · kitchenStove · wallDoorway · wallWindow
```

### Kenney Mini Characters

Download: <https://kenney.nl/assets/mini-characters>

Drop these GLB files into `public/models/characters/`:

```
character-male-a · character-male-b · character-male-c
character-female-a · character-female-b · character-female-c
```

Each ships with 32+ embedded skeletal animations (idle, walk, run, jump, sit, wave, dance, clap…). The Avatar component crossfades idle ↔ walk based on path state.

### Optional: Draco-compress

```bash
npx gltf-pipeline -i in.glb -o out.glb -d
```

Roughly 70% smaller files. Not required.

---

## Multiplayer test (two browsers)

1. Make sure Supabase env vars are set
2. Open `http://localhost:3000` in two different browsers (or one normal + one incognito)
3. Each session gets a different guest identity. Both go through `/create` → `/map` → `/room/lounge`
4. You should see both avatars walking and chatting in real time within ~200ms

---

## Replit notes

- The `.replit` config in this repo targets Cloud Run with `nodejs-20`
- **Replit Free** (0.5 vCPU / 1 GB RAM) cannot run Next 15 dev + r3f reliably — recommend **Replit Core ($20/mo)** or local development
- Always open the preview in a **new tab**, not the embedded iframe — websocket + click events are flaky in iframes

---

## Cost projections

| stage | services | est. cost |
|---|---|---|
| testing (1–10 users) | local dev | $0 |
| 50 concurrent users | Vercel Pro $20 + Supabase Pro $25 | ~$45/mo |
| 200 concurrent users | + Realtime add-on | ~$80/mo |

---

## Architecture cheatsheet

```
src/
├── app/                       Next.js App Router pages + API routes
├── components/
│   ├── chrome/                2D HUD overlays (brutalist, Tailwind)
│   ├── presence/              sidebar + cards
│   ├── chat/                  chat input + bubble
│   ├── profile/               profile card + edit modal
│   ├── auth/                  magic link drawer + mobile blocker
│   ├── creator/               /create page UI
│   ├── world/                 campus map + buildings + SceneRoot
│   ├── room/                  RoomScene + Floor/Walls/Furniture/Signs/Lighting/PostFX
│   └── avatar/                Avatar + RemoteAvatar + AvatarShadow
├── lib/
│   ├── avatar/                AvatarConfig type + 6 presets + tint pools
│   ├── rooms/                 catalog (6 rooms) + themes (per-room scene) + grid (A* mask)
│   ├── realtime/              channel helpers + payload types
│   ├── supabase/              browser/server clients + middleware refresh
│   ├── pathfinding.ts         qiao A* wrapper
│   ├── iso.ts                 facing helpers
│   └── utils.ts               cn() + guest identity
├── store/                     Zustand: avatar, room (peers/bubbles), quality
├── hooks/                     useClickToMove · useRealtimeRoom · useDeviceQuality · useAvatarConfig
└── db/                        Drizzle schema + queries
```

### Key flows

- **Click-to-move** — `<Floor onClick>` → `useClickToMove` → A* over the room's walkable mask → push waypoints into avatarStore → `<Avatar>` lerps through them in `useFrame` and broadcasts position at 10 Hz.
- **Realtime** — every room has a `room:<slug>` channel with presence + 4 broadcast events (`pos`, `walk`, `chat`, `emote`). Joiners see existing peers' last-known position via presence; `walk` payload sends the full A* path so newly-joined clients render in-progress walks correctly.
- **Demo mode** — if `NEXT_PUBLIC_SUPABASE_URL` is missing, `useRealtimeRoom` skips the channel and only echoes the local user's chat back to themselves. The `<DemoModeBanner>` surfaces this state.

---

## Known limitations (v0)

- Desktop only (`<MobileBlocker>` takes over below `lg:`)
- Chat is ephemeral — no history persisted
- One avatar per user
- No voice chat / WebRTC
- No furniture interaction (no sit-on-chair animation)
- No real-time time-of-day lighting
- No DM panel — sidebar + ProfileCard is the entire social surface

## Roadmap

- Avatar accessories (hats, glasses, props)
- Sit-on-chair animation
- Voice chat (LiveKit)
- Stripe payments
- Mobile responsive
- Custom room editing / building placement

---

## Credits

Built by Hunter ([@tommyyipxyz](https://x.com/tommyyipxyz)). Part of [Dollar Vibe Club](https://dollarvibeclub.com).

3D assets © [Kenney](https://kenney.nl) — CC0.
