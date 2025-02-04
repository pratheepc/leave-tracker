"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { UseFormRegister } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  register?: UseFormRegister<any>;
  name?: string;
}

export default function DatePicker({ id, value, onChange, register, name }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onChange) {
      onChange(selectedDate)
    }
  }

  // Register the input with react-hook-form if register and name are provided
  React.useEffect(() => {
    if (register && name) {
      register(name)
    }
  }, [register, name])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
