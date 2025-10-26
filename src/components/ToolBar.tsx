import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';

interface ToolBarProps {
  onAddPhoto: () => void;
  onDeletePhoto: () => void;
  onExport: () => void;
  onBackgroundColorChange: (color: string) => void;
  hasSelectedPhoto: boolean;
  canvasSize: string;
}

const ToolBar: React.FC<ToolBarProps> = ({
  onAddPhoto,
  onDeletePhoto,
  onExport,
  onBackgroundColorChange,
  hasSelectedPhoto,
  canvasSize,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    COLORS.white,
    COLORS.black,
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
    '#F7DC6F', // Gold
    '#BB8FCE', // Lavender
    '#85C1E9', // Light Blue
  ];

  const handleColorSelect = (color: string) => {
    onBackgroundColorChange(color);
    setShowColorPicker(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.canvasSize}>{canvasSize}</Text>
        <TouchableOpacity style={styles.exportButton} onPress={onExport}>
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      {showColorPicker && (
        <View style={styles.colorSliderWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.colorSwatch, { backgroundColor: color }]}
                onPress={() => handleColorSelect(color)}
                accessibilityLabel={`Select background ${color}`}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addButton} onPress={onAddPhoto}>
          <Text style={styles.addButtonText}>Add Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.colorButton} 
          onPress={() => setShowColorPicker(!showColorPicker)}
        >
          <Text style={styles.colorButtonText}>Background</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.deleteButton, !hasSelectedPhoto && styles.disabledButton]}
          onPress={onDeletePhoto}
          disabled={!hasSelectedPhoto}
        >
          <Text style={[styles.deleteButtonText, !hasSelectedPhoto && styles.disabledText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyBorder,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyBorder,
  },
  canvasSize: {
    fontSize: 14,
    color: COLORS.greyLight,
  },
  exportButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exportButtonText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  colorSliderWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.greyBorder,
  },
  addButton: {
    flex: 1,
    backgroundColor: COLORS.greyDark,
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.greyBorder,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  colorButton: {
    flex: 1,
    backgroundColor: COLORS.greyDark,
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.greyBorder,
  },
  colorButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.greyDark,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.greyBorder,
  },
  disabledButton: {
    backgroundColor: COLORS.greyMedium,
    borderColor: COLORS.greyLight,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  disabledText: {
    color: COLORS.greyLight,
  },
});

export default ToolBar;
