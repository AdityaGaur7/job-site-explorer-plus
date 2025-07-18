import { useState, useEffect } from 'react';
import { JobSite, JobSiteFormData } from '@/types/jobSite';

const STORAGE_KEY = 'job-sites-collection';

// Sample data for demo
const sampleJobSites: JobSite[] = [
  {
    id: '1',
    title: 'LinkedIn Jobs',
    url: 'https://linkedin.com/jobs',
    description: 'Professional networking platform with extensive job listings across all industries.',
    category: 'Technology',
    tags: ['professional', 'networking', 'full-time'],
    isFavorite: true,
    dateAdded: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'AngelList',
    url: 'https://angel.co/jobs',
    description: 'Startup jobs and investment opportunities in the tech industry.',
    category: 'Startup',
    tags: ['startup', 'equity', 'tech'],
    isFavorite: false,
    dateAdded: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Remote.co',
    url: 'https://remote.co',
    description: 'Curated remote job opportunities across various fields and experience levels.',
    category: 'Remote',
    tags: ['remote', 'flexible', 'worldwide'],
    isFavorite: true,
    dateAdded: new Date('2024-01-20'),
  },
];

export function useJobSites() {
  const [jobSites, setJobSites] = useState<JobSite[]>([]);
  const [loading, setLoading] = useState(true);

  // Load job sites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const sitesWithDates = parsed.map((site: any) => ({
          ...site,
          dateAdded: new Date(site.dateAdded),
        }));
        setJobSites(sitesWithDates);
      } else {
        // Initialize with sample data
        setJobSites(sampleJobSites);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleJobSites));
      }
    } catch (error) {
      console.error('Error loading job sites:', error);
      setJobSites(sampleJobSites);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever jobSites changes
  const saveJobSites = (sites: JobSite[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
      setJobSites(sites);
    } catch (error) {
      console.error('Error saving job sites:', error);
    }
  };

  const addJobSite = (data: JobSiteFormData) => {
    const newSite: JobSite = {
      id: Date.now().toString(),
      ...data,
      dateAdded: new Date(),
    };
    const updatedSites = [...jobSites, newSite];
    saveJobSites(updatedSites);
  };

  const updateJobSite = (id: string, data: JobSiteFormData) => {
    const updatedSites = jobSites.map(site =>
      site.id === id ? { ...site, ...data } : site
    );
    saveJobSites(updatedSites);
  };

  const deleteJobSite = (id: string) => {
    const updatedSites = jobSites.filter(site => site.id !== id);
    saveJobSites(updatedSites);
  };

  const toggleFavorite = (id: string) => {
    const updatedSites = jobSites.map(site =>
      site.id === id ? { ...site, isFavorite: !site.isFavorite } : site
    );
    saveJobSites(updatedSites);
  };

  return {
    jobSites,
    loading,
    addJobSite,
    updateJobSite,
    deleteJobSite,
    toggleFavorite,
  };
}