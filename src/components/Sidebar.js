import { useContext, useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar({ isOpen, onClose, onLogout }) {
  const { dark, toggleTheme } = useContext(ThemeContext);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : 300,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <Modal transparent visible={isOpen} animationType="none">
      {/* Overlay */}
      <TouchableOpacity style={styles.overlay} onPress={onClose} />

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          dark && styles.darkSidebar,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: dark ? "#fff" : "#000" }]}>
            Menu
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.close, { color: dark ? "#fff" : "#000" }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Theme toggle */}
        <TouchableOpacity
          style={[styles.btn, dark && styles.darkBtn]}
          onPress={toggleTheme}
        >
          <Text style={[styles.btnText, { color: dark ? "#fff" : "#000" }]}>
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  sidebar: {
    position: "absolute",
    right: 0,
    zIndex: 2,
    width: "70%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
    elevation: 10,
  },

  darkSidebar: { backgroundColor: "#1e1e1e" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: { fontSize: 22, fontWeight: "bold" },

  close: { fontSize: 22 },

  btn: {
    padding: 12,
    marginVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  darkBtn: { backgroundColor: "#333" },

  btnText: { fontSize: 16 },

  logout: {
    padding: 12,
    backgroundColor: "#ff5252",
    borderRadius: 8,
    marginTop: 20,
  },

  logoutText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
