// App.js
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CalendarView from "./src/pages/CalendarView";
import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";

import { ThemeProvider } from "./src/context/ThemeContext";

import { getCurrentUser, logoutUser } from "./src/utils/auth";
import {
  addTask,
  deleteTask,
  subscribeToTasks,
  updateTask,
} from "./src/utils/storage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔵 verifică dacă user este logat
  useEffect(() => {
    getCurrentUser().then((usr) => {
      setUser(usr);
      setLoading(false);
    });
  }, []);

  // 🔵 ascultă în timp real task-urile
  useEffect(() => {
    if (!user) return;

    const unsub = subscribeToTasks(user.uid, setTasks);
    return unsub;
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <Login {...props} onLoginSuccess={(u) => setUser(u)} />
                )}
              </Stack.Screen>

              <Stack.Screen name="Register" component={Register} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home">
                {(props) => (
                  <Home
                    {...props}
                    user={user}
                    tasks={tasks}
                    onAdd={(t) => addTask(t, user.uid)}
                    onDelete={deleteTask}
                    onUpdate={updateTask}
                    onLogout={() => {
                      logoutUser();
                      setUser(null);
                      setTasks([]);
                    }}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Calendar">
                {(props) => <CalendarView {...props} tasks={tasks} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
