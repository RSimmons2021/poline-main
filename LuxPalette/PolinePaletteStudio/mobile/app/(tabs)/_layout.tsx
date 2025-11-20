import { Tabs, usePathname } from "expo-router";
import { LayoutGrid, Shirt, Armchair, Palette, Library } from "lucide-react-native";
import { View } from "react-native";
import { useColors } from "../../context/ColorContext";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useMemo } from "react";

const TAB_ROUTES = ["index", "fashion", "interior", "painting", "library"];

export default function TabLayout() {
    const { activeColor } = useColors();
    const pathname = usePathname();

    // Calculate dot position based on active tab
    const activeIndex = useMemo(() => {
        const route = pathname.split('/').pop() || 'index';
        const index = TAB_ROUTES.indexOf(route === '' ? 'index' : route);
        return index === -1 ? 0 : index;
    }, [pathname]);

    const dotStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: withSpring(activeIndex * 75, { damping: 15, stiffness: 150 }) }],
        };
    });

    return (
        <>
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

            {/* Moving Dot Indicator */}
            <View style={{ position: 'absolute', bottom: 5, left: 37.5, right: 0, height: 4, alignItems: 'flex-start' }}>
                <Animated.View
                    style={[
                        {
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: activeColor,
                        },
                        dotStyle
                    ]}
                />
            </View>
        </>
    );
}
