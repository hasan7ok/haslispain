# Project architecture

- Use shared generated avatar assets through PixelAvatar and PixelCharacter so profile, auth, rewards, and navigation stay visually consistent when artwork changes.
- Keep the authenticated home as an editorial learning overview composed from existing game-state and culture data, preserving all learning routes.
- Keep theme state centralized in ThemeContext; theme controls consume the shared context so visual selection and applied CSS never diverge.
- Keep Spanish playback in a shared browser-speech controller so all controls share playing, stopping, and error states without adding a paid audio dependency.
- Store supplementary learning preferences per authenticated user through one shared hook; journals remain in their existing cloud table to preserve ownership and saved content.