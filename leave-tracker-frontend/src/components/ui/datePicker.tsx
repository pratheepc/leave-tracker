"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./input"

interface DatePickerProps {
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({ id, value, onChange, placeholder = "DD/MM/YYYY" }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [inputValue, setInputValue] = React.useState(value ? format(value, 'dd/MM/yyyy') : '')
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setInputValue(selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '')
    if (onChange) onChange(selectedDate)
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')  // Remove non-digits

    if (val.length > 8) val = val.slice(0, 8)

    // Add slashes automatically
    if (val.length >= 4) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4)
    } else if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2)
    }

    setInputValue(val)

    // Parse date when input is complete
    if (val.length === 10) {
      try {
        const parsedDate = parse(val, 'dd/MM/yyyy', new Date())
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate)
          if (onChange) onChange(parsedDate)
        }
      } catch (error) {
        // Invalid date
      }
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDate(undefined)
    setInputValue('')
    if (onChange) onChange(undefined)
  }

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(
          "w-full pr-20", // Increased padding-right for icons
          !date && "text-muted-foreground"
        )}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
