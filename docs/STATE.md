# State of the tree

This file records what the application source and config contain.

## Identity

| Field | Value | Where |
| --- | --- | --- |
| Display name | SwatchBoard | `app.json` `expo.name` |
| npm package | `collage-maker` | `package.json` `name` |
| Version string | `1.0.2` | `package.json` and `app.json` |
| Slug | `collage-maker` | `app.json` |
| iOS bundle id | `com.jordanryan.collagemaker` | `app.json` |
| Android package | `com.jordanryan.collagemaker` | `app.json` |
| Expo owner | `jordanrtesting` | `app.json` |
| EAS project id | `1738a900-6e48-452a-9541-0ee4b98dd3da` | `app.json` `extra.eas.projectId` |
| Orientation | portrait | `app.json` |
| UI style | dark | `app.json` `userInterfaceStyle` |
| New architecture | `false` | `app.json` `newArchEnabled` |
| iOS tablet | `supportsTablet: true` | `app.json` |

iOS photo-library usage strings are `NSPhotoLibraryUsageDescription` and `NSPhotoLibraryAddUsageDescription`. `ITSAppUsesNonExemptEncryption` is `false`. Android permissions listed in `app.json` are `android.permission.READ_EXTERNAL_STORAGE` and `android.permission.WRITE_EXTERNAL_STORAGE`. `edgeToEdgeEnabled` is `true`. `predictiveBackGestureEnabled` is `false`. `plugins` is an empty array.

## Screens

`App.tsx` registers a stack with two routes:

1. `CombinedSelection` — header title `Create Collage`. Defaults to the first preset (Instagram Post, 1080×1080) and the first layout (`1x2`). Custom size entry rejects non-positive and non-numeric values, and values above 4000 on either side.
2. `CanvasEditor` — header title `Editor`. Renders the chosen grid, a background color, and the toolbar.

`layout` on the editor route is typed as `GridLayout | null`. The selection screen always passes the selected `GridLayout`.

## Layouts and presets

`PLATFORM_PRESETS`: Instagram Post 1080×1080, Instagram Story 1080×1920, X Post 1200×675, YouTube Thumbnail 1280×720, YouTube Banner 1920×1080, Facebook Post 1200×1200.

`GRID_LAYOUTS` ids: `1x2`, `2x1`, `1x3`, `3x1`, `1x4`, `4x1`, `2x2`, `2x3`, `3x2`, `3x3`, `2x4`, `4x2`, `2x5`, `5x2`. The id is `rows` × `cols`. Cell-count filters are the products of those pairs: 2, 3, 4, 6, 8, 9, and 10.

## Editor behavior

- Empty cell tap calls `pickImageFromGallery` (`expo-image-picker`, images only, `allowsEditing: false`, `quality: 1`). A cell that already has a photo is selected on tap.
- The photo is contained in the cell. Pinch scale is clamped from 0.25 to 4. Pan translation is clamped to the cell. A drop on another cell swaps `cellIndex`.
- `Photo.rotation` exists on the type. `pickImageFromGallery` sets it to `0`. The cell transform applies `scale`, `translateX`, and `translateY`.
- Toolbar actions: Export, Clear (disabled with no photos), Background, Delete (disabled with no selected photo).
- Background swatches: white, black, `#FF6B6B`, `#4ECDC4`, `#45B7D1`, `#96CEB4`, `#FFEAA7`, `#DDA0DD`, `#98D8C8`, `#F7DC6F`, `#BB8FCE`, `#85C1E9`. The canvas background starts as `COLORS.white`.
- Export clears the selection for one frame, then `captureRef` writes a PNG (`quality: 1`, `result: 'tmpfile'`) at `canvasSize.width` by `canvasSize.height`, then `MediaLibrary.saveToLibraryAsync`. The success alert text is `Collage saved to gallery!`.

UI chrome colors are the black, white, and grey values in `src/constants/colors.ts`.

## Dependencies the screens import

Runtime packages in `package.json`: Expo `^54.0.20` (lock resolves `54.0.20`), React `19.1.0`, React Native `0.81.5`, `expo-dev-client` `^6.0.16`, `expo-file-system` `^19.0.17`, `expo-image-picker` `^17.0.8`, `expo-media-library` `^18.2.0`, `expo-status-bar` `~3.0.8`, React Navigation native `^7.1.18` and stack `^7.5.0`, `react-native-gesture-handler` `^2.12.0`, `react-native-safe-area-context` `~5.6.0`, `react-native-screens` `~4.16.0`, `react-native-view-shot` `4.0.3`.

Dev dependencies: `@expo/ngrok` `^4.1.3`, `@types/react` `~19.1.0`, TypeScript `~5.9.2`.

Application code under `src/` imports `expo-image-picker`, `expo-media-library`, `expo-status-bar`, `react-native-gesture-handler`, `react-native-view-shot`, and the navigation packages. `expo-file-system` is declared in `package.json` and is not imported under `src/`. `@expo/ngrok` is a dev dependency. None of the npm scripts pass `--tunnel`.

Entry is `index.ts` (`package.json` `main`), which calls `registerRootComponent`.

## Commands

| Script | Command |
| --- | --- |
| `start` | `expo start` |
| `android` | `expo run:android` |
| `ios` | `expo run:ios` |
| `web` | `expo start --web` |

Locked `react-native@0.81.5` requires Node `>= 20.19.4`. CI installs Node 20 and runs `npm ci`.

## iOS workflow and local scripts

`.github/workflows/eas-ios-release.yml` triggers on push to `main` and ignores `README.md` and `docs/**`. It checks out the repo, sets up Node 20, caches npm, runs `npm ci`, installs `eas-cli` globally, and runs `eas build --platform ios --profile production --non-interactive --auto-submit` with `EAS_TOKEN` and `EAS_SKIP_AUTO_FINGERPRINT=1`.

`eas.json` CLI version is `>= 12.0.0`, `appVersionSource` is `remote`, production iOS build uses `m-medium` and `Release`, and production iOS submit uses `ascAppId` `6754526332`.

`build-ios.sh`, `deploy-ios.sh`, and `submit-appstore.sh` call the `eas` binary interactively (`project:init`, `login`, `build`, or `submit`). `deploy-ios.sh` installs `eas-cli` globally when the binary is missing.

`generate_icons.py` writes PNG sizes into `ios/CollageMaker/Images.xcassets/AppIcon.appiconset` using ImageMagick `convert` on `icon.svg`. App icons used by Expo config are the files under `assets/` named in `app.json`. `/ios` is gitignored.

`.gitignore` also ignores `node_modules/`, `.expo/`, `dist/`, `web-build/`, and `/android`.
