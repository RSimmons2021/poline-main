import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { G, Path as SvgPath, Path } from 'react-native-svg';
import { Poline, positionFunctions } from 'poline';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from "react-native-reanimated";
import { useColors } from "../../context/ColorContext";
import GlassDropdown from "../ui/GlassDropdown";
import { RefreshCw, Shuffle, Save } from "lucide-react-native";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.8;

const WHEEL_STYLES = [
  "Copic Wheel",
  "Poline Wheel",
  "Kandinsky Spiral",
  "Mondrian Block",
  "Bauhaus Grid"
];

interface GenerativeColorWheelProps {
  size?: number;
}

export const GenerativeColorWheel: React.FC<GenerativeColorWheelProps> = ({
  size = WHEEL_SIZE
}) => {
  const { palette, activeColor, setActiveColor, generateNewPalette, saveCurrentPalette } = useColors();
  const [wheelStyle, setWheelStyle] = useState("Copic Wheel");

  // --- Copic Wheel Logic (from new component) ---
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

  // --- Other Styles Logic (from old component) ---
  const renderPolineWheel = () => {
    return (
      <View className="flex-row items-end justify-center h-64 gap-2">
        {palette.map((color, i) => (
          <Animated.View
            key={i}
            className="w-8 rounded-t-full border border-white/20"
            style={{
              backgroundColor: color,
              height: 100 + Math.random() * 100 // Static for now, could animate height
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setActiveColor(color)}
            />
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderKandinsky = () => {
    return (
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        {palette.map((color, i) => (
          <Animated.View
            key={i}
            className="absolute rounded-full border border-black/5 shadow-sm"
            style={{
              width: (palette.length - i) * 40,
              height: (palette.length - i) * 40,
              backgroundColor: color,
              zIndex: i,
              transform: [{ scale: 1 + (i % 2) * 0.05 }]
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setActiveColor(color)}
            />
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderGrid = () => {
    return (
      <View className="w-64 h-64 bg-white border-4 border-black grid flex-wrap flex-row">
        <View className="w-2/3 h-2/3 bg-black p-1">
          <TouchableOpacity style={{ flex: 1, backgroundColor: palette[0] }} onPress={() => setActiveColor(palette[0])} />
        </View>
        <View className="w-1/3 h-1/3 bg-black p-1">
          <TouchableOpacity style={{ flex: 1, backgroundColor: palette[1] }} onPress={() => setActiveColor(palette[1])} />
        </View>
        <View className="w-1/3 h-1/3 bg-black p-1 absolute right-0 top-1/3">
          <TouchableOpacity style={{ flex: 1, backgroundColor: palette[2] }} onPress={() => setActiveColor(palette[2])} />
        </View>
        <View className="w-2/3 h-1/3 bg-black p-1 absolute bottom-0 left-0">
          <TouchableOpacity style={{ flex: 1, backgroundColor: palette[3] }} onPress={() => setActiveColor(palette[3])} />
        </View>
        <View className="w-1/3 h-1/3 bg-black p-1 absolute bottom-0 right-0">
          <TouchableOpacity style={{ flex: 1, backgroundColor: palette[4] || palette[0] }} onPress={() => setActiveColor(palette[4] || palette[0])} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Controls */}
      <View className="absolute top-0 z-50 flex-row gap-4 items-center" style={{ top: -60 }}>
        <GlassDropdown
          options={WHEEL_STYLES}
          selected={wheelStyle}
          onSelect={setWheelStyle}
        />
        <TouchableOpacity
          onPress={() => saveCurrentPalette(`${wheelStyle} Exploration`)}
          className="p-2 rounded-lg bg-white/30 border border-white/20"
        >
          <Save size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            generateNewPalette();
            newSettings(); // Also regenerate Copic settings
          }}
          className="p-2 rounded-lg bg-white/30 border border-white/20"
        >
          <Shuffle size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="items-center justify-center">
        {wheelStyle === "Copic Wheel" && (
          <TouchableOpacity onPress={newSettings} activeOpacity={0.8}>
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
        )}
        {wheelStyle === "Poline Wheel" && renderPolineWheel()}
        {wheelStyle === "Kandinsky Spiral" && renderKandinsky()}
        {(wheelStyle === "Mondrian Block" || wheelStyle === "Bauhaus Grid") && renderGrid()}
      </View>

      {/* Active Color Indicator */}
      <View className="absolute bottom-0 pointer-events-none" style={{ bottom: -80 }}>
        <BlurView intensity={20} className="w-16 h-16 rounded-full items-center justify-center overflow-hidden border border-black/5">
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: activeColor }} />
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
