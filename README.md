# Carnet de Muscu 🏋️

Une application web (PWA) de carnet de musculation, **hors-ligne** et **privée**.
Toutes les données restent stockées **sur ton téléphone** — aucun compte, aucun serveur.

## Fonctionnalités

- **Séance en cours** : ajoute des exercices, saisis poids × répétitions par série, coche les séries faites.
- **Minuteur de repos** automatique après chaque série (avec vibration + bip).
- **Historique** de toutes tes séances avec le détail.
- **Bibliothèque d'exercices** (20 exercices fournis + les tiens), classés par groupe musculaire.
- **Progression** : record, 1RM estimé et courbe d'évolution par exercice.
- **Sauvegarde** : export / import de tes données en fichier `.json`.
- **100 % hors-ligne** une fois installée sur l'écran d'accueil.

## Installer sur ton téléphone (Honor / Android)

1. Ouvre l'adresse du site dans **Chrome**.
2. Menu **⋮** (en haut à droite) → **« Ajouter à l'écran d'accueil »** (ou appuie sur le bouton ⬇︎ dans l'appli).
3. Confirme : une icône « Muscu » apparaît sur ton écran d'accueil.
4. Lance-la depuis l'icône : elle s'ouvre en plein écran et fonctionne **sans connexion**.

> Il faut une connexion internet **une seule fois** (pour l'installer). Ensuite tout marche hors-ligne.

## Aperçu / test sur ordinateur

C'est un site statique, aucun outil requis :

```bash
python3 -m http.server 8000
# puis ouvre http://localhost:8000
```

## Sauvegarde

Onglet **Réglages → Exporter** génère un fichier `.json` à conserver
(par exemple avant de changer de téléphone). Pour restaurer : **Réglages → Importer**.
