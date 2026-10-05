import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
    AppScreen,
    LeaderboardRow,
    MetricCard,
    PageTitle,
    Panel,
    SectionHeading,
    StatusPill,
} from "@/components/serverhub-ui";
import {
    activitySeries,
    palette,
    topMembers,
    type ChartRange,
} from "@/constants/serverhub-data";

const ranges: { label: string; value: ChartRange }[] = [
  { label: "24H", value: "24h" },
  { label: "7 DAYS", value: "7d" },
  { label: "30 DAYS", value: "30d" },
];

export function DashboardScreen() {
  const [range, setRange] = useState<ChartRange>("7d");
  const chart = activitySeries[range];
  const chartMax = Math.max(...chart.map((point) => point.value));

  return (
    <AppScreen>
      <View style={styles.brandRow}>
        <View style={styles.brandLockup}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>S</Text>
          </View>
          <View>
            <Text style={styles.brandName}>ServerHub</Text>
            <Text style={styles.brandCaption}>SERVER ANALYTICS</Text>
          </View>
        </View>
        <View style={styles.profileButton}>
          <Text style={styles.profileInitial}>A</Text>
        </View>
      </View>

      <View style={styles.serverCard}>
        <View style={styles.serverIdentity}>
          <View style={styles.serverIcon}>
            <Text style={styles.serverIconText}>C</Text>
          </View>
          <View style={styles.serverCopy}>
            <Text style={styles.serverCaption}>YOUR DISCORD SERVER</Text>
            <Text style={styles.serverName}>The Cozy Corner</Text>
          </View>
        </View>
        <StatusPill>ONLINE</StatusPill>
      </View>

      <PageTitle
        title="Good evening, Alex"
        subtitle="Here’s what’s happening in your community."
      />

      <View style={styles.metricsGrid}>
        <MetricCard
          icon="◎"
          label="Total members"
          value="24,892"
          change="↗  8.2% this month"
          accent={palette.accent}
          iconBackground={palette.accentSoft}
        />
        <MetricCard
          icon="↗"
          label="Online now"
          value="3,412"
          change="13.7% of members"
          accent={palette.green}
          iconBackground={palette.greenSoft}
        />
        <MetricCard
          icon="✉"
          label="Messages"
          value="128.6k"
          change="↗  12.4% this week"
          accent={palette.blue}
          iconBackground={palette.blueSoft}
        />
        <MetricCard
          icon="♫"
          label="In voice"
          value="186"
          change="Across 12 channels"
          accent={palette.orange}
          iconBackground={palette.orangeSoft}
        />
      </View>

      <Panel>
        <View style={styles.chartHeading}>
          <View>
            <Text style={styles.panelTitle}>Message activity</Text>
            <Text style={styles.chartSummary}>
              18,420 <Text style={styles.chartDelta}>↗ 12.4%</Text>
            </Text>
          </View>
          <Text style={styles.chartCaption}>MESSAGES</Text>
        </View>
        <View style={styles.rangeSelector}>
          {ranges.map((item) => (
            <Pressable
              key={item.value}
              accessibilityRole="button"
              accessibilityState={{ selected: range === item.value }}
              onPress={() => setRange(item.value)}
              style={[
                styles.rangeButton,
                range === item.value && styles.rangeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.rangeText,
                  range === item.value && styles.rangeTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.chartArea}>
          <View style={styles.chartGuides}>
            <View style={styles.chartGuide} />
            <View style={styles.chartGuide} />
            <View style={styles.chartGuide} />
          </View>
          <View style={styles.barsRow}>
            {chart.map((point, index) => (
              <View key={`${range}-${point.label}`} style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max((point.value / chartMax) * 100, 12)}%`,
                      backgroundColor:
                        index === chart.length - 2 ? palette.accent : "#514A7B",
                      opacity: index === chart.length - 2 ? 1 : 0.76,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.barLabel,
                    index === chart.length - 2 && styles.barLabelActive,
                  ]}
                >
                  {point.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.chartFootnote}>
          <View style={styles.legendDot} />
          <Text style={styles.footnoteText}>
            {range === "24h"
              ? "Messages by hour"
              : range === "7d"
                ? "Messages this week"
                : "Messages over the last 30 days"}
          </Text>
          <Text style={styles.footnoteText}>Demo data</Text>
        </View>
      </Panel>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Voice activity</Text>
        <Text style={styles.liveCaption}>● LIVE</Text>
      </View>
      <Panel style={styles.voicePanel}>
        <View style={styles.voiceTopline}>
          <View>
            <Text style={styles.voiceValue}>
              186 <Text style={styles.voiceUnit}>members</Text>
            </Text>
            <Text style={styles.voiceSubtitle}>
              hanging out across 12 channels
            </Text>
          </View>
          <View style={styles.voiceIcon}>
            <Text style={styles.voiceIconText}>♫</Text>
          </View>
        </View>
        <View style={styles.voiceChannels}>
          <View style={styles.channelRow}>
            <View style={styles.channelIdentity}>
              <Text style={styles.channelGlyph}>♫</Text>
              <Text style={styles.channelName}>Cozy Lounge</Text>
            </View>
            <Text style={styles.channelCount}>
              42 <Text style={styles.channelMembers}>members</Text>
            </Text>
          </View>
          <View style={styles.channelRow}>
            <View style={styles.channelIdentity}>
              <Text style={styles.channelGlyph}>♫</Text>
              <Text style={styles.channelName}>Game Night</Text>
            </View>
            <Text style={styles.channelCount}>
              28 <Text style={styles.channelMembers}>members</Text>
            </Text>
          </View>
        </View>
      </Panel>

      <Panel>
        <SectionHeading title="Top members" action="View leaderboard  →" />
        {topMembers.slice(0, 3).map((member, index) => (
          <LeaderboardRow
            key={member.handle}
            member={member}
            rank={index + 1}
            compact
          />
        ))}
      </Panel>

      <Text style={styles.demoNote}>
        Dashboard preview · Demo data, ready for your Discord bot.
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLockup: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: {
    height: 37,
    width: 37,
    borderRadius: 13,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkText: { color: "#FFFFFF", fontSize: 19, fontWeight: "900" },
  brandName: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  brandCaption: {
    color: palette.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.25,
    marginTop: 2,
  },
  profileButton: {
    width: 37,
    height: 37,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: { color: "#D7D2FF", fontSize: 13, fontWeight: "800" },
  serverCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  serverIdentity: { flexDirection: "row", alignItems: "center", gap: 11 },
  serverIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: palette.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  serverIconText: { color: "#C4BCFF", fontSize: 17, fontWeight: "800" },
  serverCopy: { gap: 4 },
  serverCaption: {
    color: palette.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },
  serverName: { color: palette.text, fontSize: 13, fontWeight: "700" },
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  chartHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  panelTitle: { color: palette.text, fontSize: 15, fontWeight: "700" },
  chartSummary: {
    color: palette.text,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 7,
  },
  chartDelta: { color: palette.green, fontSize: 11, fontWeight: "700" },
  chartCaption: {
    color: palette.faint,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  rangeSelector: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: 18,
    marginBottom: 14,
    padding: 3,
    borderRadius: 10,
    backgroundColor: palette.background,
  },
  rangeButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  rangeButtonActive: { backgroundColor: palette.surfaceRaised },
  rangeText: { color: palette.muted, fontSize: 9, fontWeight: "700" },
  rangeTextActive: { color: palette.text },
  chartArea: { height: 142, position: "relative" },
  chartGuides: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    paddingBottom: 23,
    paddingTop: 2,
  },
  chartGuide: { height: 1, backgroundColor: palette.border, opacity: 0.8 },
  barsRow: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 7,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7,
  },
  bar: {
    width: "55%",
    minWidth: 10,
    maxWidth: 24,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  barLabel: { color: palette.faint, fontSize: 9, height: 15 },
  barLabelActive: { color: palette.text, fontWeight: "700" },
  chartFootnote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 11,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.accent,
  },
  footnoteText: { color: palette.muted, fontSize: 9 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: -12,
  },
  sectionTitle: { color: palette.text, fontSize: 16, fontWeight: "700" },
  liveCaption: {
    color: palette.green,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  voicePanel: { gap: 15 },
  voiceTopline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  voiceValue: { color: palette.text, fontSize: 24, fontWeight: "800" },
  voiceUnit: { color: palette.muted, fontSize: 11, fontWeight: "500" },
  voiceSubtitle: { color: palette.muted, fontSize: 11, marginTop: 4 },
  voiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: palette.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  voiceIconText: { color: palette.blue, fontSize: 19, fontWeight: "800" },
  voiceChannels: {
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 5,
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  channelIdentity: { flexDirection: "row", alignItems: "center", gap: 8 },
  channelGlyph: { color: palette.blue, fontSize: 12 },
  channelName: { color: palette.text, fontSize: 11, fontWeight: "600" },
  channelCount: { color: palette.text, fontSize: 11, fontWeight: "700" },
  channelMembers: { color: palette.muted, fontSize: 9, fontWeight: "500" },
  demoNote: {
    color: palette.faint,
    fontSize: 10,
    textAlign: "center",
    marginTop: -12,
  },
});
