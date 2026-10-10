import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { styles } from '../styles/ScanStyle';
import { API_URL } from '../config';

const ANALYZE_URL = `${API_URL}/analyze`;

interface AnalyzeResponse {
  summary?: string;
  error?: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function ScanScreen({ navigation }: Props): React.JSX.Element {
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
          <Text style={styles.backLinkText}>‹ Library</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

          <Text style={styles.title}>Lab Scan Upload</Text>

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
              <Text style={styles.buttonText}>Summarize</Text>
            )}
          </TouchableOpacity>

          {summary ? (
            <View style={styles.summaryBox}>
              {/* <Text style={styles.summaryTitle}>Summary</Text> */}
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

