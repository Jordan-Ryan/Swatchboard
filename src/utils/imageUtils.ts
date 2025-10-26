import * as ImagePicker from 'expo-image-picker';
import { Photo } from '../types';

export const requestImagePickerPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

export const pickImageFromGallery = async (): Promise<Photo | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      return {
        id: Date.now().toString(),
        uri: asset.uri,
        width: asset.width || 100,
        height: asset.height || 100,
        scale: 1,
        rotation: 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

export const calculateAspectRatio = (width: number, height: number): number => {
  return width / height;
};

export const fitImageToBounds = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
): { width: number; height: number; x: number; y: number } => {
  const imageAspect = imageWidth / imageHeight;
  const containerAspect = containerWidth / containerHeight;

  let width, height, x, y;

  if (imageAspect > containerAspect) {
    // Image is wider than container
    width = containerWidth;
    height = containerWidth / imageAspect;
    x = 0;
    y = (containerHeight - height) / 2;
  } else {
    // Image is taller than container
    height = containerHeight;
    width = containerHeight * imageAspect;
    x = (containerWidth - width) / 2;
    y = 0;
  }

  return { width, height, x, y };
};
