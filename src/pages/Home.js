import { Picker } from "@react-native-picker/picker";
import { useContext, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Sidebar from "../components/Sidebar";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem"; // <-- folosit direct
import TopBar from "../components/TopBar";
import { ThemeContext } from "../context/ThemeContext";

export default function Home({
  tasks,
  onAdd,
  onDelete,
  onUpdate,
  navigation,
  onLogout,
}) {
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { dark } = useContext(ThemeContext);

  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOption, setSortOption] = useState("dateAsc");

  const handleSubmit = (data) => {
    if (editingTask) {
      onUpdate(editingTask.id, data);
      setEditingTask(null);
    } else {
      onAdd(data);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...tasks];

    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== "All") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    switch (sortOption) {
      case "dateAsc":
        result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case "dateDesc":
        result.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
        break;
      case "alphaAsc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alphaDesc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [tasks, statusFilter, priorityFilter, sortOption]);

  return (
    <View
      style={[styles.screen, { backgroundColor: dark ? "#121212" : "#f4f4f4" }]}
    >
      <TopBar onMenuPress={() => setSidebarOpen(true)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onEdit={() => setEditingTask(item)}
          />
        )}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            {/* VIEW SWITCH */}
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.viewButton, styles.activeButton]}
              >
                <Text style={[styles.viewButtonText, { color: "#fff" }]}>
                  📝 List View
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewButton, dark && styles.darkCard]}
                onPress={() => navigation.navigate("Calendar", { tasks })}
              >
                <Text
                  style={[
                    styles.viewButtonText,
                    { color: dark ? "#fff" : "#333" },
                  ]}
                >
                  📅 Calendar View
                </Text>
              </TouchableOpacity>
            </View>

            {/* FILTER CARD */}
            <View style={[styles.filterCard, dark && styles.darkCard]}>
              <Text
                style={[styles.filterTitle, { color: dark ? "#fff" : "#000" }]}
              >
                Filters
              </Text>

              <Picker
                style={[styles.picker, dark && styles.pickerDark]}
                selectedValue={statusFilter}
                onValueChange={setStatusFilter}
              >
                <Picker.Item label="All Statuses" value="All" />
                <Picker.Item label="Upcoming" value="Upcoming" />
                <Picker.Item label="Overdue" value="Overdue" />
                <Picker.Item label="Completed" value="Completed" />
                <Picker.Item label="Canceled" value="Canceled" />
              </Picker>

              <Picker
                style={[styles.picker, dark && styles.pickerDark]}
                selectedValue={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <Picker.Item label="All Priorities" value="All" />
                <Picker.Item label="High" value="High" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Low" value="Low" />
              </Picker>

              <Picker
                style={[styles.picker, dark && styles.pickerDark]}
                selectedValue={sortOption}
                onValueChange={setSortOption}
              >
                <Picker.Item label="Deadline ↑" value="dateAsc" />
                <Picker.Item label="Deadline ↓" value="dateDesc" />
                <Picker.Item label="A → Z" value="alphaAsc" />
                <Picker.Item label="Z → A" value="alphaDesc" />
              </Picker>
            </View>

            {/* ADD / EDIT FORM */}
            <TaskForm
              mode={editingTask ? "edit" : "add"}
              initialTask={editingTask}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingTask(null)}
            />
          </>
        }
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 40,
              fontSize: 16,
              color: dark ? "#aaa" : "#555",
            }}
          >
            No tasks yet. Add your first task above.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    padding: 12,
    paddingBottom: 40,
  },

  viewToggle: {
    flexDirection: "row",
    marginBottom: 20,
  },

  viewButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },

  activeButton: {
    backgroundColor: "#007bff",
  },

  viewButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
  },

  darkCard: {
    backgroundColor: "#1e1e1e",
  },

  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  picker: {
    backgroundColor: "#eee",
    marginBottom: 12,
    borderRadius: 8,
  },

  pickerDark: {
    backgroundColor: "#333",
    color: "#fff",
  },
});
