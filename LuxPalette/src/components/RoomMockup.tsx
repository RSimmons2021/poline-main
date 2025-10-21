import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

interface RoomMockupProps {
  palette: number[][];
}

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const RoomMockup: React.FC<RoomMockupProps> = ({ palette }) => {
  if (!palette || palette.length < 3) {
    return null;
  }

  const wallColor = hslArrayToCss(palette[0]);
  const sofaColor = hslArrayToCss(palette[1]);
  const trimColor = hslArrayToCss(palette[2]);

  return (
    <View>
      <Svg height="200" width="300">
        {/* Wall */}
        <Rect x="0" y="0" width="300" height="200" fill={wallColor} />
        {/* Floor */}
        <Rect x="0" y="180" width="300" height="20" fill={trimColor} />
        {/* Sofa */}
        <Rect x="50" y="100" width="200" height="80" fill={sofaColor} />
        <Rect x="40" y="120" width="220" height="20" fill={sofaColor} rx="10" />
      </Svg>
    </View>
  );
};

export default RoomMockup;
