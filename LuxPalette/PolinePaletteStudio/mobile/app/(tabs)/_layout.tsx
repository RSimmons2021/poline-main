import { Tabs, useSegments } from "expo-router";
import { LayoutGrid, Shirt, Armchair, Palette, Library } from "lucide-react-native";
import { View, useWindowDimensions } from "react-native";
import { useColors } from "../../context/ColorContext";
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import { useEffect } from "react";

const TAB_ROUTES = ["index", "fashion", "interior", "painting", "library"];

export default function TabLayout() {
    const { activeColor } = useColors();
    const segments = useSegments();
    const { width } = useWindowDimensions();

    // Calculate tab width dynamically
    const tabWidth = width / 5;
    const dotPosition = useSharedValue(0);

    // Get active tab index from segments
    const activeIndex = (() => {
        const lastSegment = segments[segments.length - 1];
        const route = lastSegment === '(tabs)' ? 'index' : lastSegment;
        const index = TAB_ROUTES.indexOf(route);
        return index === -1 ? 0 : index;
    })();

    useEffect(() => {
        dotPosition.value = withSpring(activeIndex * tabWidth + tabWidth / 2 - 4, {
            damping: 20,
            stiffness: 200,
        });
    }, [activeIndex, tabWidth]);

    const dotStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: dotPosition.value }],
        };
    });

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#f5f0e8",
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

            {/* Moving Dot Indicator - Fixed positioning */}
            <View style={{
                position: 'absolute',
                bottom: 8,
                left: 0,
                right: 0,
                height: 8,
                pointerEvents: 'none'
            }}>
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
