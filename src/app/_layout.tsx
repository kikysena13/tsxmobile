import { DarkTheme, Tabs, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";

import { palette } from "@/constants/serverhub-data";

const tabOptions = {
  headerShown: false,
  tabBarActiveTintColor: palette.accent,
  tabBarInactiveTintColor: palette.muted,
  tabBarStyle: {
    height: 68,
    paddingTop: 7,
    paddingBottom: 8,
    backgroundColor: palette.surface,
    borderTopColor: palette.border,
  },
  tabBarLabelStyle: { fontSize: 10, fontWeight: "600" as const },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar style="light" />
      <Tabs screenOptions={tabOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 19 }}>▦</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: "Leaderboard",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 19 }}>♙</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: "Activity",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 19 }}>◷</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 19 }}>⚙</Text>
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
