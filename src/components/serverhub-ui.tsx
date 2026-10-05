import type { PropsWithChildren, ReactNode } from "react";
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
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.pageTitle}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.pageHeading}>{title}</Text>
      <Text style={styles.pageSubtitle}>{subtitle}</Text>
    </View>
  );
}

export function Panel({
  children,
  style,
}: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  change,
  accent = palette.accent,
  iconBackground = palette.accentSoft,
}: {
  icon: string;
  label: string;
  value: string;
  change: string;
  accent?: string;
  iconBackground?: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: iconBackground }]}>
        <Text style={[styles.metricIconText, { color: accent }]}>{icon}</Text>
      </View>
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
  member: Pick<Member, "initials" | "color">;
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
          backgroundColor: `${member.color}24`,
        },
      ]}
    >
      <Text
        style={[
          styles.avatarText,
          { color: member.color, fontSize: size * 0.29 },
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
      <Text style={[styles.rank, rank <= 3 && styles.topRank]}>0{rank}</Text>
      <MemberAvatar member={member} size={compact ? 38 : 44} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberHandle}>
          {member.handle}
          {compact ? "" : `  ·  ${member.role}`}
        </Text>
      </View>
      <View style={styles.memberScore}>
        <Text style={styles.memberPoints}>
          {compact ? member.messages : member.points}
        </Text>
        <Text style={styles.memberScoreCaption}>
          {compact ? "msgs" : "this month"}
        </Text>
      </View>
    </View>
  );
}

export function StatusPill({
  children,
  color = palette.green,
}: PropsWithChildren<{ color?: string }>) {
  return (
    <View style={[styles.statusPill, { backgroundColor: `${color}18` }]}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusText, { color }]}>{children}</Text>
    </View>
  );
}

export function MiniStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <View style={styles.miniStat}>
      {icon ? <View style={styles.miniStatIcon}>{icon}</View> : null}
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
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
    gap: 24,
  },
  pageTitle: { gap: 6 },
  eyebrow: {
    color: palette.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  pageHeading: {
    color: palette.text,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  pageSubtitle: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  panel: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
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
    letterSpacing: -0.2,
  },
  sectionAction: { color: palette.accent, fontSize: 12, fontWeight: "700" },
  metricCard: {
    flexGrow: 1,
    flexBasis: "46%",
    minWidth: "46%",
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    gap: 8,
  },
  metricIcon: {
    height: 34,
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    marginBottom: 3,
  },
  metricIconText: { fontSize: 17, fontWeight: "800" },
  metricLabel: { color: palette.muted, fontSize: 12, fontWeight: "600" },
  metricValue: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  metricChange: { color: palette.green, fontSize: 11, fontWeight: "700" },
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
  rank: { color: palette.faint, width: 21, fontSize: 12, fontWeight: "800" },
  topRank: { color: palette.orange },
  memberInfo: { flex: 1, gap: 4 },
  memberName: { color: palette.text, fontSize: 13, fontWeight: "700" },
  memberHandle: { color: palette.muted, fontSize: 11 },
  memberScore: { alignItems: "flex-end", gap: 4 },
  memberPoints: { color: palette.text, fontSize: 12, fontWeight: "700" },
  memberScoreCaption: { color: palette.muted, fontSize: 10 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusDot: { height: 6, width: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.4 },
  miniStat: { flex: 1, alignItems: "center", gap: 6, paddingHorizontal: 8 },
  miniStatIcon: { height: 30, justifyContent: "center" },
  miniStatValue: { color: palette.text, fontSize: 17, fontWeight: "800" },
  miniStatLabel: { color: palette.muted, fontSize: 10, textAlign: "center" },
});
