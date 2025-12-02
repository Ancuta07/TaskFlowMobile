import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const isOverdue = useMemo(() => {
    if (!task.deadline) return false;
    const due = new Date(task.deadline).getTime();
    return due < Date.now() && !["Completed", "Canceled"].includes(task.status);
  }, [task.deadline, task.status]);

  const effectiveStatus = isOverdue ? "Overdue" : task.status;

  return (
    <View style={[styles.container, { borderLeftColor: task.color }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{task.title}</Text>

        <Text
          style={[
            styles.badge,
            { backgroundColor: statusBadgeColor(effectiveStatus) },
          ]}
        >
          {effectiveStatus}
        </Text>
      </View>

      {task.description ? (
        <Text style={styles.desc}>{task.description}</Text>
      ) : null}

      <View style={styles.meta}>
        {task.deadline && (
          <Text style={styles.metaText}>
            Deadline: {new Date(task.deadline).toLocaleString()}
          </Text>
        )}
        <Text style={styles.metaText}>Priority: {task.priority}</Text>
      </View>

      <View style={styles.actions}>
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
  container: {
    borderLeftWidth: 8,
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  badge: {
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  desc: {
    marginVertical: 6,
    color: "#555",
  },
  meta: {
    marginVertical: 4,
  },
  metaText: {
    color: "#777",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  btn: {
    backgroundColor: "#eee",
    padding: 6,
    borderRadius: 6,
  },
  delete: {
    backgroundColor: "#c62828",
  },
});
