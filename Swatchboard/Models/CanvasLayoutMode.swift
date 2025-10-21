import Foundation

enum CanvasLayoutMode: String, CaseIterable, Identifiable {
    case grid
    case freeform

    var id: String { rawValue }

    var title: String {
        switch self {
        case .grid:
            return "Split"
        case .freeform:
            return "Free"
        }
    }
}
