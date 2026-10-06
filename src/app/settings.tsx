import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import {
    AppScreen,
    PageTitle,
    Panel,
    SectionHeading,
} from "@/components/serverhub-ui";
import { palette } from "@/constants/serverhub-data";

function SettingRow({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: palette.border, true: "#655D79" }}
        thumbColor={value ? palette.accent : "#A5A9B4"}
        accessibilityLabel={title}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [joinAlerts, setJoinAlerts] = useState(true);
  const [moderationAlerts, setModerationAlerts] = useState(false);

  return (
    <AppScreen>
      <PageTitle
        title="Settings"
        subtitle="Dashboard and notification preferences."
      />

      <Panel>
        <SectionHeading title="Server" />
        <View style={styles.serverRow}>
          <View style={styles.serverInfo}>
            <Text style={styles.serverName}>The Cozy Corner</Text>
            <Text style={styles.serverMeta}>Demo data · Discord</Text>
          </View>
        </View>
      </Panel>

      <Panel>
        <SectionHeading title="Notifications" />
        <SettingRow
          title="Weekly server report"
          description="A summary of growth and activity every Monday."
          value={weeklyReport}
          onValueChange={setWeeklyReport}
        />
        <SettingRow
          title="New member alerts"
          description="Get notified when someone joins your community."
          value={joinAlerts}
          onValueChange={setJoinAlerts}
        />
        <SettingRow
          title="Moderation alerts"
          description="Know when AutoMod flags a message."
          value={moderationAlerts}
          onValueChange={setModerationAlerts}
        />
      </Panel>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  serverRow: { flexDirection: "row", alignItems: "center" },
  serverInfo: { flex: 1, gap: 4 },
  serverName: { color: palette.text, fontSize: 14, fontWeight: "600" },
  serverMeta: { color: palette.muted, fontSize: 11 },
  settingRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
    paddingVertical: 10,
  },
  settingCopy: { flex: 1, gap: 5 },
  settingTitle: { color: palette.text, fontSize: 12, fontWeight: "700" },
  settingDescription: { color: palette.muted, fontSize: 10, lineHeight: 15 },
});
