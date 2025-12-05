import { useContext, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { ThemeContext } from "../context/ThemeContext";

export default function CalendarView({ route, navigation }) {
  const { dark } = useContext(ThemeContext);
  const tasks = route?.params?.tasks || [];

  const [selected, setSelected] = useState(
    new Date().toISOString().split("T")[0]
  );

  const dateKey = (d) => new Date(d).toISOString().split("T")[0];

  const markedDates = useMemo(() => {
    const marks = {};

    tasks.forEach((t) => {
      if (t.deadline) {
        const key = dateKey(t.deadline);
        marks[key] = {
          marked: true,
          dotColor: t.color || "blue",
        };
      }
    });

    marks[selected] = {
      ...(marks[selected] || {}),
      selected: true,
      selectedColor: "#007bff",
    };

    return marks;
  }, [tasks, selected]);

  const tasksForDay = tasks.filter((t) => dateKey(t.deadline) === selected);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: dark ? "#121212" : "#fff" }]}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backText, { color: dark ? "#fff" : "#007bff" }]}>
          ← Back to List
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: dark ? "#fff" : "#000" }]}>
        📅 Task Calendar
      </Text>

      <Calendar
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: dark ? "#121212" : "#fff",
          calendarBackground: dark ? "#1e1e1e" : "#fff",
          dayTextColor: dark ? "#fff" : "#000",
          monthTextColor: dark ? "#fff" : "#000",
          arrowColor: "#007bff",
        }}
      />

      <Text style={[styles.subtitle, { color: dark ? "#fff" : "#000" }]}>
        Tasks for {selected}
      </Text>

      {tasksForDay.length === 0 ? (
        <Text style={[styles.noTasks, { color: dark ? "#bbb" : "#777" }]}>
          No tasks for this day
        </Text>
      ) : (
        tasksForDay.map((t) => (
          <View
            key={t.id}
            style={[
              styles.task,
              {
                borderLeftColor: t.color,
                backgroundColor: dark ? "#1e1e1e" : "#f9f9f9",
              },
            ]}
          >
            <Text style={[styles.taskTitle, { color: dark ? "#fff" : "#000" }]}>
              {t.title}
            </Text>

            <Text style={{ color: dark ? "#ddd" : "#333" }}>
              {t.priority} Priority
            </Text>

            {t.description ? (
              <Text style={{ color: dark ? "#bbb" : "#555" }}>
                {t.description}
              </Text>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
  },
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "600",
  },
  noTasks: {
    textAlign: "center",
    marginTop: 20,
  },
  task: {
    borderLeftWidth: 6,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
