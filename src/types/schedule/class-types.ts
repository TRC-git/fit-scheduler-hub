export interface ClassType {
  class_type_id: number;
  name: string;
  duration: number;
  created_at?: string;
}

export interface CreateClassTypeData {
  name: string;
  duration: number;
}

export interface UpdateClassTypeData {
  name?: string;
  duration?: number;
}