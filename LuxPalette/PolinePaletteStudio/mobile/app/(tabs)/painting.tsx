import { View, Text, ScrollView } from "react-native";
import { useColors } from "../../context/ColorContext";

export default function Painting() {
    const { palette } = useColors();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background p-4">
            <Text className="text-3xl font-syne text-foreground mb-6 mt-10">Painting</Text>

            <View className="w-full aspect-[3/4] bg-white p-4 shadow-lg border border-black/5">
                <View className="flex-1 border border-black/10 p-2">
                    {/* Abstract Composition */}
                    <View className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-80" style={{ backgroundColor: palette[0] }} />
                    <View className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-80" style={{ backgroundColor: palette[1] }} />
                    <View className="absolute top-1/2 left-1/2 w-20 h-60 -translate-x-10 -translate-y-20 opacity-80 rotate-45" style={{ backgroundColor: palette[2] }} />
                </View>
            </View>
        </ScrollView>
    );
}
