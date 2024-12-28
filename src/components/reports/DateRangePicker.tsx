import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DateRange } from "@/types/reports";
import { CalendarIcon } from "lucide-react";

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DateRangePicker = ({ dateRange, onDateRangeChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.startDate ? (
            dateRange.endDate ? (
              <>
                {format(dateRange.startDate, "LLL dd, y")} -{" "}
                {format(dateRange.endDate, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.startDate, "LLL dd, y")
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.startDate}
          selected={{
            from: dateRange.startDate,
            to: dateRange.endDate,
          }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              onDateRangeChange({
                startDate: range.from,
                endDate: range.to,
              });
              setIsOpen(false);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};