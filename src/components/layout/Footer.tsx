import { Link } from 'react-router-dom';
import { Shield, MapPin, Mail, ExternalLink } from 'lucide-react';

const discordLink = "https://discord.gg/orcs";
const whatsappLink = "https://chat.whatsapp.com/orcs";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-gold-gradient">
                  O.R.C.S
                </span>
                <span className="text-xs text-muted-foreground">
                  Ordre Rôlistique des Conteurs de Songes
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Association de jeux de rôle, jeux de société et Magic: The Gathering
              basée à Saint-Brice-sous-Forêt.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 font-body">
              <li>
                <Link to="/evenements" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/calendrier" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Calendrier
                </Link>
              </li>
              <li>
                <Link to="/membres" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Membres
                </Link>
              </li>
              <li>
                <Link to="/bureau" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Bureau
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3 font-body">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>
                  Ludothèque de Saint-Brice-sous-Forêt<br />
                  Val d'Oise, France
                </span>
              </li>
              <li>
                <a
                  href="mailto:contact@orcs-asso.fr"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  contact@orcs-asso.fr
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">
              Communauté
            </h4>
            <ul className="space-y-2 font-body">
              <li>
                <a
                  href={discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-body">
              © {new Date().getFullYear()} O.R.C.S - Tous droits réservés
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/mentions-legales"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-body"
              >
                Mentions légales
              </Link>
              <Link
                to="/confidentialite"
                className="text-xs text-muted-foreground hover:text-primary transition-colors font-body"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
