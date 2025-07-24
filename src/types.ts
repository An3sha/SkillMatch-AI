export interface WorkExperience {
  company: string;
  roleName: string;
}

export interface Degree {
  gpa?: string;
  degree: string;
  school: string;
  endDate?: string;
  isTop50: boolean;
  subject: string;
  startDate?: string;
  originalSchool?: string;
}

export interface Education {
  degrees: Degree[];
  highest_level: string;
}

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
  work_experiences: WorkExperience[];
  education: Education;
  skills: string[];
  score?: number;
  isSelected?: boolean;
}


export interface HiringDecision {
  candidateId: string;
  reason: string;
  timestamp: string;
}