import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CanvasSize, GridLayout } from '../types';
import { COLORS } from '../constants/colors';
import { PLATFORM_PRESETS, GRID_LAYOUTS } from '../constants/presets';
import { InstagramIcon, XIcon, YouTubeIcon, FacebookIcon, CustomIcon } from '../components/PlatformIcons';
import { 
  Grid1x2Icon, Grid2x1Icon, Grid1x3Icon, Grid3x1Icon, Grid2x2Icon, 
  Grid2x3Icon, Grid3x2Icon, Grid3x3Icon, Grid1x4Icon, Grid4x1Icon,
  Grid2x4Icon, Grid4x2Icon, Grid2x5Icon, Grid5x2Icon
} from '../components/GridIcons';

type CombinedSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CombinedSelection'>;

interface Props {
  navigation: CombinedSelectionScreenNavigationProp;
}

const CombinedSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedSize, setSelectedSize] = useState<CanvasSize>(PLATFORM_PRESETS[0]);
  const [selectedLayout, setSelectedLayout] = useState<GridLayout>(GRID_LAYOUTS[0]);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [selectedCellCount, setSelectedCellCount] = useState<number | null>(null);

  // Get available cell counts from layouts
  const getAvailableCellCounts = () => {
    const counts = new Set<number>();
    GRID_LAYOUTS.forEach(layout => {
      counts.add(layout.rows * layout.cols);
    });
    return Array.from(counts).sort((a, b) => a - b);
  };

  // Filter layouts based on selected cell count
  const getFilteredLayouts = () => {
    if (selectedCellCount === null) {
      return GRID_LAYOUTS;
    }
    return GRID_LAYOUTS.filter(layout => layout.rows * layout.cols === selectedCellCount);
  };

  const handleCustomSize = () => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      Alert.alert('Invalid Size', 'Please enter valid width and height values.');
      return;
    }

    if (width > 4000 || height > 4000) {
      Alert.alert('Size Too Large', 'Maximum size is 4000x4000 pixels.');
      return;
    }

    const customSize: CanvasSize = {
      width,
      height,
      name: `${width}x${height}`,
    };

    setSelectedSize(customSize);
    setShowCustomSize(false);
    setCustomWidth('');
    setCustomHeight('');
  };

  const handleContinue = () => {
    if (!selectedSize.width || !selectedSize.height) {
      Alert.alert('Select Canvas Size', 'Please select a canvas size before continuing.');
      return;
    }
    
    navigation.navigate('CanvasEditor', { 
      canvasSize: selectedSize, 
      layout: selectedLayout 
    });
  };

  const getPlatformIcon = (name: string) => {
    switch (name) {
      case 'Instagram Post':
      case 'Instagram Story':
        return <InstagramIcon size={24} />;
      case 'X Post':
        return <XIcon size={24} />;
      case 'YouTube Thumbnail':
      case 'YouTube Banner':
        return <YouTubeIcon size={24} />;
      case 'Facebook Post':
        return <FacebookIcon size={24} />;
      default:
        return <CustomIcon size={24} />;
    }
  };

  const renderSizeOption = (size: CanvasSize, isSelected: boolean) => (
    <TouchableOpacity
      key={size.name}
      style={[styles.sizeOption, isSelected && styles.selectedOption]}
      onPress={() => {
        setSelectedSize(size);
        setShowCustomSize(false); // Hide custom size when selecting preset
      }}
    >
      <View style={styles.platformIcon}>{getPlatformIcon(size.name)}</View>
      <Text style={[styles.sizeName, isSelected && styles.selectedText]}>
        {size.name}
      </Text>
      <Text style={[styles.sizeDimensions, isSelected && styles.selectedSubText]}>
        {size.width} × {size.height}
      </Text>
    </TouchableOpacity>
  );

  const renderLayoutOption = (layout: GridLayout, isSelected: boolean) => (
    <TouchableOpacity
      key={layout.id}
      style={[styles.layoutOption, isSelected && styles.selectedOption]}
      onPress={() => setSelectedLayout(layout)}
    >
      <View style={styles.layoutPreview}>
        {renderGridPreview(layout)}
      </View>
      <Text style={[styles.layoutName, isSelected && styles.selectedText]}>
        {layout.name}
      </Text>
    </TouchableOpacity>
  );

  const getGridIcon = (layout: GridLayout) => {
    switch (layout.id) {
      case '1x2': return <Grid1x2Icon size={52} />;
      case '2x1': return <Grid2x1Icon size={52} />;
      case '1x3': return <Grid1x3Icon size={52} />;
      case '3x1': return <Grid3x1Icon size={52} />;
      case '2x2': return <Grid2x2Icon size={52} />;
      case '2x3': return <Grid2x3Icon size={52} />;
      case '3x2': return <Grid3x2Icon size={52} />;
      case '3x3': return <Grid3x3Icon size={52} />;
      case '1x4': return <Grid1x4Icon size={52} />;
      case '4x1': return <Grid4x1Icon size={52} />;
      case '2x4': return <Grid2x4Icon size={52} />;
      case '4x2': return <Grid4x2Icon size={52} />;
      case '2x5': return <Grid2x5Icon size={52} />;
      case '5x2': return <Grid5x2Icon size={52} />;
      default: return <Grid2x2Icon size={52} />;
    }
  };

  const renderGridPreview = (layout: GridLayout) => {
    return getGridIcon(layout);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Canvas Size Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Canvas Size</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={styles.horizontalContent}
        >
          {PLATFORM_PRESETS.map((size) => 
            renderSizeOption(size, selectedSize.name === size.name)
          )}
          <TouchableOpacity
            style={[styles.sizeOption, showCustomSize && styles.selectedOption]}
            onPress={() => {
              setShowCustomSize(!showCustomSize);
              if (!showCustomSize) {
                // Clear any selected preset when opening custom size
                setSelectedSize({ width: 0, height: 0, name: 'Custom' });
              }
            }}
          >
            <View style={styles.platformIcon}><CustomIcon size={24} /></View>
            <Text style={[styles.sizeName, showCustomSize && styles.selectedText]}>
              Custom
            </Text>
            <Text style={[styles.sizeDimensions, showCustomSize && styles.selectedSubText]}>
              Set Size
            </Text>
          </TouchableOpacity>
        </ScrollView>
        
        {showCustomSize && (
          <View style={styles.customSizeContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Width"
                placeholderTextColor={COLORS.greyMedium}
                value={customWidth}
                onChangeText={setCustomWidth}
                keyboardType="numeric"
              />
              <Text style={styles.xText}>×</Text>
              <TextInput
                style={styles.input}
                placeholder="Height"
                placeholderTextColor={COLORS.greyMedium}
                value={customHeight}
                onChangeText={setCustomHeight}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={[styles.customButton, (!customWidth || !customHeight) && styles.disabledButton]}
              onPress={handleCustomSize}
              disabled={!customWidth || !customHeight}
            >
              <Text style={styles.customButtonText}>Create Custom Size</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

              {/* Layout Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Layout</Text>
                
                {/* Cell Count Filter */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.filterScroll}
                  contentContainerStyle={styles.filterContent}
                >
                  <TouchableOpacity
                    style={[styles.cellCountOption, selectedCellCount === null && styles.selectedCellCountOption]}
                    onPress={() => setSelectedCellCount(null)}
                  >
                    <Text style={[styles.cellCountText, selectedCellCount === null && styles.selectedCellCountText]}>
                      All
                    </Text>
                  </TouchableOpacity>
                  {getAvailableCellCounts().map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[styles.cellCountOption, selectedCellCount === count && styles.selectedCellCountOption]}
                      onPress={() => setSelectedCellCount(count)}
                    >
                      <Text style={[styles.cellCountText, selectedCellCount === count && styles.selectedCellCountText]}>
                        {count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.horizontalScroll}
                  contentContainerStyle={styles.horizontalContent}
                >
                  {getFilteredLayouts().map((layout) => 
                    renderLayoutOption(layout, selectedLayout.id === layout.id)
                  )}
                </ScrollView>
              </View>


      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Start Creating</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 15,
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  horizontalContent: {
    paddingHorizontal: 20,
  },
  sizeOption: {
    backgroundColor: COLORS.greyDark,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  platformIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  layoutOption: {
    padding: 15,
    marginRight: 12,
    alignItems: 'center',
    width: 100,
  },
  layoutPreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.greyDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.greyBorder,
  },
  selectedOption: {
    borderColor: COLORS.white,
    backgroundColor: COLORS.greyMedium,
    borderRadius: 12,
    borderWidth: 2,
  },
  sizeName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    marginBottom: 4,
  },
  sizeDimensions: {
    fontSize: 12,
    color: COLORS.greyLight,
  },
  selectedText: {
    color: COLORS.white,
  },
  selectedSubText: {
    color: COLORS.white,
  },
  layoutName: {
    fontSize: 12,
    color: COLORS.white,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '600',
  },
  customSizeContainer: {
    backgroundColor: COLORS.greyDark,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.greyBorder,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.black,
    color: COLORS.white,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.greyBorder,
    fontSize: 16,
  },
  xText: {
    color: COLORS.white,
    fontSize: 18,
    marginHorizontal: 10,
  },
  customButton: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.greyMedium,
  },
  customButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '500',
  },
  filterScroll: {
    marginTop: 10,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  cellCountOption: {
    backgroundColor: COLORS.greyDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCellCountOption: {
    borderColor: COLORS.white,
    backgroundColor: COLORS.greyMedium,
  },
  cellCountText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
  },
  selectedCellCountText: {
    color: COLORS.white,
  },
});

export default CombinedSelectionScreen;
