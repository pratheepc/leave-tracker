import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="top-4 right-4 z-50">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
                {theme === "light" ? (
                    <Moon className="h-[1.2rem] w-[1.2rem] dark:text-white" />
                ) : (
                    <Sun className="h-[1.2rem] w-[1.2rem] dark:text-white" />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    )
}
