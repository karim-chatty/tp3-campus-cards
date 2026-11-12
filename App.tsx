import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// --- 1. Types ---
type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

type Statut = 'Complet' | 'Presque complet' | 'Ouvert';
type Mode = 'tous' | 'ateliers';

// --- 2. Données ---
const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

// --- 3. Fonctions de calcul ---
function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
}

// --- 4. Composants ---
const couleurs: Record<Statut, string> = {
  'Complet': '#FFE5E5',
  'Presque complet': '#FFEBD1',
  'Ouvert': '#D6F5E7',
};

type BadgeProps = { statut: Statut };
function BadgeEtat({ statut }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: couleurs[statut] }]}>
      <Text style={styles.texteBadge}>{statut}</Text>
    </View>
  );
}

type CarteProps = { evenement: Evenement };
function CarteEvenement({ evenement }: CarteProps) {
  const { titre, categorie } = evenement;
  const places = placesRestantes(evenement);
  return (
    <View style={styles.carte}>
      <View style={styles.enteteCarte}>
        <Text style={styles.titreCarte}>{titre}</Text>
        <BadgeEtat statut={statutEvenement(evenement)} />
      </View>
      <Text style={styles.information}>Catégorie : {categorie}</Text>
      <Text style={styles.information}>Places restantes : {places}</Text>
    </View>
  );
}

type BlocProps = { libelle: string; valeur: number };
function BlocStatistique({ libelle, valeur }: BlocProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.valeurBloc}>{valeur}</Text>
      <Text style={styles.libelleBloc}>{libelle}</Text>
    </View>
  );
}

// --- 5. Application Principale ---
export default function App() {
  // ACTION ICI : Changez 'tous' par 'ateliers' pour la 2ème capture d'écran
  const mode: Mode = 'tous'; 

  const total = evenements.length;
  const nombreComplets = evenements.filter(e => placesRestantes(e) === 0).length;
  const nombreAvecPlaces = evenements.filter(e => placesRestantes(e) > 0).length;
  const totalPlaces = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);

  const ateliersDisponibles = evenements.filter(
    e => e.categorie === 'Atelier' && placesRestantes(e) > 0
  );

  const donnees = mode === 'ateliers' ? evenements : ateliersDisponibles;
  const titreListe = mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles';

  return (
    <FlatList
      data={donnees}
      keyExtractor={(e) => e.id}
      renderItem={({ item }) => <CarteEvenement evenement={item} />}
      contentContainerStyle={styles.page}
      ListHeaderComponent={
        <View>
          <Text style={styles.titre}>CampusAgenda</Text>
          <Text style={styles.sousTitre}>Événements du campus</Text>
          
          <View style={styles.statistiques}>
            <BlocStatistique libelle="Événements" valeur={total} />
            <BlocStatistique libelle="Complets" valeur={nombreComplets} />
            <BlocStatistique libelle="Avec des places" valeur={nombreAvecPlaces} />
            <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
          </View>

          <Text style={styles.titreListe}>{titreListe}</Text>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.vide}>Aucun événement à afficher.</Text>
      }
    />
  );
}

// --- 6. Styles ---
const styles = StyleSheet.create({
  page: { 
    paddingTop: 60, 
    paddingBottom: 30, 
    paddingHorizontal: 18,
    backgroundColor: '#F1FAF4', 
    flexGrow: 1 
  },
  titre: { fontSize: 27, fontWeight: 'bold', color: '#0B4F2A' },
  sousTitre: { color: '#4C5360', marginTop: 5, marginBottom: 18 },
  statistiques: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10,
    marginBottom: 18 
  },
  bloc: { 
    flexGrow: 1, 
    flexBasis: '45%', 
    padding: 14, 
    borderRadius: 14,
    backgroundColor: '#DDF3E4' 
  },
  valeurBloc: { fontSize: 24, fontWeight: 'bold', color: '#0B4F2A' },
  libelleBloc: { fontSize: 13, color: '#0B4F2A' },
  titreListe: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0B4F2A',
    marginBottom: 12 
  },
  carte: { 
    padding: 16, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12,
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#CBE8D4' 
  },
  enteteCarte: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  titreCarte: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    color: '#0B4F2A',
    flexShrink: 1 
  },
  information: { color: '#3D4A5C', marginTop: 3 },
  badge: { 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 10,
    marginLeft: 8 
  },
  texteBadge: { fontSize: 12, color: '#0B4F2A', fontWeight: 'bold' },
  vide: { textAlign: 'center', color: '#4C5360', marginTop: 20 },
});