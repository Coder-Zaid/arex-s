
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    // If there's a saved theme, use it
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      applyThemeStyles(savedTheme);
    } 
    // Otherwise check for system preference
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        applyThemeStyles('dark');
      }
    }
  }, []);

  const applyThemeStyles = (currentTheme: Theme) => {
    if (currentTheme === 'dark') {
      // Apply black color for selected items in dark mode
      document.documentElement.style.setProperty('--selected-bg', '#191919');
      document.documentElement.style.setProperty('--selected-text', '#ffffff');
      
      // Fix Apple logo visibility in dark mode
      document.documentElement.style.setProperty('--apple-logo-filter', 'invert(1)');
    } else {
      document.documentElement.style.setProperty('--selected-bg', '#f0f0f0');
      document.documentElement.style.setProperty('--selected-text', '#2563eb');
      document.documentElement.style.setProperty('--apple-logo-filter', 'none');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    applyThemeStyles(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
