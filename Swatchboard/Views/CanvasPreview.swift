import SwiftUI

struct CanvasPreview: View {
    @ObservedObject var viewModel: CanvasViewModel
    var isInteractive: Bool = true
    var showHeader: Bool = true

    var body: some View {
        VStack(alignment: .leading, spacing: showHeader ? 12 : 0) {
            if showHeader {
                Text("Preview")
                    .font(.headline)
            }

            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(viewModel.backgroundColor)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.secondary.opacity(0.2))
                    )
                    .overlay {
                        GeometryReader { proxy in
                            CanvasSurfaceView(viewModel: viewModel, canvasSize: proxy.size, isInteractive: isInteractive)
                        }
                    }
            }
            .aspectRatio(viewModel.canvasAspectRatio, contentMode: .fit)
            .frame(maxWidth: .infinity)
        }
        .animation(.easeInOut, value: viewModel.layoutMode)
        .animation(.easeInOut, value: viewModel.gridSlotCount)
    }

}

struct CanvasSurfaceView: View {
    @ObservedObject var viewModel: CanvasViewModel
    let canvasSize: CGSize
    let isInteractive: Bool

    var body: some View {
        ZStack {
            switch viewModel.layoutMode {
            case .grid:
                GridCanvasView(viewModel: viewModel, size: canvasSize, isInteractive: isInteractive)
            case .freeform:
                FreeformCanvasView(viewModel: viewModel, size: canvasSize, isInteractive: isInteractive)
            }

            TextOverlayCanvasView(viewModel: viewModel, canvasSize: canvasSize, isInteractive: isInteractive)
        }
        .frame(width: canvasSize.width, height: canvasSize.height)
    }
}

private struct GridCanvasView: View {
    @ObservedObject var viewModel: CanvasViewModel
    let size: CGSize
    let isInteractive: Bool

    var body: some View {
        let dims = viewModel.gridDimensions
        let columns = max(dims.columns, 1)
        let rows = max(dims.rows, 1)
        let cellWidth = size.width / CGFloat(columns)
        let cellHeight = size.height / CGFloat(rows)

        ZStack {
            ForEach(Array(viewModel.gridItems.enumerated()), id: \.offset) { index, item in
                let row = index / columns
                let column = index % columns
                let origin = CGPoint(x: CGFloat(column) * cellWidth,
                                     y: CGFloat(row) * cellHeight)

                GridSlotView(
                    item: item,
                    isSelected: viewModel.selectedGridIndex == index,
                    size: CGSize(width: cellWidth, height: cellHeight)
                )
                .position(x: origin.x + cellWidth / 2, y: origin.y + cellHeight / 2)
                .onTapGesture {
                    guard isInteractive else { return }
                    viewModel.handleGridSelection(at: index)
                }
            }
        }
        .frame(width: size.width, height: size.height)
    }
}

private struct GridSlotView: View {
    let item: CanvasPhoto?
    let isSelected: Bool
    let size: CGSize

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 8)
                .strokeBorder(isSelected ? Color.accentColor : Color.secondary.opacity(0.35), lineWidth: isSelected ? 3 : 1)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.clear)
                )

            if let photo = item {
                photo.image
                    .resizable()
                    .scaledToFill()
                    .frame(width: size.width, height: size.height)
                    .clipped()
                    .cornerRadius(6)
            } else {
                VStack(spacing: 6) {
                    Image(systemName: "photo")
                        .font(.title2)
                        .foregroundColor(.secondary)
                    Text("Tap to add")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
        }
        .frame(width: size.width, height: size.height)
    }
}

private struct FreeformCanvasView: View {
    @ObservedObject var viewModel: CanvasViewModel
    let size: CGSize
    let isInteractive: Bool

    var body: some View {
        ZStack {
            ForEach($viewModel.freeformItems) { $item in
                FreeformPhotoView(photo: $item, canvasSize: size, isActive: viewModel.activeFreeformPhotoID == item.id, isInteractive: isInteractive)
                    .onTapGesture {
                        guard isInteractive else { return }
                        viewModel.activeFreeformPhotoID = item.id
                    }
            }
        }
        .frame(width: size.width, height: size.height)
    }
}

private struct FreeformPhotoView: View {
    @Binding var photo: CanvasPhoto
    let canvasSize: CGSize
    let isActive: Bool
    let isInteractive: Bool

    @State private var dragStartPosition: CGPoint = .zero
    @State private var isDragging = false

    @State private var initialSize: CGSize = .zero
    @State private var isResizing = false

    @State private var initialRotation: Angle = .zero
    @State private var isRotating = false

    var body: some View {
        photo.image
            .resizable()
            .aspectRatio(contentMode: .fill)
            .frame(width: photo.size.width, height: photo.size.height)
            .clipped()
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(isActive ? Color.accentColor : Color.clear, lineWidth: 3)
            )
            .cornerRadius(12)
            .shadow(radius: 6)
            .rotationEffect(photo.rotation)
            .position(position(in: canvasSize))
            .gesture(isInteractive ? dragGesture.simultaneously(with: resizeGesture).simultaneously(with: rotationGesture) : nil)
    }

    private func position(in canvasSize: CGSize) -> CGPoint {
        CGPoint(x: canvasSize.width * photo.position.x,
                y: canvasSize.height * photo.position.y)
    }

    private func clampPosition(_ point: CGPoint) -> CGPoint {
        let halfWidthRatio = (photo.size.width / canvasSize.width) / 2
        let halfHeightRatio = (photo.size.height / canvasSize.height) / 2

        let minX = min(halfWidthRatio, 0.5)
        let maxX = max(1 - halfWidthRatio, 0.5)
        let minY = min(halfHeightRatio, 0.5)
        let maxY = max(1 - halfHeightRatio, 0.5)

        let clampedX: CGFloat
        let clampedY: CGFloat

        if minX > maxX {
            clampedX = 0.5
        } else {
            clampedX = min(max(point.x, minX), maxX)
        }

        if minY > maxY {
            clampedY = 0.5
        } else {
            clampedY = min(max(point.y, minY), maxY)
        }

        return CGPoint(x: clampedX, y: clampedY)
    }

    private var dragGesture: some Gesture {
        DragGesture()
            .onChanged { value in
                if !isDragging {
                    isDragging = true
                    dragStartPosition = photo.position
                }
                let dx = value.translation.width / canvasSize.width
                let dy = value.translation.height / canvasSize.height
                let newPoint = CGPoint(x: dragStartPosition.x + dx, y: dragStartPosition.y + dy)
                photo.position = clampPosition(newPoint)
            }
            .onEnded { _ in
                isDragging = false
            }
    }

    private var resizeGesture: some Gesture {
        MagnificationGesture()
            .onChanged { scale in
                if !isResizing {
                    isResizing = true
                    initialSize = photo.size
                }
                let newWidth = max(60, min(initialSize.width * scale, canvasSize.width))
                let newHeight = max(60, min(initialSize.height * scale, canvasSize.height))
                photo.size = CGSize(width: newWidth, height: newHeight)
            }
            .onEnded { _ in
                isResizing = false
            }
    }

    private var rotationGesture: some Gesture {
        RotationGesture()
            .onChanged { angle in
                if !isRotating {
                    isRotating = true
                    initialRotation = photo.rotation
                }
                photo.rotation = initialRotation + angle
            }
            .onEnded { _ in
                isRotating = false
            }
    }
}

private struct TextOverlayCanvasView: View {
    @ObservedObject var viewModel: CanvasViewModel
    let canvasSize: CGSize
    let isInteractive: Bool

    var body: some View {
        ForEach($viewModel.textItems) { $text in
            CanvasTextView(text: $text, canvasSize: canvasSize, isActive: viewModel.activeTextID == text.id, isInteractive: isInteractive)
                .onTapGesture {
                    guard isInteractive else { return }
                    viewModel.activeTextID = text.id
                }
        }
    }
}

private struct CanvasTextView: View {
    @Binding var text: CanvasText
    let canvasSize: CGSize
    let isActive: Bool
    let isInteractive: Bool

    @State private var dragStartPosition: CGPoint?
    @State private var initialScale: CGFloat?
    @State private var initialRotation: Angle?

    var body: some View {
        Text(text.content)
            .font(text.font)
            .foregroundStyle(text.color)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.black.opacity(isActive ? 0.35 : 0.15))
            .cornerRadius(14)
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(isActive ? Color.white : Color.white.opacity(0.2), lineWidth: isActive ? 2 : 1)
            )
            .rotationEffect(text.rotation)
            .position(position(in: canvasSize))
            .gesture(isInteractive ? dragGesture.simultaneously(with: scaleGesture).simultaneously(with: rotationGesture) : nil)
    }

    private func position(in canvasSize: CGSize) -> CGPoint {
        CGPoint(x: canvasSize.width * text.position.x,
                y: canvasSize.height * text.position.y)
    }

    private var dragGesture: some Gesture {
        DragGesture()
            .onChanged { value in
                if dragStartPosition == nil {
                    dragStartPosition = text.position
                }
                guard let dragStartPosition else { return }
                let dx = value.translation.width / canvasSize.width
                let dy = value.translation.height / canvasSize.height
                let newPoint = CGPoint(x: dragStartPosition.x + dx, y: dragStartPosition.y + dy)
                text.position = CGPoint(x: min(max(newPoint.x, 0), 1),
                                        y: min(max(newPoint.y, 0), 1))
            }
            .onEnded { _ in
                dragStartPosition = nil
            }
    }

    private var scaleGesture: some Gesture {
        MagnificationGesture()
            .onChanged { scale in
                if initialScale == nil {
                    initialScale = text.scale
                }
                guard let initialScale else { return }
                let newScale = min(max(initialScale * scale, 0.4), 4)
                text.scale = newScale
            }
            .onEnded { _ in
                initialScale = nil
            }
    }

    private var rotationGesture: some Gesture {
        RotationGesture()
            .onChanged { angle in
                if initialRotation == nil {
                    initialRotation = text.rotation
                }
                guard let initialRotation else { return }
                text.rotation = initialRotation + angle
            }
            .onEnded { _ in
                initialRotation = nil
            }
    }
}
