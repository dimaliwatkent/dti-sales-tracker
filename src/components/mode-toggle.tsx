import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <div onClick={toggleTheme} className="">
        {theme === "light" ? (
          <div className="flex items-center gap-2">
            <Sun size={16} />
            <p className="md:hidden">Light Mode</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Moon size={16} />
            <p className="md:hidden">Dark Mode</p>
          </div>
        )}
      </div>
    </>
  );
}
