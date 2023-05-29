import AsyncStorage from "@react-native-async-storage/async-storage";
import { Preferences } from "../types";

const DEFAULT_PREFERENCES: Preferences = {
  theme: "light",
};

export const getUserPreferences = async () => {
  const preferences = await AsyncStorage.getItem("preferences");
  if (preferences) return JSON.parse(preferences) as Preferences;
  return DEFAULT_PREFERENCES;
};

export const setUserPreferences = async (preferences: Partial<Preferences>) => {
  const currentPreferences = await getUserPreferences();
  const newPreferences = { ...currentPreferences, ...preferences };
  await AsyncStorage.setItem("preferences", JSON.stringify(newPreferences));
};
