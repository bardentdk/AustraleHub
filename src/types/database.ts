export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'manager' | 'formateur';
};

export type TrainingSession = {
  id: string;
  external_id_digiforma?: string;
  external_id_nellapp?: string;
  title: string;
  start_date: string;
  end_date: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
};

export type Student = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  session_id: string;
  status: 'active' | 'withdrawn' | 'certified';
};

export type Invoice = {
  id: string;
  external_id_inqom?: string;
  student_id: string;
  session_id: string;
  amount_ht: number;
  amount_ttc: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  due_date: string;
  pdf_url?: string;
};

export type CRMLead = {
  id: string;
  external_id_hubspot?: string;
  deal_name: string;
  stage: string;
  amount: number;
  probability: number;
  close_date: string;
};

export type InternalResource = {
  id: string;
  type: 'leave' | 'car_rental' | 'exam_event';
  title: string;
  start_time: string;
  end_time: string;
  assigned_to?: string;
  description?: string;
};