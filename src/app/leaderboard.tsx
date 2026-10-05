import { StyleSheet, Text, View } from "react-native";

import {
    AppScreen,
    LeaderboardRow,
    PageTitle,
    Panel,
    SectionHeading,
    StatusPill,
} from "@/components/serverhub-ui";
import { palette, topMembers } from "@/constants/serverhub-data";

export default function LeaderboardScreen() {
  return (
    <AppScreen>
      <View style={styles.topLine}>
        <Text style={styles.brand}>
          SERVERHUB <Text style={styles.brandDot}>/</Text> COMMUNITY
        </Text>
        <StatusPill>LIVE DATA</StatusPill>
      </View>
      <PageTitle
        eyebrow="Community pulse"
        title="Leaderboard"
        subtitle="The people making this server feel like home."
      />

      <Panel>
        <SectionHeading title="Top members" action="This month  ⌄" />
        <Text style={styles.panelHint}>
          Ranked by XP earned from messages and voice activity.
        </Text>
        {topMembers.map((member, index) => (
          <LeaderboardRow
            key={member.handle}
            member={member}
            rank={index + 1}
          />
        ))}
      </Panel>

      <Panel style={styles.highlight}>
        <Text style={styles.highlightEyebrow}>YOUR COMMUNITY</Text>
        <Text style={styles.highlightTitle}>Good conversations add up.</Text>
        <Text style={styles.highlightBody}>
          Members earned 84,290 XP together this month — up 18% from last month.
        </Text>
      </Panel>
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
  panelHint: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -7,
    marginBottom: 5,
  },
  highlight: { backgroundColor: palette.accentSoft, borderColor: "#39315E" },
  highlightEyebrow: {
    color: "#B8AEFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  highlightTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 11,
  },
  highlightBody: {
    color: "#C2BDDA",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },
});
