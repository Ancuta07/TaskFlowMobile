import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerUser } from "../utils/auth";

const PASSWORD_REGEX =
  /^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?`~]).*$/;

export default function Register({ navigation }) {
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

  const handleRegister = async () => {
    setError("");
    setLoading(true);

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
      navigation.navigate("Login");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        style={styles.input}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
      />

      <PasswordChecklist checks={checks} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.btnText}>{loading ? "..." : "Register"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function PasswordChecklist({ checks }) {
  const item = (ok, text) => (
    <View style={styles.checkItem}>
      <View
        style={[styles.checkIcon, { backgroundColor: ok ? "#16A34A" : "#aaa" }]}
      />
      <Text>{text}</Text>
    </View>
  );

  return (
    <View style={{ marginTop: 12 }}>
      {item(checks.length, "Min 12 characters")}
      {item(checks.lower, "One lowercase letter")}
      {item(checks.upper, "One uppercase letter")}
      {item(checks.digit, "One number")}
      {item(checks.special, "One special character")}
      {item(checks.match, "Passwords match")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
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
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
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
