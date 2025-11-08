import React, { useContext } from 'react';
import { XStack, YStack, Text as TamaguiText, Button } from 'tamagui';
import { Alert } from 'react-native';
import { SavedPalette } from '../utils/storage';
import { shareAsync, isAvailableAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { ThemeContext } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { hslToHex } from '../utils/colors';

interface SavedPaletteCardProps {
  palette: SavedPalette;
  onDelete: (paletteId: string) => void;
  onRename: (paletteId: string, newName: string) => void;
  onMoveUp: (paletteId: string) => void;
  onMoveDown: (paletteId: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const SavedPaletteCard: React.FC<SavedPaletteCardProps> = ({
  palette,
  onDelete,
  onRename,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const { theme } = useContext(ThemeContext);

  const handleDelete = () => {
    Alert.alert(
      'Delete Palette',
      'Are you sure you want to delete this palette?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(palette.id) },
      ]
    );
  };

  const handleRename = () => {
    Alert.prompt(
      'Rename Palette',
      'Enter a new name for this palette:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (value?: string) => {
            const newName = value;
            if (newName) {
              onRename(palette.id, newName);
            }
          },
        },
      ],
      'plain-text',
      palette.name
    );
  };

  const handleExport = async () => {
    const jsonString = JSON.stringify(palette, null, 2);
    if (!(await isAvailableAsync())) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return;
    }
    try {
      const tempFile = '/tmp/' + Date.now() + '_' + palette.name.replace(/\s/g, '_') + '.json';
      await FileSystem.writeAsStringAsync(tempFile, jsonString);
      await shareAsync(tempFile, { mimeType: 'application/json', dialogTitle: 'Share Palette' });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the palette');
      console.error(error);
    }
  };

  return (
    <YStack padding={15} borderRadius={12} marginBottom={15} backgroundColor={theme.card}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={10}>
        <TamaguiText fontSize={16} fontFamily="Inter_400Regular" color={theme.text}>
          {palette.name}
        </TamaguiText>
        <XStack>
          <Button size="sm" marginRight={10} onPress={handleExport} backgroundColor={theme.primary}>
            Export
          </Button>
          <Button size="sm" marginRight={10} onPress={handleRename} backgroundColor={theme.primary}>
            Rename
          </Button>
          <Button size="sm" backgroundColor="#c0392b" onPress={handleDelete}>
            Delete
          </Button>
        </XStack>
      </XStack>

      <XStack>
        {palette.colors.map((hsl, i) => {
          const css = hslArrayToCss(hsl);
          return (
            <YStack key={i} width={40} height={40} borderRadius={8} marginRight={10} alignItems="center" justifyContent="center" backgroundColor={css}>
              <TamaguiText fontSize={8} color="#fff" textAlign="center" marginTop={2}>
                {hslToHex(hsl[0], hsl[1] * 100, hsl[2] * 100)}
              </TamaguiText>
            </YStack>
          );
        })}
      </XStack>

      <XStack justifyContent="flex-end" marginTop={10}>
        <Button size="sm" marginRight={10} disabled={isFirst} onPress={() => onMoveUp(palette.id)}>
          <Ionicons name="arrow-up" size={16} color={isFirst ? 'gray' : theme.text} />
        </Button>
        <Button size="sm" disabled={isLast} onPress={() => onMoveDown(palette.id)}>
          <Ionicons name="arrow-down" size={16} color={isLast ? 'gray' : theme.text} />
        </Button>
      </XStack>
    </YStack>
  );
};

// Styles removed as they are now handled by Tamagui components

export default SavedPaletteCard;