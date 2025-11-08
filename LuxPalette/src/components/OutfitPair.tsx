import React, { useContext } from 'react';
import { XStack, YStack, Text as TamaguiText } from 'tamagui';
import { hslToRgb, getContrastRatio } from '../utils/colors';
import { ThemeContext } from '../theme/ThemeContext';

interface OutfitPairProps {
  color1: number[];
  color2: number[];
}

function hslArrayToCss(hsl: number[]): string {
  const [h, s, l] = hsl;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const OutfitPair: React.FC<OutfitPairProps> = ({ color1, color2 }) => {
  const { theme } = useContext(ThemeContext);
  const rgb1 = hslToRgb(color1[0], color1[1], color1[2]);
  const rgb2 = hslToRgb(color2[0], color2[1], color2[2]);
  const contrastRatio = getContrastRatio(rgb1, rgb2);

  return (
    <XStack alignItems="center" marginBottom={10}>
      <YStack width={80} height={80} borderRadius={12} backgroundColor={hslArrayToCss(color1)} />
      <YStack width={80} height={80} borderRadius={12} backgroundColor={hslArrayToCss(color2)} marginLeft={10} />
      <YStack marginLeft={20}>
        <TamaguiText fontSize={16} fontFamily="Inter_400Regular" color={theme.text}>
          Contrast Ratio: {contrastRatio.toFixed(2)}
        </TamaguiText>
        <TamaguiText fontSize={14} fontFamily="Inter_400Regular" color={theme.subtext} marginTop={5}>
          {contrastRatio >= 4.5 ? 'Good' : 'Poor'}
        </TamaguiText>
      </YStack>
    </XStack>
  );
};

// Styles removed as they are now handled by Tamagui components

export default OutfitPair;