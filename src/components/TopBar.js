import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Importăm logo (cea mai sigură metodă în Expo)
const logo = require("../../assets/TaskFlowLogo.png");

export default function TopBar({ onMenuPress }) {
  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image source={logo} style={styles.logo} />

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

  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: -40, // ajustează centarea vizuală
  },

  menuButton: {
    padding: 6,
  },

  menuText: {
    fontSize: 28,
    color: "#333",
  },
});
