import { useContext } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onUpdate, onEdit }) {
  const { dark } = useContext(ThemeContext);

  if (!tasks || tasks.length === 0) {
    return (
      <View>
        <Text style={[styles.empty, { color: dark ? "#aaa" : "#777" }]}>
          No tasks yet. Add your first task above.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onEdit={() => onEdit(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
});
