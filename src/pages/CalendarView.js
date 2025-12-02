import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarView({ tasks }) {
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Task Calendar</Text>

      <Calendar
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={markedDates}
      />

      <Text style={styles.subtitle}>Tasks for {selected}</Text>

      {tasksForDay.length === 0 ? (
        <Text>No tasks for this day</Text>
      ) : (
        tasksForDay.map((t) => (
          <View key={t.id} style={[styles.task, { borderLeftColor: t.color }]}>
            <Text style={styles.taskTitle}>{t.title}</Text>
            <Text>{t.priority} Priority</Text>
            {t.description && <Text>{t.description}</Text>}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    marginBottom: 8,
  },
  task: {
    borderLeftWidth: 6,
    padding: 10,
    marginBottom: 10,
  },
  taskTitle: {
    fontWeight: "bold",
  },
});
