import { DarkTheme, Tabs, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { palette } from "@/constants/serverhub-data";
import {
    ServerHubAuthGate,
    ServerHubAuthProvider,
} from "@/context/serverhub-auth";

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
      <ServerHubAuthProvider>
        <ServerHubAuthGate>
          <Tabs screenOptions={tabOptions}>
            <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
            <Tabs.Screen
              name="leaderboard"
              options={{ title: "Leaderboard" }}
            />
            <Tabs.Screen name="activity" options={{ title: "Activity" }} />
            <Tabs.Screen name="settings" options={{ title: "Settings" }} />
          </Tabs>
        </ServerHubAuthGate>
      </ServerHubAuthProvider>
    </ThemeProvider>
  );
}
