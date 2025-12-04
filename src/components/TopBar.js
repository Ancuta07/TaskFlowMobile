import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TopBar({ onMenuPress }) {
  return (
    <View style={styles.container}>
      {/* LOGO - folosește text dacă nu ai imaginea */}
      <Text style={styles.logoText}>TaskFlow</Text>

      {/* TITLU */}
      <Text style={styles.title}>TaskFlow</Text>

      {/* BUTON MENIU */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
  },

  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    width: 40,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },

  menuButton: {
    padding: 6,
  },

  menuText: {
    fontSize: 28,
    color: "#333",
  },
});