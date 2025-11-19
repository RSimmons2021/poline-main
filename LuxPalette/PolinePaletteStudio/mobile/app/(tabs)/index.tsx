import { View, Text, ScrollView } from "react-native";
import GenerativeWheel from "../../components/generative/GenerativeWheel";
import { useColors } from "../../context/ColorContext";

export default function Explore() {
    const { activeColor } = useColors();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-3xl font-syne text-foreground mb-2">Explore</Text>
                <Text className="text-sm font-space text-muted-foreground mb-8">
                    Discover new color harmonies
                </Text>

                <GenerativeWheel />

                <View className="mt-8 p-4 rounded-lg border border-black/5 bg-white/30 w-full max-w-xs">
                    <Text className="text-xs font-space text-muted-foreground uppercase tracking-widest mb-2">Active Color</Text>
                    <Text className="text-xl font-space font-bold">{activeColor}</Text>
                </View>
            </View>
        </ScrollView>
    );
}
