export interface PositionWithPayRate {
  positionid: number;
  positionname: string;
  defaultpayrate: number;
  payrate?: number;
  access_level: any;
}

export interface FormData {
  positionname: string;
  paytype: string;
  defaultpayrate: string;
  description: string;
  required_certifications: string;
  min_experience_months: string;
}