import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SavedPalette } from '../utils/storage';
import * as Sharing from 'expo-sharing';
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
          onPress: (newName) => {
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
    const fileName = `${FileSystem.cacheDirectory}${palette.name.replace(/\s/g, '_')}.json`;
    await FileSystem.writeAsStringAsync(fileName, jsonString);
    await Sharing.shareAsync(fileName);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{palette.name}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleExport} style={[styles.exportButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.actionButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRename} style={[styles.renameButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.actionButtonText}>Rename</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.swatchRow}>
        {palette.colors.map((hsl, i) => {
          const css = hslArrayToCss(hsl);
          return (
            <View key={i} style={[styles.swatch, { backgroundColor: css }]}>
              <Text style={styles.hexText}>{hslToHex(hsl[0], hsl[1] * 100, hsl[2] * 100)}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.reorderContainer}>
        <TouchableOpacity
          onPress={() => onMoveUp(palette.id)}
          disabled={isFirst}
          style={[styles.reorderButton, isFirst && styles.disabledButton]}
        >
          <Ionicons name="arrow-up" size={20} color={isFirst ? 'gray' : theme.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onMoveDown(palette.id)}
          disabled={isLast}
          style={[styles.reorderButton, isLast && styles.disabledButton]}
        >
          <Ionicons name="arrow-down" size={20} color={isLast ? 'gray' : theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  exportButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  renameButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#c0392b',
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  swatchRow: {
    flexDirection: 'row',
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexText: {
    fontSize: 8,
    color: '#fff',
    textAlign: 'center',
    marginTop: 2,
  },
  reorderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  reorderButton: {
    padding: 5,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default SavedPaletteCard;