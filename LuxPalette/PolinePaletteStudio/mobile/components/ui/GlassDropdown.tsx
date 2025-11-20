import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { ChevronDown } from "lucide-react-native";

interface GlassDropdownProps {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
}

export default function GlassDropdown({ options, selected, onSelect }: GlassDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const handleSelect = (option: string) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <View>
            <TouchableOpacity
                onLayout={(event) => {
                    const { x, y, width, height } = event.nativeEvent.layout;
                    setButtonLayout({ x, y, width, height });
                }}
                onPress={() => setIsOpen(!isOpen)}
                className="px-4 py-2 rounded-lg border border-white/20 bg-white/30 flex-row items-center gap-2"
            >
                <Text className="text-sm font-space">{selected}</Text>
                <ChevronDown size={16} color="#000" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => setIsOpen(false)}
                >
                    <View
                        style={{
                            position: 'absolute',
                            top: buttonLayout.y + buttonLayout.height + 5,
                            left: buttonLayout.x,
                            minWidth: 200,
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}
                    >
                        <BlurView intensity={80} tint="light" style={{ borderRadius: 8 }}>
                            <View className="border border-white/20 rounded-lg overflow-hidden">
                                {options.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleSelect(option)}
                                        className="px-4 py-3 border-b border-white/10"
                                        style={{
                                            backgroundColor: option === selected ? 'rgba(0,0,0,0.05)' : 'transparent'
                                        }}
                                    >
                                        <Text className="text-sm font-space">{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </BlurView>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
