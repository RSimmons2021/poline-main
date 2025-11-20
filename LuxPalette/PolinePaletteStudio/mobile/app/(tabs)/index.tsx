import { View, ScrollView, Text } from "react-native";
import { GenerativeColorWheel } from "../../components/generative/GenerativeColorWheel";
import { useColors } from "../../context/ColorContext";

export default function Explore() {
    const { palette } = useColors();

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{
                flexGrow: 1,
                paddingVertical: 80,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 40 }}>
                {/* Current Palette */}
                <View style={{ gap: 8 }}>
                    <Text className="text-xs font-syne text-foreground mb-2 text-center">Current</Text>
                    {palette.map((color, i) => (
                        <View
                            key={i}
                            style={{
                                width: 60,
                                height: 60,
                                backgroundColor: color,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: 'rgba(0,0,0,0.1)'
                            }}
                        />
                    ))}
                </View>

                {/* Color Wheel */}
                <GenerativeColorWheel />
            </View>
        </ScrollView>
    );
}
