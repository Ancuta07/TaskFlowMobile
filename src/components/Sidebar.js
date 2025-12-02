import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Sidebar({
  isOpen,
  onClose,
  darkMode,
  toggleDarkMode,
  onLogout,
}) {
  return (
    <Modal transparent visible={isOpen} animationType="slide">
      <TouchableOpacity style={styles.overlay} onPress={onClose} />

      <View style={[styles.sidebar, darkMode && styles.dark]}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={toggleDarkMode}>
          <Text style={styles.btnText}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.logout]}
          onPress={onLogout}
        >
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebar: {
    position: "absolute",
    right: 0,
    width: "70%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
    elevation: 10,
  },
  dark: {
    backgroundColor: "#222",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  close: {
    fontSize: 22,
    color: "#000",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  btn: {
    padding: 12,
    marginVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  logout: {
    backgroundColor: "#ff5252",
  },
  btnText: {
    fontSize: 16,
  },
});
