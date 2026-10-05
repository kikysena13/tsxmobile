import { StyleSheet, Text, View } from "react-native";

import {
    AppScreen,
    PageTitle,
    Panel,
    SectionHeading,
    StatusPill,
} from "@/components/serverhub-ui";
import { palette, recentActivity } from "@/constants/serverhub-data";

const eventColors = {
  message: palette.accent,
  member: palette.green,
  voice: palette.blue,
  moderation: palette.orange,
};

export default function ActivityScreen() {
  return (
    <AppScreen>
      <View style={styles.topLine}>
        <Text style={styles.brand}>
          SERVERHUB <Text style={styles.brandDot}>/</Text> COMMUNITY
        </Text>
        <StatusPill>LIVE DATA</StatusPill>
      </View>
      <PageTitle
        eyebrow="Everything happening"
        title="Activity"
        subtitle="A live snapshot of the moments that keep your server moving."
      />

      <View style={styles.summaryRow}>
        <Panel style={styles.summaryCard}>
          <Text style={styles.summaryValue}>1,284</Text>
          <Text style={styles.summaryLabel}>events today</Text>
        </Panel>
        <Panel style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: palette.green }]}>
            +12.8%
          </Text>
          <Text style={styles.summaryLabel}>vs. yesterday</Text>
        </Panel>
      </View>

      <Panel>
        <SectionHeading title="Recent activity" action="Today  ⌄" />
        {recentActivity.map((event, index) => {
          const color = eventColors[event.category];
          return (
            <View key={event.id} style={styles.eventRow}>
              <View style={styles.timeline}>
                <View
                  style={[styles.eventIcon, { backgroundColor: `${color}20` }]}
                >
                  <Text style={[styles.eventIconText, { color }]}>
                    {event.initials}
                  </Text>
                </View>
                {index < recentActivity.length - 1 ? (
                  <View style={styles.timelineLine} />
                ) : null}
              </View>
              <View style={styles.eventContent}>
                <View style={styles.eventTitleLine}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <Text style={styles.eventActor}>by {event.actor}</Text>
              </View>
            </View>
          );
        })}
      </Panel>
      <Text style={styles.demoNote}>
        Demo activity · Connect your Discord bot to see live events.
      </Text>
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
  summaryRow: { flexDirection: "row", gap: 12 },
  summaryCard: { flex: 1, paddingVertical: 16, gap: 5 },
  summaryValue: { color: palette.text, fontSize: 20, fontWeight: "800" },
  summaryLabel: { color: palette.muted, fontSize: 11 },
  eventRow: { flexDirection: "row", minHeight: 82, gap: 12 },
  timeline: { alignItems: "center", width: 38 },
  eventIcon: {
    height: 34,
    width: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  eventIconText: { fontSize: 14, fontWeight: "800" },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: palette.border,
    marginVertical: 5,
  },
  eventContent: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 14,
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 5,
  },
  eventTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  eventTitle: { flex: 1, color: palette.text, fontSize: 13, fontWeight: "700" },
  eventTime: { color: palette.faint, fontSize: 10 },
  eventDescription: { color: palette.muted, fontSize: 12, lineHeight: 17 },
  eventActor: { color: palette.faint, fontSize: 10 },
  demoNote: {
    color: palette.faint,
    textAlign: "center",
    fontSize: 10,
    marginTop: -10,
  },
});
