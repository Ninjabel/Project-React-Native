import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { HistoryReminder, Reminder } from "../types";
import { scheduleReminder } from "./scheduleReminder";

export const getReminders = async () => {
  const storageItem = await AsyncStorage.getItem("reminders");
  const reminders = storageItem ? JSON.parse(storageItem) : [];
  return reminders as Reminder[];
};

export const deleteReminder = async (id: string) => {
  const reminders = await getReminders();
  const reminder = reminders.find((reminder) => reminder.id === id);
  await Notifications.cancelScheduledNotificationAsync(reminder.notificationId);
  const newReminders = reminders.filter((reminder) => reminder.id !== id);
  await AsyncStorage.setItem("reminders", JSON.stringify(newReminders));
};

export const addReminder = async (reminder: Reminder) => {
  const notificationId = await scheduleReminder(reminder);
  const newReminder = { ...reminder, notificationId };
  const reminders = await getReminders();
  await AsyncStorage.setItem(
    "reminders",
    JSON.stringify([...reminders, newReminder])
  );

  return newReminder;
};

export const updateReminder = async (reminder: Reminder) => {
  const reminders = await getReminders();
  const reminderIndex = reminders.findIndex(
    (reminderItem) => reminderItem.id === reminder.id
  );

  const oldReminder = reminders[reminderIndex];
  await Notifications.cancelScheduledNotificationAsync(
    oldReminder.notificationId
  );

  const newNotificationId = await scheduleReminder(reminder);
  const newReminder = { ...reminder, notificationId: newNotificationId };
  reminders[reminderIndex] = newReminder;
  await AsyncStorage.setItem("reminders", JSON.stringify(reminders));
  return newReminder;
};

export const getRemindersHistory = async () => {
  const storageItem = await AsyncStorage.getItem("reminders_history");
  const historyReminders = storageItem ? JSON.parse(storageItem) : [];
  return historyReminders as HistoryReminder[];
};

export const addReminderToHistory = async (reminder: HistoryReminder) => {
  const historyReminders = await getRemindersHistory();
  await AsyncStorage.setItem(
    "reminders_history",
    JSON.stringify([...historyReminders, reminder])
  );
};

export const clearRemindersHistory = async () => {
  await AsyncStorage.removeItem("reminders_history");
};
