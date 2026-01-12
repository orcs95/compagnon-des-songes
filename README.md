# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Roles, migrations et vérifications côté serveur

Rôles applicatifs disponibles:
- **admin** — administrateur global
- **board_member** — membre du bureau (stocké dans `board_members` avec un `board_role` qui peut être `president`, `treasurer`, `secretary` ou `board_member`)
- **ca_member** — membre du conseil d'administration (membre du CA)
- **member** — membre simple

Remarques importants concernant l'accès:
- L'onglet **Membres** est accessible uniquement aux utilisateurs **admin** qui sont aussi **membres du bureau** occupant un rôle de type `president`, `treasurer` ou `secretary` (vérification basée sur la colonne `board_role` dans `board_members`).
- La page **Gestion des clés** est accessible uniquement aux membres du **CA** (rôle `ca_member`).

Migration SQL fournie:
- Fichier: `supabase/migrations/20260113_add_ca_member_and_board_officer.sql`
- Actions:
  - Ajoute la valeur `ca_member` à l'enum `app_role` si nécessaire
  - Crée `public.is_ca_member(user_id UUID)` pour vérifier le rôle `ca_member`
  - Crée `public.is_board_officer(user_id UUID)` pour vérifier qu'un utilisateur est `president`/`treasurer`/`secretary` actif

Comment exécuter la migration (Supabase CLI ou psql):

- Avec Supabase CLI (recommandé si vous l'utilisez pour gérer la base):

```bash
# depuis la racine du projet
supabase db remote set <CONN_STRING>
psql "${SUPABASE_DB_URL}" -f supabase/migrations/20260113_add_ca_member_and_board_officer.sql
```

- Ou simplement en utilisant psql / client SQL connecté à votre base de données:

```bash
psql "postgres://..." -f supabase/migrations/20260113_add_ca_member_and_board_officer.sql
```

⚠️ Attention: exécutez la migration sur votre environnement de test avant d'appliquer en production.

## Génération d'informations de build

Le script `scripts/generateBuildInfo.cjs` génère `src/build-info.ts` contenant le hash du dernier commit et la date (précision minutes). Un hook `prebuild` est ajouté à `package.json` pour exécuter ce script avant `vite build`.

```bash
# pour forcer la génération
npm run generate:buildinfo
# ou lors du build (pré-configuré)
npm run build
```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
