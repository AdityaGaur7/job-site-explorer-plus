import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { JobSite, JobSiteFormData } from '@/types/jobSite';

interface AddJobSiteDialogProps {
  onAdd: (jobSite: JobSiteFormData) => void;
  editingSite?: JobSite | null;
  onEdit?: (id: string, data: JobSiteFormData) => void;
  onClose?: () => void;
}

export function AddJobSiteDialog({ onAdd, editingSite, onEdit, onClose }: AddJobSiteDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingSite) {
      setTitle(editingSite.title);
      setUrl(editingSite.url);
      setDescription(editingSite.description);
    }
  }, [editingSite]);

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !url) return;

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const data: JobSiteFormData = {
      title,
      url: finalUrl,
      description,
      category: 'Other',
      tags: [],
      isFavorite: editingSite?.isFavorite || false,
    };

    if (editingSite && onEdit) {
      onEdit(editingSite.id, data);
    } else {
      onAdd(data);
    }

    resetForm();
    setOpen(false);
    onClose?.();
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={open || !!editingSite} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      {!editingSite && (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingSite ? 'Edit Job Site' : 'Add Job Site'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              placeholder="e.g., LinkedIn Jobs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="e.g., linkedin.com/jobs"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingSite ? 'Save' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
