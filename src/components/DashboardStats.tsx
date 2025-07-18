import { BarChart3, Heart, Globe, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobSite } from '@/types/jobSite';

interface DashboardStatsProps {
  jobSites: JobSite[];
}

export function DashboardStats({ jobSites }: DashboardStatsProps) {
  const totalSites = jobSites.length;
  const favoriteSites = jobSites.filter(site => site.isFavorite).length;
  const uniqueCategories = new Set(jobSites.map(site => site.category)).size;
  const recentlyAdded = jobSites.filter(site => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return site.dateAdded >= weekAgo;
  }).length;

  const stats = [
    {
      title: 'Total Sites',
      value: totalSites,
      icon: Globe,
      description: 'Job websites in collection',
      color: 'text-primary'
    },
    {
      title: 'Favorites',
      value: favoriteSites,
      icon: Heart,
      description: 'Bookmarked sites',
      color: 'text-warning'
    },
    {
      title: 'Categories',
      value: uniqueCategories,
      icon: FolderOpen,
      description: 'Different categories',
      color: 'text-success'
    },
    {
      title: 'Recent',
      value: recentlyAdded,
      icon: BarChart3,
      description: 'Added this week',
      color: 'text-accent-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="relative overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="absolute inset-0 bg-gradient-primary opacity-5" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}