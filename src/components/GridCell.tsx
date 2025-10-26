import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated, PanResponder, GestureResponderEvent } from 'react-native';
import { Photo } from '../types';
import { COLORS } from '../constants/colors';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const MIN_SCALE = 0.25;
const MAX_SCALE = 4;
const EPSILON = 0.001;

interface GridBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GridCellProps {
  photo: Photo | null;
  onPress: () => void;
  onPhotoUpdate?: (photo: Photo) => void;
  cellWidth: number;
  cellHeight: number;
  cellIndex: number;
  totalRows: number;
  totalCols: number;
  gridBounds: GridBounds | null;
  onSwap?: (fromIndex: number, toIndex: number) => void;
  isActive: boolean;
  onActivate: (photoId: string | null) => void;
  backgroundColor: string;
}

const distanceBetweenTouches = (touches: readonly any[]) => {
  if (touches.length < 2) return 0;
  const touch1 = touches[0];
  const touch2 = touches[1];
  return Math.sqrt(
    Math.pow(touch2.pageX - touch1.pageX, 2) +
    Math.pow(touch2.pageY - touch1.pageY, 2)
  );
};

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

const GridCell: React.FC<GridCellProps> = ({
  photo,
  onPress,
  onPhotoUpdate,
  cellWidth,
  cellHeight,
  cellIndex,
  totalRows,
  totalCols,
  gridBounds,
  onSwap,
  isActive,
  onActivate,
  backgroundColor,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const scaleValue = useRef(1);
  const translateXValue = useRef(0);
  const translateYValue = useRef(0);
  const fitScaleRef = useRef(1);
  const latestPagePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  const getTranslateBounds = (scaleFactor: number) => {
    if (!photo) {
      return { maxTranslateX: 0, maxTranslateY: 0 };
    }

    const baseScale = fitScaleRef.current;
    const safeWidth = photo.width > 0 ? photo.width : cellWidth;
    const safeHeight = photo.height > 0 ? photo.height : cellHeight;
    const scaledWidth = safeWidth * baseScale * scaleFactor;
    const scaledHeight = safeHeight * baseScale * scaleFactor;

    const maxTranslateX = Math.abs(scaledWidth - cellWidth) / 2;
    const maxTranslateY = Math.abs(scaledHeight - cellHeight) / 2;

    return {
      maxTranslateX,
      maxTranslateY,
    };
  };

  useEffect(() => {
    if (!photo) {
      scale.setValue(1);
      translateX.setValue(0);
      translateY.setValue(0);
      scaleValue.current = 1;
      translateXValue.current = 0;
      translateYValue.current = 0;
      fitScaleRef.current = 1;
      return;
    }

    const widthRatio = photo.width > 0 ? cellWidth / photo.width : 1;
    const heightRatio = photo.height > 0 ? cellHeight / photo.height : 1;
    const fitScale = Math.min(widthRatio, heightRatio) || 1;
    fitScaleRef.current = fitScale;

    const storedScale = typeof photo.scale === 'number' ? photo.scale : 1;
    const nextScale = clamp(storedScale, MIN_SCALE, MAX_SCALE);

    const { maxTranslateX, maxTranslateY } = getTranslateBounds(nextScale);
    const storedTranslateX = clamp(photo.translateX ?? 0, -maxTranslateX, maxTranslateX);
    const storedTranslateY = clamp(photo.translateY ?? 0, -maxTranslateY, maxTranslateY);

    scale.setValue(nextScale);
    translateX.setValue(storedTranslateX);
    translateY.setValue(storedTranslateY);

    scaleValue.current = nextScale;
    translateXValue.current = storedTranslateX;
    translateYValue.current = storedTranslateY;

    const shouldNormalize =
      photo.scale === undefined ||
      photo.translateX === undefined ||
      photo.translateY === undefined ||
      Math.abs((photo.scale ?? 1) - nextScale) > EPSILON ||
      Math.abs((photo.translateX ?? 0) - storedTranslateX) > EPSILON ||
      Math.abs((photo.translateY ?? 0) - storedTranslateY) > EPSILON;

    if (shouldNormalize && onPhotoUpdate) {
      onPhotoUpdate({
        ...photo,
        scale: nextScale,
        translateX: storedTranslateX,
        translateY: storedTranslateY,
      });
    }
  }, [photo, cellWidth, cellHeight, onPhotoUpdate, scale, translateX, translateY]);

  const handlePinch = (touches: readonly any[]) => {
    if (!photo) return;

    const currentDistance = distanceBetweenTouches(touches);
    if (currentDistance <= 0) {
      return;
    }

    const lastDistance = (panResponder as any).lastDistance || currentDistance;
    if (lastDistance <= 0) {
      (panResponder as any).lastDistance = currentDistance;
      return;
    }

    const scaleFactor = currentDistance / lastDistance;
    const nextScale = clamp(scaleValue.current * scaleFactor, MIN_SCALE, MAX_SCALE);

    scale.setValue(nextScale);
    scaleValue.current = nextScale;

    const { maxTranslateX, maxTranslateY } = getTranslateBounds(nextScale);

    const clampedX = clamp(translateXValue.current, -maxTranslateX, maxTranslateX);
    const clampedY = clamp(translateYValue.current, -maxTranslateY, maxTranslateY);

    translateX.setValue(clampedX);
    translateY.setValue(clampedY);
    translateXValue.current = clampedX;
    translateYValue.current = clampedY;

    (panResponder as any).lastDistance = currentDistance;
  };

  const commitPhotoState = () => {
    if (!photo || !onPhotoUpdate) {
      return;
    }

    const { maxTranslateX, maxTranslateY } = getTranslateBounds(scaleValue.current);
    const clampedX = clamp(translateXValue.current, -maxTranslateX, maxTranslateX);
    const clampedY = clamp(translateYValue.current, -maxTranslateY, maxTranslateY);

    translateX.setValue(clampedX);
    translateY.setValue(clampedY);
    translateXValue.current = clampedX;
    translateYValue.current = clampedY;

    onPhotoUpdate({
      ...photo,
      scale: scaleValue.current,
      translateX: clampedX,
      translateY: clampedY,
    });
  };

  const handleSwapIfNeeded = () => {
    if (!photo || !gridBounds || !onSwap) {
      return;
    }

    const totalCells = totalRows * totalCols;
    const dropX = latestPagePosition.current.x - gridBounds.x;
    const dropY = latestPagePosition.current.y - gridBounds.y;

    if (dropX < 0 || dropY < 0 || dropX > gridBounds.width || dropY > gridBounds.height) {
      return;
    }

    const targetCol = Math.floor(dropX / cellWidth);
    const targetRow = Math.floor(dropY / cellHeight);
    const targetIndex = targetRow * totalCols + targetCol;

    if (targetIndex >= 0 && targetIndex < totalCells && targetIndex !== cellIndex) {
      onSwap(cellIndex, targetIndex);
    }
  };

  const updateLatestPagePosition = (evt: GestureResponderEvent) => {
    latestPagePosition.current = {
      x: evt.nativeEvent.pageX,
      y: evt.nativeEvent.pageY,
    };
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !!photo,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return (
        !!photo &&
        (Math.abs(gestureState.dx) > 5 ||
          Math.abs(gestureState.dy) > 5 ||
          evt.nativeEvent.touches.length === 2)
      );
    },
    onPanResponderGrant: (evt) => {
      if (!photo) {
        return;
      }

      onActivate(photo ? photo.id : null);
      updateLatestPagePosition(evt);

      const touches = evt.nativeEvent.touches;
      if (touches.length === 2) {
        isResizingRef.current = true;
        isDraggingRef.current = false;
        (panResponder as any).lastDistance = distanceBetweenTouches(touches);
      } else {
        isDraggingRef.current = true;
        onActivate(photo.id);
        isResizingRef.current = false;
        (panResponder as any).startX = translateXValue.current;
        (panResponder as any).startY = translateYValue.current;
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      if (!photo) {
        return;
      }

      const touches = evt.nativeEvent.touches;
      updateLatestPagePosition(evt);

      if (touches.length === 2) {
        isResizingRef.current = true;
        isDraggingRef.current = false;
        handlePinch(touches);
        return;
      }

      if (touches.length === 1 && isResizingRef.current) {
        isResizingRef.current = false;
        isDraggingRef.current = true;
        (panResponder as any).startX = translateXValue.current;
        (panResponder as any).startY = translateYValue.current;
      }

      if (touches.length === 1 && isDraggingRef.current) {
        const startX = (panResponder as any).startX || 0;
        const startY = (panResponder as any).startY || 0;
        const { maxTranslateX, maxTranslateY } = getTranslateBounds(scaleValue.current);

        const nextX = clamp(startX + gestureState.dx, -maxTranslateX, maxTranslateX);
        const nextY = clamp(startY + gestureState.dy, -maxTranslateY, maxTranslateY);

        translateX.setValue(nextX);
        translateY.setValue(nextY);
        translateXValue.current = nextX;
        translateYValue.current = nextY;
      }
    },
    onPanResponderRelease: () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
      (panResponder as any).lastDistance = 0;
      (panResponder as any).startX = 0;
      (panResponder as any).startY = 0;

      commitPhotoState();
      handleSwapIfNeeded();
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderTerminate: () => {
      isDraggingRef.current = false;
      isResizingRef.current = false;
      (panResponder as any).lastDistance = 0;
      (panResponder as any).startX = 0;
      (panResponder as any).startY = 0;
      commitPhotoState();
    },
  });

  const handleCellPress = () => {
    onActivate(photo ? photo.id : null);
    if (!photo) {
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          width: cellWidth,
          height: cellHeight,
          backgroundColor,
          borderColor: backgroundColor,
        },
        isActive && styles.selectedCell,
      ]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={handleCellPress}
        activeOpacity={0.85}
      >
        {photo ? (
          <View
            style={[styles.photoContainer, { backgroundColor }]}
            {...panResponder.panHandlers}
          >
            <AnimatedImage
              source={{ uri: photo.uri }}
              style={[
                styles.photo,
                {
                  transform: [
                    { scale },
                    { translateX },
                    { translateY },
                  ],
                },
              ]}
              resizeMode="contain"
            />
            {isActive && (
              <View style={styles.selectionBorder} pointerEvents="none" />
            )}
          </View>
        ) : (
          <View style={[styles.placeholder, { backgroundColor }]}>
            <View style={styles.plusIcon}>
              <View style={styles.plusHorizontal} />
              <View style={styles.plusVertical} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: COLORS.greyBorder,
    backgroundColor: COLORS.greyDark,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  touchable: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: COLORS.greyLight,
  },
  plusVertical: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: COLORS.greyLight,
  },
  selectionBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderWidth: 2,
    borderColor: COLORS.white,
    borderRadius: 4,
  },
});

export default GridCell;
