import { View } from "react-native";
import { GenerativeColorWheel } from "../../components/generative/GenerativeColorWheel";

export default function Explore() {
    return (
        <View className="flex-1 bg-background items-center justify-center">
            <GenerativeColorWheel />
        </View>
    );
}
