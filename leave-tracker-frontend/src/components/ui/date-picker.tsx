import * as React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    value?: Date | string;
    onChange?: (date: string) => void;
    placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = "DD/MM/YYYY" }: DatePickerProps) {
    const [displayValue, setDisplayValue] = React.useState("");
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                setDisplayValue(`${day}/${month}/${year}`);
            }
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.replace(/\D/g, '');

        if (input.length > 8) input = input.slice(0, 8);

        let formatted = '';
        if (input.length >= 2) {
            formatted += input.slice(0, 2) + '/';
            if (input.length >= 4) {
                formatted += input.slice(2, 4) + '/';
                if (input.length > 4) {
                    formatted += input.slice(4, 8);
                }
            } else {
                formatted += input.slice(2);
            }
        } else {
            formatted = input;
        }

        setDisplayValue(formatted);

        if (input.length === 8) {
            const day = parseInt(input.slice(0, 2));
            const month = parseInt(input.slice(2, 4)) - 1;
            const year = parseInt(input.slice(4, 8));

            const date = new Date(year, month, day);
            if (!isNaN(date.getTime())) {
                onChange?.(date.toISOString());
            }
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDisplayValue("");
        onChange?.("");
    };

    return (
        <div className="relative">
            <Input
                type="text"
                placeholder={placeholder}
                value={displayValue}
                onChange={handleChange}
                maxLength={10}
                className={cn(
                    "w-full pl-3 pr-20 text-left",
                )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {displayValue && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleClear}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear date</span>
                    </Button>
                )}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            type="button"
                        >
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                            <span className="sr-only">Open calendar</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="single"
                            selected={value ? new Date(value) : undefined}
                            onSelect={(date) => {
                                onChange?.(date?.toISOString() ?? "");
                                setOpen(false);
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
} 