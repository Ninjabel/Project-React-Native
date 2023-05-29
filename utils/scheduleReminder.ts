import dayjs from "dayjs";
import { Reminder } from "../types";
import * as Notifications from "expo-notifications";
import {
  NotificationContentInput,
  NotificationTriggerInput,
} from "expo-notifications";

export const scheduleReminder = async (reminder: Reminder) => {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;
  }

  const content: NotificationContentInput = {
    title: reminder.title,
    body: reminder.description,
    sound: true,
  };

  const selectedDate = dayjs(reminder.date);
  const selectedTime = dayjs(reminder.time);
  const selectedDateTime = selectedDate
    .hour(selectedTime.hour())
    .minute(selectedTime.minute())
    .second(0);

  let trigger: NotificationTriggerInput = {
    seconds: selectedDateTime.diff(dayjs(), "second"),
  };

  if (reminder.isRecurring) {
    let interval = 0;
    switch (reminder.repeatUnit) {
      case "minutes":
        interval = 60 * 1000;
        break;
      case "hours":
        interval = 60 * 60 * 1000;
        break;
      case "days":
        interval = 24 * 60 * 60 * 1000;
        break;
      case "weeks":
        interval = 7 * 24 * 60 * 60 * 1000;
        break;
      case "months":
        interval = 30 * 24 * 60 * 60 * 1000;
        break;
      case "years":
        interval = 365 * 24 * 60 * 60 * 1000;
        break;
    }

    trigger = {
      ...trigger,
      repeats: true,
      seconds: interval / 1000,
    };
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });

  return notificationId;
};
