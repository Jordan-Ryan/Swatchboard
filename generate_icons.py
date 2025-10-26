#!/usr/bin/env python3
"""
iOS App Icon Generator
Converts SVG to all required iOS icon sizes
"""

import os
import subprocess
import sys

def check_imagemagick():
    """Check if ImageMagick is installed"""
    try:
        subprocess.run(['convert', '-version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_imagemagick():
    """Install ImageMagick using Homebrew"""
    print("Installing ImageMagick...")
    try:
        subprocess.run(['brew', 'install', 'imagemagick'], check=True)
        return True
    except subprocess.CalledProcessError:
        print("Failed to install ImageMagick. Please install it manually:")
        print("brew install imagemagick")
        return False

def generate_icons():
    """Generate all required iOS icon sizes"""
    
    # iOS icon sizes
    sizes = [
        (20, "App-Icon-20x20@1x.png"),
        (40, "App-Icon-20x20@2x.png"),
        (60, "App-Icon-20x20@3x.png"),
        (29, "App-Icon-29x29@1x.png"),
        (58, "App-Icon-29x29@2x.png"),
        (87, "App-Icon-29x29@3x.png"),
        (40, "App-Icon-40x40@1x.png"),
        (80, "App-Icon-40x40@2x.png"),
        (120, "App-Icon-40x40@3x.png"),
        (120, "App-Icon-60x60@2x.png"),
        (180, "App-Icon-60x60@3x.png"),
        (1024, "App-Icon-1024x1024@1x.png")
    ]
    
    icon_dir = "ios/CollageMaker/Images.xcassets/AppIcon.appiconset"
    
    print("Generating iOS app icons...")
    
    for size, filename in sizes:
        output_path = os.path.join(icon_dir, filename)
        print(f"Creating {filename} ({size}x{size})...")
        
        try:
            subprocess.run([
                'convert', 
                'icon.svg',
                '-resize', f'{size}x{size}',
                '-background', 'transparent',
                output_path
            ], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error creating {filename}: {e}")
            return False
    
    print("✅ All icons generated successfully!")
    return True

def main():
    print("🎨 iOS App Icon Generator")
    print("=" * 30)
    
    # Check if ImageMagick is installed
    if not check_imagemagick():
        print("ImageMagick not found. Installing...")
        if not install_imagemagick():
            return 1
    
    # Generate icons
    if generate_icons():
        print("\n🎉 Icon generation complete!")
        print("Your app now has a custom collage-themed icon!")
        return 0
    else:
        print("\n❌ Icon generation failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())

