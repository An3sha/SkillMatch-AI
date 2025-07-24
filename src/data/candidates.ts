import { Candidate } from '../types';

// Transform profiles data to match Candidate interface
export const candidates: Candidate[] = [
  {
    id: '1',
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    phone: "4159876543",
    location: "San Francisco, CA",
    submitted_at: "2025-01-27T14:30:22.000Z",
    work_availability: ["full-time"],
    annual_salary_expectation: {
      "full-time": "$165,000"
    },
    work_experiences: [
      { company: "Google", roleName: "Senior Software Engineer" },
      { company: "Meta", roleName: "Software Engineer" },
      { company: "Stripe", roleName: "Frontend Engineer" }
    ],
    education: {
      highest_level: "Master's Degree",
      degrees: [
        {
          degree: "Master's Degree",
          subject: "Computer Science",
          school: "Stanford University",
          isTop50: true
        }
      ]
    },
    skills: ["React", "TypeScript", "Node.js", "System Design", "Leadership", "Machine Learning"]
  },
  {
    id: '2',
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    phone: "3125551234",
    location: "Chicago, IL",
    submitted_at: "2025-01-26T11:15:33.000Z",
    work_availability: ["full-time", "part-time"],
    annual_salary_expectation: {
      "full-time": "$145,000"
    },
    work_experiences: [
      { company: "Goldman Sachs", roleName: "VP Product Manager" },
      { company: "McKinsey & Company", roleName: "Senior Business Analyst" },
      { company: "Accenture", roleName: "Strategy Consultant" }
    ],
    education: {
      highest_level: "MBA",
      degrees: [
        {
          degree: "MBA",
          subject: "Business Administration",
          school: "Wharton School",
          isTop50: true
        }
      ]
    },
    skills: ["Product Management", "Strategic Planning", "Financial Analysis", "Team Leadership", "Market Research"]
  },
  {
    id: '3',
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "2065559876",
    location: "Seattle, WA",
    submitted_at: "2025-01-25T16:45:11.000Z",
    work_availability: ["full-time"],
    annual_salary_expectation: {
      "full-time": "$155,000"
    },
    work_experiences: [
      { company: "Amazon", roleName: "Senior UX Designer" },
      { company: "Microsoft", roleName: "Product Designer" },
      { company: "Adobe", roleName: "UI/UX Designer" }
    ],
    education: {
      highest_level: "Master's Degree",
      degrees: [
        {
          degree: "Master's Degree",
          subject: "Human-Computer Interaction",
          school: "Carnegie Mellon University",
          isTop50: true
        }
      ]
    },
    skills: ["User Experience Design", "Prototyping", "Design Systems", "User Research", "Figma", "Adobe Creative Suite"]
  },
  {
    id: '4',
    name: "Alex Rodriguez",
    email: "alex.rodriguez@example.com",
    phone: "7865554321",
    location: "Miami, FL",
    submitted_at: "2025-01-24T13:20:55.000Z",
    work_availability: ["full-time"],
    annual_salary_expectation: {
      "full-time": "$135,000"
    },
    work_experiences: [
      { company: "Salesforce", roleName: "Marketing Manager" },
      { company: "HubSpot", roleName: "Growth Marketing Specialist" },
      { company: "Mailchimp", roleName: "Digital Marketing Coordinator" }
    ],
    education: {
      highest_level: "Bachelor's Degree",
      degrees: [
        {
          degree: "Bachelor's Degree",
          subject: "Marketing",
          school: "University of Miami",
          isTop50: false
        }
      ]
    },
    skills: ["Digital Marketing", "Growth Hacking", "Analytics", "Content Strategy", "Social Media", "SEO"]
  },
  {
    id: '5',
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "9175556789",
    location: "New York, NY",
    submitted_at: "2025-01-23T10:30:44.000Z",
    work_availability: ["full-time"],
    annual_salary_expectation: {
      "full-time": "$175,000"
    },
    work_experiences: [
      { company: "Two Sigma", roleName: "Senior Data Scientist" },
      { company: "Palantir", roleName: "Data Scientist" },
      { company: "Netflix", roleName: "ML Engineer" }
    ],
    education: {
      highest_level: "PhD",
      degrees: [
        {
          degree: "PhD",
          subject: "Statistics",
          school: "Columbia University",
          isTop50: true
        }
      ]
    },
    skills: ["Machine Learning", "Python", "R", "Statistical Analysis", "Deep Learning", "Data Visualization"]
  },
  {
    id: '6',
    name: "Emily Watson",
    email: "emily.watson@example.com",
    phone: "6175552468",
    location: "Boston, MA",
    submitted_at: "2025-01-22T09:45:17.000Z",
    work_availability: ["full-time", "part-time"],
    annual_salary_expectation: {
      "full-time": "$125,000"
    },
    work_experiences: [
      { company: "Local Startup", roleName: "Operations Manager" },
      { company: "Consulting Firm", roleName: "Business Analyst" }
    ],
    education: {
      highest_level: "Bachelor's Degree",
      degrees: [
        {
          degree: "Bachelor's Degree",
          subject: "Business Administration",
          school: "Boston University",
          isTop50: false
        }
      ]
    },
    skills: ["Project Management", "Operations", "Data Analysis", "Communication"]
  }
];