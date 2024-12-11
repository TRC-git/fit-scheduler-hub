import { X } from "lucide-react";

const timeSlots = [
  "5:00am - 6:00am",
  "6:00am - 7:00am",
  "8:00am - 9:00am",
  "3:00pm - 4:00pm",
  "4:00pm - 5:00pm",
  "5:00pm - 6:00pm",
  "6:00pm - 7:00pm",
];

const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

const ScheduleGrid = () => {
  return (
    <div className="bg-fitness-card rounded-lg p-4">
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="text-fitness-text font-medium p-2">Avail. Times</div>
        {days.map((day, index) => (
          <div
            key={day}
            className={`text-fitness-text font-medium p-2 text-center ${
              index === 6 ? "bg-red-900/20" : "bg-fitness-muted"
            } rounded-md`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {timeSlots.map((timeSlot) => (
          <div key={timeSlot} className="grid grid-cols-8 gap-2">
            <div className="text-fitness-text p-2">{timeSlot}</div>
            {days.map((day) => (
              <div
                key={`${timeSlot}-${day}`}
                className="bg-fitness-muted/50 rounded-md p-2"
              >
                <div className="bg-[#1A1F2C] p-2 rounded flex items-center justify-between">
                  <div>
                    <p className="text-fitness-text text-sm">Heath Graham</p>
                    <p className="text-xs text-gray-400">CrossFit</p>
                  </div>
                  <X className="w-4 h-4 text-red-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;