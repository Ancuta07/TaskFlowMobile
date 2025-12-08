import { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { loginUser } from "../utils/auth";

export default function Login({ navigation, onLoginSuccess }) {
  const { dark } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const result = await loginUser(email, password);

    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <View
      style={[
        styles.container,
        dark && { backgroundColor: "#1e1e1e" }, // 🔥 background dark
      ]}
    >
      <Text style={[styles.title, dark && { color: "#fff" }]}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={dark ? "#bbb" : "#666"} // 🔥 text vizibil
        value={email}
        style={[
          styles.input,
          dark && styles.inputDark,
        ]}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={dark ? "#bbb" : "#666"}
        value={password}
        secureTextEntry
        style={[
          styles.input,
          dark && styles.inputDark,
        ]}
        onChangeText={setPassword}
      />

      {error !== "" && (
        <Text
          style={[
            styles.error,
            dark && { color: "#ff6b6b" },
          ]}
        >
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          dark && styles.buttonDark,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text
          style={[
            styles.btnText,
            dark && styles.btnTextDark,
          ]}
        >
          {loading ? "Loading..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text
          style={[
            styles.link,
            dark && { color: "#4dabf7" },
          ]}
        >
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#000",
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
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDark: {
    backgroundColor: "#4dabf7",
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
    marginBottom: 10,
    textAlign: "center",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#007bff",
  },
});
