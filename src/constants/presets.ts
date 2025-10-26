import { CanvasSize, GridLayout } from '../types';

export const PLATFORM_PRESETS: CanvasSize[] = [
  { width: 1080, height: 1080, name: 'Instagram Post' },
  { width: 1080, height: 1920, name: 'Instagram Story' },
  { width: 1200, height: 675, name: 'X Post' },
  { width: 1280, height: 720, name: 'YouTube Thumbnail' },
  { width: 1920, height: 1080, name: 'YouTube Banner' },
  { width: 1200, height: 1200, name: 'Facebook Post' },
];

export const GRID_LAYOUTS: GridLayout[] = [
  // Single row/column layouts
  { id: '1x2', name: '1x2', rows: 1, cols: 2, preview: '1x2' },
  { id: '2x1', name: '2x1', rows: 2, cols: 1, preview: '2x1' },
  { id: '1x3', name: '1x3', rows: 1, cols: 3, preview: '1x3' },
  { id: '3x1', name: '3x1', rows: 3, cols: 1, preview: '3x1' },
  { id: '1x4', name: '1x4', rows: 1, cols: 4, preview: '1x4' },
  { id: '4x1', name: '4x1', rows: 4, cols: 1, preview: '4x1' },
  
  // Square and rectangular layouts
  { id: '2x2', name: '2x2', rows: 2, cols: 2, preview: '2x2' },
  { id: '2x3', name: '2x3', rows: 2, cols: 3, preview: '2x3' },
  { id: '3x2', name: '3x2', rows: 3, cols: 2, preview: '3x2' },
  { id: '3x3', name: '3x3', rows: 3, cols: 3, preview: '3x3' },
  { id: '2x4', name: '2x4', rows: 2, cols: 4, preview: '2x4' },
  { id: '4x2', name: '4x2', rows: 4, cols: 2, preview: '4x2' },
  { id: '2x5', name: '2x5', rows: 2, cols: 5, preview: '2x5' },
  { id: '5x2', name: '5x2', rows: 5, cols: 2, preview: '5x2' },
];
