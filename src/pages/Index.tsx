import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, LogOut } from 'lucide-react';
import { JobSiteCard } from '@/components/JobSiteCard';
import { AddJobSiteDialog } from '@/components/AddJobSiteDialog';
import { useJobSites } from '@/hooks/useJobSites';
import { useToast } from '@/hooks/use-toast';
import { JobSite } from '@/types/jobSite';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

const Index = () => {
  const { jobSites, loading, addJobSite, updateJobSite, deleteJobSite, toggleFavorite } = useJobSites();
  const { toast } = useToast();
  const [editingSite, setEditingSite] = useState<JobSite | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (!session) {
        navigate('/auth');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleAddJobSite = (data: any) => {
    addJobSite(data);
    toast({
      title: 'Success!',
      description: 'Job site added to your collection.',
    });
  };

  const handleEditJobSite = (id: string, data: any) => {
    updateJobSite(id, data);
    setEditingSite(null);
    toast({
      title: 'Updated!',
      description: 'Job site has been updated.',
    });
  };

  const handleDeleteJobSite = (id: string) => {
    deleteJobSite(id);
    toast({
      title: 'Deleted',
      description: 'Job site removed from your collection.',
      variant: 'destructive',
    });
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">Job Sites</h1>
            </div>
            <div className="flex items-center gap-2">
              <AddJobSiteDialog 
                onAdd={handleAddJobSite}
                editingSite={editingSite}
                onEdit={handleEditJobSite}
                onClose={() => setEditingSite(null)}
              />
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {jobSites.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No job sites yet. Add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobSites.map((site) => (
              <JobSiteCard
                key={site.id}
                jobSite={site}
                onToggleFavorite={handleToggleFavorite}
                onEdit={setEditingSite}
                onDelete={handleDeleteJobSite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
