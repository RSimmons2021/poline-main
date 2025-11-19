import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useColors } from "../../context/ColorContext";
import { Trash2 } from "lucide-react-native";

export default function Library() {
    const { savedPalettes, deletePalette, setPalette } = useColors();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background p-4">
            <Text className="text-3xl font-syne text-foreground mb-6 mt-10">Library</Text>

            {savedPalettes.length === 0 ? (
                <View className="flex-1 items-center justify-center opacity-50">
                    <Text className="font-space">No saved palettes yet.</Text>
                </View>
            ) : (
                <View className="gap-4">
                    {savedPalettes.map((saved) => (
                        <TouchableOpacity
                            key={saved.id}
                            className="bg-white p-4 rounded-xl shadow-sm border border-black/5"
                            onPress={() => setPalette(saved.colors)}
                        >
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="font-space font-bold text-lg">{saved.name}</Text>
                                <TouchableOpacity onPress={() => deletePalette(saved.id)}>
                                    <Trash2 size={18} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-row h-12 rounded-lg overflow-hidden">
                                {saved.colors.map((c, i) => (
                                    <View key={i} style={{ flex: 1, backgroundColor: c }} />
                                ))}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}
