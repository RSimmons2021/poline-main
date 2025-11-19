import { View, Text, ScrollView } from "react-native";
import { useColors } from "../../context/ColorContext";

export default function Interior() {
    const { palette } = useColors();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background p-4">
            <Text className="text-3xl font-syne text-foreground mb-6 mt-10">Interior</Text>

            <View className="w-full h-64 rounded-xl overflow-hidden border border-black/5 mb-4">
                {/* Abstract Room Representation */}
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, backgroundColor: palette[0] }} /> {/* Wall */}
                    <View style={{ flex: 1, backgroundColor: palette[1] }} /> {/* Wall */}
                </View>
                <View style={{ height: 60, backgroundColor: palette[2] }} /> {/* Floor */}

                <View className="absolute bottom-10 left-10 w-20 h-20 rounded-lg shadow-lg" style={{ backgroundColor: palette[3] }} /> {/* Furniture */}
            </View>
        </ScrollView>
    );
}
