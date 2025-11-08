import React, { useContext } from 'react';
import { YStack, Text as TamaguiText } from 'tamagui';
import { ThemeContext } from '../theme/ThemeContext';
import FabricTextureOverlay from './FabricTextureOverlay';

interface SwatchStripProps {
  palette: number[][];
  textureType: 'none' | 'lines' | 'dots';
}

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const SwatchStrip: React.FC<SwatchStripProps> = ({ palette, textureType }) => {
  const { theme } = useContext(ThemeContext);

  if (!palette || palette.length === 0) {
    return null;
  }

  return (
    <YStack width="100%" flexDirection="column">
      {palette.map((hsl, i) => {
        const css = hslArrayToCss(hsl);
        return (
          <YStack key={i} height={50} alignItems="center" justifyContent="center" position="relative">
            <FabricTextureOverlay color={css} textureType={textureType} />
            <TamaguiText position="absolute" fontSize={12} color={theme.text} fontFamily="Inter_400Regular">
              {css}
            </TamaguiText>
          </YStack>
        );
      })}
    </YStack>
  );
};


export default SwatchStrip;
