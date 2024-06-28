// Interfaces

export interface CompetitorResponse {
  user_id: string;
  competitor_num: string;
  competitor_image: string;
  name: string;
  lastname: string;
  rh: string;
  eps: string;
  allergies: [];
  contacts: [];
  vehicle_id: string;
}

export interface VehicleResponse {
  vehicle_id: string;
  vehicle_image: string;
  vehicle_reference: string;
  plate: string;
  number_policy_soat: string;
  certificate_number_rtm: string;
  all_risk: boolean;
  user_id: string;
}
