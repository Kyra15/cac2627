import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin';

// for local point at flask, for prod, point to api key backend endpoint
const ANALYZE_URL = 'http://192.168.240.242:4200/analyze';

interface AnalyzeResponse {
  summary?: string;
  error?: string;
}

export default function App(): React.JSX.Element {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const requestPermissions = async (type: 'camera' | 'library'): Promise<boolean> => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const pickFromCamera = async (): Promise<void> => {
    const ok = await requestPermissions('camera');
    if (!ok) {
      Alert.alert('Permission needed', 'Camera access is required to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 1,
    });
    handlePickerResult(result);
  };

  const scanDocument = async (): Promise<void> => {
    const ok = await requestPermissions('camera');
    if (!ok) {
      Alert.alert('Permission needed', 'Camera access is required to take a photo.');
      return;
    }
    const { scannedImages } = await DocumentScanner.scanDocument({
      maxNumDocuments: 20,
      responseType: ResponseType.Base64
    });
    
    if (!scannedImages || scannedImages.length === 0) {
        return;
    }
    const base64Image = `data:image/jpeg;base64,${scannedImages[0]}`;
    setImageUri(base64Image);

    handleScanResult(scannedImages);
  }

  const handleScanResult = (result: string[]): void => {
    if (!result || result.length === 0) return;
    const asset = result[0];
    setImageBase64(asset);;
    setSummary('');
  };


  const pickFromLibrary = async (): Promise<void> => {
    const ok = await requestPermissions('library');
    if (!ok) {
      Alert.alert('Permission needed', 'Photo library access is required to upload a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 1,
      mediaTypes: ["images"]
    });
    handlePickerResult(result);
  };

  const handlePickerResult = (result: ImagePicker.ImagePickerResult): void => {
    if (result.canceled || !result.assets || result.assets.length === 0) return;
    const asset = result.assets[0];
    setImageUri(asset.uri);
    setImageBase64(asset.base64 ?? null);
    setSummary('');
  };

  const analyzePhoto = async (): Promise<void> => {
    if (!imageBase64) {
      Alert.alert('No photo selected', 'Take or upload a photo first.');
      return;
    }
    setLoading(true);
    setSummary('');
    try {
      const response = await fetch(ANALYZE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: AnalyzeResponse = await response.json();
      setSummary(data.summary || 'No summary returned.');
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Error',
        'Could not analyze the photo. Check that your backend URL is set correctly.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Photo Summarizer</Text>

        <View style={styles.imageBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>No photo selected yet</Text>
          )}
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={scanDocument}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickFromLibrary}>
            <Text style={styles.buttonText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.analyzeButton, !imageBase64 && styles.buttonDisabled]}
          onPress={analyzePhoto}
          disabled={!imageBase64 || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Summarize Photo</Text>
          )}
        </TouchableOpacity>

        {summary ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  scroll: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', marginVertical: 16 },
  imageBox: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    backgroundColor: '#1b1e26',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholder: { color: '#6b7280' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  button: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  analyzeButton: {
    width: '100%',
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { backgroundColor: '#3f5c47' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  summaryBox: {
    width: '100%',
    backgroundColor: '#1b1e26',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  summaryTitle: { color: '#9ca3af', fontSize: 13, marginBottom: 8, textTransform: 'uppercase' },
  summaryText: { color: '#fff', fontSize: 16, lineHeight: 22 },
});
