import "../global.css";
import { Slot } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ColorProvider } from "../context/ColorContext";

/*
import { 
  useFonts, 
  Syne_400Regular 
} from "@expo-google-fonts/syne";
import { SpaceGrotesk_400Regular } from "@expo-google-fonts/space-grotesk";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import { Inter_400Regular } from "@expo-google-fonts/inter";
*/

export default function Layout() {
    /*
    const [fontsLoaded] = useFonts({
      Syne_400Regular,
      SpaceGrotesk_400Regular,
      DMSerifDisplay_400Regular,
      Inter_400Regular,
    });
  
    if (!fontsLoaded) {
      return (
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" color="#000" />
        </View>
      );
    }
    */

    return (
        <ColorProvider>
            <View style={{ flex: 1 }}>
                <Slot />
                <StatusBar style="auto" />
            </View>
        </ColorProvider>
    );
}
