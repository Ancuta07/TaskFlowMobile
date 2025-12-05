import { Picker } from "@react-native-picker/picker";
import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemeContext } from "../context/ThemeContext";
import { generateId } from "../utils/storage";

const PRIORITIES = ["High", "Medium", "Low"];

// 🎨 Culori presetate
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
      {/* Title */}
      <TextInput
        placeholder="Title *"
        placeholderTextColor={dark ? "#aaa" : "#666"}
        style={[styles.input, dark && styles.inputDark]}
        value={title}
        onChangeText={setTitle}
      />

      {/* Deadline picker */}
      <TouchableOpacity
        style={[styles.dateButton, dark && styles.inputDark]}
        onPress={() => setPickerVisible(true)}
      >
        <Text style={{ color: dark ? "#eee" : "#333" }}>
          {deadline ? deadline.toLocaleString() : "Pick a deadline"}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        onConfirm={(date) => {
          setDeadline(date);
          setPickerVisible(false);
        }}
        onCancel={() => setPickerVisible(false)}
      />

      {/* Description */}
      <TextInput
        placeholder="Description"
        placeholderTextColor={dark ? "#aaa" : "#666"}
        multiline
        style={[styles.input, styles.textarea, dark && styles.inputDark]}
        value={desc}
        onChangeText={setDesc}
      />

      {/* Priority + Color */}
      <View style={styles.row}>
        <Picker
          selectedValue={priority}
          style={[styles.picker, dark && styles.pickerDark]}
          onValueChange={setPriority}
        >
          {PRIORITIES.map((p) => (
            <Picker.Item key={p} label={`${p} Priority`} value={p} />
          ))}
        </Picker>

        {/* 🎨 SELECTOR DE CULORI (înlocuiește TextInput-ul HEX) */}
        <View style={[styles.colorBox, dark && styles.inputDark]}>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  color === c && { borderWidth: 3, borderColor: "#000" },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Submit */}
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
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  formDark: {
    backgroundColor: "#1a1a1a",
  },

  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  inputDark: {
    backgroundColor: "#333",
    color: "#fff",
  },

  textarea: {
    height: 70,
    textAlignVertical: "top",
  },

  dateButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  picker: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  pickerDark: {
    backgroundColor: "#333",
    color: "#fff",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  /* 🎨 Stiluri pentru selectorul de culori */
  colorBox: {
    flex: 1,
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
    justifyContent: "center",
  },

  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderColor: "#555",
    borderWidth: 1,
  },

  submit: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  submitText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
