import { useContext, useMemo, useState } from "react";
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

// Componentă pentru dropdown custom (mai frumos pe iOS)
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

  // Opțiuni pentru dropdown-uri
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

  const sortOptions = [
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
                value={sortOptions.find(opt => opt.value === sortOption)?.label || "Sort by"}
                options={sortOptions}
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  
  // Styles for CustomDropdown
  dropdownButton: {
    backgroundColor: "#f0f0f0",
    padding: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownButtonDark: {
    backgroundColor: "#333",
    borderColor: '#444',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownTextDark: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    paddingTop: 20,
  },
  modalContentDark: {
    backgroundColor: '#1e1e1e',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionDark: {
    borderBottomColor: '#333',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextDark: {
    color: '#fff',
  },
  
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});