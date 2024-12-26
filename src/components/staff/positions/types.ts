export interface Position {
  positionid: number;
  positionname: string;
  defaultpayrate: number | null;
  paytype?: string | null;
  description?: string | null;
  required_certifications?: string[];
  min_experience_months?: number;
  access_level?: any;
}

export interface PositionWithPayRate extends Position {
  payrate?: number;
}

export interface FormData {
  positionname: string;
  paytype: string;
  defaultpayrate: string;
  description: string;
  required_certifications: string;
  min_experience_months: string;
}