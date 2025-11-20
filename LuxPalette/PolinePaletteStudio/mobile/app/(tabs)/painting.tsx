import { View, Dimensions } from "react-native";
import { useColors } from "../../context/ColorContext";
import { GenerativePoster } from "../../components/generative/GenerativePoster";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Painting() {
    const { palette } = useColors();

    return (
        <View className="flex-1 bg-background">
            <GenerativePoster
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT}
                colors={palette}
                animate={true}
            />
        </View>
    );
}
