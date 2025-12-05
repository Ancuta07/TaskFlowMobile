import { useContext, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

function statusBadgeColor(status) {
  switch (status) {
    case "Completed":
      return "#2e7d32";
    case "Canceled":
      return "#616161";
    case "Overdue":
      return "#c62828";
    default:
      return "#1565c0";
  }
}

export default function TaskItem({ task, onDelete, onUpdate, onEdit }) {
  const { dark } = useContext(ThemeContext);

  const isOverdue = useMemo(() => {
    if (!task.deadline) return false;
    const due = new Date(task.deadline).getTime();
    return due < Date.now() && !["Completed", "Canceled"].includes(task.status);
  }, [task.deadline, task.status]);

  const effectiveStatus = isOverdue ? "Overdue" : task.status;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: task.color },
        dark && styles.cardDark,
      ]}
    >
      {/* TITLE + BADGE */}
      <View style={styles.row}>
        <Text style={[styles.title, dark && { color: "#fff" }]}>
          {task.title}
        </Text>

        <Text
          style={[
            styles.badge,
            { backgroundColor: statusBadgeColor(effectiveStatus) },
          ]}
        >
          {effectiveStatus}
        </Text>
      </View>

      {/* DESCRIPTION */}
      {task.description ? (
        <Text style={[styles.desc, dark && { color: "#ddd" }]}>
          {task.description}
        </Text>
      ) : null}

      {/* META INFO */}
      <View style={styles.meta}>
        {task.deadline && (
          <Text style={[styles.metaText, dark && { color: "#bbb" }]}>
            Deadline: {new Date(task.deadline).toLocaleString()}
          </Text>
        )}
        <Text style={[styles.metaText, dark && { color: "#bbb" }]}>
          Priority: {task.priority}
        </Text>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={onEdit}>
          <Text>Edit</Text>
        </TouchableOpacity>

        {effectiveStatus !== "Completed" ? (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onUpdate(task.id, { status: "Completed" })}
          >
            <Text>Complete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onUpdate(task.id, { status: "Upcoming" })}
          >
            <Text>Reopen</Text>
          </TouchableOpacity>
        )}

        {effectiveStatus !== "Canceled" ? (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onUpdate(task.id, { status: "Canceled" })}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onUpdate(task.id, { status: "Upcoming" })}
          >
            <Text>Reopen</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btn, styles.delete]}
          onPress={() => onDelete(task.id)}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 8,
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#1e1e1e",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 17,
    fontWeight: "bold",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    color: "white",
    fontWeight: "600",
  },

  desc: {
    marginTop: 6,
    marginBottom: 8,
    color: "#555",
  },

  meta: {
    marginBottom: 10,
  },

  metaText: {
    color: "#777",
  },

  buttons: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  btn: {
    backgroundColor: "#ededed",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  delete: {
    backgroundColor: "#c62828",
  },
});
