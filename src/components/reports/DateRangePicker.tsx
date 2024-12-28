import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DateRange } from "@/types/reports";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePayPeriod } from "@/contexts/PayPeriodContext";

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DateRangePicker = ({ dateRange, onDateRangeChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getPayPeriodRange } = usePayPeriod();

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const { startDate, endDate } = getPayPeriodRange(selectedDate);
      onDateRangeChange({ startDate, endDate });
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "justify-start text-left font-normal",
            "bg-fitness-card border-fitness-grid hover:bg-fitness-inner",
            "text-fitness-text"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-fitness-accent" />
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
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-fitness-card border-fitness-grid" 
        align="start"
      >
        <Calendar
          initialFocus
          mode="single"
          defaultMonth={dateRange.startDate}
          selected={dateRange.startDate}
          onSelect={handleSelect}
          numberOfMonths={1}
          className="text-fitness-text"
        />
      </PopoverContent>
    </Popover>
  );
};