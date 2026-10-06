import { StyleSheet, Text } from "react-native";

import {
    AppScreen,
    LeaderboardRow,
    PageTitle,
    Panel,
} from "@/components/serverhub-ui";
import { palette, topMembers } from "@/constants/serverhub-data";

export default function LeaderboardScreen() {
  return (
    <AppScreen>
      <PageTitle
        title="Leaderboard"
        subtitle="Members ranked by XP this month."
      />

      <Panel>
        {topMembers.map((member, index) => (
          <LeaderboardRow
            key={member.handle}
            member={member}
            rank={index + 1}
          />
        ))}
      </Panel>
      <Text style={styles.note}>
        XP is calculated from message and voice activity.
      </Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  note: { color: palette.faint, fontSize: 11, marginTop: -8 },
});
