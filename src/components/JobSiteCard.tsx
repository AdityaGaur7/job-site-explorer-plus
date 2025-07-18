import { useState } from 'react';
import { Star, ExternalLink, Edit, Trash2, Building2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobSite } from '@/types/jobSite';

interface JobSiteCardProps {
  jobSite: JobSite;
  onToggleFavorite: (id: string) => void;
  onEdit: (jobSite: JobSite) => void;
  onDelete: (id: string) => void;
}

export function JobSiteCard({ jobSite, onToggleFavorite, onEdit, onDelete }: JobSiteCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleVisitSite = () => {
    window.open(jobSite.url, '_blank', 'noopener,noreferrer');
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] animate-scale-in">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {!imageError && getFaviconUrl(jobSite.url) ? (
              <img
                src={getFaviconUrl(jobSite.url)!}
                alt={`${jobSite.title} favicon`}
                className="w-8 h-8 rounded-md"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-gradient-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                {jobSite.title}
              </h3>
              <p className="text-sm text-muted-foreground">{jobSite.url}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(jobSite.id)}
            className="shrink-0"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                jobSite.isFavorite
                  ? 'fill-warning text-warning'
                  : 'text-muted-foreground hover:text-warning'
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {jobSite.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {jobSite.category}
          </Badge>
          {jobSite.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="relative flex gap-2 pt-4">
        <Button
          variant="default"
          size="sm"
          onClick={handleVisitSite}
          className="flex-1"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Visit Site
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(jobSite)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(jobSite.id)}
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}