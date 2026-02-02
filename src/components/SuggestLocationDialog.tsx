import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SuggestLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: { lat: number; lng: number } | null;
  onSuccess: () => void;
}

export function SuggestLocationDialog({ 
  open, 
  onOpenChange, 
  coordinates, 
  onSuccess 
}: SuggestLocationDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to suggest a location.',
      });
      return;
    }

    if (!name || !coordinates) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in the service name.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('locations').insert({
        name,
        description: description || null,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        status: 'pending',
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Suggestion submitted!',
        description: 'Your location will be reviewed by an admin before appearing on the map.',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Could not submit your suggestion.';
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Service Details</DialogTitle>
          <DialogDescription>
            You've placed a marker on the map. Now add details about this service location.
          </DialogDescription>
        </DialogHeader>
        
        {coordinates && (
          <div className="bg-muted rounded-lg p-3 text-sm">
            <p className="font-medium text-foreground">Selected Location</p>
            <p className="text-muted-foreground">
              Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Community Food Bank"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the service, hours, contact info..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Suggestion'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
