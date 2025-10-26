# Collage Maker

A clean, minimalist React Native app for creating photo collages with grid layouts and freeform placement.

## Features

- **Canvas Size Selection**: Choose from platform presets (Instagram, X, YouTube, etc.) or create custom sizes
- **Grid Layouts**: 20+ grid options from 1x2 to 5x5 layouts
- **Freeform Mode**: Drag and position photos anywhere on the canvas
- **Export**: Save collages to device gallery at specified resolution
- **Clean Design**: Black, white, and grey color scheme with no gradients

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your phone (iOS/Android)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Test on your device:
   - **iOS**: Run `npm run ios` or scan QR code with Expo Go
   - **Android**: Run `npm run android` or scan QR code with Expo Go
   - **Web**: Run `npm run web`

## Usage

1. **Select Canvas Size**: Choose from platform presets or enter custom dimensions
2. **Choose Layout**: Pick a grid layout or select freeform mode
3. **Add Photos**: Tap cells (grid mode) or use "Add Photo" button (freeform mode)
4. **Edit Photos**: 
   - Grid mode: Photos auto-fit to cells
   - Freeform mode: Drag photos to reposition
5. **Export**: Tap "Export" to save your collage to the gallery

## Platform Presets

- Instagram Post: 1080×1080
- Instagram Story: 1080×1920
- X Post: 1200×675
- YouTube Thumbnail: 1280×720
- YouTube Banner: 1920×1080
- Facebook Post: 1200×1200

## Grid Layouts

Available layouts include: 1×2, 2×1, 1×3, 3×1, 2×2, 2×3, 3×2, 3×3, 2×4, 4×2, 2×5, 5×2, 3×4, 4×3, 4×4, 3×5, 5×3, 4×5, 5×4, 5×5, and Freeform.

## Technical Details

- Built with React Native and Expo
- TypeScript for type safety
- React Navigation for screen flow
- PanResponder for gesture handling
- Expo Image Picker for photo selection
- Expo Media Library for saving to gallery
- React Native View Shot for canvas export

## Troubleshooting

If you encounter the "WorkletsError" about version mismatch:
1. Run `npx expo install --fix` to update dependencies
2. Clear cache with `npx expo start --clear`
3. Restart the development server

The app has been simplified to use PanResponder instead of React Native Reanimated to avoid worklets issues.

## Support

- Support URL: https://github.com/Jordan-Ryan/Swatchboard/issues
- Privacy Policy: See [docs/privacy.md](docs/privacy.md)