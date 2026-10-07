import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    AppScreen,
    LeaderboardRow,
    MetricCard,
    PageTitle,
    Panel,
    SectionHeading,
} from "@/components/serverhub-ui";
import { formatNumber, palette } from "@/constants/serverhub-data";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { toMember } from "@/lib/dashboard-format";
import type { ActivityRange } from "@/lib/serverhub-api";

const ranges: { label: string; value: ActivityRange }[] = [
  { label: "Day", value: "24h" },
  { label: "Week", value: "7d" },
  { label: "Month", value: "30d" },
];

export function DashboardScreen() {
  const [range, setRange] = useState<ActivityRange>("7d");
  const { data, isLoading, error, refresh } = useDashboardData();
  const chart = data?.messageActivity[range] || [];
  const chartMax = Math.max(1, ...chart.map((point) => point.value));
  const chartTotal = chart.reduce((total, point) => total + point.value, 0);
  const members = (data?.leaderboard || []).map(toMember);

  return (
    <AppScreen>
      <PageTitle
        title={data?.server.name || "Server overview"}
        subtitle="Data langsung dari server Discord"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!data ? (
        <Panel>
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={palette.accent} />
              <Text style={styles.emptyText}>
                Menghubungkan ke bot Discord…
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.emptyText}>
                Data dashboard belum tersedia.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={refresh}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Coba lagi</Text>
              </Pressable>
            </>
          )}
        </Panel>
      ) : null}

      <View style={styles.metricsGrid}>
        <MetricCard
          label="Total members"
          value={data ? formatNumber(data.metrics.memberCount) : "—"}
          change="Server members"
        />
        <MetricCard
          label="Online now"
          value={
            data?.metrics.onlineCount === null || !data
              ? "—"
              : formatNumber(data.metrics.onlineCount)
          }
          change={
            !data || data.metrics.onlineCount === null
              ? "Presence intent belum aktif"
              : "Online members"
          }
        />
        <MetricCard
          label="Messages"
          value={data ? formatNumber(data.metrics.messageCount) : "—"}
          change="Total sejak tracking aktif"
        />
        <MetricCard
          label="In voice"
          value={data ? formatNumber(data.metrics.voiceCount) : "—"}
          change={`${data?.voiceChannels.length || 0} active channels`}
        />
      </View>

      <Panel>
        <View style={styles.chartHeading}>
          <Text style={styles.panelTitle}>Messages</Text>
          <Text style={styles.chartSummary}>
            {data ? `${formatNumber(chartTotal)} · ${range}` : "—"}
          </Text>
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
          {!data ? null : chartTotal > 0 ? (
            <View style={styles.barsRow}>
              {chart.map((point, index) => (
                <View key={`${range}-${point.label}`} style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max((point.value / chartMax) * 100, 12)}%`,
                        backgroundColor:
                          index === chart.length - 1
                            ? palette.accent
                            : "#454A52",
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
          ) : (
            <View style={styles.chartEmpty}>
              <Text style={styles.emptyText}>
                Riwayat pesan mulai terkumpul setelah bot aktif.
              </Text>
            </View>
          )}
        </View>
      </Panel>

      <Panel style={styles.voicePanel}>
        <SectionHeading title="Voice activity" />
        <View style={styles.voiceTopline}>
          <View>
            <Text style={styles.voiceValue}>
              {data ? formatNumber(data.metrics.voiceCount) : "—"}{" "}
              <Text style={styles.voiceUnit}>members</Text>
            </Text>
            <Text style={styles.voiceSubtitle}>
              across {data?.voiceChannels.length || 0} active channels
            </Text>
          </View>
        </View>
        <View style={styles.voiceChannels}>
          {(data?.voiceChannels || []).map((channel) => (
            <View key={channel.name} style={styles.channelRow}>
              <View style={styles.channelIdentity}>
                <Text style={styles.channelName}>{channel.name}</Text>
              </View>
              <Text style={styles.channelCount}>
                {formatNumber(channel.count)}{" "}
                <Text style={styles.channelMembers}>members</Text>
              </Text>
            </View>
          ))}
          {data && data.voiceChannels.length === 0 ? (
            <Text style={styles.emptyText}>
              Tidak ada member di voice saat ini.
            </Text>
          ) : null}
        </View>
      </Panel>

      <Panel>
        <SectionHeading title="Top members" />
        {members.length ? (
          members
            .slice(0, 3)
            .map((member, index) => (
              <LeaderboardRow
                key={member.handle}
                member={member}
                rank={index + 1}
                compact
              />
            ))
        ) : (
          <Text style={styles.emptyText}>Leaderboard belum tersedia.</Text>
        )}
      </Panel>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  emptyText: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  errorText: { color: "#E29B9B", fontSize: 12, lineHeight: 18 },
  retryButton: { alignSelf: "flex-start", paddingVertical: 8, marginTop: 6 },
  retryText: { color: palette.text, fontSize: 12, fontWeight: "600" },
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
  chartEmpty: { height: 90, justifyContent: "center", alignItems: "center" },
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
