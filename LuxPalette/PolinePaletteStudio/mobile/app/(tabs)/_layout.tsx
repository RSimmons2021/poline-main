import { Tabs } from "expo-router";
import { LayoutGrid, Shirt, Armchair, Palette, Library } from "lucide-react-native";
import { View } from "react-native";
import { useColors } from "../../context/ColorContext";

export default function TabLayout() {
    const { activeColor } = useColors();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#f5f0e8", // bg-background
                    borderTopColor: "rgba(0,0,0,0.1)",
                    height: 60,
                    paddingBottom: 10,
                },
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: "#9ca3af",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="fashion"
                options={{
                    title: "Fashion",
                    tabBarIcon: ({ color }) => <Shirt size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="interior"
                options={{
                    title: "Interior",
                    tabBarIcon: ({ color }) => <Armchair size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="painting"
                options={{
                    title: "Painting",
                    tabBarIcon: ({ color }) => <Palette size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: "Library",
                    tabBarIcon: ({ color }) => <Library size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
