export type RecruitmentStage =
  | 'Screening'
  | 'Interview'
  | 'Offer Sent'
  | 'Joined'
  | 'Not Selected';

export type LetterType =
  | 'Offer Letter'
  | 'Experience Letter'
  | 'Relieving Letter'
  | 'General'
  | 'Show Cause';

export interface InterviewRound {
  round_name: string;
  date?: string;
  conducted_by?: string;
  venue?: string;
  verdict?: 'Passed' | 'Failed' | 'Pending';
  notes?: string;
}

export interface Applicant {
  id: string;
  name: string;
  phone?: string;
  trade?: string;
  site?: string;
  source?: string;
  stage: RecruitmentStage;
  certification?: string;
  previous_employer?: string;
  aadhar?: string;
  offer_letter_ref?: string;
  address?: string;
  experience?: string;
  interview_rounds: InterviewRound[];
  created_at: string;
  updated_at?: string;
  updated_by?: string;
}

export interface Letter {
  id: string;
  ref_no: string;
  date: string;
  type: LetterType;
  to_name: string;
  to_address?: string;
  subject: string;
  body: string;
  created_by: string;
  created_at: string;
}
