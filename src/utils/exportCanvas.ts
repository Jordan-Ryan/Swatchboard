import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { Alert } from 'react-native';

export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
};

export const saveImageToGallery = async (uri: string): Promise<boolean> => {
  try {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant permission to save images to your gallery.');
      return false;
    }

    await MediaLibrary.saveToLibraryAsync(uri);
    return true;
  } catch (error) {
    console.error('Error saving image:', error);
    return false;
  }
};

export const captureCanvas = async (
  canvasRef: React.RefObject<any>,
  width: number,
  height: number
): Promise<string | null> => {
  try {
    const uri = await captureRef(canvasRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
      width,
      height,
    });
    return uri;
  } catch (error) {
    console.error('Error capturing canvas:', error);
    return null;
  }
};
