export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  submitted_at: string;
  work_availability: string[];
  annual_salary_expectation: {
    [key: string]: string;
  };
  work_experiences: any[];
  education: any;
  skills: string[];
  score?: number;
  isSelected?: boolean;
}


export interface HiringDecision {
  candidateId: string;
  reason: string;
  timestamp: string;
}