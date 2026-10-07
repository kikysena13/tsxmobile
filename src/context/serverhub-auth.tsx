import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { AppScreen, Panel } from "@/components/serverhub-ui";
import { palette } from "@/constants/serverhub-data";
import {
    redeemDiscordTicket,
    revokeSession,
    startDiscordLogin,
} from "@/lib/serverhub-api";

const STORAGE_KEY = "serverhub.session.v1";

type ServerHubSession = {
  token: string;
  expiresAt: string;
  user: { id: string; username: string };
  guild: { id: string; name: string };
};

type AuthContextValue = {
  session: ServerHubSession | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readStoredSession(): Promise<ServerHubSession | null> {
  try {
    const value =
      Platform.OS === "web"
        ? globalThis.sessionStorage?.getItem(STORAGE_KEY) || null
        : await SecureStore.getItemAsync(STORAGE_KEY);
    if (!value) return null;
    const session = JSON.parse(value) as ServerHubSession;
    return session.token && Date.parse(session.expiresAt) > Date.now()
      ? session
      : null;
  } catch {
    return null;
  }
}

async function saveStoredSession(session: ServerHubSession | null) {
  if (Platform.OS === "web") {
    if (session)
      globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(session));
    else globalThis.sessionStorage?.removeItem(STORAGE_KEY);
    return;
  }
  if (session)
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
  else await SecureStore.deleteItemAsync(STORAGE_KEY);
}

export function ServerHubAuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<ServerHubSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === "web") WebBrowser.maybeCompleteAuthSession();
  }, []);

  useEffect(() => {
    let active = true;
    void readStoredSession().then((savedSession) => {
      if (!active) return;
      setSession(savedSession);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async () => {
    const redirectUri = Linking.createURL("auth");
    const { authorizationUrl } = await startDiscordLogin(redirectUri);
    const result = await WebBrowser.openAuthSessionAsync(
      authorizationUrl,
      redirectUri,
    );
    if (result.type !== "success" || !result.url) {
      if (result.type === "cancel" || result.type === "dismiss") return;
      throw new Error("Login Discord tidak selesai.");
    }

    const query = Linking.parse(result.url).queryParams || {};
    const ticketValue = query.ticket;
    const errorValue = query.error;
    const ticket = Array.isArray(ticketValue) ? ticketValue[0] : ticketValue;
    const loginError = Array.isArray(errorValue) ? errorValue[0] : errorValue;
    if (loginError) {
      if (loginError === "admin_access_required") {
        throw new Error("Akun ini bukan admin server Discord yang terhubung.");
      }
      throw new Error(
        "Login Discord gagal atau kedaluwarsa. Silakan coba lagi.",
      );
    }
    if (!ticket) throw new Error("Server tidak mengembalikan tiket login.");

    const newSession = await redeemDiscordTicket(ticket);
    await saveStoredSession(newSession);
    setSession(newSession);
  }, []);

  const signOut = useCallback(async () => {
    const currentSession = session;
    setSession(null);
    await saveStoredSession(null);
    if (currentSession) {
      await revokeSession(currentSession.token).catch(() => undefined);
    }
  }, [session]);

  const value = useMemo(
    () => ({ session, isLoading, signIn, signOut }),
    [session, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useServerHubAuth() {
  const value = useContext(AuthContext);
  if (!value)
    throw new Error(
      "useServerHubAuth must be used inside ServerHubAuthProvider.",
    );
  return value;
}

export function ServerHubAuthGate({ children }: PropsWithChildren) {
  const { session, isLoading } = useServerHubAuth();
  return (
    <View style={styles.gate}>
      {children}
      {isLoading ? (
        <View style={[styles.overlay, styles.loading]}>
          <ActivityIndicator color={palette.accent} />
        </View>
      ) : null}
      {!isLoading && !session ? (
        <View style={styles.overlay}>
          <DiscordLoginScreen />
        </View>
      ) : null}
    </View>
  );
}

function DiscordLoginScreen() {
  const { signIn } = useServerHubAuth();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setWorking(true);
    setError(null);
    try {
      await signIn();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Tidak dapat login ke Discord.",
      );
    } finally {
      setWorking(false);
    }
  }

  return (
    <AppScreen>
      <View style={styles.loginHeader}>
        <Text style={styles.brand}>SERVERHUB</Text>
        <Text style={styles.title}>Masuk dengan Discord</Text>
        <Text style={styles.subtitle}>
          Dashboard hanya tersedia untuk admin server yang terhubung.
        </Text>
      </View>
      <Panel>
        <Text style={styles.panelText}>
          Kami memeriksa izin server Anda. Token bot tetap tersimpan di backend
          dan tidak dikirim ke perangkat.
        </Text>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          disabled={working}
          onPress={() => void handleSignIn()}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            working && styles.buttonDisabled,
          ]}
        >
          {working ? (
            <ActivityIndicator color={palette.text} />
          ) : (
            <Text style={styles.buttonText}>Lanjutkan ke Discord</Text>
          )}
        </Pressable>
      </Panel>
      <Text style={styles.footer}>ServerHub · akses admin</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  gate: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: palette.background,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.background,
  },
  loginHeader: { gap: 8, marginTop: 48, marginBottom: 12 },
  brand: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  title: { color: palette.text, fontSize: 25, fontWeight: "700", marginTop: 8 },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21 },
  panelText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },
  error: { color: "#E29B9B", fontSize: 12, lineHeight: 18, marginBottom: 12 },
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonPressed: { opacity: 0.8 },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: palette.text, fontSize: 14, fontWeight: "600" },
  footer: {
    color: palette.faint,
    textAlign: "center",
    fontSize: 11,
    marginTop: 4,
  },
});
