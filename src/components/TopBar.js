import { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

export default function TopBar({ onMenuPress }) {
  const { dark } = useContext(ThemeContext);

  return (
    <View style={[styles.container, dark && styles.dark]}>
      <Image
        source={require("../../assets/images/TaskFlowLogo.png")}
        style={styles.logo}
      />

      <Text style={[styles.title, { color: dark ? "#fff" : "#222" }]}>
        TaskFlow
      </Text>

      <TouchableOpacity onPress={onMenuPress}>
        <Text style={[styles.menu, { color: dark ? "#fff" : "#222" }]}>☰</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    elevation: 4,
  },
  dark: { backgroundColor: "#1a1a1a" },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  title: { flex: 1, textAlign: "center", fontSize: 22, fontWeight: "bold" },
  menu: { fontSize: 28 },
});
