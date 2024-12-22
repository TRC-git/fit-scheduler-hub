import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import ClassTypeDialog from "./ClassTypeDialog";
import ClassTypesList from "./ClassTypesList";

const ClassTypes = () => {
  const { 
    classTypes, 
    createClassType, 
    updateClassType, 
    deleteClassType 
  } = useClassTypes();

  return (
    <div>
      <div className="mb-4">
        <ClassTypeDialog onSubmit={(data) => createClassType.mutateAsync(data)} />
      </div>

      <ClassTypesList
        classTypes={classTypes || []}
        onUpdate={(id, data) => updateClassType.mutateAsync({ id, data })}
        onDelete={(id) => deleteClassType.mutateAsync(id)}
      />
    </div>
  );
};

export default ClassTypes;