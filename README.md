# SwatchBoard

Photo collage app. The Expo display name is SwatchBoard (`app.json`). The npm package name is `collage-maker`. The version string in `package.json` and `app.json` is `1.0.2`.

## What the app does

- Choose a canvas size from the presets in `src/constants/presets.ts`, or enter a custom width and height. Custom values are parsed as integers and must be from 1 through 4000.
- Choose a grid from `GRID_LAYOUTS` in that file. The selection screen can filter those layouts by cell count.
- Tap an empty cell to pick a photo with `expo-image-picker`. The image uses `resizeMode="contain"`. A two-finger pinch scales it between 0.25 and 4. A one-finger drag moves it inside the cell. Releasing a drag over another cell swaps the photos (`src/components/GridCell.tsx`).
- Change the canvas background from the swatches in `src/components/ToolBar.tsx`, delete the selected photo, or clear every photo.
- Export captures a PNG at the selected canvas width and height (`src/utils/exportCanvas.ts`) and saves it with `expo-media-library`.

### Canvas presets

| Name | Pixels |
| --- | --- |
| Instagram Post | 1080×1080 |
| Instagram Story | 1080×1920 |
| X Post | 1200×675 |
| YouTube Thumbnail | 1280×720 |
| YouTube Banner | 1920×1080 |
| Facebook Post | 1200×1200 |

### Grid layouts

Rows × columns, from `src/constants/presets.ts`: 1×2, 2×1, 1×3, 3×1, 1×4, 4×1, 2×2, 2×3, 3×2, 3×3, 2×4, 4×2, 2×5, 5×2.

## Requirements

- Node.js `>= 20.19.4`. That range is the `engines` field of locked `react-native@0.81.5` in `package-lock.json`. `package.json` has no `engines` field. The iOS workflow requests Node 20.
- npm. `package-lock.json` is the lockfile `npm ci` uses.
- A Mac with Xcode for `npm run ios` (`expo run:ios`).
- An Android SDK for `npm run android` (`expo run:android`).
- EAS CLI `>= 12.0.0` for the release scripts and the GitHub workflow (`eas.json`). The workflow installs it with `npm install -g eas-cli`.

## Setup

```bash
npm ci
```

## Run

```bash
npm start
npm run ios
npm run android
npm run web
```

| Script | Command |
| --- | --- |
| `start` | `expo start` |
| `ios` | `expo run:ios` |
| `android` | `expo run:android` |
| `web` | `expo start --web` |

The scripts in `package.json` are the four commands above. The app depends on `expo-dev-client`. `npm run ios` and `npm run android` compile a native development build. Generated `ios/` and `android/` directories are gitignored.

## iOS build and submit

A push to `main` runs `.github/workflows/eas-ios-release.yml` unless the change is only `README.md` or files under `docs/`. The job uses `macos-latest`, Node 20, `npm ci`, a global `eas-cli` install, and:

```bash
eas build --platform ios --profile production --non-interactive --auto-submit
```

The job reads `EAS_TOKEN` from the `EAS_TOKEN` secret and sets `EAS_SKIP_AUTO_FINGERPRINT=1`.

`eas.json` sets `appVersionSource` to `remote`. The production build profile is iOS only, with `resourceClass` `m-medium` and `buildConfiguration` `Release`. The production submit profile uses App Store Connect app id `6754526332`.

These shell scripts are separate from that workflow and wait for keyboard input:

- `build-ios.sh` runs `eas project:init`, then `eas build --platform ios --profile production`.
- `deploy-ios.sh` installs `eas-cli` when `eas` is missing, runs `eas login`, then the same production iOS build.
- `submit-appstore.sh` runs `eas submit --platform ios`.

From `app.json`: iOS bundle identifier and Android package are `com.jordanryan.collagemaker`. Expo `owner` is `jordanrtesting`. The EAS project id is `1738a900-6e48-452a-9541-0ee4b98dd3da`. `newArchEnabled` is `false`. iOS `supportsTablet` is `true`.

## Stack

- Expo `^54.0.20` (lockfile resolves `54.0.20`), React `19.1.0`, React Native `0.81.5`
- TypeScript `~5.9.2`. `tsconfig.json` extends `expo/tsconfig.base` with `strict` set to `true`
- `@react-navigation/native` and `@react-navigation/stack`
- Screens in `App.tsx`: `CombinedSelection` (title `Create Collage`) and `CanvasEditor` (title `Editor`)
- `expo-image-picker` and `expo-media-library` for picking and saving photos
- `react-native-view-shot` for export (`captureRef`, PNG, quality `1`)
- Cell gestures use `PanResponder` and `Animated`. `App.tsx` also imports `react-native-gesture-handler`

## Docs

- [docs/privacy.md](docs/privacy.md)
- [docs/support.md](docs/support.md)
- [docs/STATE.md](docs/STATE.md)
- Issues: https://github.com/Jordan-Ryan/Swatchboard/issues
