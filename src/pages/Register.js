import { useContext, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { registerUser } from "../utils/auth";

const PASSWORD_REGEX =
  /^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?`~]).*$/;

export default function Register({ navigation }) {
  const { dark } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checks = useMemo(
    () => ({
      length: password.length >= 12,
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      special: /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?`~]/.test(password),
      match: password === confirm && password.length > 0,
    }),
    [password, confirm]
  );

  const isPasswordValid = PASSWORD_REGEX.test(password) && checks.match;

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError("Password does not meet requirements.");
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await registerUser(email, password);

    if (result.success) {
      navigation.goBack();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        dark && { backgroundColor: "#1e1e1e" },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, dark && { color: "#fff" }]}>
        Create Account
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={dark ? "#bbb" : "#666"}
        value={email}
        style={[styles.input, dark && styles.inputDark]}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={dark ? "#bbb" : "#666"}
        secureTextEntry
        style={[styles.input, dark && styles.inputDark]}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor={dark ? "#bbb" : "#666"}
        secureTextEntry
        style={[styles.input, dark && styles.inputDark]}
        value={confirm}
        onChangeText={setConfirm}
      />

      <PasswordChecklist checks={checks} dark={dark} />

      {error ? (
        <Text style={[styles.error, dark && { color: "#ff6b6b" }]}>{error}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          !isPasswordValid && styles.buttonDisabled,
          dark && styles.buttonDark,
        ]}
        onPress={handleRegister}
        disabled={!isPasswordValid || loading}
      >
        <Text
          style={[
            styles.btnText,
            dark && styles.btnTextDark,
          ]}
        >
          {loading ? "Creating..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text
          style={[
            styles.link,
            dark && { color: "#4dabf7" },
          ]}
        >
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function PasswordChecklist({ checks, dark }) {
  const row = (ok, text) => (
    <View style={styles.checkItem}>
      <View
        style={[
          styles.checkIcon,
          { backgroundColor: ok ? "#16A34A" : dark ? "#555" : "#ccc" },
        ]}
      />
      <Text style={{ color: ok ? "#16A34A" : dark ? "#ccc" : "#666" }}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={styles.checklist}>
      {row(checks.length, "Min 12 characters")}
      {row(checks.lower, "One lowercase letter")}
      {row(checks.upper, "One uppercase letter")}
      {row(checks.digit, "One number")}
      {row(checks.special, "One special character")}
      {row(checks.match, "Passwords match")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  inputDark: {
    backgroundColor: "#333",
    borderColor: "#555",
    color: "#fff",
  },
  checklist: {
    marginBottom: 15,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 10,
  },
  checkIcon: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDark: {
    backgroundColor: "#4dabf7",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  btnTextDark: {
    color: "#1e1e1e",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#007bff",
  },
});
