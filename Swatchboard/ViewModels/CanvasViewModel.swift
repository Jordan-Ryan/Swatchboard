import SwiftUI
import PhotosUI
import UIKit
import Photos

@MainActor
final class CanvasViewModel: ObservableObject {
    @Published var selectedTemplate: CanvasTemplate?
    @Published var customSize: CGSize

    @Published var layoutMode: CanvasLayoutMode = .grid {
        didSet {
            guard oldValue != layoutMode else { return }
            synchronizeStorage(from: oldValue, to: layoutMode)
        }
    }

    @Published var backgroundColor: Color = .white

    @Published var gridSlotCount: Int = 4 {
        didSet {
            if gridSlotCount < 1 {
                gridSlotCount = 1
                return
            }
            resizeGridItems()
        }
    }

    @Published private(set) var gridItems: [CanvasPhoto?]
    @Published var selectedGridIndex: Int?

    @Published var freeformItems: [CanvasPhoto]
    @Published var activeFreeformPhotoID: CanvasPhoto.ID?

    @Published var textItems: [CanvasText]
    @Published var activeTextID: CanvasText.ID?

    let availableGridSections: [Int] = [1, 2, 3, 4, 5, 6]

    init() {
        let defaultTemplate = CanvasTemplate.presets.first
        self.selectedTemplate = defaultTemplate
        self.customSize = CGSize(width: 1080, height: 1080)
        self.gridItems = Array(repeating: nil, count: gridSlotCount)
        self.selectedGridIndex = nil
        self.freeformItems = []
        self.textItems = []
    }

    var usesCustomTemplate: Bool {
        selectedTemplate == nil
    }

    var currentCanvasSize: CGSize {
        let base = selectedTemplate?.size ?? customSize
        let width = max(base.width, 1)
        let height = max(base.height, 1)
        return CGSize(width: width, height: height)
    }

    var canvasAspectRatio: CGFloat {
        let size = currentCanvasSize
        guard size.height > 0 else { return 1 }
        return size.width / size.height
    }

    var gridDimensions: (rows: Int, columns: Int) {
        let count = max(gridSlotCount, 1)
        switch count {
        case 1:
            return (1, 1)
        case 2:
            return (1, 2)
        case 3:
            return (1, 3)
        case 4:
            return (2, 2)
        case 5:
            return (2, 3)
        case 6:
            return (2, 3)
        default:
            let columns = Int(ceil(sqrt(Double(count))))
            let rows = Int(ceil(Double(count) / Double(columns)))
            return (rows, columns)
        }
    }

    var gridDescription: String? {
        guard gridSlotCount > 1 else { return nil }
        let dims = gridDimensions
        return "\(gridSlotCount) sections arranged as \(dims.rows) × \(dims.columns). Tap two slots to swap."
    }

    func handleNewPhotoSelections(_ items: [PhotosPickerItem]) async {
        for item in items {
            do {
                if let data = try await item.loadTransferable(type: Data.self),
                   let uiImage = UIImage(data: data) {
                    addPhoto(uiImage)
                }
            } catch {
                continue
            }
        }
    }

    func handleGridSelection(at index: Int) {
        guard gridItems.indices.contains(index) else { return }
        if let selected = selectedGridIndex {
            if selected == index {
                selectedGridIndex = nil
            } else {
                gridItems.swapAt(selected, index)
                selectedGridIndex = nil
            }
        } else {
            selectedGridIndex = index
        }
    }

    func addTextOverlay() {
        var text = CanvasText(content: "Your text here", position: CGPoint(x: 0.5, y: 0.5))
        text.scale = 1
        textItems.append(text)
        activeTextID = text.id
    }

    func removeTextOverlay(_ id: CanvasText.ID) {
        textItems.removeAll { $0.id == id }
        if activeTextID == id {
            activeTextID = nil
        }
    }

    private func addPhoto(_ uiImage: UIImage) {
        switch layoutMode {
        case .grid:
            addPhotoToGrid(uiImage)
        case .freeform:
            addPhotoToFreeform(uiImage)
        }
    }

    private func addPhotoToGrid(_ uiImage: UIImage) {
        let photo = CanvasPhoto(uiImage: uiImage, position: CGPoint(x: 0.5, y: 0.5), size: defaultFreeformSize(for: uiImage))
        if let selectedIndex = selectedGridIndex, gridItems.indices.contains(selectedIndex) {
            gridItems[selectedIndex] = photo
            selectedGridIndex = nil
            return
        }
        if let emptyIndex = gridItems.firstIndex(where: { $0 == nil }) {
            gridItems[emptyIndex] = photo
        } else {
            // Grid is full, fall back to freeform placement
            addPhotoToFreeform(uiImage)
        }
    }

    private func addPhotoToFreeform(_ uiImage: UIImage) {
        var photo = CanvasPhoto(uiImage: uiImage, position: CGPoint(x: 0.5, y: 0.5), size: defaultFreeformSize(for: uiImage))
        photo.rotation = .zero
        freeformItems.append(photo)
        activeFreeformPhotoID = photo.id
    }

    private func resizeGridItems() {
        let target = max(1, gridSlotCount)
        if gridItems.count == target { return }

        if gridItems.count < target {
            let additions = Array(repeating: CanvasPhoto?.none, count: target - gridItems.count)
            gridItems.append(contentsOf: additions)
        } else {
            let removed = gridItems.suffix(gridItems.count - target)
            let converted = removed.compactMap { $0 }.map(convertToFreeform)
            if !converted.isEmpty {
                freeformItems.append(contentsOf: converted)
            }
            gridItems = Array(gridItems.prefix(target))
        }

        if let selected = selectedGridIndex, selected >= target {
            selectedGridIndex = nil
        }
    }

    private func synchronizeStorage(from oldValue: CanvasLayoutMode, to newValue: CanvasLayoutMode) {
        switch (oldValue, newValue) {
        case (.grid, .freeform):
            let converted = gridItems.compactMap { $0 }.map(convertToFreeform)
            if !converted.isEmpty {
                freeformItems.append(contentsOf: converted)
                activeFreeformPhotoID = converted.last?.id
            }
            gridItems = Array(repeating: nil, count: gridSlotCount)
            selectedGridIndex = nil
        case (.freeform, .grid):
            populateGridFromFreeform()
        default:
            break
        }
    }

    private func populateGridFromFreeform() {
        var photos = freeformItems
        gridItems = Array(repeating: nil, count: gridSlotCount)
        selectedGridIndex = nil

        for index in gridItems.indices {
            guard !photos.isEmpty else { break }
            var next = photos.removeFirst()
            next.position = CGPoint(x: 0.5, y: 0.5)
            next.size = defaultFreeformSize(for: next.uiImage)
            next.rotation = .zero
            gridItems[index] = next
        }
        freeformItems = photos
    }

    private func convertToFreeform(_ photo: CanvasPhoto) -> CanvasPhoto {
        var converted = photo
        converted.position = CGPoint(x: 0.5, y: 0.5)
        converted.size = defaultFreeformSize(for: photo.uiImage)
        converted.rotation = .zero
        converted.image = Image(uiImage: photo.uiImage)
        return converted
    }

    private func defaultFreeformSize(for image: UIImage) -> CGSize {
        let base: CGFloat = 220
        let aspectRatio = image.size.width / max(image.size.height, 1)
        var width: CGFloat
        var height: CGFloat

        if aspectRatio >= 1 {
            width = base
            height = base / max(aspectRatio, 0.01)
        } else {
            width = base * max(aspectRatio, 0.01)
            height = base
        }

        width = min(max(width, 140), 360)
        height = min(max(height, 140), 360)
        return CGSize(width: width, height: height)
    }

    enum SaveError: Error, LocalizedError {
        case permissionDenied
        case unableToCreateAsset

        var errorDescription: String? {
            switch self {
            case .permissionDenied:
                return "Photo library access is required to save your collage."
            case .unableToCreateAsset:
                return "Unable to save the collage to your photo library."
            }
        }
    }

    func saveImageToPhotoLibrary(_ image: UIImage) async throws {
        let status = await requestAuthorizationIfNeeded()
        guard status == .authorized || status == .limited else {
            throw SaveError.permissionDenied
        }

        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            PHPhotoLibrary.shared().performChanges({
                PHAssetChangeRequest.creationRequestForAsset(from: image)
            }) { success, error in
                if let error = error {
                    continuation.resume(throwing: error)
                } else if success {
                    continuation.resume(returning: ())
                } else {
                    continuation.resume(throwing: SaveError.unableToCreateAsset)
                }
            }
        }
    }

    private func requestAuthorizationIfNeeded() async -> PHAuthorizationStatus {
        let current = PHPhotoLibrary.authorizationStatus(for: .addOnly)
        if current == .authorized || current == .limited {
            return current
        }

        return await withCheckedContinuation { continuation in
            PHPhotoLibrary.requestAuthorization(for: .addOnly) { status in
                continuation.resume(returning: status)
            }
        }
    }
}
