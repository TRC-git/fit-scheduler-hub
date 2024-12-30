import { TimeOffRequest } from "./types";
import { Button } from "@/components/ui/button";

interface RequestListProps {
  requests: TimeOffRequest[];
  onApprove?: (requestId: number) => Promise<void>;
  type: "pending" | "approved";
}

export const RequestList = ({ requests, onApprove, type }: RequestListProps) => {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.request_id}
          className="flex items-center justify-between p-4 rounded-lg bg-[#202020]"
        >
          <div className="space-y-1">
            <p className="text-fitness-text font-medium">
              {request.employees.firstname} {request.employees.lastname}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
            </p>
            {request.reason && (
              <p className="text-sm text-fitness-accent">{request.reason}</p>
            )}
            {type === "approved" && request.approver && (
              <p className="text-sm text-gray-400">
                Approved by: {request.approver.firstname} {request.approver.lastname}
              </p>
            )}
          </div>
          {type === "pending" && onApprove && (
            <Button 
              onClick={() => onApprove(request.request_id)}
              className="bg-fitness-accent text-black hover:bg-fitness-accent/90"
            >
              Approve
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};