# Swatchboard

Swatchboard is a SwiftUI iOS application for combining multiple photos into a single exportable canvas. It includes social-media-ready presets (Instagram posts and stories, Facebook covers, YouTube thumbnails, etc.) as well as a fully custom canvas size.

## Features

- **Guided setup:** Start on a sizing screen with Instagram, Facebook, and YouTube-ready templates or specify an exact width and height before choosing your layout style.
- **Split layouts:** Quickly divide the canvas into evenly sized slots (2–6 sections) and tap to swap images between slots.
- **Freeform layouts:** Drag, resize, and rotate images anywhere on the canvas with live snapping that keeps them within bounds.
- **Text overlays:** Drop modern, monochrome captions onto the collage, then adjust the copy, font, color, size, rotation, and placement.
- **Background customization:** Set the canvas background color (including transparency) for any empty areas.
- **Photo library integration:** Import images directly with the system photo picker and export the final image back to Photos.

## Getting Started

1. Open the project folder in Xcode (`File` → `Open...` → select the `Swatchboard` directory).
2. Ensure the deployment target is iOS 16 or later (required for `PhotosPicker`).
3. Build and run the `Swatchboard` scheme on a simulator or device.

When running for the first time, Xcode may prompt you to add the SwiftUI previews target; you can dismiss the preview if not needed. Grant the application access to the photo library when prompted to load images into the canvas.

## Trying the project without a Mac

This repository contains a native iOS application and therefore cannot be executed directly inside this Linux-based environment. If you do not currently have access to macOS or Xcode, you still have a few options for exploring the project:

- **Swift Playgrounds on iPad:** Import the contents of the `Swatchboard` directory into the Playgrounds app (version 4.2 or later). The UI will run with touch interaction, although the Photos picker and export features are unavailable on iPadOS Playgrounds.
- **Hosted macOS services:** Providers such as [MacStadium](https://www.macstadium.com/), [MacInCloud](https://www.macincloud.com/), or [GitHub Codespaces with a macOS host](https://docs.github.com/en/codespaces) let you rent temporary macOS hardware with Xcode preinstalled.
- **Ask a teammate with a Mac:** The generated Xcode project is self-contained. Anyone with Xcode 15 or newer can open the project and run it on a simulator or device without extra setup.

Regardless of the approach, you will need to sign in with an Apple ID that has access to the Photos library in order to exercise the import/export flows.
