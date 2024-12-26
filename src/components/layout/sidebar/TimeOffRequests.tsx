import { Plus, Check, X } from "lucide-react";

const timeOffRequests = [
  { name: "Heath Graham", status: "pending" },
  { name: "Jay Duquette", status: "pending" },
];

export const TimeOffRequests = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-fitness-text">
          Time Off Request
        </h2>
        <button className="flex items-center gap-1 text-fitness-accent">
          <Plus className="w-4 h-4" />
          Ask
        </button>
      </div>
      <div className="space-y-3">
        {timeOffRequests.map((request, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-fitness-inner rounded-md"
          >
            <span className="text-fitness-text">{request.name}</span>
            <div className="flex gap-2">
              <Check className="w-5 h-5 text-green-500 cursor-pointer" />
              <X className="w-5 h-5 text-red-500 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};