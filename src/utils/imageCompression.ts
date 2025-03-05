import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

/**
 * Compresses an image to ensure it's under 1MB
 * @param uri The URI of the image to compress
 * @returns The URI of the compressed image
 */
export const compressImage = async (uri: string): Promise<string> => {
  try {
    // First check the file size
    const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
    
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }
    
    // If already under 1MB, return the original
    if (fileInfo.size && fileInfo.size < 1024 * 1024) {
      return uri;
    }
    
    // Calculate compression quality based on file size
    // The larger the file, the more we compress
    let quality = 0.8;
    if (fileInfo.size > 5 * 1024 * 1024) {
      quality = 0.5;
    } else if (fileInfo.size > 2 * 1024 * 1024) {
      quality = 0.7;
    }
    
    // Compress the image
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }], // Resize to max width of 1200px
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    // Check if the compressed image is still too large
    const compressedInfo = await FileSystem.getInfoAsync(result.uri, { size: true });
    
    if (compressedInfo.size && compressedInfo.size > 1024 * 1024) {
      // If still too large, compress more aggressively
      return compressImage(result.uri);
    }
    
    return result.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}; 