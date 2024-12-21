import { GripVertical } from "lucide-react";

export const DragHandle = () => (
  <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
);