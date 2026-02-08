import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, MapPin, Clock, Database, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { capeTownServices } from '@/data/capeTownServices';
import type { Location, LocationStatus } from '@/types/database';

export default function Admin() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchLocations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error fetching locations',
        description: error.message,
      });
    } else {
      setLocations((data as Location[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchLocations();
    }
  }, [isAdmin]);

  const updateLocationStatus = async (id: string, status: LocationStatus) => {
    const { error } = await supabase
      .from('locations')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating location',
        description: error.message,
      });
    } else {
      toast({
        title: 'Location updated',
        description: `Location has been ${status}.`,
      });
      fetchLocations();
    }
  };

  const deleteLocation = async (id: string) => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error deleting location',
        description: error.message,
      });
    } else {
      toast({
        title: 'Location deleted',
        description: 'Location has been removed.',
      });
      fetchLocations();
    }
  };

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      // Insert services one by one to handle potential conflicts
      let successCount = 0;
      let errorCount = 0;
      
      for (const service of capeTownServices) {
        const { error } = await supabase
          .from('services')
          .insert({
            name: service.name,
            type: service.type,
            address: service.address,
            lat: service.lat,
            lng: service.lng,
            phone: service.phone || null,
            hours: service.hours,
            description: service.description || null,
          });
        
        if (error) {
          // Likely duplicate, skip
          errorCount++;
        } else {
          successCount++;
        }
      }

      toast({
        title: 'Database seeded',
        description: `Added ${successCount} new services. ${errorCount} already existed.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error seeding database',
        description: 'Failed to add services',
      });
    }
    setSeeding(false);
  };

  const getStatusBadge = (status: LocationStatus) => {
    const variants: Record<LocationStatus, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      approved: 'default',
      denied: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const filterByStatus = (status: LocationStatus | 'all') => {
    if (status === 'all') return locations;
    return locations.filter((loc) => loc.status === status);
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage location suggestions</p>
            </div>
          </div>
          <Button onClick={seedDatabase} disabled={seeding}>
            {seeding ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Seed Cape Town Data
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pending">
              Pending ({filterByStatus('pending').length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({filterByStatus('approved').length})
            </TabsTrigger>
            <TabsTrigger value="denied">
              Denied ({filterByStatus('denied').length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({locations.length})
            </TabsTrigger>
          </TabsList>

          {(['pending', 'approved', 'denied', 'all'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading...</p>
              ) : filterByStatus(tab).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No {tab === 'all' ? '' : tab} locations found.
                </p>
              ) : (
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filterByStatus(tab).map((location) => (
                      <Card key={location.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg line-clamp-1">
                              {location.name}
                            </CardTitle>
                            {getStatusBadge(location.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {location.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {location.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {Number(location.latitude).toFixed(4)}, {Number(location.longitude).toFixed(4)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(location.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          {location.status === 'pending' && (
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => updateLocationStatus(location.id, 'approved')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                onClick={() => updateLocationStatus(location.id, 'denied')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Deny
                              </Button>
                            </div>
                          )}

                          {location.status !== 'pending' && (
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => updateLocationStatus(location.id, 'pending')}
                              >
                                Reset to Pending
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteLocation(location.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
