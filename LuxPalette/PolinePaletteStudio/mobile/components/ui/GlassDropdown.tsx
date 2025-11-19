import React, { useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from "react-native-reanimated";
import { ChevronDown } from "lucide-react-native";
import { clsx } from "clsx";

interface GlassDropdownProps {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
}

export default function GlassDropdown({ options, selected, onSelect }: GlassDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rotate = useSharedValue(0);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        rotate.value = withTiming(isOpen ? 0 : 180);
    };

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotate.value}deg` }],
        };
    });

    return (
        <View className="relative z-50">
            <Pressable onPress={toggleDropdown}>
                <BlurView intensity={30} tint="light" className="px-4 py-2 rounded-lg flex-row items-center gap-2 overflow-hidden border border-white/20">
                    <Text className="text-sm font-space text-foreground">{selected}</Text>
                    <Animated.View style={animatedIconStyle}>
                        <ChevronDown size={14} color="#000" />
                    </Animated.View>
                </BlurView>
            </Pressable>

            {isOpen && (
                <View className="absolute top-full mt-2 left-0 w-48 rounded-lg overflow-hidden shadow-xl border border-white/20 z-50">
                    <BlurView intensity={80} tint="light" className="py-1">
                        {options.map((option) => (
                            <Pressable
                                key={option}
                                onPress={() => {
                                    onSelect(option);
                                    toggleDropdown();
                                }}
                                className={clsx(
                                    "px-4 py-3",
                                    selected === option ? "bg-black/5" : ""
                                )}
                            >
                                <Text className={clsx(
                                    "text-sm font-space text-foreground",
                                    selected === option ? "font-bold" : ""
                                )}>
                                    {option}
                                </Text>
                            </Pressable>
                        ))}
                    </BlurView>
                </View>
            )}
        </View>
    );
}
