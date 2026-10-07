# Project architecture

- Use generated photorealistic portraits through shared avatar components so profile, auth, rewards, and navigation remain visually consistent.
- Keep the authenticated home as an editorial learning overview composed from existing game-state and culture data, preserving all learning routes.
- Keep theme state centralized in ThemeContext; theme controls consume the shared context so visual selection and applied CSS never diverge.