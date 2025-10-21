import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = CanvasViewModel()
    @State private var showEditor = false

    var body: some View {
        NavigationStack {
            TemplateAndLayoutView(viewModel: viewModel, showEditor: $showEditor)
                .navigationDestination(isPresented: $showEditor) {
                    CanvasEditorView(viewModel: viewModel)
                        .toolbarBackground(.visible, for: .navigationBar)
                        .toolbarBackground(Color.black, for: .navigationBar)
                }
        }
        .tint(.white)
    }
}

private struct TemplateAndLayoutView: View {
    @ObservedObject var viewModel: CanvasViewModel
    @Binding var showEditor: Bool
    @FocusState private var isWidthFocused: Bool
    @FocusState private var isHeightFocused: Bool

    var body: some View {
        ZStack {
            LinearGradient(colors: [Color.black, Color.gray.opacity(0.4)], startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 32) {
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Select Your Canvas")
                            .font(.largeTitle.weight(.semibold))
                            .foregroundStyle(Color.white)

                        Text("Choose a social-ready template or craft a custom size, then pick how your images should flow.")
                            .font(.body)
                            .foregroundStyle(Color.white.opacity(0.7))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    VStack(alignment: .leading, spacing: 20) {
                        Text("Canvas Size")
                            .font(.title3.weight(.medium))
                            .foregroundStyle(Color.white)

                        Picker("Template", selection: $viewModel.selectedTemplate) {
                            ForEach(CanvasTemplate.presets) { template in
                                Text(template.name)
                                    .tag(Optional(template))
                            }
                            Text("Custom")
                                .tag(Optional<CanvasTemplate>.none)
                        }
                        .pickerStyle(.segmented)

                        if viewModel.usesCustomTemplate {
                            HStack(spacing: 20) {
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Width")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                    TextField("Width", value: $viewModel.customSize.width, format: .number)
                                        .keyboardType(.numberPad)
                                        .focused($isWidthFocused)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 10)
                                        .background(Color.white.opacity(0.08))
                                        .cornerRadius(12)
                                        .foregroundStyle(Color.white)
                                }

                                VStack(alignment: .leading, spacing: 8) {
                                    Text("Height")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                    TextField("Height", value: $viewModel.customSize.height, format: .number)
                                        .keyboardType(.numberPad)
                                        .focused($isHeightFocused)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 10)
                                        .background(Color.white.opacity(0.08))
                                        .cornerRadius(12)
                                        .foregroundStyle(Color.white)
                                }
                            }
                        }
                    }

                    VStack(alignment: .leading, spacing: 20) {
                        Text("Layout Mode")
                            .font(.title3.weight(.medium))
                            .foregroundStyle(Color.white)

                        Picker("Layout", selection: $viewModel.layoutMode) {
                            ForEach(CanvasLayoutMode.allCases) { mode in
                                Text(mode.title)
                                    .tag(mode)
                            }
                        }
                        .pickerStyle(.segmented)

                        switch viewModel.layoutMode {
                        case .grid:
                            GridConfigurationView(viewModel: viewModel)
                        case .freeform:
                            Text("Drag, resize, and rotate photos freely on the next screen.")
                                .font(.footnote)
                                .foregroundStyle(Color.white.opacity(0.6))
                        }
                    }

                    CanvasPreview(viewModel: viewModel, isInteractive: false)

                    Button {
                        showEditor = true
                    } label: {
                        Text("Start Designing")
                            .font(.headline)
                            .padding(.vertical, 14)
                            .frame(maxWidth: .infinity)
                            .background(Color.white)
                            .foregroundColor(.black)
                            .cornerRadius(16)
                    }
                }
                .padding(24)
            }
        }
        .navigationTitle("Swatchboard")
        .toolbarBackground(.visible, for: .navigationBar)
        .toolbarBackground(Color.black.opacity(0.85), for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }
}

private struct GridConfigurationView: View {
    @ObservedObject var viewModel: CanvasViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Sections")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Picker("Sections", selection: $viewModel.gridSlotCount) {
                ForEach(viewModel.availableGridSections, id: \.self) { count in
                    Text("\(count)")
                        .tag(count)
                }
            }
            .pickerStyle(.segmented)

            if let description = viewModel.gridDescription {
                Text(description)
                    .font(.footnote)
                    .foregroundStyle(Color.white.opacity(0.6))
            }
        }
    }
}

#Preview {
    ContentView()
}
