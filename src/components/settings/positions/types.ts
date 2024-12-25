export interface Position {
  positionid?: number;
  positionname: string;
  paytype: string | null;
  defaultpayrate: number | null;
  description: string | null;
  required_certifications: string[];
  min_experience_months: number;
}

export interface FormData {
  positionname: string;
  paytype: string;
  defaultpayrate: string;
  description: string;
  required_certifications: string;
  min_experience_months: string;
}