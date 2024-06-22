export interface CompetitorResponse {
  user_id: string;
  competitorNum: string;
  competitorImage: string;
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
  vehicleImage: string;
  vehicleReference: string;
  plate: string;
  numberPolicySoat: string;
  certificateNumberRTM: string;
  allRisk: boolean;
  user_id: string;
}
