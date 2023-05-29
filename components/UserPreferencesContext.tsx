import { ReactNode, createContext } from "react";
import { setUserPreferences } from "../utils/userPreferences";
import { Preferences } from "../types";

export const UserPreferencesContext = createContext<any>({});

type Props = {
  theme: Preferences["theme"];
  children: ReactNode;
  setTheme: (theme: Preferences["theme"]) => void;
};

export const UserPreferencesProvider = ({
  children,
  theme,
  setTheme,
}: Props) => {
  const handleThemeChange = async (theme: Preferences["theme"]) => {
    setTheme(theme);
    await setUserPreferences({ theme });
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        handleThemeChange,
        theme,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
