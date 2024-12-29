export interface StaffFormData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  is_admin: boolean;
}

export interface StaffFormProps {
  formData: StaffFormData;
  onChange: (field: string, value: string | boolean) => void;
}