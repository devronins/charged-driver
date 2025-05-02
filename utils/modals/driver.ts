export interface DriverModal {
  id: number;
  uuid: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  photo?: string;
  user_type: 'driver';
  rating?: string;
  is_online: boolean;
  is_verified: boolean;
  created_at?: Date;
  updated_at?: Date;

  firebase_id: string;
  timezone?: string;
  address?: string;
  address_coordinates?: string;
  android_fcm_token?: string;
  ios_fcm_token?: string;
  work_address_coordinates?: string;
  work_address?: string;
  car_model?: string;
  car_color?: string;
  license_plate?: string;
  total_rides?: number;
  total_earnings?: number;
  is_active?: boolean;
  last_location_lat?: number;
  last_location_lng?: number;
  last_location_updated_at?: Date;
  car_type?: string;
  car_year?: string;
}

export interface DriverUploadedDocumentModal {
  id: number;
  user_id: number;
  document_type_id: number;
  file_url: string;
  file_name: string;
  file_type: string;
  status: 'verified' | 'pending' | 'rejected';
  expiry_date?: Date;
  rejection_reason?: string;
  notes?: string;
  uploaded_by: 'driver';
  reviewed_by?: number;
  uploaded_at: Date;
  verified_at?: Date;
  rejected_at?: Date;
  created_at: string;
  updated_at: string;
  user_notified: boolean;
}

export interface DriverDocumentTypesModal {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_required: true;
  user_type: string;
  created_at: Date;
}

export const DriverType = {
  Admin: 1,
  Driver: 2,
};

export const AvailableDriverTypes = [
  { title: 'Admin', value: '1' },
  { title: 'Driver', value: '2' },
];

export const DriverStatus = {
  ACTIVE: 'active',
  HIDDEN: 'hidden',
};

export const AvailableDriverStatus = [
  { title: 'Active', value: 'active' },
  { title: 'Hidden', value: 'hidden' },
];
