import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div>
      <button onClick={toggleTheme} className="hover:scale-125">
        {theme === "dark" ? <Moon /> : <Sun />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
