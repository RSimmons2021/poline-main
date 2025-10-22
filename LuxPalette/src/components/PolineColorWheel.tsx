import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Defs, RadialGradient, Stop, Line, Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import { Poline } from 'poline';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface PolineColorWheelProps {
  poline: Poline;
  size?: number;
  showPaletteColors?: boolean;
  reduceMotion?: boolean;
}

const PaletteColorCircle = ({ point, reduceMotion, springConfig }) => {
  const animatedProps = useAnimatedProps(() => ({
    cx: reduceMotion ? point.x : withSpring(point.x, springConfig),
    cy: reduceMotion ? point.y : withSpring(point.y, springConfig),
  }));

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      r={4}
      fill={point.hsl}
      stroke="white"
      strokeWidth={1}
      opacity={0.7}
    />
  );
};

const AnchorPoint = ({ point, reduceMotion, springConfig }) => {
  const animatedProps = useAnimatedProps(() => ({
    cx: reduceMotion ? point.x : withSpring(point.x, springConfig),
    cy: reduceMotion ? point.y : withSpring(point.y, springConfig),
  }));

  return (
    <G>
      {/* Outer glow */}
      <AnimatedCircle
        animatedProps={animatedProps}
        r={14}
        fill={point.hsl}
        opacity={0.3}
      />
      {/* Main anchor point */}
      <AnimatedCircle
        animatedProps={animatedProps}
        r={8}
        fill={point.hsl}
        stroke="white"
        strokeWidth={2}
      />
      {/* Center dot */}
      <AnimatedCircle
        animatedProps={animatedProps}
        r={3}
        fill="white"
        opacity={0.8}
      />
    </G>
  );
};


/**
 * Interactive poline color wheel component for React Native
 * Displays anchor points and palette colors with fluid animations
 */
export const PolineColorWheel: React.FC<PolineColorWheelProps> = ({
  poline,
  size = 300,
  showPaletteColors = true,
  reduceMotion = false,
}) => {

  if (!poline) {
    return null;
  }

  const center = size / 2;
  const wheelRadius = size * 0.4;

  // Animation configuration
  const springConfig = {
    damping: 15,
    stiffness: 120,
    mass: 1,
  };

  // Generate hue wheel background (360 degree color wheel)
  const hueStops = useMemo(() => {
    const stops = [];
    for (let i = 0; i <= 12; i++) {
      const hue = (i / 12) * 360;
      stops.push(
        <Stop
          key={i}
          offset={`${(i / 12) * 100}%`}
          stopColor={`hsl(${hue}, 100%, 50%)`}
          stopOpacity="1"
        />
      );
    }
    return stops;
  }, []);

  // Get anchor points from poline
  const anchorPoints = useMemo(() => {
    return poline.anchorPoints.map((point, index) => {
      const color = point.hsl;
      // Convert HSL to polar coordinates for display
      const h = color[0]; // 0-360
      const s = color[1]; // 0-1
      const l = color[2]; // 0-1

      // Calculate position on wheel
      const angle = (h * Math.PI) / 180;
      const distance = wheelRadius * s;

      const x = center + distance * Math.cos(angle);
      const y = center + distance * Math.sin(angle);

      return {
        x,
        y,
        color,
        hsl: `hsl(${color[0]}, ${color[1] * 100}%, ${color[2] * 100}%)`,
        index,
      };
    });
  }, [poline.anchorPoints, center, wheelRadius]);

  // Get all palette colors for display
  const paletteColors = useMemo(() => {
    return poline.colors.map((color, index) => {
      const h = color[0];
      const s = color[1];
      const l = color[2];

      const angle = (h * Math.PI) / 180;
      const distance = wheelRadius * s;

      const x = center + distance * Math.cos(angle);
      const y = center + distance * Math.sin(angle);

      return {
        x,
        y,
        color,
        hsl: `hsl(${color[0]}, ${color[1] * 100}%, ${color[2] * 100}%)`,
        index,
      };
    });
  }, [poline.colors, center, wheelRadius]);

  // Create connection lines between anchor points
  const connectionPaths = useMemo(() => {
    if (anchorPoints.length < 2) return [];

    const paths = [];
    for (let i = 0; i < anchorPoints.length; i++) {
      const start = anchorPoints[i];
      const end = anchorPoints[(i + 1) % anchorPoints.length];

      // Only draw line if closed loop or not the last segment
      if (poline.closedLoop || i < anchorPoints.length - 1) {
        paths.push({
          start,
          end,
          index: i,
        });
      }
    }

    return paths;
  }, [anchorPoints, poline.closedLoop]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          {/* Radial gradient for hue wheel */}
          <RadialGradient
            id="hueWheel"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="white" stopOpacity="1" />
            <Stop offset="100%" stopColor="hsl(0, 100%, 50%)" stopOpacity="1" />
          </RadialGradient>

          {/* Gradient for lightness (center to edge) */}
          <RadialGradient
            id="lightnessGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="black" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Color wheel background */}
        <G>
          {/* Draw color wheel segments */}
          {Array.from({ length: 360 }).map((_, i) => {
            const startAngle = (i * Math.PI) / 180;
            const endAngle = ((i + 1) * Math.PI) / 180;

            const x1 = center + wheelRadius * Math.cos(startAngle);
            const y1 = center + wheelRadius * Math.sin(startAngle);

            return (
              <Line
                key={i}
                x1={center}
                y1={center}
                x2={x1}
                y2={y1}
                stroke={`hsl(${i}, 100%, 50%)`}
                strokeWidth={2}
                opacity={0.3}
              />
            );
          })}

          {/* Lightness gradient overlay */}
          <Circle
            cx={center}
            cy={center}
            r={wheelRadius}
            fill="url(#lightnessGradient)"
          />
        </G>

        {/* Connection lines between anchors */}
        {connectionPaths.map((path) => (
          <AnimatedPath
            key={`path-${path.index}`}
            d={`M ${path.start.x} ${path.start.y} L ${path.end.x} ${path.end.y}`}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth={2}
            strokeDasharray="5,5"
          />
        ))}

        {/* Palette color dots (smaller) */}
        {showPaletteColors &&
          paletteColors.map((point, index) => {
            // Skip anchor points (they'll be drawn separately)
            const isAnchor = anchorPoints.some(
              (ap) => Math.abs(ap.x - point.x) < 1 && Math.abs(ap.y - point.y) < 1
            );

            if (isAnchor) return null;

            return (
              <PaletteColorCircle
                key={`palette-${index}`}
                point={point}
                reduceMotion={reduceMotion}
                springConfig={springConfig}
              />
            );
          })}

        {/* Anchor points (larger, more prominent) */}
        {anchorPoints.map((point) => (
          <AnchorPoint
            key={`anchor-${point.index}`}
            point={point}
            reduceMotion={reduceMotion}
            springConfig={springConfig}
          />
        ))}

        {/* Center reference point */}
        <Circle
          cx={center}
          cy={center}
          r={4}
          fill="rgba(128, 128, 128, 0.5)"
          stroke="white"
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});