import { useContext } from "react";
import { ListItem, Text, Toggle, useTheme } from "@ui-kitten/components";
import { Tabs } from "expo-router";
import { ScrollView } from "react-native";
import { UserPreferencesContext } from "../components/UserPreferencesContext";

const SettingsPage = () => {
  const theme = useTheme();
  const preferences = useContext(UserPreferencesContext);

  const handleDarkModeToggle = async (checked: boolean) => {
    const theme = checked ? "dark" : "light";
    preferences.handleThemeChange(theme);
  };

  return (
    <>
      <Tabs.Screen
        options={{
          headerStyle: {
            backgroundColor: theme["background-basic-color-2"],
          },
          tabBarStyle: {
            backgroundColor: theme["background-basic-color-2"],
          },
          headerTitle: () => (
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>Ustawienia</Text>
          ),
        }}
      />

      <ScrollView
        style={{
          flex: 1,
          paddingVertical: 16,
          paddingHorizontal: 16,
          backgroundColor: theme["background-basic-color-1"],
        }}
      >
        <ListItem
          title="Ciemny motyw"
          description="Zmień motyw aplikacji"
          accessoryRight={
            <Toggle
              checked={preferences.theme === "dark"}
              onChange={handleDarkModeToggle}
            />
          }
        />
      </ScrollView>
    </>
  );
};

export default SettingsPage;
