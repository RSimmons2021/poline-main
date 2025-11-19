import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { G, Path as SvgPath } from 'react-native-svg';
import { Poline, positionFunctions } from 'poline';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GenerativeColorWheelProps {
  style?: 'default' | 'dark' | 'blur' | 'notches' | 'trans';
  onStyleChange?: (style: string) => void;
  size?: number;
}

export const GenerativeColorWheel: React.FC<GenerativeColorWheelProps> = ({
  size = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.8
}) => {
  const [poline, setPoline] = useState<Poline | null>(null);
  const [hueSection, setHueSection] = useState(10);
  const [lightnessLevels, setLightnessLevels] = useState(3);
  const [invertLight, setInvertLight] = useState(false);
  const [direction, setDirection] = useState(1);
  const [rings, setRings] = useState<any[]>([]);

  const newSettings = () => {
    const newDirection = Math.random() < 0.5 ? 1 : -1;
    let newHueSection = 10 + Math.floor(Math.random() * 10);
    newHueSection = 3 + Math.round(Math.random() * 45);
    if (Math.random() < 0.15) {
      newHueSection = 100 + Math.round(Math.random() * 240);
    }
    const newLightnessLevels = 3 + Math.floor(Math.random() * 10);
    const newInvertLight = Math.random() < 0.5;

    const newPoline = new Poline({
      anchorColors: [
        [Math.random() * 360, Math.random(), Math.random()],
        [Math.random() * 360, Math.random(), Math.random()]
      ],
      numPoints: 10,
      positionFunctionX:
        Math.random() < 0.5
          ? positionFunctions.smoothStepPosition
          : positionFunctions.sinusoidalPosition,
    });

    const additionalAnchors = Math.random() < 0.3 ? Math.round(Math.random() * 2) : 0;
    for (let i = 0; i < additionalAnchors; i++) {
      newPoline.addAnchorPoint({
        xyz: [Math.random(), Math.random(), Math.random()]
      });
    }

    setDirection(newDirection);
    setHueSection(newHueSection);
    setLightnessLevels(newLightnessLevels);
    setInvertLight(newInvertLight);
    setPoline(newPoline);
  };

  const generateRings = () => {
    if (!poline) return;

    const hueSlice = 360 / hueSection;
    const lightnessSlice = 1 / lightnessLevels;

    const hueSections = new Array(hueSection).fill('').map((_, i) => (i + 1) * hueSlice);
    const lightnessSections = new Array(lightnessLevels)
      .fill('')
      .map((_, i) =>
        invertLight ? 1 - (i + 1) / lightnessLevels : (i + 1) / lightnessLevels
      );

    const colors = poline.colors.map((color, i) => {
      return {
        values: color,
        css: `hsl(${color[0]}, ${color[1] * 100}%, ${color[2] * 100}%)`,
      };
    });

    const newRings: any[] = [];

    lightnessSections.forEach((lightnessSection, ringIndex) => {
      const currentSegmentLightness = colors.filter(
        (c) =>
          c.values[2] <= lightnessSection &&
          lightnessSection - lightnessSlice <= c.values[2]
      );

      const segmentedHuesForLightness = hueSections.map((hueSection) =>
        currentSegmentLightness.filter(
          (c) =>
            c.values[0] <= hueSection && hueSection - hueSlice <= c.values[0]
        )
      );

      const ringColors = segmentedHuesForLightness.map((segment) =>
        segment.length > 0 ? segment[0].css : '#F5F1E8'
      );

      newRings.push({
        colors: ringColors,
        radius: ((ringIndex + 1) / lightnessLevels) * (size / 2),
        innerRadius: (ringIndex / lightnessLevels) * (size / 2),
      });
    });

    setRings(newRings);
  };

  useEffect(() => {
    newSettings();
  }, []);

  useEffect(() => {
    if (poline) {
      generateRings();
    }
  }, [poline, hueSection, lightnessLevels, invertLight]);

  useEffect(() => {
    // Animate rotation
    const interval = setInterval(() => {
      if (poline) {
        poline.shiftHue(0.75 * direction);
        generateRings();
      }
    }, 16.66);

    return () => clearInterval(interval);
  }, [poline, direction]);

  const handlePress = () => {
    newSettings();
  };

  const createArcPath = (
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
    centerX: number,
    centerY: number
  ): string => {
    const startOuterX = centerX + outerRadius * Math.cos(startAngle);
    const startOuterY = centerY + outerRadius * Math.sin(startAngle);
    const endOuterX = centerX + outerRadius * Math.cos(endAngle);
    const endOuterY = centerY + outerRadius * Math.sin(endAngle);
    const startInnerX = centerX + innerRadius * Math.cos(endAngle);
    const startInnerY = centerY + innerRadius * Math.sin(endAngle);
    const endInnerX = centerX + innerRadius * Math.cos(startAngle);
    const endInnerY = centerY + innerRadius * Math.sin(startAngle);

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return [
      `M ${startOuterX} ${startOuterY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}`,
      `L ${startInnerX} ${startInnerY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInnerX} ${endInnerY}`,
      'Z'
    ].join(' ');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Svg width={size} height={size}>
          <G transform={`translate(${size / 2}, ${size / 2})`}>
            {rings.map((ring, ringIndex) => {
              const segmentAngle = (2 * Math.PI) / ring.colors.length;
              return ring.colors.map((color: string, segmentIndex: number) => {
                const startAngle = segmentIndex * segmentAngle;
                const endAngle = (segmentIndex + 1) * segmentAngle;

                const pathData = createArcPath(
                  ring.innerRadius,
                  ring.radius,
                  startAngle - Math.PI / 2, // Rotate to start at top
                  endAngle - Math.PI / 2,
                  0,
                  0
                );

                return (
                  <SvgPath
                    key={`${ringIndex}-${segmentIndex}`}
                    d={pathData}
                    fill={color}
                    stroke="none"
                  />
                );
              });
            })}
          </G>
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
