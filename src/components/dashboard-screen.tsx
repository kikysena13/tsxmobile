import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  AppScreen,
  LeaderboardRow,
  MetricCard,
  PageTitle,
  Panel,
  SectionHeading,
} from "@/components/serverhub-ui";
import {
  activitySeries,
  palette,
  topMembers,
  type ChartRange,
} from "@/constants/serverhub-data";

const ranges: { label: string; value: ChartRange }[] = [
  { label: "Day", value: "24h" },
  { label: "Week", value: "7d" },
  { label: "Month", value: "30d" },
];

const chartTotals: Record<ChartRange, string> = {
  "24h": "2,840 today",
  "7d": "18,420 this week",
  "30d": "74,120 this month",
};

export function DashboardScreen() {
  const [range, setRange] = useState<ChartRange>("7d");
  const chart = activitySeries[range];
  const chartMax = Math.max(...chart.map((point) => point.value));

  return (
    <AppScreen>
      <PageTitle
        title="The Cozy Corner"
        subtitle="Server overview · Demo data"
      />

      <View style={styles.metricsGrid}>
        <MetricCard
          label="Total members"
          value="24,892"
          change="Up 8.2% this month"
        />
        <MetricCard
          label="Online now"
          value="3,412"
          change="13.7% of the server"
        />
        <MetricCard
          label="Messages"
          value="128.6k"
          change="Up 12.4% this week"
        />
        <MetricCard label="In voice" value="186" change="Across 12 channels" />
      </View>

      <Panel>
        <View style={styles.chartHeading}>
          <Text style={styles.panelTitle}>Messages</Text>
          <Text style={styles.chartSummary}>{chartTotals[range]}</Text>
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
                        index === chart.length - 1 ? palette.accent : "#454A52",
                      opacity: index === chart.length - 1 ? 1 : 0.8,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.barLabel,
                    index === chart.length - 1 && styles.barLabelActive,
                  ]}
                >
                  {point.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Panel>

      <Panel style={styles.voicePanel}>
        <SectionHeading title="Voice activity" />
        <View style={styles.voiceTopline}>
          <View>
            <Text style={styles.voiceValue}>
              186 <Text style={styles.voiceUnit}>members</Text>
            </Text>
            <Text style={styles.voiceSubtitle}>
              hanging out across 12 channels
            </Text>
          </View>
        </View>
        <View style={styles.voiceChannels}>
          <View style={styles.channelRow}>
            <View style={styles.channelIdentity}>
              <Text style={styles.channelName}>Cozy Lounge</Text>
            </View>
            <Text style={styles.channelCount}>
              42 <Text style={styles.channelMembers}>members</Text>
            </Text>
          </View>
          <View style={styles.channelRow}>
            <View style={styles.channelIdentity}>
              <Text style={styles.channelName}>Game Night</Text>
            </View>
            <Text style={styles.channelCount}>
              28 <Text style={styles.channelMembers}>members</Text>
            </Text>
          </View>
        </View>
      </Panel>

      <Panel>
        <SectionHeading title="Top members" />
        {topMembers.slice(0, 3).map((member, index) => (
          <LeaderboardRow
            key={member.handle}
            member={member}
            rank={index + 1}
            compact
          />
        ))}
      </Panel>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metricsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chartHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  panelTitle: { color: palette.text, fontSize: 14, fontWeight: "600" },
  chartSummary: { color: palette.muted, fontSize: 11, fontWeight: "500" },
  rangeSelector: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: 14,
    marginBottom: 12,
    gap: 16,
  },
  rangeButton: { paddingVertical: 5 },
  rangeButtonActive: {
    borderBottomWidth: 1,
    borderBottomColor: palette.accent,
  },
  rangeText: { color: palette.faint, fontSize: 11, fontWeight: "500" },
  rangeTextActive: { color: palette.text },
  chartArea: { height: 128, position: "relative" },
  chartGuides: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    paddingBottom: 21,
    paddingTop: 2,
  },
  chartGuide: { height: 1, backgroundColor: palette.border, opacity: 0.55 },
  barsRow: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  bar: {
    width: "48%",
    minWidth: 10,
    maxWidth: 24,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barLabel: { color: palette.faint, fontSize: 9, height: 14 },
  barLabelActive: { color: palette.muted, fontWeight: "500" },
  voicePanel: { gap: 0 },
  voiceTopline: { marginBottom: 14 },
  voiceValue: { color: palette.text, fontSize: 22, fontWeight: "600" },
  voiceUnit: { color: palette.muted, fontSize: 11, fontWeight: "400" },
  voiceSubtitle: { color: palette.muted, fontSize: 11, marginTop: 4 },
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
  channelIdentity: { flexDirection: "row", alignItems: "center" },
  channelName: { color: palette.text, fontSize: 11, fontWeight: "500" },
  channelCount: { color: palette.text, fontSize: 11, fontWeight: "500" },
  channelMembers: { color: palette.muted, fontSize: 10, fontWeight: "400" },
});
