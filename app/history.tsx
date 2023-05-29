import {
  Button,
  List,
  ListItem,
  Spinner,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import dayjs from "dayjs";
import { HistoryReminder } from "../types";
import { clearRemindersHistory, getRemindersHistory } from "../utils/reminders";

const HistoryPage = () => {
  const theme = useTheme();
  const [reminders, setReminders] = useState<HistoryReminder[] | null>(null);

  useEffect(() => {
    getRemindersHistory().then((reminders) => {
      setReminders(reminders);
    });
  }, []);

  const handleOpenReminder = (reminder: HistoryReminder) => {
    Alert.alert(reminder.title, reminder.description);
  };

  const handleClearHistory = async () => {
    setReminders([]);
    await clearRemindersHistory();
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
          tabBarIcon: () => <Text>📖</Text>,
          headerTitle: () => (
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>Historia</Text>
          ),
          headerRight: () => (
            <View style={{ paddingHorizontal: 16 }}>
              <Button onPress={handleClearHistory} size="tiny">
                Wyczyść
              </Button>
            </View>
          ),
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: theme["background-basic-color-1"],
        }}
      >
        {!reminders && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner />
          </View>
        )}

        {reminders && (
          <>
            {reminders.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  gap: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  Historia jest pusta.
                </Text>
              </View>
            ) : (
              <List
                data={reminders}
                renderItem={({ item }) => (
                  <ListItem
                    onPress={() => handleOpenReminder(item)}
                    title={item.title}
                    description={dayjs(item.date).format("DD.MM.YYYY HH:mm")}
                  />
                )}
              />
            )}
          </>
        )}
      </View>
    </>
  );
};

export default HistoryPage;
