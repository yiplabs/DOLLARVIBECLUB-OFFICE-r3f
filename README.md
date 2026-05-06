# DVC Cowork

**Habbo-style 3D virtual cowork space for vibe coders.** Local-first prototype, multiplayer extension of [dollarvibeclub.com](https://dollarvibeclub.com).

`Next.js 15` · `React 19` · `TypeScript` · `react-three-fiber v9` · `drei v10` · `Tailwind 4`

---

## What this is (v0)

A 3D isometric coworking space. Click a building on the campus map → enter a themed room → click the floor to walk → chat. **100% local-only, no env vars, no signup, no Supabase, no API keys.** State persists to `localStorage`.

Six themed rooms:

- **The Lounge** — chill, social, default vibe (with a friendly NPC greeter and a project showcase board)
- **Deep Focus** — quiet work, lo-fi (pomodoro widget auto-opens)
- **The Arena** — 1v1 build-offs
- **Brainstorm** — sticky notes everywhere (animated whiteboard)
- **The Stage** — talks, $1 ship-or-die (with three swinging colored spotlights)
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

## Feature tour

### Landing → Create → Map → Room

- `/` — brutalist landing with aurora blobs, $ coin, an auto-rotating 3D primitive avatar preview, and a tile for each room
- `/create` — character creator with live 3D preview, 6 presets, randomize, color tabs (body / hair / outfit / shoes / extras for accessories)
- `/map` — isometric campus with 6 buildings, lampposts, benches, trees, and a fountain. Hover lifts a building, click triggers fade-zoom into the room
- `/room/[slug]` — full themed scene with HUD overlay

### Avatar
- Primitive geometry (boxes + spheres) tinted from your config — no GLBs, never a 404
- 6 emotes: idle (gentle sway), walk (bobbing), wave, dance (figure-8 spin), sit (toggle, sustained), clap
- 5 accessories: glasses, beanie, crown, headphones (each tintable)
- AFK auto-emote: random small wave after 30s of stillness
- Click your own avatar to open your profile card; click any peer to open theirs

### Per-room decorations
- **Lounge:** ProjectBoard wall (corkboard with shipping/beta/idea cards), GreeterNpc that says hi when you get close
- **Brainstorm:** Whiteboard with rotated sticky notes
- **Stage:** Three animated colored spotlights with volumetric cones that sweep slowly
- **Deep Focus:** PomodoroWidget pre-opens (work 25m / break 5m, auto-rolls)

### Chrome (HUD)
- TopBar with live countdown to the next FRI 20:00 UTC ship-or-die event
- PresenceSidebar with minimap (canvas, real-time peer + self markers), step counter, msgs/min, achievements link
- ChatInput with `/wave`, `/dance`, `/sit`, `/clap`, `/shout`, `/me`, `/help` slash commands
- EmoteBar (4 buttons mapped to keys 1-4)
- MarqueeTicker scrolling room news
- MusicWidget — embeds a YouTube lo-fi stream (3 tracks); volume + play controls in settings
- ActivityFeed — collects walks, chats, emotes, achievements with a badge for unread events
- PomodoroWidget — focus/break timer with auto-roll
- PerfHud — fps + frame ms + heap (toggleable in settings)
- RoomInfoOverlay — quick room metadata + jump-to-room links
- AchievementsPanel — 10 unlockable achievements (first walk, sit master, all rooms, night owl, etc)
- SettingsPanel — time of day (dawn → night), graphics quality, audio, walking helpers, perf hud, pet toggle
- OnboardingTour — 5-step intro, can be replayed from settings
- MagicLinkPanel — waitlist signup placeholder for v1 auth

### Audio
- WebAudio-synthesized SFX: footsteps (bass + filtered noise), emote sounds (wave/dance/clap/sit), toast pings, achievement arpeggio
- Lo-fi music via YouTube IFrame embed (graceful fallback when blocked)
- Volume controls bound to settings store

### Camera
- Smooth follow rig that lerps the orthographic camera toward the avatar's position
- Toggleable in settings

### Helpers / hooks
- `useClickToMove` — A* pathfinding over the room mask
- `useRealtimeRoom` — local mock; chat → spawnLocalBubble
- `useDeviceQuality` — auto-tunes quality tier from `useDetectGPU`
- `useStepCounter` — cumulative grid-cell distance walked
- `useAfkAutoEmote` — random idle waves after 30s
- `useAchievementWatcher` — unlocks + toasts
- `useAudioWiring` — footstep/emote SFX driven by store subscriptions
- `useKeyboardShortcuts` — `?`, `/`, `E`, `G`, `1-4`, `Esc`

### Persistence (localStorage only)
- `dvc_avatar_v1` — character config + setup flag
- `dvc_settings_v1` — time of day, audio, toggles, pet
- `dvc_achievements_v1` — unlocks + visited rooms

---

## Architecture cheatsheet

```
src/
├── app/                       Next.js App Router pages + error.tsx
├── components/
│   ├── chrome/                2D HUD (TopBar, ChatInput, Settings, Toast,
│   │                          Pomodoro, Music, Activity, Achievements, etc)
│   ├── presence/              sidebar + minimap + cards
│   ├── chat/                  ChatInput + ChatBubble (3D)
│   ├── profile/               ProfileCard + EditProfileModal
│   ├── auth/                  MagicLinkPanel + MobileBlocker
│   ├── creator/               /create UI + AvatarPreview3D
│   ├── landing/               HeroAvatar (3D preview on landing)
│   ├── world/                 SceneRoot + WorldMapScene + WorldBuilding
│   │                          + CameraRig + AnimatedDoor
│   ├── room/                  RoomScene + Floor/Walls/Furniture/Signs/Lighting/PostFX
│   │                          + AmbientParticles + Whiteboard + ProjectBoard
│   │                          + StageSpotlight + PrimitiveFurniture (16 pieces)
│   └── avatar/                PrimitiveAvatar + Avatar/RemoteAvatar + Pet
│                              + GreeterNpc + AvatarShadow + AvatarGLTF (gated)
├── lib/
│   ├── audio/sfx.ts           WebAudio synth: footsteps, emotes, toast, achievement
│   ├── avatar/                AvatarConfig + presets + tint pools + accessories
│   ├── rooms/                 catalog + themes + grid (A* mask)
│   ├── realtime/types.ts      payload shapes (used locally, no server)
│   ├── pathfinding.ts         qiao A* wrapper
│   ├── iso.ts                 facing helpers
│   └── utils.ts               cn()
├── store/                     Zustand:
│                              avatarStore (persisted), roomStore,
│                              qualityStore, settingsStore (persisted),
│                              pomodoroStore, achievementsStore (persisted)
└── hooks/                     useClickToMove · useRealtimeRoom · useDeviceQuality
                               · useAvatarConfig · useStepCounter · useAfkAutoEmote
                               · useAchievementWatcher · useAudioWiring · useKeyboardShortcuts
```

---

## Keyboard shortcuts

| key | action |
|---|---|
| `/` | focus chat |
| `?` | toggle help |
| `Esc` | close modals / blur chat |
| `E` | toggle edit-profile modal |
| `G` | toggle settings panel |
| `1` `2` `3` `4` | wave · dance · sit · clap |
| Click floor | walk to spot |
| Click avatar | open profile card |

---

## Upgrading visuals (optional, post-v0)

The app ships with hand-built primitive geometry that looks deliberate but blocky. To swap in real Kenney 3D assets:

1. Download <https://kenney.nl/assets/furniture-kit> and <https://kenney.nl/assets/mini-characters>. Both are CC0.
2. Unzip both.
3. Drop the GLBs from `furniture-kit/Models/GLB/` into `public/models/furniture/`.
4. Drop `character-male-{a,b,c}.glb` and `character-female-{a,b,c}.glb` into `public/models/characters/`.
5. In `src/components/avatar/AvatarGLTF.tsx`, set `KENNEY_AVAILABLE = true` and fill in the GLTF body using the pattern in the master prompt PART 14.
6. In `src/components/room/Furniture.tsx`, swap individual `FURNITURE_MAP` entries to GLTF-loading variants.

The boundary in `avatarLoader.tsx` ensures any failed fetch falls back to the primitive instead of white-screening.

---

## Known limitations (v0)

- Desktop only (`<MobileBlocker>` takes over below `lg:`)
- No real multiplayer — sidebar shows only you
- Chat is local + ephemeral
- One avatar per user
- No persistent profiles, projects, or auth
- No voice / WebRTC
- Music IFrame requires network access; blocked gracefully

## Roadmap to v1

- Supabase Realtime channels for presence + walk/chat/emote broadcasts
- Magic-link auth + Drizzle profile/projects schema
- Avatar accessories (more variants)
- Sit-on-chair detection (auto-sit when next to a chair)
- Voice chat (LiveKit)
- Stripe payments
- Mobile responsive layout
- More NPCs + room interactions

The previous scaffold included full Supabase wiring. It was stripped to make the v0 prototype work without any external dependencies. The realtime payload types in `src/lib/realtime/types.ts` are kept as the contract for v1.

---

## Credits

Built by Hunter ([@tommyyipxyz](https://x.com/tommyyipxyz)). Part of [Dollar Vibe Club](https://dollarvibeclub.com).

3D character + furniture models (when you upgrade): © [Kenney](https://kenney.nl) — CC0.
