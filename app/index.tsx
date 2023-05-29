import {
  Text,
  List,
  ListItem,
  Button,
  Spinner,
  useTheme,
} from "@ui-kitten/components";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { CreateReminderModal } from "../components/CreateReminderModal";
import { Reminder } from "../types";
import { getReminders } from "../utils/reminders";

const App = () => {
  const theme = useTheme();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [reminders, setReminders] = useState<Reminder[] | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    getReminders().then((reminders) => setReminders(reminders));
  }, []);

  const handleOpenReminder = (reminder: Reminder) => {
    setReminder(reminder);
  };

  const handleSubmitReminder = async (reminder: Reminder, isEdit: boolean) => {
    if (isEdit) {
      setReminders((reminders) =>
        reminders.map((r) => (r.id === reminder.id ? reminder : r))
      );
    } else {
      setReminders((reminders) => [...reminders, reminder]);
    }

    setIsCreateModalOpen(false);
    setReminder(null);
  };

  const handleDismissReminder = () => {
    setReminder(null);
    setIsCreateModalOpen(false);
  };

  const handleDeleteReminder = async (reminderId: string) => {
    const newReminders = reminders.filter((r) => r.id !== reminderId);
    setReminder(null);
    setIsCreateModalOpen(false);
    setReminders(newReminders);
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
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>
              Przypomnienia
            </Text>
          ),
          headerRight: () => (
            <View style={{ paddingHorizontal: 16 }}>
              <Button onPress={() => setIsCreateModalOpen(true)} size="tiny">
                Dodaj
              </Button>
            </View>
          ),
        }}
      />

      <View
        style={{ flex: 1, backgroundColor: theme["background-basic-color-1"] }}
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
                  paddingHorizontal: 16,
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  Nie posiadasz żadnych przypomnień.
                </Text>
                <Button onPress={() => setIsCreateModalOpen(true)} size="small">
                  Dodaj przypomnienie
                </Button>
              </View>
            ) : (
              <List
                data={reminders}
                renderItem={({ item }) => (
                  <ListItem
                    onPress={() => handleOpenReminder(item)}
                    title={item.title}
                    description={item.description}
                  />
                )}
              />
            )}
          </>
        )}
      </View>

      {(isCreateModalOpen || reminder) && (
        <CreateReminderModal
          reminder={reminder}
          onDelete={handleDeleteReminder}
          onDismiss={handleDismissReminder}
          onSubmit={handleSubmitReminder}
        />
      )}
    </>
  );
};

export default App;
