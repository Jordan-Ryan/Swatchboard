# Agent notes

Treat `src/`, `package.json`, `app.json`, `eas.json`, and `.github/workflows/eas-ios-release.yml` as the source for behavior, scripts, and release steps. `docs/STATE.md` lists the current screens, layouts, and commands.

## Setup and run

Node.js `>= 20.19.4` (engines of locked `react-native@0.81.5`). The iOS workflow requests Node 20. `package.json` has no `engines` field.

```bash
npm ci
npm start
npm run ios
npm run android
npm run web
```

`npm run ios` is `expo run:ios`. `npm run android` is `expo run:android`. `npm run web` is `expo start --web`. The scripts in `package.json` are `start`, `ios`, `android`, and `web`. `ios/` and `android/` are gitignored.

Install dependencies with `npm ci` against `package-lock.json`.

## Editing

- Describe layouts only from `GRID_LAYOUTS` and canvas presets only from `PLATFORM_PRESETS` in `src/constants/presets.ts`.
- Custom canvas sizes are positive integers up to 4000 (`src/screens/CombinedSelectionScreen.tsx`).
- Export goes through `captureCanvas` and `saveImageToGallery` in `src/utils/exportCanvas.ts`.
- Keep display name SwatchBoard, npm name `collage-maker`, bundle id `com.jordanryan.collagemaker`, and version `1.0.2` unless those files change.
- A docs-only edit under `README.md` or `docs/**` is ignored by the EAS workflow `paths-ignore` list.

## Release commands already in the repo

The GitHub workflow builds and submits iOS with `eas build --platform ios --profile production --non-interactive --auto-submit`, using secret `EAS_TOKEN`. `build-ios.sh`, `deploy-ios.sh`, and `submit-appstore.sh` call `eas` interactively. The workflow command is the non-interactive build above.
