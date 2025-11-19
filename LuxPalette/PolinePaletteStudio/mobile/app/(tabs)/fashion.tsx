import { View, Text, ScrollView } from "react-native";
import { useColors } from "../../context/ColorContext";

export default function Fashion() {
    const { palette } = useColors();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background p-4">
            <Text className="text-3xl font-syne text-foreground mb-6 mt-10">Fashion</Text>

            <View className="flex-row flex-wrap gap-4 justify-center">
                {/* Placeholder Fashion Cards */}
                <View className="w-40 h-60 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <View style={{ flex: 3, backgroundColor: palette[0] }} />
                    <View style={{ flex: 1, backgroundColor: palette[1] }} />
                </View>
                <View className="w-40 h-60 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <View style={{ flex: 2, backgroundColor: palette[2] }} />
                    <View style={{ flex: 2, backgroundColor: palette[3] }} />
                </View>
                <View className="w-40 h-60 rounded-2xl bg-white shadow-sm overflow-hidden">
                    <View style={{ flex: 4, backgroundColor: palette[4] || palette[0] }} />
                    <View style={{ flex: 1, backgroundColor: palette[0] }} />
                </View>
            </View>
        </ScrollView>
    );
}
