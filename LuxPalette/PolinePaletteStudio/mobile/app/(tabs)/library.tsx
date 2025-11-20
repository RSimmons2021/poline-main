import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useColors } from "../../context/ColorContext";
import ColorCombos from "../../components/ColorCombos";

export default function Library() {
    const { savedPalettes, setPalette, deletePalette } = useColors();

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
        >
            <Text className="text-3xl font-syne text-foreground mb-6 mt-10">Library</Text>

            {/* Color Combinations - Scrollable */}
            <ColorCombos />

            {/* Saved Palettes */}
            <View className="mt-8">
                <Text className="text-xl font-syne text-foreground mb-4">Saved Palettes</Text>
                {savedPalettes.length === 0 ? (
                    <Text className="text-muted-foreground font-space">No saved palettes yet</Text>
                ) : (
                    savedPalettes.map((savedPalette) => (
                        <View key={savedPalette.id} className="mb-4 p-4 bg-white/30 rounded-lg border border-white/20">
                            <Text className="text-sm font-space mb-2">{savedPalette.name}</Text>
                            <View className="flex-row gap-2 mb-2">
                                {savedPalette.colors.map((color: string, i: number) => (
                                    <View
                                        key={i}
                                        style={{ backgroundColor: color }}
                                        className="w-12 h-12 rounded-lg border border-black/5"
                                    />
                                ))}
                            </View>
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={() => setPalette(savedPalette.colors)}
                                    className="flex-1 p-2 bg-black/10 rounded-lg"
                                >
                                    <Text className="text-center font-space text-xs">Apply</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deletePalette(savedPalette.id)}
                                    className="flex-1 p-2 bg-red-500/20 rounded-lg"
                                >
                                    <Text className="text-center font-space text-xs text-red-700">Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}
