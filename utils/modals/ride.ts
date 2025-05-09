export interface RideModal {
  id: number;
  uuid: string;
  rider_id: number;
  driver_id: number;
  ride_type_id: number;
  status_id: number | null;
  pickup_address: string;
  pickup_lat: string;
  pickup_lng: string;
  dropoff_address: string;
  dropoff_lat: string;
  dropoff_lng: string;
  distance_km: string;
  duration_minutes: number;
  base_fare: string;
  distance_fare: string;
  time_fare: string;
  surge_multiplier: string;
  total_fare: string;
  driver_earnings: string;
  platform_fee: string;
  payment_method_id: number;
  payment_status: string;
  cancellation_reason: string | null;
  cancellation_fee: string | null;
  rating: number | null;
  review: string | null;
  created_at: string; // ISO date string
  requested_at: string;
  accepted_at: string | null;
  arrived_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  status: RideStatus;
  govt_tax_percentage: string;
  name: string;
  rider: string;
  driver: string;
}

export interface RideTypeModal {
  id: number;
  name: string;
  description: string;
  base_price: string;
  price_per_km: string;
  price_per_minute: string;
  min_fare: string;
  icon: string;
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  cancel_fee: string;
  refund_distance_in_m: number;
  minimum_billable_distance: string;
  commission_percentage: string;
  keyword: string;
  govt_tax_percentage: string;
}

export enum RideStatus {
  Requested = 'requested',
  Accepted = 'accepted',
  Started = 'started',
  Cancelled = 'canceled',
  Completed = 'completed',
}
