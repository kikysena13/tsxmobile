import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    AppScreen,
    PageTitle,
    Panel,
    SectionHeading,
} from "@/components/serverhub-ui";
import { palette } from "@/constants/serverhub-data";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { toActivityEvent } from "@/lib/dashboard-format";

export default function ActivityScreen() {
  const { data, isLoading, error, refresh } = useDashboardData();
  const events = (data?.recentActivity || []).map((event) =>
    toActivityEvent(event),
  );

  return (
    <AppScreen>
      <PageTitle title="Activity" subtitle="Recent server events" />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Panel>
        <SectionHeading title="Today" />
        {events.map((event) => {
          return (
            <View key={event.id} style={styles.eventRow}>
              <View style={styles.eventMarker} />
              <View style={styles.eventContent}>
                <Text style={styles.eventSummary}>{event.summary}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
            </View>
          );
        })}
        {isLoading && events.length === 0 ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={palette.accent} />
            <Text style={styles.emptyText}>Memuat aktivitas…</Text>
          </View>
        ) : null}
        {!isLoading && events.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Belum ada aktivitas sejak bot mulai merekam.
            </Text>
            {error ? (
              <Pressable
                accessibilityRole="button"
                onPress={refresh}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Coba lagi</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </Panel>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  emptyState: { gap: 4 },
  emptyText: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  errorText: { color: "#E29B9B", fontSize: 12, lineHeight: 18 },
  retryButton: { alignSelf: "flex-start", paddingVertical: 8 },
  retryText: { color: palette.text, fontSize: 12, fontWeight: "600" },
  eventRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  eventMarker: {
    width: 6,
    height: 6,
    marginTop: 6,
    borderRadius: 3,
    backgroundColor: palette.faint,
  },
  eventContent: {
    flex: 1,
    paddingBottom: 14,
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  eventSummary: { color: palette.text, fontSize: 13, fontWeight: "500" },
  eventTime: { color: palette.faint, fontSize: 11 },
});
