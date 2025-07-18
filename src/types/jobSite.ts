export interface JobSite {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  dateAdded: Date;
}

export type JobSiteFormData = Omit<JobSite, 'id' | 'dateAdded'>;

export const JOB_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Marketing',
  'Sales',
  'Design',
  'Engineering',
  'Remote',
  'Freelance',
  'Startup',
  'Government',
  'Non-Profit',
  'Other'
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];