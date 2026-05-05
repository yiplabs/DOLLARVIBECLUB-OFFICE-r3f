# DVC Cowork

**Habbo-style 3D virtual cowork space for vibe coders.** Local-first prototype, multiplayer extension of [dollarvibeclub.com](https://dollarvibeclub.com).

`Next.js 15` · `React 19` · `TypeScript` · `react-three-fiber v9` · `drei v10` · `Tailwind 4`

---

## What this is (v0)

A 3D isometric coworking space. Click a building on the campus map → enter a themed room → click the floor to walk → chat. **100% local-only, no env vars, no signup, no Supabase, no API keys.** State persists to `localStorage`.

Multiplayer + auth land in v1.

Six themed rooms:

- **The Lounge** — chill, social, default vibe
- **Deep Focus** — quiet work, lo-fi
- **The Arena** — 1v1 build-offs
- **Brainstorm** — sticky notes everywhere
- **The Stage** — talks, $1 ship-or-die
- **Mentor Row** — open-door office hours

---

## Run it

Requires Node ≥ 20.

```bash
git clone <this repo>
cd dvc-cowork
npm install
npm run dev
```

App boots at `http://localhost:3000`. No `.env` needed.

If you're on an older Node version, install nvm and run `nvm install 20 && nvm use 20`.

---

## How to use

1. Land at `/` → "enter the cowork" → routed to `/create`
2. Pick a preset, randomize, or recolor — the 3D primitive avatar updates live
3. "Lock it in" saves to `localStorage` and routes to `/map`
4. Click any building → routes to `/room/<slug>`
5. Click any floor tile to walk. A* avoids walls + furniture.
6. Press `/` to focus chat, `?` for shortcuts, `E` to edit, `1`-`4` for emotes
7. Refresh — your avatar persists.

---

## Architecture cheatsheet

```
src/
├── app/                       Next.js App Router pages
│   ├── page.tsx               landing
│   ├── create/page.tsx        character creator
│   ├── map/page.tsx           campus
│   └── room/[slug]/page.tsx   themed room
├── components/
│   ├── chrome/                2D HUD (TopBar, ChatInput, Toast, etc.)
│   ├── presence/              sidebar (currently shows just you)
│   ├── chat/                  ChatInput + ChatBubble (3D)
│   ├── profile/               ProfileCard + EditProfileModal
│   ├── auth/                  MagicLinkPanel (waitlist) + MobileBlocker
│   ├── creator/               /create UI
│   ├── world/                 SceneRoot + WorldMapScene + WorldBuilding
│   ├── room/                  RoomScene + Floor/Walls/Furniture/Signs/Lighting/PostFX
│   │                          + PrimitiveFurniture (geometry-only)
│   └── avatar/                PrimitiveAvatar + AvatarGLTF (gated) + Avatar/RemoteAvatar
├── lib/
│   ├── avatar/                AvatarConfig type + 6 presets + tint pools
│   ├── rooms/                 catalog + themes + grid (A* mask)
│   ├── realtime/types.ts      payload shapes (used locally, no server)
│   ├── pathfinding.ts         qiao A* wrapper
│   ├── iso.ts                 facing helpers
│   └── utils.ts               cn()
├── store/                     Zustand: avatarStore (persisted), roomStore, qualityStore
└── hooks/                     useClickToMove · useRealtimeRoom (mock) · useDeviceQuality · useAvatarConfig
```

### Key flows

- **Click-to-move** — `<Floor onClick>` → `useClickToMove` → A* over the room's walkable mask → push waypoints into `avatarStore.path` → `<Avatar>` lerps through them in `useFrame`.
- **Persistence** — `avatarStore` is wrapped in zustand's `persist` middleware. Only `config` and `hasSetup` go to localStorage; runtime `pos`/`path` reset on reload.
- **Local mock multiplayer** — `useRealtimeRoom` wires the room broadcaster so chat input → a local self-bubble. Walk/pos/emote broadcasts are no-ops.
- **Asset-free rendering** — every avatar and every furniture model is a Three.js primitive (boxes/spheres/cylinders) tinted from `AvatarConfig` and `theme.furniture[].tint`. No `useGLTF` calls hit the network.

---

## Upgrading visuals (optional, post-v0)

The app ships with hand-built primitive geometry that looks deliberate but blocky. To swap in real Kenney 3D assets:

1. Download <https://kenney.nl/assets/furniture-kit> and <https://kenney.nl/assets/mini-characters>. Both are CC0.
2. Unzip both.
3. Drop the GLBs from `furniture-kit/Models/GLB/` into `public/models/furniture/` (filenames in `public/models/furniture/README.md`).
4. Drop `character-male-{a,b,c}.glb` and `character-female-{a,b,c}.glb` into `public/models/characters/`.
5. In `src/components/avatar/AvatarGLTF.tsx`, set `KENNEY_AVAILABLE = true` and fill in the GLTF body using the pattern in the master prompt PART 14 (`useGLTF` + `SkeletonUtils.clone` + name-based tinting).
6. In `src/components/room/Furniture.tsx`, swap individual `FURNITURE_MAP` entries to GLTF-loading variants as you go.

Refresh — primitives swap to real models on a per-component basis. The boundary in `avatarLoader.tsx` ensures any failed fetch falls back to the primitive instead of white-screening.

---

## Known limitations (v0)

- Desktop only (`<MobileBlocker>` takes over below `lg:`)
- No multiplayer — sidebar shows only you
- Chat is local + ephemeral
- One avatar per user
- No persistent profiles, projects, or auth
- No voice / WebRTC

---

## Roadmap to v1

- Supabase Realtime channels for presence + walk/chat/emote broadcasts
- Magic-link auth + Drizzle profile/projects schema
- Avatar accessories (hats, glasses, props)
- Sit-on-chair animation
- Stripe payments
- Mobile responsive

The previous scaffold included full Supabase wiring. It was stripped to make the v0 prototype work without any external dependencies. The realtime payload types in `src/lib/realtime/types.ts` are kept as the contract for v1.

---

## Credits

Built by Hunter ([@tommyyipxyz](https://x.com/tommyyipxyz)). Part of [Dollar Vibe Club](https://dollarvibeclub.com).

3D character + furniture models (when you upgrade): © [Kenney](https://kenney.nl) — CC0.
