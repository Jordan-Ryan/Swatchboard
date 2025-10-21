import SwiftUI
import UIKit

struct CanvasPhoto: Identifiable {
    let id = UUID()
    let uiImage: UIImage
    var image: Image
    var position: CGPoint
    var size: CGSize
    var rotation: Angle

    init(uiImage: UIImage, position: CGPoint, size: CGSize, rotation: Angle = .zero) {
        self.uiImage = uiImage
        self.image = Image(uiImage: uiImage)
        self.position = position
        self.size = size
        self.rotation = rotation
    }
}
