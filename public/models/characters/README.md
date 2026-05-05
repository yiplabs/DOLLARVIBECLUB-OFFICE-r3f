# Kenney Mini Characters

Drop the GLB files from https://kenney.nl/assets/mini-characters here.

Required filenames (referenced by `lib/avatar/presets.ts`):

- character-male-a.glb
- character-male-b.glb
- character-male-c.glb
- character-female-a.glb
- character-female-b.glb
- character-female-c.glb

Each ships with 32+ embedded skeletal animations including: Idle, Walk, Run, Jump, Sit, Wave, Dance, Clap. The Avatar component crossfades between Idle ↔ Walk based on whether the avatar has an active path.

License: CC0 (public domain). Created by Kenney.

If models are missing, `<Avatar />` falls back to a tinted capsule primitive so click-to-move still works.
