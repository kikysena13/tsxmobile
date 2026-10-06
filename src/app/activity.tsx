import { StyleSheet, Text, View } from "react-native";

import {
  AppScreen,
  PageTitle,
  Panel,
  SectionHeading,
} from "@/components/serverhub-ui";
import { palette, recentActivity } from "@/constants/serverhub-data";

export default function ActivityScreen() {
  return (
    <AppScreen>
      <PageTitle title="Activity" subtitle="Recent server events · Demo data" />

      <Panel>
        <SectionHeading title="Today" />
        {recentActivity.map((event) => {
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
      </Panel>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
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
