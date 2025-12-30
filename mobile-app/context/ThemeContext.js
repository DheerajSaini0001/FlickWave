
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'nativewind';

const ThemeContext = createContext({
    colorScheme: 'dark',
    toggleColorScheme: () => { },
});

export const ThemeProvider = ({ children }) => {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
