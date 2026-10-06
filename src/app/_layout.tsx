import { DarkTheme, Tabs, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { palette } from "@/constants/serverhub-data";

const tabOptions = {
  headerShown: false,
  tabBarActiveTintColor: palette.accent,
  tabBarInactiveTintColor: palette.muted,
  tabBarStyle: {
    height: 64,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: palette.background,
    borderTopColor: palette.border,
  },
  tabBarLabelStyle: { fontSize: 11, fontWeight: "500" as const },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar style="light" />
      <Tabs screenOptions={tabOptions}>
        <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
        <Tabs.Screen name="leaderboard" options={{ title: "Leaderboard" }} />
        <Tabs.Screen name="activity" options={{ title: "Activity" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>
    </ThemeProvider>
  );
}
