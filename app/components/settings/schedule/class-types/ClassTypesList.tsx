import { ClassType, UpdateClassTypeData } from "@/types/schedule/class-types";
import ClassTypeItem from "./ClassTypeItem";

interface ClassTypesListProps {
  classTypes: ClassType[];
  onUpdate: (id: number, data: UpdateClassTypeData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const ClassTypesList = ({ classTypes, onUpdate, onDelete }: ClassTypesListProps) => {
  return (
    <div className="grid gap-4">
      {classTypes?.map((classType) => (
        <ClassTypeItem
          key={classType.class_type_id}
          classType={classType}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ClassTypesList;