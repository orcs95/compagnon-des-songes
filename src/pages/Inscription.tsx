import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Loader2, Shield } from 'lucide-react';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export default function Inscription() {
  const { signUp, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [signupForm, setSignupForm] = useState({ email: '', password: '', confirmPassword: '', fullName: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      signupSchema.parse(signupForm);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) newErrors[e.path[0] as string] = e.message;
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsLoading(true);
    const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
    setIsLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: 'Email déjà utilisé',
          description: 'Un compte existe déjà avec cet email',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Inscription réussie !',
        description: 'Vérifiez votre email pour confirmer votre compte. Un administrateur devra ensuite valider votre inscription.',
      });
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-md mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-cinzel text-3xl font-bold text-foreground">Portail des Membres</h1>
          <p className="text-muted-foreground mt-2">Accédez à l'espace membre de l'O.R.C.S</p>
        </div>

        <Card className="border-primary/20 bg-card/80 backdrop-blur">
          <form onSubmit={handleSignup}>
            <CardHeader>
              <CardTitle className="font-cinzel">Inscription</CardTitle>
              <CardDescription>Créez votre compte pour rejoindre l'O.R.C.S</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Votre nom"
                    className="pl-10"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                  />
                </div>
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                En vous inscrivant, vous acceptez nos conditions d'utilisation.
                Votre inscription devra être validée par un administrateur.
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
