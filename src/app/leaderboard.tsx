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
    PageTitle,
    Panel,
} from "@/components/serverhub-ui";
import { palette } from "@/constants/serverhub-data";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { toMember } from "@/lib/dashboard-format";

export default function LeaderboardScreen() {
  const { data, isLoading, error, refresh } = useDashboardData();
  const members = (data?.leaderboard || []).map(toMember);

  return (
    <AppScreen>
      <PageTitle title="Leaderboard" subtitle="Members ranked by XP" />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Panel>
        {members.map((member, index) => (
          <LeaderboardRow
            key={member.handle}
            member={member}
            rank={index + 1}
          />
        ))}
        {isLoading && members.length === 0 ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={palette.accent} />
            <Text style={styles.note}>Memuat leaderboard…</Text>
          </View>
        ) : null}
        {!isLoading && members.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.note}>Leaderboard belum tersedia.</Text>
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
      <Text style={styles.note}>
        XP is calculated from message and voice activity.
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  emptyState: { gap: 4 },
  errorText: { color: "#E29B9B", fontSize: 12, lineHeight: 18 },
  retryButton: { alignSelf: "flex-start", paddingVertical: 8 },
  retryText: { color: palette.text, fontSize: 12, fontWeight: "600" },
  note: { color: palette.faint, fontSize: 11, marginTop: -8 },
});
