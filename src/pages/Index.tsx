import { useState, useMemo } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { JobSiteCard } from '@/components/JobSiteCard';
import { AddJobSiteDialog } from '@/components/AddJobSiteDialog';
import { DashboardStats } from '@/components/DashboardStats';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { useJobSites } from '@/hooks/useJobSites';
import { useToast } from '@/hooks/use-toast';
import { JobSite } from '@/types/jobSite';

const Index = () => {
  const { jobSites, loading, addJobSite, updateJobSite, deleteJobSite, toggleFavorite } = useJobSites();
  const { toast } = useToast();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingSite, setEditingSite] = useState<JobSite | null>(null);

  // Filtered job sites
  const filteredJobSites = useMemo(() => {
    return jobSites.filter(site => {
      const matchesSearch = site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           site.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || site.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || site.isFavorite;
      
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [jobSites, searchTerm, selectedCategory, showFavoritesOnly]);

  const hasActiveFilters = Boolean(searchTerm || selectedCategory !== 'all' || showFavoritesOnly);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowFavoritesOnly(false);
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
    const site = jobSites.find(s => s.id === id);
    toast({
      title: site?.isFavorite ? 'Removed from favorites' : 'Added to favorites',
      description: `${site?.title} ${site?.isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your job sites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Job Sites Collection</h1>
                <p className="text-sm text-muted-foreground">Organize and discover job opportunities</p>
              </div>
            </div>
            
            <AddJobSiteDialog 
              onAdd={handleAddJobSite}
              editingSite={editingSite}
              onEdit={handleEditJobSite}
              onClose={() => setEditingSite(null)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <DashboardStats jobSites={jobSites} />

        {/* Search and Filters */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Job Sites Grid */}
        {filteredJobSites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-gradient-primary/10 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {hasActiveFilters ? 'No matching job sites' : 'No job sites yet'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search terms to find job sites.'
                : 'Start building your job sites collection by adding your first website.'
              }
            </p>
            {!hasActiveFilters && (
              <AddJobSiteDialog onAdd={handleAddJobSite} />
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredJobSites.length} of {jobSites.length} job sites
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobSites.map((site, index) => (
                <div key={site.id} style={{ animationDelay: `${index * 0.1}s` }}>
                  <JobSiteCard
                    jobSite={site}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={setEditingSite}
                    onDelete={handleDeleteJobSite}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
