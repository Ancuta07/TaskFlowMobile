/* import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

// -------------------------------
// Încarcă task-urile pentru user-ul curent
// -------------------------------
export async function loadTasks(userId) {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const tasks = [];
    querySnapshot.forEach((docItem) => {
      tasks.push({ id: docItem.id, ...docItem.data() });
    });

    return tasks;
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
}

// -------------------------------
// Ascultă în timp real task-urile
// -------------------------------
export function subscribeToTasks(userId, callback) {
  const tasksRef = collection(db, "tasks");
  const q = query(tasksRef, where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const tasks = [];
    snapshot.forEach((docItem) => {
      tasks.push({ id: docItem.id, ...docItem.data() });
    });
    callback(tasks);
  });
}

// -------------------------------
// Adaugă un task nou
// -------------------------------
export async function addTask(task, userId) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...task,
      userId,
      createdAt: new Date().toISOString(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// -------------------------------
// Actualizează task
// -------------------------------
export async function updateTask(taskId, updates) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// -------------------------------
// Șterge task
// -------------------------------
export async function deleteTask(taskId) {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// -------------------------------
// Generator de ID compatibil cu toate platformele
// -------------------------------
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}
*/

// src/utils/storage.js - PENTRU EXPO (LA FEL CA ÎN REACT WEB)
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

export async function loadTasks(userId) {
  try {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    
    return tasks;
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
}

export function subscribeToTasks(userId, callback) {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('userId', '==', userId));
  
  return onSnapshot(q, (snapshot) => {
    const tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    callback(tasks);
  });
}

export async function addTask(task, userId) {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      userId: userId,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateTask(taskId, updates) {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteTask(taskId) {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export function generateId() {
  if (window.crypto?.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}