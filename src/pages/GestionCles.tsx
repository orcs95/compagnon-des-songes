import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Shield, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export default function GestionCles() {
  const { isLoading, isCAMember } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isCAMember) {
      navigate('/');
    }
  }, [isLoading, isCAMember, navigate]);

  if (isLoading) return <Layout><div className="flex items-center justify-center min-h-[60vh]" /></Layout>;

  return (
    <Layout>
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-gold-gradient">Gestion des clés</span>
          </h1>
          <p className="text-center text-muted-foreground font-body max-w-2xl mx-auto mb-8">
            Espace réservé aux membres du conseil d'administration pour gérer l'attribution des clés du local.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto card-fantasy rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold">État des clés du local</h3>
              <Badge variant="outline" className="border-primary/30 text-primary font-display">
                2 clés
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-display font-semibold">Clé #1</p>
                    <p className="text-sm text-muted-foreground font-body">Détenue par Alexandre Durand</p>
                  </div>
                </div>
                <Badge className="bg-forest/20 text-forest-light border-forest/30">Attribuée</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-display font-semibold">Clé #2</p>
                    <p className="text-sm text-muted-foreground font-body">Détenue par Marie Lambert</p>
                  </div>
                </div>
                <Badge className="bg-forest/20 text-forest-light border-forest/30">Attribuée</Badge>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-body mt-6 text-center">
              Les transferts et l'attribution des clés se font via ce panneau. Seuls les membres du CA ont accès.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
