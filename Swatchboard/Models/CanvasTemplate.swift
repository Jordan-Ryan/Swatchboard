import SwiftUI

struct CanvasTemplate: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let size: CGSize

    static let presets: [CanvasTemplate] = [
        CanvasTemplate(name: "Instagram Post", size: CGSize(width: 1080, height: 1080)),
        CanvasTemplate(name: "Instagram Story", size: CGSize(width: 1080, height: 1920)),
        CanvasTemplate(name: "Facebook Cover", size: CGSize(width: 1640, height: 720)),
        CanvasTemplate(name: "YouTube Thumbnail", size: CGSize(width: 1280, height: 720)),
        CanvasTemplate(name: "Pinterest Pin", size: CGSize(width: 1000, height: 1500))
    ]
}
