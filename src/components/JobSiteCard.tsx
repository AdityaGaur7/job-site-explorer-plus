import { useState } from 'react';
import { Star, ExternalLink, Edit, Trash2, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {!imageError && getFaviconUrl(jobSite.url) ? (
              <img
                src={getFaviconUrl(jobSite.url)!}
                alt=""
                className="w-8 h-8 rounded shrink-0"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-medium text-foreground truncate">{jobSite.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{jobSite.url}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={() => onToggleFavorite(jobSite.id)}
          >
            <Star
              className={`w-4 h-4 ${
                jobSite.isFavorite
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </Button>
        </div>

        {jobSite.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {jobSite.description}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={handleVisitSite} className="flex-1">
            <ExternalLink className="w-4 h-4 mr-1" />
            Visit
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(jobSite)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onDelete(jobSite.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
