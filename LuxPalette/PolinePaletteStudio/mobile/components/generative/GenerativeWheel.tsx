import React, { useState, useEffect } from "react";
import { View, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    FadeIn,
    FadeOut
} from "react-native-reanimated";
import { useColors } from "../../context/ColorContext";
import GlassDropdown from "../ui/GlassDropdown";
import { RefreshCw, Shuffle, Save } from "lucide-react-native";
import { BlurView } from "expo-blur";

const WHEEL_STYLES = [
    "Copic Wheel",
    "Poline Wheel",
    "Kandinsky Spiral",
    "Mondrian Block",
    "Bauhaus Grid"
];

const { width } = Dimensions.get("window");
const WHEEL_SIZE = Math.min(width * 0.8, 350);

// SVG Helpers
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y,
        "L", start.x, start.y
    ].join(" ");
    return d;
}

export default function GenerativeWheel() {
    const { palette, activeColor, setActiveColor, generateNewPalette, saveCurrentPalette } = useColors();
    const [wheelStyle, setWheelStyle] = useState("Copic Wheel");

    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 20000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedWheelStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const renderCopicWheel = () => {
        const center = WHEEL_SIZE / 2;
        const radius = WHEEL_SIZE / 2;
        const anglePerSlice = 360 / palette.length;

        return (
            <Animated.View style={[{ width: WHEEL_SIZE, height: WHEEL_SIZE }, animatedWheelStyle]}>
                <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
                    {palette.map((color, i) => {
                        const startAngle = i * anglePerSlice;
                        const endAngle = (i + 1) * anglePerSlice;
                        const pathData = describeArc(center, center, radius, startAngle, endAngle);
                        return (
                            <Path
                                key={i}
                                d={pathData}
                                fill={color}
                                onPress={() => setActiveColor(color)}
                            />
                        );
                    })}
                </Svg>
            </Animated.View>
        );
    };

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
            <View className="items-center justify-center" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
                {palette.map((color, i) => (
                    <Animated.View
                        key={i}
                        className="absolute rounded-full border border-black/5 shadow-sm"
                        style={{
                            width: (palette.length - i) * 40,
                            height: (palette.length - i) * 40,
                            backgroundColor: color,
                            zIndex: i,
                            // Simple animation simulation
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
        <View className="w-full items-center justify-center py-10">
            {/* Controls */}
            <View className="absolute top-0 z-50 flex-row gap-4 items-center">
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
                    onPress={generateNewPalette}
                    className="p-2 rounded-lg bg-white/30 border border-white/20"
                >
                    <Shuffle size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="mt-20 items-center justify-center">
                {wheelStyle === "Copic Wheel" && renderCopicWheel()}
                {wheelStyle === "Poline Wheel" && renderPolineWheel()}
                {wheelStyle === "Kandinsky Spiral" && renderKandinsky()}
                {(wheelStyle === "Mondrian Block" || wheelStyle === "Bauhaus Grid") && renderGrid()}
            </View>

            {/* Active Color Indicator */}
            <View className="absolute bottom-0 pointer-events-none">
                <BlurView intensity={20} className="w-16 h-16 rounded-full items-center justify-center overflow-hidden border border-black/5">
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: activeColor }} />
                </BlurView>
            </View>
        </View>
    );
}
