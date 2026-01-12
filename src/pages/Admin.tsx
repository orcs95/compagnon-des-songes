import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMembers } from '@/hooks/useMembers';
import { useKeys } from '@/hooks/useKeys';
import { 
  Shield, 
  Users, 
  Key, 
  Calendar, 
  Mail,
  Loader2, 
  Check,
  X,
  UserCheck,
  UserX
} from 'lucide-react';
import type { MembershipStatus } from '@/types/database';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { members, isLoading: membersLoading, updateMemberStatus } = useMembers();
  const { keys, isLoading: keysLoading } = useKeys();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (!authLoading && !isAdmin) {
      toast({
        title: 'Accès refusé',
        description: "Vous n'avez pas les droits d'administration",
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  const handleStatusChange = async (memberId: string, newStatus: MembershipStatus) => {
    try {
      await updateMemberStatus(memberId, newStatus);
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut du membre a été modifié',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const pendingMembers = members.filter(m => m.membership_status === 'pending');
  const activeMembers = members.filter(m => m.membership_status === 'active');
  const inactiveMembers = members.filter(m => m.membership_status === 'inactive');

  return (
    <Layout>
      <div className="container py-12 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-cinzel text-3xl font-bold text-foreground">
            Administration
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez les membres, événements et clés de l'association
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 bg-card/80">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <Users className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingMembers.length}</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/20">
                  <UserCheck className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-500/20">
                  <UserX className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inactiveMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Inactifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/80">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Key className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {keys.filter(k => k.status === 'held').length}/2
                  </p>
                  <p className="text-sm text-muted-foreground">Clés détenues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="pending" className="relative">
              En attente
              {pendingMembers.length > 0 && (
                <Badge className="ml-2 bg-amber-500 text-xs">{pendingMembers.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="keys">Clés</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
          </TabsList>

          {/* Pending Members */}
          <TabsContent value="pending">
            <Card className="border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="font-cinzel">Inscriptions en attente</CardTitle>
                <CardDescription>
                  Validez ou refusez les nouvelles inscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : pendingMembers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune inscription en attente
                  </p>
                ) : (
                  <div className="space-y-4">
                    {pendingMembers.map(member => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
                      >
                        <div>
                          <p className="font-medium">{member.full_name || 'Sans nom'}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Inscrit le {new Date(member.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                            onClick={() => handleStatusChange(member.id, 'active')}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Valider
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                            onClick={() => handleStatusChange(member.id, 'inactive')}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Refuser
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Members */}
          <TabsContent value="members">
            <Card className="border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="font-cinzel">Tous les membres</CardTitle>
                <CardDescription>
                  Liste complète des membres de l'association
                </CardDescription>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {members.map(member => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{member.full_name || 'Sans nom'}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {member.activities?.map(activity => (
                            <Badge key={activity} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                          <Badge 
                            variant={
                              member.membership_status === 'active' ? 'default' :
                              member.membership_status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {member.membership_status === 'active' ? 'Actif' :
                             member.membership_status === 'pending' ? 'En attente' : 'Inactif'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keys */}
          <TabsContent value="keys">
            <Card className="border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="font-cinzel">Gestion des clés</CardTitle>
                <CardDescription>
                  Statut des 2 clés du local
                </CardDescription>
              </CardHeader>
              <CardContent>
                {keysLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {keys.map(key => (
                      <div 
                        key={key.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${key.status === 'held' ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                            <Key className={`w-6 h-6 ${key.status === 'held' ? 'text-green-400' : 'text-amber-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium">Clé n°{key.key_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {key.status === 'held' 
                                ? `Détenue par ${key.holder_name || 'Inconnu'}`
                                : 'Disponible'
                              }
                            </p>
                          </div>
                        </div>
                        <Badge variant={key.status === 'held' ? 'default' : 'secondary'}>
                          {key.status === 'held' ? 'Détenue' : 'Disponible'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emails */}
          <TabsContent value="emails">
            <Card className="border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="font-cinzel">Communications</CardTitle>
                <CardDescription>
                  Envoyez des emails aux membres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    La fonctionnalité d'envoi d'emails nécessite la configuration 
                    d'une Edge Function Supabase avec Resend.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Consultez le fichier supabase/functions/send-email pour l'implémentation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
