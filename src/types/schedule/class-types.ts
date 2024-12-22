export interface ClassType {
  class_type_id: number;
  name: string;
  duration: number;
  created_at?: string;
  operational_days?: string[];
}

export interface CreateClassTypeData {
  name: string;
  duration: number;
}

export interface UpdateClassTypeData {
  name?: string;
  duration?: number;
  operational_days?: string[];
}