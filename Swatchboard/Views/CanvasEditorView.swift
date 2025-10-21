import SwiftUI
import PhotosUI
import UIKit

struct CanvasEditorView: View {
    @ObservedObject var viewModel: CanvasViewModel
    @State private var photoPickerItems: [PhotosPickerItem] = []
    @State private var isSaving = false
    @State private var saveAlert: SaveAlert?
    @State private var editingTextID: CanvasText.ID?

    var body: some View {
        ZStack {
            LinearGradient(colors: [Color.black, Color.gray.opacity(0.45)], startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 28) {
                    canvasStage
                    backgroundSection
                    textOverlaySection
                }
                .padding(24)
            }
        }
        .navigationTitle("Design Canvas")
        .toolbarColorScheme(.dark, for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .toolbarBackground(Color.black.opacity(0.9), for: .navigationBar)
        .toolbar {
            ToolbarItemGroup(placement: .navigationBarTrailing) {
                PhotosPicker(selection: $photoPickerItems, matching: .images) {
                    Image(systemName: "photo.on.rectangle")
                }
                .accessibilityLabel("Add photos")
                .disabled(isSaving)
                .onChange(of: photoPickerItems) { newItems in
                    Task {
                        await viewModel.handleNewPhotoSelections(newItems)
                        photoPickerItems.removeAll()
                    }
                }

                Button {
                    viewModel.addTextOverlay()
                    if let newest = viewModel.textItems.last {
                        editingTextID = newest.id
                    }
                } label: {
                    Image(systemName: "textformat")
                }
                .accessibilityLabel("Add text overlay")
                .disabled(isSaving)

                Button {
                    saveCanvas()
                } label: {
                    if isSaving {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Image(systemName: "square.and.arrow.down")
                    }
                }
                .accessibilityLabel("Save to Photos")
                .disabled(isSaving)
            }
        }
        .alert(item: $saveAlert) { alert in
            Alert(title: Text(alert.title), message: Text(alert.message), dismissButton: .default(Text("OK")))
        }
        .sheet(item: $editingTextID) { id in
            if let index = viewModel.textItems.firstIndex(where: { $0.id == id }) {
                TextOverlayEditor(text: $viewModel.textItems[index]) {
                    viewModel.removeTextOverlay(id)
                }
                .presentationDetents([.medium, .large])
            }
        }
    }

    private var canvasStage: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Canvas")
                .font(.title3.weight(.semibold))
                .foregroundColor(.white)

            ZStack {
                RoundedRectangle(cornerRadius: 24)
                    .fill(Color.white.opacity(0.05))
                    .overlay(
                        RoundedRectangle(cornerRadius: 24)
                            .stroke(Color.white.opacity(0.1))
                    )
                    .overlay {
                        CanvasPreview(viewModel: viewModel, showHeader: false)
                            .padding(24)
                    }
            }
        }
    }

    private var backgroundSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Background")
                .font(.title3.weight(.medium))
                .foregroundColor(.white)

            Text("Set the tone for any empty space with a custom color.")
                .font(.footnote)
                .foregroundColor(.white.opacity(0.6))

            ColorPicker("Canvas Background", selection: $viewModel.backgroundColor, supportsOpacity: true)
                .colorMultiply(.white)
                .labelsHidden()
                .padding()
                .background(Color.white.opacity(0.08))
                .cornerRadius(18)
                .accessibilityLabel("Canvas background color")
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    @ViewBuilder
    private var textOverlaySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Text Overlays")
                    .font(.title3.weight(.medium))
                    .foregroundColor(.white)
                Spacer()
                if viewModel.textItems.isEmpty {
                    Button("Add Text") {
                        viewModel.addTextOverlay()
                        if let newest = viewModel.textItems.last {
                            editingTextID = newest.id
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.white)
                    .foregroundColor(.black)
                }
            }

            if viewModel.textItems.isEmpty {
                Text("Tap Add Text above to drop a headline anywhere on your canvas.")
                    .font(.footnote)
                    .foregroundColor(.white.opacity(0.6))
            } else {
                VStack(spacing: 12) {
                    ForEach(viewModel.textItems) { text in
                        Button {
                            editingTextID = text.id
                            viewModel.activeTextID = text.id
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(text.content)
                                        .font(.subheadline)
                                        .foregroundColor(.white)
                                        .lineLimit(1)
                                    Text("\(Int(text.fontSize)) pt • \(text.fontName)")
                                        .font(.caption)
                                        .foregroundColor(.white.opacity(0.6))
                                }
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.white.opacity(0.4))
                            }
                            .padding()
                            .background(viewModel.activeTextID == text.id ? Color.white.opacity(0.16) : Color.white.opacity(0.08))
                            .cornerRadius(16)
                        }
                    }
                }
            }
        }
    }

    private func saveCanvas() {
        guard !isSaving else { return }
        isSaving = true

        let targetSize = viewModel.currentCanvasSize
        let exportView = CanvasSurfaceView(viewModel: viewModel, canvasSize: targetSize, isInteractive: false)
            .background(viewModel.backgroundColor)
            .frame(width: targetSize.width, height: targetSize.height)

        Task {
            let renderedImage: UIImage?
            if #available(iOS 16.0, *) {
                let renderer = ImageRenderer(content: exportView)
                renderer.scale = UIScreen.main.scale
                renderedImage = renderer.uiImage
            } else {
                renderedImage = await legacyRender(exportView: exportView, size: targetSize)
            }

            guard let image = renderedImage else {
                await finishSaving(result: .failure("Unable to render the canvas for export."))
                return
            }

            do {
                try await viewModel.saveImageToPhotoLibrary(image)
                await finishSaving(result: .success("Saved to your photo library."))
            } catch {
                await finishSaving(result: .failure(error.localizedDescription))
            }
        }
    }

    @MainActor
    private func finishSaving(result: SaveResult) {
        isSaving = false
        switch result {
        case .success(let message):
            saveAlert = SaveAlert(title: "Saved", message: message)
        case .failure(let message):
            saveAlert = SaveAlert(title: "Couldn't Save", message: message)
        }
    }

    @MainActor
    private func legacyRender(exportView: some View, size: CGSize) -> UIImage? {
        let controller = UIHostingController(rootView: exportView)
        controller.view.bounds = CGRect(origin: .zero, size: size)
        controller.view.backgroundColor = UIColor(viewModel.backgroundColor)
        controller.view.layoutIfNeeded()

        let renderer = UIGraphicsImageRenderer(size: size)
        return renderer.image { _ in
            controller.view.drawHierarchy(in: controller.view.bounds, afterScreenUpdates: true)
        }
    }

    private enum SaveResult {
        case success(String)
        case failure(String)
    }

    private struct SaveAlert: Identifiable {
        let id = UUID()
        let title: String
        let message: String
    }
}

private struct TextOverlayEditor: View {
    @Binding var text: CanvasText
    var onDelete: () -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section("Text") {
                    TextEditor(text: $text.content)
                        .frame(minHeight: 80)
                }

                Section("Style") {
                    Picker("Font", selection: $text.fontName) {
                        ForEach(CanvasText.availableFonts, id: \.self) { font in
                            Text(font)
                                .tag(font)
                        }
                    }

                    VStack(alignment: .leading, spacing: 4) {
                        Slider(value: $text.fontSize, in: 14...96, step: 1) {
                            Text("Base Size")
                        }
                        .accessibilityLabel("Base font size")

                        Text("\(Int(text.fontSize)) pt")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }

                    ColorPicker("Color", selection: $text.color, supportsOpacity: true)
                }

                Section {
                    Button(role: .destructive) {
                        onDelete()
                        dismiss()
                    } label: {
                        Text("Remove Text")
                    }
                }
            }
            .navigationTitle("Edit Text")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}
