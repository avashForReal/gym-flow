import { useState } from "react"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  selectedDate: Date | null
  onDateChange: (date: Date | null) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  selectedDate,
  onDateChange,
  placeholder = "Select date",
  className = ""
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date)
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    onDateChange(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={isOpen ? "default" : "outline"}
              className="h-9 px-3 text-sm justify-start text-left font-normal"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {selectedDate ? formatDate(selectedDate) : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleDateSelect}
              initialFocus
              showOutsideDays={false}
              className="rounded-md border-0"
            />
          </PopoverContent>
        </Popover>

        {selectedDate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
