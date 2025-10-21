import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Line, Circle } from 'react-native-svg';

interface FabricTextureOverlayProps {
  color: string;
  textureType: 'none' | 'lines' | 'dots';
}

const FabricTextureOverlay: React.FC<FabricTextureOverlayProps> = ({ color, textureType }) => {
  if (textureType === 'none') {
    return <View style={{ backgroundColor: color, flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      <Svg height="100%" width="100%">
        {textureType === 'lines' && (
          <>
            <Line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <Line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </>
        )}
        {textureType === 'dots' && (
          <>
            {Array.from({ length: 10 }).map((_, i) => (
              Array.from({ length: 10 }).map((_2, j) => (
                <Circle
                  key={`${i}-${j}`}
                  cx={`${i * 10 + 5}%`}
                  cy={`${j * 10 + 5}%`}
                  r="2"
                  fill="rgba(255,255,255,0.2)"
                />
              ))
            ))}
          </>
        )}
      </Svg>
    </View>
  );
};

export default FabricTextureOverlay;
