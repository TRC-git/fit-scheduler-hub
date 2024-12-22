export interface DatabaseTypes {
  class_types: ClassTypesTable;
  // other table types can be added here as needed
}

export interface ClassTypesTable {
  class_type_id: number;
  name: string;
  duration: number;
  created_at?: string;
  operational_days?: string[];
  opening_time?: string;
  closing_time?: string;
}
