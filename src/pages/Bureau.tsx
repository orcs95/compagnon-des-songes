import { Layout } from '@/components/layout/Layout';
import { Crown, Mail, Shield, Scroll, Coins, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BoardMember {
  id: string;
  name: string;
  role: string;
  roleIcon: typeof Crown;
  email: string;
  description: string;
  hasKey: boolean;
}

const boardMembers: BoardMember[] = [
  {
    id: '1',
    name: 'Alexandre Durand',
    role: 'Président',
    roleIcon: Crown,
    email: 'president@orcs-asso.fr',
    description: 'Maître de guilde depuis 2020, Alexandre coordonne les activités et représente l\'association.',
    hasKey: true,
  },
  {
    id: '2',
    name: 'Marie Lambert',
    role: 'Trésorière',
    roleIcon: Coins,
    email: 'tresorier@orcs-asso.fr',
    description: 'Gardienne des coffres, Marie gère les finances et les cotisations des membres.',
    hasKey: true,
  },
  {
    id: '3',
    name: 'Thomas Petit',
    role: 'Secrétaire',
    roleIcon: Scroll,
    email: 'secretaire@orcs-asso.fr',
    description: 'Chroniqueur de la guilde, Thomas rédige les comptes-rendus et gère la communication.',
    hasKey: false,
  },
];

export default function Bureau() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-gold-gradient">Le Bureau</span>
          </h1>
          <p className="text-center text-muted-foreground font-body max-w-2xl mx-auto">
            Découvrez les membres du conseil d'administration qui font vivre notre association au quotidien.
          </p>
        </div>
      </section>

      {/* Board Members */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member) => {
              const Icon = member.roleIcon;
              return (
                <div 
                  key={member.id}
                  className="card-fantasy rounded-lg p-8 text-center transition-all duration-300 hover:border-primary/50"
                >
                  {/* Avatar placeholder */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <Shield className="h-12 w-12 text-primary/50" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary">
                      <Icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-display text-xl font-bold mb-2">{member.name}</h3>
                  <Badge className="bg-primary/20 text-primary border-primary/30 font-display mb-4">
                    {member.role}
                  </Badge>
                  <p className="text-muted-foreground font-body text-sm mb-4 leading-relaxed">
                    {member.description}
                  </p>

                  {/* Key Badge */}
                  {member.hasKey && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Key className="h-4 w-4 text-primary" />
                      <span className="text-xs text-primary font-display">Détenteur de clé</span>
                    </div>
                  )}

                  {/* Contact */}
                  <a 
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body"
                  >
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Management Status */}
      <section className="py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">
            Gestion des Clés
          </h2>
          <div className="max-w-2xl mx-auto card-fantasy rounded-lg p-8">
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
                <Badge className="bg-forest/20 text-forest-light border-forest/30">
                  Attribuée
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-display font-semibold">Clé #2</p>
                    <p className="text-sm text-muted-foreground font-body">Détenue par Marie Lambert</p>
                  </div>
                </div>
                <Badge className="bg-forest/20 text-forest-light border-forest/30">
                  Attribuée
                </Badge>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-body mt-6 text-center">
              Les transferts de clés nécessitent une confirmation des deux parties.
              <br />
              Seuls les membres du bureau peuvent détenir une clé.
            </p>
          </div>
        </div>
      </section>

      {/* Association Info */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold mb-4">À propos de l'association</h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              O.R.C.S - Ordre Rôlistique des Conteurs de Songes est une association loi 1901 
              fondée en 2019. Notre mission est de promouvoir les jeux de rôle, jeux de société 
              et jeux de cartes à collectionner dans le Val d'Oise.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="card-fantasy rounded-lg p-4">
                <p className="font-display font-semibold text-primary mb-1">Création</p>
                <p className="text-muted-foreground font-body">2019</p>
              </div>
              <div className="card-fantasy rounded-lg p-4">
                <p className="font-display font-semibold text-primary mb-1">Statut</p>
                <p className="text-muted-foreground font-body">Association Loi 1901</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
