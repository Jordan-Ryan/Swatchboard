import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Photo } from '../types';
import { COLORS } from '../constants/colors';
import { pickImageFromGallery } from '../utils/imageUtils';
import { captureCanvas, saveImageToGallery } from '../utils/exportCanvas';
import GridCell from '../components/GridCell';
import ToolBar from '../components/ToolBar';
import ViewShot from 'react-native-view-shot';

type CanvasEditorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CanvasEditor'>;
type CanvasEditorScreenRouteProp = RouteProp<RootStackParamList, 'CanvasEditor'>;

interface Props {
  navigation: CanvasEditorScreenNavigationProp;
  route: CanvasEditorScreenRouteProp;
}

const CanvasEditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const { canvasSize, layout } = route.params;
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>(COLORS.white);
  const canvasRef = useRef<ViewShot>(null);
  const gridContainerRef = useRef<View>(null);
  const [gridBounds, setGridBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [activeGridIndex, setActiveGridIndex] = useState<number | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height - 200; // Account for toolbar

  // Calculate canvas dimensions maintaining aspect ratio
  const canvasAspectRatio = canvasSize.width / canvasSize.height;
  const screenAspectRatio = screenWidth / screenHeight;

  let canvasWidth, canvasHeight;
  if (canvasAspectRatio > screenAspectRatio) {
    canvasWidth = screenWidth - 40;
    canvasHeight = canvasWidth / canvasAspectRatio;
  } else {
    canvasHeight = screenHeight - 40;
    canvasWidth = canvasHeight * canvasAspectRatio;
  }

  const handleAddPhoto = async () => {
    const photo = await pickImageFromGallery();
    if (photo) {
      if (!layout) {
        return;
      }

      const totalCells = layout.rows * layout.cols;
      const occupied = new Set(photos.map(p => p.cellIndex));
      let targetIndex = 0;
      while (occupied.has(targetIndex) && targetIndex < totalCells) {
        targetIndex += 1;
      }

      if (targetIndex >= totalCells) {
        Alert.alert('Layout Full', 'All cells in this layout already have photos.');
        return;
      }

      const newPhoto = {
        ...photo,
        cellIndex: targetIndex,
      };
      setPhotos([...photos, newPhoto]);
      setActiveGridIndex(targetIndex);
      setSelectedPhotoId(newPhoto.id);
    }
  };

  const handleCellPress = async (cellIndex: number) => {
    setActiveGridIndex(cellIndex);
    const existingPhoto = photos.find(p => p.cellIndex === cellIndex);
    if (existingPhoto) {
      setSelectedPhotoId(existingPhoto.id);
    }
    const photo = await pickImageFromGallery();
    if (photo) {
      const newPhoto = {
        ...photo,
        cellIndex,
      };
      
      // Replace existing photo in this cell or add new one
      const updatedPhotos = photos.filter(p => p.cellIndex !== cellIndex);
      updatedPhotos.push(newPhoto);
      setPhotos(updatedPhotos);
      setSelectedPhotoId(newPhoto.id);
    }
  };

  const handlePhotoUpdate = (updatedPhoto: Photo) => {
    setPhotos(photos.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };

  const handleGridPhotoSwap = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      return;
    }

    setPhotos(prevPhotos => {
      const fromPhotoIdx = prevPhotos.findIndex(p => p.cellIndex === fromIndex);
      if (fromPhotoIdx === -1) {
        return prevPhotos;
      }

      const toPhotoIdx = prevPhotos.findIndex(p => p.cellIndex === toIndex);
      const updatedPhotos = prevPhotos.map(photo => ({ ...photo }));

      if (toPhotoIdx !== -1) {
        const tempIndex = updatedPhotos[fromPhotoIdx].cellIndex;
        updatedPhotos[fromPhotoIdx].cellIndex = updatedPhotos[toPhotoIdx].cellIndex;
        updatedPhotos[toPhotoIdx].cellIndex = tempIndex;
      } else {
        updatedPhotos[fromPhotoIdx].cellIndex = toIndex;
      }

      const activePhoto = updatedPhotos.find(p => p.cellIndex === toIndex);
      setSelectedPhotoId(activePhoto ? activePhoto.id : null);
      setActiveGridIndex(toIndex);
      return updatedPhotos;
    });
  };

  const handleDeletePhoto = () => {
    if (selectedPhotoId) {
      setPhotos(photos.filter(p => p.id !== selectedPhotoId));
      setSelectedPhotoId(null);
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  const handleExport = async () => {
    const previousSelectedPhotoId = selectedPhotoId;
    const previousActiveGridIndex = activeGridIndex;

    if (previousSelectedPhotoId || previousActiveGridIndex !== null) {
      setSelectedPhotoId(null);
      setActiveGridIndex(null);
      await new Promise(resolve => requestAnimationFrame(() => resolve(null)));
    }

    try {
      const uri = await captureCanvas(canvasRef, canvasSize.width, canvasSize.height);
      if (uri) {
        const saved = await saveImageToGallery(uri);
        if (saved) {
          Alert.alert('Success', 'Collage saved to gallery!');
        } else {
          Alert.alert('Error', 'Failed to save image to gallery.');
        }
      } else {
        Alert.alert('Error', 'Failed to capture canvas.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export collage.');
    } finally {
      if (previousSelectedPhotoId || previousActiveGridIndex !== null) {
        setSelectedPhotoId(previousSelectedPhotoId);
        setActiveGridIndex(previousActiveGridIndex);
      }
    }
  };

  const handleGridLayout = () => {
    // measureInWindow ensures we have absolute coordinates for drag calculations
    requestAnimationFrame(() => {
      gridContainerRef.current?.measureInWindow((x, y, width, height) => {
        setGridBounds({
          x,
          y,
          width,
          height,
        });
      });
    });
  };

  const renderGridLayout = () => {
    if (!layout) return null;

    const cellWidth = canvasWidth / layout.cols;
    const cellHeight = canvasHeight / layout.rows;

    const cells = [];
    for (let i = 0; i < layout.rows * layout.cols; i++) {
      const photo = photos.find(p => p.cellIndex === i);
      cells.push(
        <GridCell
          key={i}
          photo={photo || null}
          onPress={() => handleCellPress(i)}
          onPhotoUpdate={handlePhotoUpdate}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          cellIndex={i}
          totalRows={layout.rows}
          totalCols={layout.cols}
          gridBounds={gridBounds}
          onSwap={handleGridPhotoSwap}
          isActive={activeGridIndex === i}
          onActivate={(photoId) => {
            setActiveGridIndex(i);
            setSelectedPhotoId(photoId);
          }}
          backgroundColor={backgroundColor}
        />
      );
    }

    return (
      <View
        ref={gridContainerRef}
        onLayout={handleGridLayout}
        style={[
          styles.gridContainer,
          {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: backgroundColor,
          }
        ]}
      >
        {cells}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasWrapper}>
        <ViewShot ref={canvasRef} options={{ format: 'png', quality: 1 }}>
          <View style={[
            styles.canvas,
            {
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: backgroundColor,
              borderColor: backgroundColor,
            }
          ]}>
            {renderGridLayout()}
          </View>
        </ViewShot>
      </View>

      <ToolBar
        onAddPhoto={handleAddPhoto}
        onDeletePhoto={handleDeletePhoto}
        onExport={handleExport}
        onBackgroundColorChange={handleBackgroundColorChange}
        hasSelectedPhoto={!!selectedPhotoId}
        canvasSize={`${canvasSize.width} × ${canvasSize.height}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  canvasWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  canvas: {
    backgroundColor: COLORS.white,
    borderRadius: 0,
    borderWidth: 0,
    overflow: 'hidden',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default CanvasEditorScreen;
