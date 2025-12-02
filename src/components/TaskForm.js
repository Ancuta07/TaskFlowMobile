import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { generateId } from "../utils/storage";

const PRIORITIES = ["High", "Medium", "Low"];

export default function TaskForm({
  mode = "add",
  initialTask,
  onSubmit,
  onCancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [color, setColor] = useState("#3f51b5");
  const [priority, setPriority] = useState("Medium");

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDesc(initialTask.description || "");
      setDeadline(initialTask.deadline ? new Date(initialTask.deadline) : null);
      setColor(initialTask.color);
      setPriority(initialTask.priority);
    } else {
      setTitle("");
      setDesc("");
      setDeadline(null);
      setColor("#3f51b5");
      setPriority("Medium");
    }
  }, [initialTask]);

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

      setTitle("");
      setDesc("");
      setDeadline(null);
      setColor("#3f51b5");
      setPriority("Medium");
    } else {
      onSubmit(base);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Title *"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {deadline ? deadline.toLocaleString() : "Pick a deadline"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={deadline || new Date()}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setDeadline(date);
          }}
        />
      )}

      <TextInput
        placeholder="Description"
        multiline
        style={[styles.input, styles.textarea]}
        value={desc}
        onChangeText={setDesc}
      />

      <View style={styles.row}>
        <Picker
          selectedValue={priority}
          style={styles.picker}
          onValueChange={setPriority}
        >
          {PRIORITIES.map((p) => (
            <Picker.Item key={p} label={`${p} Priority`} value={p} />
          ))}
        </Picker>

        {/* Color Picker simplu */}
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={color}
          onChangeText={setColor}
          placeholder="Color HEX"
        />
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>
          {mode === "edit" ? "Save changes" : "Add Task"}
        </Text>
      </TouchableOpacity>

      {mode === "edit" && (
        <TouchableOpacity style={styles.cancel} onPress={onCancelEdit}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  textarea: {
    height: 70,
  },
  dateButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButtonText: {
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  picker: {
    flex: 1,
    backgroundColor: "#eee",
  },
  submit: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  submitText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancel: {
    padding: 10,
    marginTop: 8,
  },
  cancelText: {
    textAlign: "center",
    color: "red",
  },
});
