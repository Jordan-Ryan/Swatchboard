export interface CanvasSize {
  width: number;
  height: number;
  name: string;
}

export interface GridLayout {
  id: string;
  name: string;
  rows: number;
  cols: number;
  preview: string; // Visual representation like "1x2", "2x2", etc.
}

export interface Photo {
  id: string;
  uri: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  cellIndex?: number; // For grid layouts
  translateX?: number; // For grid photo positioning
  translateY?: number; // For grid photo positioning
}

export interface CanvasState {
  size: CanvasSize;
  layout: GridLayout | null;
  photos: Photo[];
  selectedPhotoId: string | null;
}

export type RootStackParamList = {
  CombinedSelection: undefined;
  CanvasEditor: { canvasSize: CanvasSize; layout: GridLayout | null };
};
