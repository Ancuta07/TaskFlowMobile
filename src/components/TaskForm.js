import DateTimePicker from '@react-native-community/datetimepicker';
import { useContext, useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { generateId } from "../utils/storage";

const PRIORITIES = ["High", "Medium", "Low"];
const COLORS = ["#3f51b5", "#ff5252", "#4caf50", "#ff9800", "#9c27b0"];

export default function TaskForm({
  mode = "add",
  initialTask,
  onSubmit,
  onCancelEdit,
}) {
  const { dark } = useContext(ThemeContext);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [color, setColor] = useState("#3f51b5");
  const [priority, setPriority] = useState("Medium");
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDesc(initialTask.description || "");
      setDeadline(initialTask.deadline ? new Date(initialTask.deadline) : null);
      setColor(initialTask.color);
      setPriority(initialTask.priority);
    } else {
      resetForm();
    }
  }, [initialTask]);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setDeadline(null);
    setColor("#3f51b5");
    setPriority("Medium");
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const base = {
      title: title.trim(),
      description: desc.trim(),
      deadline: deadline ? deadline.toISOString() : null,
      color,
      priority,
    };

    if (mode === "add") {
      const nowISO = new Date().toISOString();
      const isOverdue =
        deadline && deadline.getTime() < Date.now() ? "Overdue" : "Upcoming";

      onSubmit({
        id: generateId(),
        ...base,
        status: isOverdue,
        createdAt: nowISO,
      });

      resetForm();
    } else {
      onSubmit(base);
    }
  };

  return (
    <View style={[styles.form, dark && styles.formDark]}>
      <TextInput
        placeholder="Title *"
        placeholderTextColor={dark ? "#aaa" : "#666"}
        style={[styles.input, dark && styles.inputDark]}
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        style={[styles.dateButton, dark && styles.dateButtonDark]}
        onPress={() => setPickerVisible(true)}
      >
        <Text style={[styles.dateButtonText, dark && styles.dateButtonTextDark]}>
          {deadline ? deadline.toLocaleString() : "📅 Pick a deadline"}
        </Text>
      </TouchableOpacity>

     {isPickerVisible && (
  <View style={[
    styles.pickerWrap,
    dark ? styles.pickerWrapDark : styles.pickerWrapLight
  ]}>
    <DateTimePicker
      value={deadline || new Date()}
      mode="datetime"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      themeVariant={dark ? "dark" : "light"}
      textColor={dark ? "#fff" : "#000"}
      onChange={(event, date) => {
        setPickerVisible(false);
        if (date) setDeadline(date);
      }}
    />
  </View>
)}



      <TextInput
        placeholder="Description"
        placeholderTextColor={dark ? "#aaa" : "#666"}
        multiline
        style={[styles.input, styles.textarea, dark && styles.inputDark]}
        value={desc}
        onChangeText={setDesc}
        numberOfLines={3}
      />

      <View style={styles.row}>
        <View style={[styles.priorityContainer, dark && styles.priorityContainerDark]}>
          <Text style={[styles.label, dark && styles.labelDark]}>Priority:</Text>
          <View style={styles.priorityButtons}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityButton,
                  priority === p && styles.priorityButtonActive,
                  dark && styles.priorityButtonDark,
                  priority === p && dark && styles.priorityButtonActiveDark,
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.priorityButtonText,
                  priority === p && styles.priorityButtonTextActive,
                  dark && styles.priorityButtonTextDark,
                  priority === p && dark && styles.priorityButtonTextActiveDark,
                ]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.colorContainer, dark && styles.colorContainerDark]}>
          <Text style={[styles.label, dark && styles.labelDark]}>Color:</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  color === c && styles.colorDotSelected,
                  dark && color === c && styles.colorDotSelectedDark,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {mode === "edit" ? "💾 Save Changes" : "➕ Add Task"}
        </Text>
      </TouchableOpacity>

      {mode === "edit" && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancelEdit}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formDark: {
    backgroundColor: "#1e1e1e",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputDark: {
    backgroundColor: "#333",
    borderColor: '#444',
    color: '#fff',
  },
  textarea: {
    height: Platform.OS === 'ios' ? 80 : 70,
    textAlignVertical: "top",
  },
 dateButton: {
    backgroundColor: "#ddd", // contrast puternic light mode
    padding: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#bbb',
    alignItems: 'center',
},
dateButtonDark: {
    backgroundColor: "#333",
    borderColor: '#444',
},

dateButtonText: {
    fontSize: 16,
    color: "#007bff",     // vizibil, identic cu butonul Add Task
    fontWeight: "700",
},
dateButtonTextDark: {
    fontSize: 16,
    color: "#f1f1f1",
    fontWeight: "600",
},


  row: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 16,
  },
  priorityContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  priorityContainerDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  colorContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  colorContainerDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  labelDark: {
    color: '#bbb',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  priorityButtonDark: {
    backgroundColor: '#3a3a3a',
  },
  priorityButtonActive: {
    backgroundColor: '#007bff',
  },
  priorityButtonActiveDark: {
    backgroundColor: '#007bff',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priorityButtonTextDark: {
    color: '#ddd',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  priorityButtonTextActiveDark: {
    color: '#fff',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: '#000',
    transform: [{ scale: 1.1 }],
  },
  colorDotSelectedDark: {
    borderColor: '#fff',
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: Platform.OS === 'ios' ? 16 : 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: "#ff5252",
    fontSize: 16,
    fontWeight: "600",
  },
pickerWrap: {
  borderRadius: 10,
  paddingVertical: 6,
  marginBottom: 10,
},

pickerWrapLight: {
  backgroundColor: "#eee",  // NU alb pur, se integrează cu light mode
},

pickerWrapDark: {
  backgroundColor: "#2a2a2a",
},


});