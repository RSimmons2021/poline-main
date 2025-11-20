import { View, Text, ScrollView } from "react-native";
import { useColors } from "../../context/ColorContext";
import { GenerativeColorWheel } from "../../components/generative/GenerativeColorWheel";

export default function Explore() {
    const { activeColor } = useColors();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
            <View className="flex-1 items-center justify-center py-10">
                <GenerativeColorWheel />
            </View>
        </ScrollView>
    );
}
