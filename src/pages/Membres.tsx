import { Layout } from '@/components/layout/Layout';
import { Users, Search, Filter, Shield, Dices, Sparkles, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ActivityFilter = 'all' | 'jdr' | 'jds' | 'mtg';
type StatusFilter = 'all' | 'active' | 'inactive';

interface Member {
  id: string;
  name: string;
  joinDate: string;
  isActive: boolean;
  isBoardMember: boolean;
  boardRole?: string;
  activities: ('jdr' | 'jds' | 'mtg')[];
}

const members: Member[] = [
  {
    id: '1',
    name: 'Alexandre Durand',
    joinDate: '2019-03-15',
    isActive: true,
    isBoardMember: true,
    boardRole: 'Président',
    activities: ['jdr', 'jds'],
  },
  {
    id: '2',
    name: 'Marie Lambert',
    joinDate: '2019-03-15',
    isActive: true,
    isBoardMember: true,
    boardRole: 'Trésorière',
    activities: ['jds', 'mtg'],
  },
  {
    id: '3',
    name: 'Thomas Petit',
    joinDate: '2020-01-10',
    isActive: true,
    isBoardMember: true,
    boardRole: 'Secrétaire',
    activities: ['jdr'],
  },
  {
    id: '4',
    name: 'Sophie Martin',
    joinDate: '2021-06-20',
    isActive: true,
    isBoardMember: false,
    activities: ['mtg'],
  },
  {
    id: '5',
    name: 'Lucas Bernard',
    joinDate: '2022-02-14',
    isActive: true,
    isBoardMember: false,
    activities: ['jdr', 'jds', 'mtg'],
  },
  {
    id: '6',
    name: 'Emma Dubois',
    joinDate: '2022-09-01',
    isActive: true,
    isBoardMember: false,
    activities: ['jds'],
  },
  {
    id: '7',
    name: 'Julien Moreau',
    joinDate: '2023-01-05',
    isActive: true,
    isBoardMember: false,
    activities: ['mtg', 'jdr'],
  },
  {
    id: '8',
    name: 'Camille Lefebvre',
    joinDate: '2023-05-12',
    isActive: false,
    isBoardMember: false,
    activities: ['jds'],
  },
  {
    id: '9',
    name: 'Antoine Rousseau',
    joinDate: '2024-01-08',
    isActive: true,
    isBoardMember: false,
    activities: ['jdr', 'mtg'],
  },
];

const activityIcons: Record<string, typeof Dices> = {
  jdr: Dices,
  jds: Users,
  mtg: Sparkles,
};

const activityNames: Record<string, string> = {
  jdr: 'JDR',
  jds: 'Jeux de Société',
  mtg: 'Magic',
};

const activityColors: Record<string, string> = {
  jdr: 'bg-crimson/20 text-crimson border-crimson/30',
  jds: 'bg-forest/20 text-forest-light border-forest/30',
  mtg: 'bg-primary/20 text-primary border-primary/30',
};

export default function Membres() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { isLoading, isAdminBoardMember } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdminBoardMember) {
      navigate('/');
    }
  }, [isLoading, isAdminBoardMember, navigate]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActivity = activityFilter === 'all' || member.activities.includes(activityFilter);
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && member.isActive) ||
      (statusFilter === 'inactive' && !member.isActive);
    return matchesSearch && matchesActivity && matchesStatus;
  });

  const activeCount = members.filter(m => m.isActive).length;
  const boardCount = members.filter(m => m.isBoardMember).length;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-gold-gradient">Nos Membres</span>
          </h1>
          <p className="text-center text-muted-foreground font-body max-w-2xl mx-auto mb-8">
            La guilde O.R.C.S rassemble des passionnés de jeux de rôle, 
            jeux de société et Magic: The Gathering.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-primary">{members.length}</p>
              <p className="text-sm text-muted-foreground font-body">Membres</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-forest-light">{activeCount}</p>
              <p className="text-sm text-muted-foreground font-body">Actifs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-display font-bold text-crimson">{boardCount}</p>
              <p className="text-sm text-muted-foreground font-body">Bureau</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border font-body"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Activity Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-body">Activité:</span>
                <div className="flex gap-1">
                  {(['all', 'jdr', 'jds', 'mtg'] as ActivityFilter[]).map(filter => (
                    <Button
                      key={filter}
                      variant={activityFilter === filter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivityFilter(filter)}
                      className="font-display text-xs"
                    >
                      {filter === 'all' ? 'Tous' : activityNames[filter]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-body">Statut:</span>
                <div className="flex gap-1">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className="font-display text-xs"
                  >
                    Tous
                  </Button>
                  <Button
                    variant={statusFilter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('active')}
                    className="font-display text-xs"
                  >
                    <UserCheck className="h-3 w-3 mr-1" />
                    Actifs
                  </Button>
                  <Button
                    variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('inactive')}
                    className="font-display text-xs"
                  >
                    <UserX className="h-3 w-3 mr-1" />
                    Inactifs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Members List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-body text-lg">
                Aucun membre trouvé.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function MemberCard({ member }: { member: Member }) {
  const joinYear = new Date(member.joinDate).getFullYear();

  return (
    <div className="card-fantasy rounded-lg p-6 transition-all duration-300 hover:border-primary/50">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary/50" />
          </div>
          {member.isBoardMember && (
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-primary">
              <Shield className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-lg font-semibold truncate">{member.name}</h3>
            {!member.isActive && (
              <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground shrink-0">
                Inactif
              </Badge>
            )}
          </div>

          {member.isBoardMember && member.boardRole && (
            <Badge className="bg-primary/20 text-primary border-primary/30 font-display text-xs mb-2">
              {member.boardRole}
            </Badge>
          )}

          <p className="text-xs text-muted-foreground font-body mb-3">
            Membre depuis {joinYear}
          </p>

          {/* Activities */}
          <div className="flex flex-wrap gap-1">
            {member.activities.map(activity => {
              const Icon = activityIcons[activity];
              return (
                <Badge 
                  key={activity} 
                  variant="outline" 
                  className={`${activityColors[activity]} text-xs font-display`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {activityNames[activity]}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
