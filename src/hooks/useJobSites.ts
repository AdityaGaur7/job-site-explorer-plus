import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JobSite, JobSiteFormData } from '@/types/jobSite';

export function useJobSites() {
  const [jobSites, setJobSites] = useState<JobSite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobSites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setJobSites([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('job_sites')
        .select('*')
        .eq('user_id', user.id)
        .order('date_added', { ascending: false });

      if (error) throw error;

      const sites: JobSite[] = (data || []).map((site) => ({
        id: site.id,
        title: site.title,
        url: site.url,
        description: site.description || '',
        category: site.category,
        tags: site.tags || [],
        isFavorite: site.is_favorite || false,
        dateAdded: new Date(site.date_added),
      }));

      setJobSites(sites);
    } catch (error) {
      console.error('Error fetching job sites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobSites();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchJobSites();
    });

    return () => subscription.unsubscribe();
  }, []);

  const addJobSite = async (data: JobSiteFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('job_sites').insert({
        title: data.title,
        url: data.url,
        description: data.description,
        category: data.category,
        tags: data.tags,
        is_favorite: data.isFavorite,
        user_id: user.id,
      });

      if (error) throw error;
      await fetchJobSites();
    } catch (error) {
      console.error('Error adding job site:', error);
    }
  };

  const updateJobSite = async (id: string, data: JobSiteFormData) => {
    try {
      const { error } = await supabase
        .from('job_sites')
        .update({
          title: data.title,
          url: data.url,
          description: data.description,
          category: data.category,
          tags: data.tags,
          is_favorite: data.isFavorite,
        })
        .eq('id', id);

      if (error) throw error;
      await fetchJobSites();
    } catch (error) {
      console.error('Error updating job site:', error);
    }
  };

  const deleteJobSite = async (id: string) => {
    try {
      const { error } = await supabase.from('job_sites').delete().eq('id', id);

      if (error) throw error;
      await fetchJobSites();
    } catch (error) {
      console.error('Error deleting job site:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    const site = jobSites.find((s) => s.id === id);
    if (!site) return;

    try {
      const { error } = await supabase
        .from('job_sites')
        .update({ is_favorite: !site.isFavorite })
        .eq('id', id);

      if (error) throw error;
      await fetchJobSites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
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
