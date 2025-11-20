import { View } from "react-native";
import { useColors } from "../../context/ColorContext";
import { GenerativeColorHarmonies } from "../../components/GenerativeColorHarmonies";

export default function Interior() {
    const { setPalette } = useColors();

    return (
        <View className="flex-1">
            <GenerativeColorHarmonies
                amount={6}
                onColorsGenerated={(colors) => setPalette(colors)}
            />
        </View>
    );
}
