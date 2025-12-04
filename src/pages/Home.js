import { Picker } from "@react-native-picker/picker";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Sidebar from "../components/Sidebar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TopBar from "../components/TopBar";

export default function Home({
  tasks,
  onAdd,
  onDelete,
  onUpdate,
  navigation,
  user,
  onLogout,
}) {
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <View style={styles.screen}>
      {/* 🟦 TOP BAR */}
      <TopBar onMenuPress={() => setSidebarOpen(true)} />

      {/* 🟩 SIDEBAR (modal) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={false}
        toggleDarkMode={() => {}}
        onLogout={onLogout}
      />

      {/* 🟨 CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔵 BUTOANE LIST/CALENDAR */}
        <View style={styles.viewToggle}>
          <TouchableOpacity style={[styles.viewButton, styles.activeButton]}>
            <Text style={styles.viewButtonText}>📝 List View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Text style={styles.viewButtonText}>📅 Calendar View</Text>
          </TouchableOpacity>
        </View>

        {/* 🔵 FILTRE */}
        <View style={styles.filters}>
          <Picker
            style={styles.picker}
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
            style={styles.picker}
            selectedValue={priorityFilter}
            onValueChange={setPriorityFilter}
          >
            <Picker.Item label="All Priorities" value="All" />
            <Picker.Item label="High" value="High" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Low" value="Low" />
          </Picker>

          <Picker
            style={styles.picker}
            selectedValue={sortOption}
            onValueChange={setSortOption}
          >
            <Picker.Item label="Deadline ↑" value="dateAsc" />
            <Picker.Item label="Deadline ↓" value="dateDesc" />
            <Picker.Item label="A → Z" value="alphaAsc" />
            <Picker.Item label="Z → A" value="alphaDesc" />
          </Picker>
        </View>

        {/* 🟥 FORMULAR */}
        <TaskForm
          mode={editingTask ? "edit" : "add"}
          initialTask={editingTask}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingTask(null)}
        />

        {/* 🟧 LISTĂ */}
        <TaskList
          tasks={filteredAndSorted}
          onEdit={(task) => setEditingTask(task)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  viewToggle: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-around',
  },
  viewButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  viewButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  filters: {
    marginBottom: 15,
  },
  picker: {
    backgroundColor: "#eee",
    marginBottom: 10,
    borderRadius: 8,
  },
});