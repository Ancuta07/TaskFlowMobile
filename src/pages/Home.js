import { useContext, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Sidebar from "../components/Sidebar";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import TopBar from "../components/TopBar";
import { ThemeContext } from "../context/ThemeContext";

/* Dropdown UI */
function CustomDropdown({ value, options, onSelect, label, dark }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdownButton, dark && styles.dropdownButtonDark]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.dropdownText, dark && styles.dropdownTextDark]}>
          {value || label}
        </Text>
        <Text style={dark && { color: '#fff' }}>▼</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={[styles.modalContent, dark && styles.modalContentDark]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, dark && styles.optionDark]}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, dark && styles.optionTextDark]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default function Home({
  tasks: externalTasks,
  onAdd,
  onDelete,
  onUpdate,
  navigation,
  onLogout,
}) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { dark } = useContext(ThemeContext);

  /* Load tasks initially from Firebase props */
  useEffect(() => {
    if (externalTasks) {
      setTasks(externalTasks);
    }
  }, [externalTasks]);

  /* Local state for filters */
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOption, setSortOption] = useState("dateAsc");

  /* Unified function: add new task + sync backend */
  const handleAdd = async (task) => {
    setTasks(prev => [...prev, task]);
    await onAdd(task); // Firebase funcție deja existentă
  };

  /* Update task (edit, complete, cancel etc.) */
  const handleUpdate = async (id, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
    await onUpdate(id, updates);
  };

  /* Delete task locally + backend */
  const handleDelete = async (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    await onDelete(id);
  };

  /* Handle add vs edit submit */
  const handleSubmit = (data) => {
    if (editingTask) {
      handleUpdate(editingTask.id, data);
      setEditingTask(null);
    } else {
      handleAdd(data);
    }
  };

  /* Filtering + sorting UI list */
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
        result.sort((a, b) => (new Date(a.deadline || 0) - new Date(b.deadline || 0)));
        break;
      case "dateDesc":
        result.sort((a, b) => (new Date(b.deadline || 0) - new Date(a.deadline || 0)));
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


  /* Dropdown options */
  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "Overdue", value: "Overdue" },
    { label: "Completed", value: "Completed" },
    { label: "Canceled", value: "Canceled" },
  ];

  const priorityOptions = [
    { label: "All Priorities", value: "All" },
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  const sortOptionsList = [
    { label: "Deadline ↑", value: "dateAsc" },
    { label: "Deadline ↓", value: "dateDesc" },
    { label: "A → Z", value: "alphaAsc" },
    { label: "Z → A", value: "alphaDesc" },
  ];

  return (
    <View
      style={[styles.screen, { backgroundColor: dark ? "#121212" : "#f5f5f5" }]}
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
            onDelete={handleDelete}
            onUpdate={handleUpdate}
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
                  📝 List
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewButton, dark && styles.viewButtonDark]}
                onPress={() => navigation.navigate("Calendar", { tasks })}
              >
                <Text
                  style={[
                    styles.viewButtonText,
                    { color: dark ? "#fff" : "#333" },
                  ]}
                >
                  📅 Calendar
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

              <CustomDropdown
                value={statusFilter === "All" ? "All Statuses" : statusFilter}
                options={statusOptions}
                onSelect={setStatusFilter}
                label="Select Status"
                dark={dark}
              />

              <CustomDropdown
                value={priorityFilter === "All" ? "All Priorities" : priorityFilter}
                options={priorityOptions}
                onSelect={setPriorityFilter}
                label="Select Priority"
                dark={dark}
              />

              <CustomDropdown
                value={sortOptionsList.find(opt => opt.value === sortOption)?.label || "Sort by"}
                options={sortOptionsList}
                onSelect={setSortOption}
                label="Sort by"
                dark={dark}
              />
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
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: dark ? "#aaa" : "#555" },
              ]}
            >
              No tasks yet. Add your first task above.
            </Text>
          </View>
        }
      />
    </View>
  );
}


/* STYLES updated with better Dark Mode contrast */
const styles = StyleSheet.create({
  screen: { flex: 1 },

  container: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 40,
  },

  viewToggle: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },

  viewButton: {
    padding: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    flex: 1,
  },

  viewButtonDark: {
    backgroundColor: "#333",
  },

  activeButton: {
    backgroundColor: "#007bff",
  },

  viewButtonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },

  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  darkCard: {
    backgroundColor: "#1e1e1e",
  },

  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  /* Dropdown button */
  dropdownButton: {
    backgroundColor: "#f0f0f0",
    padding: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  dropdownButtonDark: {
    backgroundColor: "#2b2b2b",
    borderColor: "#444",
  },

  dropdownText: { 
    fontSize: 16, 
    color: "#333" 
  },

  dropdownTextDark: { 
    fontSize: 16,
    color: "#f1f1f1",
    fontWeight: "500",
  },

  /* Modal backdrop */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  /* Dropdown list container */
  modalContent: { 
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
    paddingTop: 10,
  },

  modalContentDark: {
    backgroundColor: "#2d2d2d",
  },

  /* Dropdown options */
  option: { 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  optionDark: {
    backgroundColor: "#333",
    borderBottomColor: "#444",
  },

  optionText: {
    fontSize: 16,
    color: "#333",
  },

  optionTextDark: {
    fontSize: 16,
    color: "#f9f9f9",
    fontWeight: "600",
  },

  emptyContainer: { 
    paddingVertical: 40, 
    alignItems: "center" 
  },

  emptyText: { 
    fontSize: 16, 
    textAlign: "center" 
  },
});
