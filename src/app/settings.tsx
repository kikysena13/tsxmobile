import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import {
    AppScreen,
    PageTitle,
    Panel,
    SectionHeading,
    StatusPill,
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
        trackColor={{ false: palette.border, true: "#51459A" }}
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
  const [compactNumbers, setCompactNumbers] = useState(true);

  return (
    <AppScreen>
      <View style={styles.topLine}>
        <Text style={styles.brand}>
          SERVERHUB <Text style={styles.brandDot}>/</Text> COMMUNITY
        </Text>
        <StatusPill color={palette.blue}>CONNECTED</StatusPill>
      </View>
      <PageTitle
        eyebrow="Make it yours"
        title="Settings"
        subtitle="Manage your dashboard preferences and server connection."
      />

      <Panel>
        <SectionHeading title="Connected server" />
        <View style={styles.serverRow}>
          <View style={styles.serverBadge}>
            <Text style={styles.serverBadgeText}>C</Text>
          </View>
          <View style={styles.serverInfo}>
            <Text style={styles.serverName}>The Cozy Corner</Text>
            <Text style={styles.serverMeta}>24,892 members · Discord</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.connectionNote}>
          Bot connected · Last synced just now
        </Text>
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

      <Panel>
        <SectionHeading title="Dashboard" />
        <SettingRow
          title="Compact numbers"
          description="Show large values in a shorter format."
          value={compactNumbers}
          onValueChange={setCompactNumbers}
        />
      </Panel>
      <Text style={styles.version}>SERVERHUB · VERSION 1.0.0 · DEMO MODE</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  brandDot: { color: palette.accent },
  serverRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  serverBadge: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.accentSoft,
    borderWidth: 1,
    borderColor: "#3B345E",
  },
  serverBadgeText: { color: "#C3BAFF", fontSize: 18, fontWeight: "800" },
  serverInfo: { flex: 1, gap: 5 },
  serverName: { color: palette.text, fontSize: 13, fontWeight: "700" },
  serverMeta: { color: palette.muted, fontSize: 11 },
  chevron: { color: palette.faint, fontSize: 25, marginRight: 5 },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginTop: 15,
    marginBottom: 12,
  },
  connectionNote: { color: palette.green, fontSize: 11, fontWeight: "600" },
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
  version: {
    color: palette.faint,
    fontSize: 9,
    letterSpacing: 1.1,
    textAlign: "center",
    marginTop: -6,
  },
});
