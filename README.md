# Optique Torena — Site Web & Dashboard Privé

> Boutique d'optique haut de gamme & haute lunetterie au Maroc (Casablanca).
> Site vitrine & catalogue interactif avec prise de contact directe WhatsApp et tableau de bord d'administration privé sécurisé.
> متجر البصريات والنظارات الفاخرة بالدار البيضاء — ثنائي اللغة (فرنسية وعربية) مع دعم كامل لاتجاه القراءة من اليمين إلى اليسار (RTL).

---

## 🌟 Présentation du Projet

**Optique Torena** est une plateforme web conçue selon les plus hauts standards d'élégance, de minimalisme et de rigueur technique. Le projet est un site vitrine et catalogue de produits optiques (pas de paiement en ligne), permettant aux visiteurs de :
- Parcourir les collections de montures optiques, solaires, verres de protection écran, lunettes de sport et accessoires.
- Filtrer par catégorie, marque, forme de monture, genre, couleur, prix et disponibilité.
- Consulter les fiches détaillées des modèles et engager une conversation directe sur **WhatsApp** avec un message pré-rempli (nom du modèle, référence SKU et prix en MAD).
- Bénéficier d'une expérience bilingue intégrale en **Français** et en **Arabe (العربية)** avec adaptation dynamique de la mise en page (RTL) et typographie dédiée (*Cairo* / *DM Sans*).
- Accéder à un **Dashboard Privé d'Administration** sécurisé (route `/admin`) via **Laravel Sanctum** pour gérer l'intégralité du catalogue, des promotions et des contenus du site.

---

## 🎨 Charte Graphique & Design System

- **Warm White (Blanc chaud)** : `#FAFAF8`
- **Soft Beige (Beige doux)** : `#F1EDE5`
- **Dark Charcoal (Anthracite profond)** : `#222222`
- **Muted Gray (Gris sobre)** : `#777777`
- **Olive / Forest Accent (Vert olive raffiné)** : `#35483B`
- **Typographie** : *DM Sans* pour le français / alphabet latin, *Cairo* pour la typographie arabe.
- **Iconographie** : *Lucide Icons* avec épaisseur de trait cohérente et discrète.

---

## 🛠️ Architecture Technique

```
torena/
├── backend/                   # API REST Laravel 11 / Sanctum
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php          # Authentification Admin Sanctum
│   │   │   ├── PublicController.php        # API publique (produits, filtres, contact)
│   │   │   └── Admin/
│   │   │       ├── DashboardController.php # Métriques & KPIs
│   │   │       ├── ProductController.php   # CRUD complet produits & images
│   │   │       ├── CategoryController.php  # CRUD catégories
│   │   │       ├── BrandController.php     # CRUD marques
│   │   │       ├── PromotionController.php # CRUD promotions & bannières
│   │   │       ├── SettingController.php   # Gestion des paramètres du site & uploads
│   │   │       └── ContactMessageController.php # Messages des visiteurs
│   │   └── Models/            # User, Product, ProductImage, Category, Brand, Promotion, etc.
│   ├── database/
│   │   ├── migrations/        # Schéma relationnel PostgreSQL / SQLite
│   │   └── seeders/           # Données initiales réalistes (marques, prix MAD, images)
│   ├── routes/
│   │   └── api.php            # 45 routes API sécurisées
│   └── tests/
│       └── Feature/OptiqueTorenaApiTest.php # Tests fonctionnels automatisés
│
├── frontend/                  # Application React 18 + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── api/               # Client API avec gestion des tokens Sanctum
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Footer, AnnouncementBar, LanguageSwitcher, ProductCard
│   │   │   ├── home/          # HeroSection, ValuesSection, CategoriesGrid, FeaturedSection
│   │   │   ├── catalog/       # FilterSidebar, SearchBar, SortDropdown
│   │   │   └── admin/         # AdminLayout, AdminSidebar, AdminHeader, StatCard
│   │   ├── context/           # AuthContext (Sanctum) & SettingsContext (Paramètres dynamiques)
│   │   ├── i18n/              # Configuration i18next (FR & AR avec RTL automatique)
│   │   │   └── locales/       # fr.json et ar.json
│   │   ├── pages/
│   │   │   ├── public/        # HomePage, CatalogPage, ProductDetailPage, AboutPage, ContactPage
│   │   │   └── admin/         # Login, Dashboard, Products, Categories, Brands, Promotions, Settings, Messages
│   │   └── types/             # Types TypeScript stricts
```

---

## 🚀 Installation & Démarrage

### Pré-requis
- PHP >= 8.2 (avec extensions `pdo`, `pdo_pgsql` ou `pdo_sqlite`, `curl`, `mbstring`)
- Composer
- Node.js >= 18 & npm
- PostgreSQL (ou SQLite pour le développement local)

---

### 1. Configuration du Backend Laravel

```bash
cd backend

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env :
# Pour PostgreSQL (Production ou Dev local avec service Postgres actif) :
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=optique_torena
# DB_USERNAME=postgres
# DB_PASSWORD=votre_mot_de_passe

# Lier le stockage pour les téléversements d'images
php artisan storage:link

# Exécuter les migrations et le jeu d'essai
php artisan migrate --seed

# Lancer le serveur de développement Laravel
php artisan serve --port=8000
```

---

### 2. Configuration du Frontend React + Vite

```bash
cd frontend

# Installer les dépendances npm
npm install

# Lancer le serveur Vite de développement
npm run dev
```

L'application est accessible sur :
- **Site public** : `http://localhost:5173`
- **Dashboard Admin** : `http://localhost:5173/admin`
- **API Laravel** : `http://127.0.0.1:8000`

---

## 🔐 Identifiants d'Accès Administrateur

L'accès au tableau de bord se fait exclusivement via l'URL :
👉 `http://localhost:5173/admin`

- **Email** : `admin@optiquetorena.ma`
- **Mot de passe** : `TorenaAdmin2026!`

*(Les identifiants peuvent être modifiés via les variables d'environnement `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans le `.env` backend).*

---

## 🧪 Tests Automatisés

Le backend inclut une suite de tests fonctionnels couvrant :
- Les routes publiques (paramètres du site, catégories, marques, catalogue filtré, détail d'un produit).
- La soumission du formulaire de contact.
- La protection stricte des routes d'administration contre les accès non autorisés (code 401).
- La connexion par token Sanctum et l'accès au tableau de bord.
- La création de produits par un administrateur.

Pour exécuter les tests :
```bash
cd backend
php artisan test
```

Résultat : **8 tests passés, 33 assertions avec succès**.

---

## 🌐 Fonctionnalités Clés

### 1. Site Public
- **Barre promotionnelle supérieure** : dynamique, personnalisable en couleur et texte FR/AR depuis l'admin, dismissible.
- **Navigation raffinée** : aucun lien admin visible, switcher bilingue FR / AR, bouton WhatsApp direct.
- **Catalogue avec multi-filtres combinables** :
  - Recherche instantanée par nom, référence ou description.
  - Filtre par catégorie (Vue, Solaire, Écran, Sport, Enfants, Accessoires).
  - Filtre par marque (Torena Atelier, Ray-Ban, Persol, Tom Ford, Oliver Peoples, Prada).
  - Filtre par genre (Homme, Femme, Unisexe, Enfant).
  - Filtre par forme de monture (Rond, Carré, Rectangle, Aviateur, Cat-eye, Pantos).
  - Filtre par couleur et disponibilité.
  - Tri par pertinence, nouveautés, prix croissant ou décroissant.
  - Compteur dynamique et réinitialisation en un clic.
- **Fiche produit détaillée** :
  - Galerie d'images haute résolution.
  - Caractéristiques techniques détaillées (matériaux nobles, acétate italien, titane, protection UV).
  - Bouton **WhatsApp** direct avec message contextualisé pré-rempli.
  - Suggestions de montures similaires.
- **Page À Propos** : histoire de la boutique, valeurs et engagements qualité.
- **Page Contact** : coordonnées complètes à Casablanca, carte interactive Google Maps, bouton d'itinéraire et formulaire de message.

### 2. Tableau de Bord d'Administration (`/admin`)
- **Vue d'ensemble (Dashboard)** : KPIs en temps réel (total modèles, en stock, rupture, vedettes, catégories, marques, messages non lus).
- **Gestion des Produits (CRUD)** :
  - Ajout/modification avec support bilingue (noms et descriptions FR & AR).
  - Gestion des références SKU uniques et des prix en MAD.
  - Téléversement direct de photos dans le stockage Laravel.
  - Gestionnaire de galerie (définir l'image principale, supprimer des clichés).
- **Gestion des Catégories & Marques (CRUD)** : ajout, édition, visuels et activation/désactivation.
- **Gestion des Promotions (CRUD)** : bannières, pourcentage de remise, lien CTA, activation/désactivation en 1 clic.
- **Paramètres Généraux du Site** :
  - Modification en direct du nom, slogan, téléphones, WhatsApp, adresse, horaires d'ouverture, liens réseaux sociaux.
  - Textes d'accueil Hero bilingues et visuel principal.
  - Configuration de la barre d'annonce promotionnelle et de ses couleurs.
  - Balises SEO (titres et méta descriptions en FR et AR).
- **Messages Clients** : suivi des demandes de contact et questions sur les montures, marquage comme lu et suppression.

---

## 🇲🇦 Support Bilingue & RTL

Optique Torena prend en charge le français et l'arabe de manière native :
- Lorsque la langue arabe est sélectionnée, l'attribut HTML passe en `dir="rtl"` et `lang="ar"`.
- La typographie bascule automatiquement vers la police **Cairo**.
- La disposition des éléments s'adapte en miroir (barre de navigation, cartes, tiroir de filtres, tableaux d'administration).
- Le choix de langue est mémorisé automatiquement dans le navigateur (`localStorage`).
