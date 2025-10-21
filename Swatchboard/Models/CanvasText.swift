import SwiftUI

struct CanvasText: Identifiable {
    let id = UUID()
    var content: String
    var position: CGPoint
    var scale: CGFloat = 1
    var rotation: Angle = .zero
    var color: Color = .white
    var fontName: String = CanvasText.availableFonts.first ?? "HelveticaNeue"
    var fontSize: CGFloat = 32

    static let availableFonts: [String] = [
        "HelveticaNeue-Bold",
        "AvenirNext-DemiBold",
        "Futura-Medium",
        "GillSans-SemiBold"
    ]

    var font: Font {
        Font.custom(fontName, size: fontSize * scale)
    }
}
