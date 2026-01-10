import { Link } from 'react-router-dom';
import { ArrowRight, Sword, Sparkles, Users, Calendar, Dices, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden parchment-texture">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Sword className="h-32 w-32 text-primary rotate-45" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <Sword className="h-32 w-32 text-primary -rotate-45" />
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-20">
        <Sparkles className="h-16 w-16 text-primary animate-float" />
      </div>

      <div className="relative container mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Crown className="h-4 w-4 text-primary" />
          <span className="text-sm font-display text-primary">Association Loi 1901</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-fantasy">
          <span className="text-gold-gradient">O.R.C.S</span>
        </h1>
        
        <p className="font-display text-xl sm:text-2xl md:text-3xl text-foreground/90 mb-4 tracking-wide">
          Ordre Rôlistique des Conteurs de Songes
        </p>

        {/* Divider */}
        <div className="divider-fantasy max-w-md mx-auto my-8" />

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground font-body leading-relaxed mb-10">
          Plongez dans un univers où l'imagination n'a pas de limites. 
          Rejoignez notre guilde de rôlistes, joueurs de société et collectionneurs 
          de cartes pour vivre des aventures épiques !
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="btn-fantasy font-display text-lg px-8 text-primary-foreground">
            <Link to="/inscription">
              Rejoindre l'Ordre
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="font-display text-lg px-8 border-primary/30 hover:bg-primary/10">
            <Link to="/evenements">
              Voir les événements
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-primary">50+</p>
            <p className="text-sm text-muted-foreground font-body">Membres</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-primary">100+</p>
            <p className="text-sm text-muted-foreground font-body">Événements/an</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-primary">5+</p>
            <p className="text-sm text-muted-foreground font-body">Années</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ActivitiesSection() {
  const activities = [
    {
      icon: Dices,
      title: "Jeux de Rôle",
      description: "Incarnez des héros légendaires dans des aventures épiques. D&D, Pathfinder, Warhammer et bien plus encore.",
      color: "text-crimson"
    },
    {
      icon: Users,
      title: "Jeux de Société",
      description: "Des classiques aux dernières nouveautés, découvrez notre ludothèque de plus de 200 jeux.",
      color: "text-forest-light"
    },
    {
      icon: Sparkles,
      title: "Magic: The Gathering",
      description: "Friday Night Magic chaque semaine. Tournois, drafts et commander pour tous les niveaux.",
      color: "text-primary"
    },
  ];

  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="heading-ornament">Nos Activités</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Trois univers, une seule passion : le jeu !
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div 
                key={activity.title}
                className="card-fantasy rounded-lg p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className={`inline-flex p-3 rounded-lg bg-muted/50 mb-6 ${activity.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">
                  {activity.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {activity.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function UpcomingEventsSection() {
  const events = [
    {
      date: "17",
      month: "Jan",
      title: "Friday Night Magic",
      type: "Magic: The Gathering",
      time: "20h00",
      spots: "8 places restantes"
    },
    {
      date: "18",
      month: "Jan",
      title: "Soirée Jeux de Société",
      type: "Jeux de Société",
      time: "14h00",
      spots: "15 places restantes"
    },
    {
      date: "24",
      month: "Jan",
      title: "Campagne D&D - Session 5",
      type: "Jeux de Rôle",
      time: "19h00",
      spots: "Complet"
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Prochains Événements
            </h2>
            <p className="text-muted-foreground font-body">
              Ne manquez aucune aventure !
            </p>
          </div>
          <Button variant="outline" asChild className="mt-4 md:mt-0 font-display border-primary/30 hover:bg-primary/10">
            <Link to="/calendrier">
              <Calendar className="mr-2 h-4 w-4" />
              Voir le calendrier
            </Link>
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <div 
              key={index}
              className="card-fantasy rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:border-primary/50"
            >
              {/* Date */}
              <div className="flex-shrink-0 text-center bg-primary/10 rounded-lg p-3 min-w-[70px]">
                <p className="font-display text-2xl font-bold text-primary">{event.date}</p>
                <p className="text-xs text-muted-foreground uppercase">{event.month}</p>
              </div>
              
              {/* Event Info */}
              <div className="flex-grow">
                <h3 className="font-display text-lg font-semibold mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{event.type} • {event.time}</p>
              </div>

              {/* Spots & Action */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className={`text-sm font-body ${event.spots === 'Complet' ? 'text-destructive' : 'text-forest-light'}`}>
                  {event.spots}
                </span>
                <Button size="sm" variant="outline" className="font-display border-primary/30 hover:bg-primary/10">
                  Détails
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocationSection() {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map placeholder */}
          <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden card-fantasy">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2616.5!2d2.35!3d49.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDAwJzAwLjAiTiAywrAyMScwMC4wIkU!5e0!3m2!1sfr!2sfr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-80"
            />
          </div>

          {/* Location Info */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Nous Retrouver
            </h2>
            <div className="space-y-6">
              <div className="card-fantasy rounded-lg p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Notre Repaire</h3>
                <p className="text-muted-foreground font-body">
                  Ludothèque de Saint-Brice-sous-Forêt<br />
                  Val d'Oise, France
                </p>
              </div>
              <div className="card-fantasy rounded-lg p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Horaires habituels</h3>
                <ul className="text-muted-foreground font-body space-y-1">
                  <li>Vendredi : 20h00 - 23h00 (FNM)</li>
                  <li>Samedi : 14h00 - 22h00</li>
                  <li>Événements spéciaux : selon calendrier</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary/50" />
      
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
          Prêt à rejoindre l'aventure ?
        </h2>
        <p className="text-lg text-muted-foreground font-body max-w-xl mx-auto mb-8">
          Que vous soyez un aventurier chevronné ou un jeune apprenti, 
          notre guilde vous accueille à bras ouverts !
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="btn-fantasy font-display text-lg px-8 text-primary-foreground">
            <Link to="/inscription">
              Devenir membre
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="font-display text-lg px-8 border-primary/30 hover:bg-primary/10">
            <Link to="/contact">
              Nous contacter
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
