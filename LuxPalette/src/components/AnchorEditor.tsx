import React, { useContext, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Circle, G, Line } from 'react-native-svg';
import { ThemeContext } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const CIRCLE_RADIUS = (width / 2) - 40; // Adjust as needed
const CENTER_X = width / 2;
const CENTER_Y = CIRCLE_RADIUS + 20; // Offset for better positioning

interface AnchorEditorProps {
  anchorColors: number[][];
  onAnchorColorChange: (index: number, newColor: number[]) => void;
}

// Helper to convert HSL to polar coordinates (angle and radius)
const hslToPolar = (h: number, s: number, l: number) => {
  const angle = h; // Hue directly maps to angle (0-360)
  const radius = s * CIRCLE_RADIUS; // Saturation maps to radius (0-CIRCLE_RADIUS)
  return { angle, radius };
};

// Helper to convert polar coordinates to HSL (hue and saturation)
const polarToHsl = (angle: number, radius: number, l: number) => {
  const h = angle % 360; // Ensure hue is within 0-360
  if (h < 0) h += 360;
  const s = Math.min(1, Math.max(0, radius / CIRCLE_RADIUS)); // Ensure saturation is within 0-1
  return [h, s, l];
};

const AnchorEditor: React.FC<AnchorEditorProps> = ({ anchorColors, onAnchorColorChange }) => {
  const { theme } = useContext(ThemeContext);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const touchX = evt.nativeEvent.locationX;
        const touchY = evt.nativeEvent.locationY;

        // Find the closest anchor point to the touch
        let closestAnchorIndex = -1;
        let minDistance = Infinity;

        anchorColors.forEach((color, index) => {
          const { angle, radius } = hslToPolar(color[0], color[1], color[2]);
          const x = CENTER_X + radius * Math.cos((angle - 90) * Math.PI / 180);
          const y = CENTER_Y + radius * Math.sin((angle - 90) * Math.PI / 180);

          const distance = Math.sqrt(Math.pow(touchX - x, 2) + Math.pow(touchY - y, 2));
          if (distance < minDistance) {
            minDistance = distance;
            closestAnchorIndex = index;
          }
        });

        if (closestAnchorIndex !== -1 && minDistance < 30) { // Only drag if close to an anchor
          const dx = touchX - CENTER_X;
          const dy = touchY - CENTER_Y;

          let newAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90; // Convert to 0-360 hue
          if (newAngle < 0) newAngle += 360;

          const newRadius = Math.sqrt(dx * dx + dy * dy);

          const newHsl = polarToHsl(newAngle, newRadius, anchorColors[closestAnchorIndex][2]);
          onAnchorColorChange(closestAnchorIndex, newHsl);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      

      {anchorColors.map((color, index) => (
        <View key={index} style={[styles.anchorContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.anchorTitle, { color: theme.text }]}>Anchor {index + 1}</Text>
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: theme.text }]}>H: {Math.round(color[0])}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={360}
              value={color[0]}
              onValueChange={(value) => onAnchorColorChange(index, [value, color[1], color[2]])}
              thumbTintColor={theme.primary}
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: theme.text }]}>S: {color[1].toFixed(2)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={color[1]}
              onValueChange={(value) => onAnchorColorChange(index, [color[0], value, color[2]])}
              thumbTintColor={theme.primary}
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: theme.text }]}>L: {color[2].toFixed(2)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={color[2]}
              onValueChange={(value) => onAnchorColorChange(index, [color[0], color[1], value])}
              thumbTintColor={theme.primary}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  colorWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  anchorContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 12,
  },
  anchorTitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    width: 60,
  },
  slider: {
    flex: 1,
  },
});

export default AnchorEditor;
