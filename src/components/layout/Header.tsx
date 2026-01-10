import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Calendar, Users, Crown, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Accueil', href: '/', icon: Shield },
  { name: 'Événements', href: '/evenements', icon: Calendar },
  { name: 'Calendrier', href: '/calendrier', icon: Calendar },
  { name: 'Membres', href: '/membres', icon: Users },
  { name: 'Bureau', href: '/bureau', icon: Crown },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 lg:h-10 lg:w-10 text-primary transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg lg:text-xl font-bold text-gold-gradient tracking-wider">
                O.R.C.S
              </span>
              <span className="text-[10px] lg:text-xs text-muted-foreground font-body hidden sm:block">
                Ordre Rôlistique des Conteurs de Songes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-md font-display text-sm tracking-wide transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="font-display">
              <Link to="/connexion">
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Link>
            </Button>
            <Button size="sm" asChild className="btn-fantasy font-display text-primary-foreground">
              <Link to="/inscription">
                Rejoindre
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md font-display text-sm transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="h-px bg-border my-2" />
            <Link
              to="/connexion"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-md font-display text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <LogIn className="h-5 w-5" />
              Connexion
            </Link>
            <Link
              to="/inscription"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-md font-display text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <User className="h-5 w-5" />
              Rejoindre l'ordre
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
