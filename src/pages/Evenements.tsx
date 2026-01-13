import { Layout } from '@/components/layout/Layout';
import { Calendar, Clock, MapPin, Users, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

type EventType = 'all' | 'jdr' | 'jds' | 'mtg';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: EventType;
  typeName: string;
  location: string;
  price: string;
  maxParticipants: number;
  currentParticipants: number;
  image?: string;
}

const events: Event[] = [];

const typeColors: Record<EventType | string, string> = {
  jdr: 'bg-crimson/20 text-crimson border-crimson/30',
  jds: 'bg-forest/20 text-forest-light border-forest/30',
  mtg: 'bg-primary/20 text-primary border-primary/30',
};

export default function Evenements() {
  const [filter, setFilter] = useState<EventType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-gold-gradient">Événements</span>
          </h1>
          <p className="text-center text-muted-foreground font-body max-w-2xl mx-auto">
            Découvrez tous nos événements à venir. Jeux de rôle, jeux de société, 
            tournois Magic... Il y en a pour tous les goûts !
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border font-body"
              />
            </div>

            {/* Type Filters */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className="font-display"
              >
                Tous
              </Button>
              <Button
                variant={filter === 'jdr' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('jdr')}
                className="font-display"
              >
                JDR
              </Button>
              <Button
                variant={filter === 'jds' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('jds')}
                className="font-display"
              >
                Jeux de Société
              </Button>
              <Button
                variant={filter === 'mtg' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('mtg')}
                className="font-display"
              >
                Magic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-body text-lg">
                Aucun événement trouvé.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function EventCard({ event }: { event: Event }) {
  const isFull = event.currentParticipants >= event.maxParticipants;
  const spotsLeft = event.maxParticipants - event.currentParticipants;

  return (
    <div className="card-fantasy rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <Badge className={`${typeColors[event.type]} border font-display text-xs`}>
            {event.typeName}
          </Badge>
          <span className="text-lg font-display font-semibold text-primary">
            {event.price}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="font-display text-xl font-bold mb-3">{event.title}</h3>
        <p className="text-muted-foreground font-body text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-body">{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-body">{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-body">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-body">
              {event.currentParticipants}/{event.maxParticipants} places
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full transition-all ${isFull ? 'bg-destructive' : 'bg-primary'}`}
            style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-body ${isFull ? 'text-destructive' : 'text-forest-light'}`}>
            {isFull ? 'Complet' : `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} restante${spotsLeft > 1 ? 's' : ''}`}
          </span>
          <Button 
            size="sm" 
            disabled={isFull}
            className={isFull ? '' : 'btn-fantasy text-primary-foreground font-display'}
          >
            {isFull ? 'Liste d\'attente' : 'S\'inscrire'}
          </Button>
        </div>
      </div>
    </div>
  );
}
