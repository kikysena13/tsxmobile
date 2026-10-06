import type { PropsWithChildren } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, type Member } from "@/constants/serverhub-data";

export function AppScreen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.pageTitle}>
      <Text style={styles.pageHeading}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Panel({
  children,
  style,
}: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function SectionHeading({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricChange}>{change}</Text>
    </View>
  );
}

export function MemberAvatar({
  member,
  size = 42,
}: {
  member: Pick<Member, "initials">;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.surfaceRaised,
        },
      ]}
    >
      <Text
        style={[
          styles.avatarText,
          { color: palette.muted, fontSize: size * 0.29 },
        ]}
      >
        {member.initials}
      </Text>
    </View>
  );
}

export function LeaderboardRow({
  member,
  rank,
  compact = false,
}: {
  member: Member;
  rank: number;
  compact?: boolean;
}) {
  return (
    <View style={styles.memberRow}>
      <Text style={styles.rank}>{String(rank).padStart(2, "0")}</Text>
      <MemberAvatar member={member} size={compact ? 38 : 44} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberHandle}>{member.handle}</Text>
      </View>
      <View style={styles.memberScore}>
        <Text style={styles.memberPoints}>
          {compact ? member.messages : member.points}
        </Text>
        {compact ? (
          <Text style={styles.memberScoreCaption}>messages</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center", paddingBottom: 30 },
  content: {
    width: "100%",
    maxWidth: 920,
    paddingHorizontal: 22,
    paddingTop: 14,
    gap: 18,
  },
  pageTitle: { gap: 4 },
  pageHeading: {
    color: palette.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  pageSubtitle: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  panel: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 15,
    padding: 16,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: "46%",
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 14,
    gap: 5,
  },
  metricLabel: { color: palette.muted, fontSize: 12, fontWeight: "500" },
  metricValue: {
    color: palette.text,
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  metricChange: { color: palette.faint, fontSize: 10, fontWeight: "500" },
  avatar: { alignItems: "center", justifyContent: "center" },
  avatarText: { fontWeight: "800", letterSpacing: -0.3 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rank: { color: palette.faint, width: 21, fontSize: 11, fontWeight: "600" },
  memberInfo: { flex: 1, gap: 4 },
  memberName: { color: palette.text, fontSize: 13, fontWeight: "700" },
  memberHandle: { color: palette.muted, fontSize: 11 },
  memberScore: { alignItems: "flex-end", gap: 4 },
  memberPoints: { color: palette.text, fontSize: 12, fontWeight: "600" },
  memberScoreCaption: { color: palette.muted, fontSize: 10 },
});
