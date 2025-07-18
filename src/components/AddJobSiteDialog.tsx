import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { JobSite, JobSiteFormData, JOB_CATEGORIES } from '@/types/jobSite';

interface AddJobSiteDialogProps {
  onAdd: (jobSite: JobSiteFormData) => void;
  editingSite?: JobSite | null;
  onEdit?: (id: string, data: JobSiteFormData) => void;
  onClose?: () => void;
}

export function AddJobSiteDialog({ onAdd, editingSite, onEdit, onClose }: AddJobSiteDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<JobSiteFormData>({
    title: editingSite?.title || '',
    url: editingSite?.url || '',
    description: editingSite?.description || '',
    category: editingSite?.category || '',
    tags: editingSite?.tags || [],
    isFavorite: editingSite?.isFavorite || false,
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url || !formData.category) {
      return;
    }

    if (editingSite && onEdit) {
      onEdit(editingSite.id, formData);
    } else {
      onAdd(formData);
    }

    // Reset form
    setFormData({
      title: '',
      url: '',
      description: '',
      category: '',
      tags: [],
      isFavorite: false,
    });
    setCurrentTag('');
    setOpen(false);
    onClose?.();
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleUrlChange = (value: string) => {
    let url = value.trim();
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setFormData(prev => ({ ...prev, url }));
  };

  return (
    <Dialog open={open || !!editingSite} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) onClose?.();
    }}>
      {!editingSite && (
        <DialogTrigger asChild>
          <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Add Job Site
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingSite ? 'Edit Job Site' : 'Add New Job Site'}
          </DialogTitle>
          <DialogDescription>
            {editingSite 
              ? 'Update the job site information below.'
              : 'Add a new job website to your collection. Fill in the details below.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Site Name *</Label>
            <Input
              id="title"
              placeholder="e.g., LinkedIn Jobs"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Website URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="e.g., linkedin.com/jobs"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {JOB_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this job site..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setOpen(false);
              onClose?.();
            }}>
              Cancel
            </Button>
            <Button type="submit">
              {editingSite ? 'Update Site' : 'Add Site'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}