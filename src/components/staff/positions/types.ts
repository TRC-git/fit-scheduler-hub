export interface Position {
  positionid: number;
  positionname: string;
  defaultpayrate: number | null;
  payrate?: number;
  access_level?: any;
  paytype?: string | null;
  description?: string | null;
  required_certifications?: string[];
  min_experience_months?: number;
}

export interface PositionWithPayRate extends Position {
  defaultpayrate: number | null;
}