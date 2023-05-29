import {
  Input,
  Button,
  Text,
  ButtonGroup,
  CheckBox,
  Select,
  SelectItem,
  IndexPath,
  useTheme,
} from "@ui-kitten/components";
import { useState } from "react";
import { Modal, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reminder } from "../types";
import dayjs from "dayjs";
import { ScrollView } from "react-native";
import { scheduleReminder } from "../utils/scheduleReminder";
import {
  addReminder,
  deleteReminder,
  updateReminder,
} from "../utils/reminders";

type Props = {
  onDismiss: () => void;
  onSubmit: (reminder: Reminder, isEdit: boolean) => void;
  onDelete: (reminderId: string) => void;
  reminder?: Reminder;
};

const formSchema = z.object({
  title: z.string().min(1, "Pole wymagane"),
  description: z.string(),
  isRecurring: z.boolean(),
  date: z.date(),
  time: z.date(),
  repeatUnit: z
    .enum(["minutes", "hours", "days", "weeks", "months", "years"] as const)
    .optional(),
});

type FormFields = z.infer<typeof formSchema>;

const reccuringOptions: {
  label: string;
  value: Reminder["repeatUnit"];
  index: number;
}[] = [
  { label: "Minutę", value: "minutes", index: 0 },
  { label: "Godzinę", value: "hours", index: 1 },
  { label: "Dzień", value: "days", index: 2 },
  { label: "Tydzień", value: "weeks", index: 3 },
  { label: "Miesiąc", value: "months", index: 4 },
  { label: "Rok", value: "years", index: 5 },
];

export const CreateReminderModal = ({
  onDismiss,
  onSubmit,
  onDelete,
  reminder,
}: Props) => {
  const theme = useTheme();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const { formState, handleSubmit, setValue, watch } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: reminder
      ? {
          ...reminder,
          date: new Date(reminder.date),
          time: new Date(reminder.time),
        }
      : {
          title: "",
          description: "",
          date: new Date(),
          time: new Date(),
          isRecurring: false,
        },
  });

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    setIsDatePickerOpen(false);
    setValue("date", date, { shouldValidate: true });
  };

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    setIsTimePickerOpen(false);
    setValue("time", date, { shouldValidate: true });
  };

  const handleReccuringOptionChange = (event: any) => {
    const index = event.row;
    const option = reccuringOptions[index];
    setValue("repeatUnit", option.value, { shouldValidate: true });
  };

  const handleDeleteReminder = async () => {
    await deleteReminder(reminder.id);
    onDelete(reminder.id);
  };

  const submitHandler = async (data: FormFields) => {
    const reminderData: Reminder = {
      id: isEdit ? reminder.id : nanoid(),
      title: data.title,
      description: data.description,
      date: data.date.toString(),
      time: data.time.toString(),
      isRecurring: data.isRecurring,
      repeatUnit: data.repeatUnit,
    };

    const handler = isEdit ? updateReminder : addReminder;
    await handler(reminderData);
    onSubmit(reminderData, isEdit);
  };

  const isEdit = !!reminder;
  const titleValue = watch("title");
  const descriptionValue = watch("description");
  const dateValue = watch("date");
  const timeValue = watch("time");
  const isRecurring = watch("isRecurring");
  const repeatUnit = watch("repeatUnit");

  const selectedRecuringOption = reccuringOptions.find(
    (option) => option.value === repeatUnit
  );

  return (
    <Modal
      visible
      onDismiss={onDismiss}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <ScrollView
        style={{
          flex: 1,
          gap: 16,
          paddingTop: 16,
          paddingBottom: 32,
          paddingHorizontal: 16,
          backgroundColor: theme["background-basic-color-1"],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 24 }}>
            {isEdit ? "Edytuj przypomnienie" : "Dodaj przypomnienie"}
          </Text>
          <Button size="tiny" onPress={onDismiss}>
            Zamknij
          </Button>
        </View>

        <View style={{ gap: 16 }}>
          <Input
            label="Tytuł"
            caption={formState.errors.title?.message}
            status={formState.errors.title ? "danger" : "basic"}
            value={titleValue}
            onChange={(e) =>
              setValue("title", e.nativeEvent.text, {
                shouldValidate: true,
              })
            }
          />

          <Input
            label="Opis"
            multiline
            caption={formState.errors.description?.message}
            status={formState.errors.description ? "danger" : "basic"}
            value={descriptionValue}
            onChange={(e) =>
              setValue("description", e.nativeEvent.text, {
                shouldValidate: true,
              })
            }
          />

          <View>
            <Text style={{ fontSize: 12, marginBottom: 4 }}>
              Kliknij w pole, aby wybrać datę i godzinę przypomnienia
            </Text>

            <ButtonGroup>
              <Button
                style={{ flex: 1 }}
                onPress={() => setIsDatePickerOpen(true)}
              >
                {dayjs(dateValue).format("DD.MM.YYYY")}
              </Button>
              <Button
                style={{ flex: 1 }}
                onPress={() => setIsTimePickerOpen(true)}
              >
                {dayjs(timeValue).format("HH:mm")}
              </Button>
            </ButtonGroup>
          </View>

          {isDatePickerOpen && (
            <DateTimePicker
              display="spinner"
              mode="date"
              minimumDate={new Date()}
              value={dateValue}
              onChange={handleDateChange}
            />
          )}

          {isTimePickerOpen && (
            <DateTimePicker
              display="spinner"
              mode="time"
              is24Hour
              value={timeValue}
              onChange={handleTimeChange}
            />
          )}

          <CheckBox
            style={{ marginLeft: 2 }}
            checked={isRecurring}
            onChange={(checked) =>
              setValue("isRecurring", checked, {
                shouldValidate: true,
              })
            }
          >
            Powiadomienie cykliczne
          </CheckBox>

          {isRecurring && (
            <View>
              <Text style={{ fontSize: 14, marginBottom: 4 }}>
                Przypominaj co:
              </Text>

              <Select
                placeholder="Wybierz jednostkę"
                value={selectedRecuringOption?.label}
                selectedIndex={
                  selectedRecuringOption
                    ? new IndexPath(selectedRecuringOption.index)
                    : undefined
                }
                onSelect={handleReccuringOptionChange as any}
                style={{ flex: 1 }}
              >
                {reccuringOptions.map((option) => (
                  <SelectItem key={option.value} title={option.label} />
                ))}
              </Select>
            </View>
          )}
        </View>

        <View style={{ gap: 8, marginTop: 64 }}>
          {isEdit && (
            <Button
              status="danger"
              onPress={handleDeleteReminder}
              style={{ marginTop: "auto" }}
            >
              Usuń
            </Button>
          )}

          <Button onPress={handleSubmit(submitHandler)}>Zapisz</Button>
        </View>
      </ScrollView>
    </Modal>
  );
};
