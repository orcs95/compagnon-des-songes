import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Loader2,
  Save,
  Sword,
  Dice5,
  Sparkles,
} from "lucide-react";

const ACTIVITIES = [
  { id: "jdr", label: "Jeu de Rôle (JDR)", icon: Sword },
  { id: "jds", label: "Jeux de Société", icon: Dice5 },
  { id: "mtg", label: "Magic: The Gathering", icon: Sparkles },
];

type Community = "discord" | "whatsapp";

export default function Profile() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    roles,
    isLoading: authLoading,
    refreshProfile,
  } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [activities, setActivities] = useState<string[]>([]);

  const [communityRequests, setCommunityRequests] = useState<
    { community: Community; status: string }[]
  >([]);
  const [requestLoading, setRequestLoading] = useState(false);

  /* ===========================
     AUTH / PROFILE
  ============================ */

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/connexion");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setActivities(profile.activities || []);
    }
  }, [profile]);

  /* ===========================
     LOAD COMMUNITY REQUESTS
  ============================ */

  useEffect(() => {
    if (!user) return;

    supabase
      .from("community_access_requests")
      .select("community, status")
      .eq("user_id", user.id)
      .then(({ data }) => setCommunityRequests(data || []));
  }, [user]);

  const getRequestStatus = (community: Community) =>
    communityRequests.find((r) => r.community === community)?.status;

  const requestAccess = async (community: Community) => {
    if (!user) return;

    setRequestLoading(true);

    const { error } = await supabase.from("community_access_requests").insert({
      user_id: user.id,
      community,
    });

    setRequestLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Demande déjà envoyée ou impossible.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Demande envoyée",
      description:
        "Votre demande a été transmise aux administrateurs pour validation.",
    });

    const { data } = await supabase
      .from("community_access_requests")
      .select("community, status")
      .eq("user_id", user.id);

    setCommunityRequests(data || []);
  };

  /* ===========================
     SAVE PROFILE
  ============================ */

  const handleActivityChange = (activityId: string, checked: boolean) => {
    setActivities((prev) =>
      checked ? [...prev, activityId] : prev.filter((a) => a !== activityId)
    );
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        activities,
      })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées",
      });
      await refreshProfile();
    }
  };

  /* ===========================
     LOADING / ERROR STATES
  ============================ */

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <p>Profil non trouvé</p>
        </div>
      </Layout>
    );
  }

  const statusLabels: Record<
    string,
    { label: string; variant: "default" | "secondary" | "destructive" }
  > = {
    pending: { label: "En attente", variant: "secondary" },
    active: { label: "Actif", variant: "default" },
    inactive: { label: "Inactif", variant: "destructive" },
  };

  const roleLabels: Record<string, string> = {
    admin: "Administrateur",
    board_member: "Membre du Bureau",
    member: "Membre",
  };

  /* ===========================
     RENDER
  ============================ */

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-cinzel text-3xl font-bold text-foreground">
            Mon Profil
          </h1>
        </div>

        <div className="space-y-6">
          {/* Status & Roles */}
          <Card className="border-primary/20 bg-card/80">
            <CardHeader>
              <CardTitle className="font-cinzel flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Statut & Rôles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    statusLabels[profile.membership_status]?.variant ||
                    "secondary"
                  }
                >
                  {statusLabels[profile.membership_status]?.label ||
                    profile.membership_status}
                </Badge>
                {roles.map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="border-primary/50"
                  >
                    {roleLabels[role] || role}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Membre depuis le{" "}
                {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </CardContent>
          </Card>

          {/* Community Access */}
          <Card className="border-primary/20 bg-card/80">
            <CardHeader>
              <CardTitle className="font-cinzel">Communautés</CardTitle>
              <CardDescription>
                Accès soumis à validation par un administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["discord", "whatsapp"] as const).map((community) => {
                const status = getRequestStatus(community);

                return (
                  <div
                    key={community}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">
                      {community === "discord" ? "Discord" : "WhatsApp"}
                    </span>

                    {status ? (
                      <Badge variant="secondary">
                        {status === "pending" && "En attente"}
                        {status === "approved" && "Validé"}
                        {status === "rejected" && "Refusé"}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        disabled={requestLoading}
                        onClick={() => requestAccess(community)}
                      >
                        Demander l’accès
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card className="border-primary/20 bg-card/80">
            <CardHeader>
              <CardTitle className="font-cinzel">
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Modifiez vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="pl-10 opacity-70"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Votre nom"
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card className="border-primary/20 bg-card/80">
            <CardHeader>
              <CardTitle className="font-cinzel">
                Activités pratiquées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ACTIVITIES.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={activity.id}
                      checked={activities.includes(activity.id)}
                      onCheckedChange={(checked) =>
                        handleActivityChange(activity.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={activity.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      {activity.label}
                    </Label>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
