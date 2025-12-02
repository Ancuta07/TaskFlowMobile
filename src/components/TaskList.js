import { FlatList, StyleSheet, Text } from "react-native";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onUpdate, onEdit }) {
  if (!tasks.length) {
    return (
      <Text style={styles.empty}>No tasks yet. Add your first task above.</Text>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
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
    color: "#777",
  },
});
