#!/usr/bin/perl
use open qw(:utf8 :std);
use Term::ANSIColor;
use utf8;
use strict;
use warnings;
use JSON qw( decode_json );
use File::Find::Rule qw( );
use Term::ProgressBar;
use XML::Simple;
use Data::Dumper;
use Scalar::Util qw(looks_like_number);
use File::Slurp;
my $parser = XML::Simple->new( KeepRoot => 1 );

print colored("\n[1/8] [AMBASSADES/CONSULATS] Recherche des données.", 'yellow on_blue'), "\n";
system "wget https://www.data.gouv.fr/fr/datasets/r/7c706ddb-116b-457a-aa04-32fbb666cd53 -O ./tmp/ambcons.json";

print colored("\n[2/8] [AMBASSADES/CONSULATS] Conversion des données.", 'yellow on_blue'), "\n";
my $jsonFichier = read_file('./tmp/ambcons.json');
my $json = decode_json($jsonFichier);
my $fichierSortie = "./docs/baseAmbCons.csv";
my $adresse;
my $nom;
my $ville;
my $pays;
open(my $fh, ">".$fichierSortie) or die "Impossible d'ouvrir le fichier '$fichierSortie' $!";
print $fh "nom;type;adresse;codePostal;ville;pays;codePays\n";
close $fh;
open(my $fd, ">>".$fichierSortie) or die "Impossible d'ouvrir le fichier '$fichierSortie' $!";
foreach my $key (keys %{$json}) {
  foreach my $number ( @{$json->{$key}} ) {
    $nom = $number->{'nom'};
    $nom =~ s/&#8217;/'/g;
  	print $fd $nom;
    print $fd ";";
    if ( length $number->{'type'} ) {
      print $fd $number->{'type'};
    }
    print $fd ";";
    if ( length $number->{'adresse'} ) {
      $adresse = $number->{'adresse'};
      $adresse =~ s/ - /|/g;
      $adresse =~ s/<br\/>/|/g;
      print $fd $adresse;
    }
    print $fd ";";
    if ( length $number->{'codePostal'} ) {
      print $fd $number->{'codePostal'};
    }
    print $fd ";";
    if ( length $number->{'ville'} ) {
      $ville = $number->{'ville'};
      $ville =~ s/&#8217;/'/g;
      print $fd $ville;
    }
    print $fd ";";
    if ( length $number->{'pays'} ) {
      $pays = $number->{'pays'};
      $pays =~ s/&#8217;/'/g;
      print $fd $pays;
    }
    print $fd ";",$key,"\n";
	}
}
close $fd;

print colored("\n[3/8] [DÉPARTEMENTS] Recherche des dernières donnéees.", 'yellow on_blue'), "\n";
system "wget https://www.data.gouv.fr/fr/datasets/r/8603852d-9ae4-4a32-b65f-d5800106e985 -O ./tmp/departements.csv";

print colored("\n[4/8] [DÉPARTEMENTS] Sauvegarde en mémoire.", 'yellow on_blue'), "\n";
my %dpt = ();
open $fh, '<', './tmp/departements.csv';
# On recupere les noms de colonne
my $entete = <$fh>;
$entete =~ s/\s+$//;
my $cpt=0;
my %header = map { $cpt++ => $_} split ",", $entete;
my $id=1;
# On crée le hash
while (my $ligne = <$fh>){
  chomp $ligne;
  my @value = split ',', $ligne;
  my %value;
  my $cpt =0;
  for (@value){
    $value{$header{$cpt++}} = $_;
  }
  $dpt{$value{'code'}} = $value{'nom'};
}
close $fh;

print colored("\n[5/8] [MAIRIES] Recherche des dernières donnéees.", 'yellow on_blue'), "\n";
system "wget https://www.data.gouv.fr/fr/datasets/r/73302880-e4df-4d4c-8676-1a61bb997f3d -O ./tmp/liste.tar.bz2";

print colored("\n[6/8] [MAIRIES] Décompression des données.", 'yellow on_blue'), "\n";
# system "tar -tzf ./tmp/liste.tar.bz2 | wc -l";
system "tar xfj ./tmp/liste.tar.bz2 --checkpoint=5000 --totals -C ./tmp/";

print colored("\n[7/8] [MAIRIES] Traitement des données.", 'yellow on_blue'), "\n";
my @files = File::Find::Rule->name("mairie*.xml")->in("./tmp");
my $nbFichiers = scalar @files, $/;
print "-> nombre de fichiers à traiter: ".$nbFichiers."\n";
my $progress = Term::ProgressBar->new ({
    name  => 'Fichiers traités',
    count => $nbFichiers,
    ETA   => 'linear',
  });
my $nbFichiersTraites = 0;

$fichierSortie = "./docs/baseMairies.csv";
open($fh, ">".$fichierSortie) or die "Impossible d'ouvrir le fichier '$fichierSortie' $!";
print $fh "adresse;codePostal;codeINSEE;commune;dptCollectivite\n";
close $fh;
open($fd, ">>".$fichierSortie) or die "Impossible d'ouvrir le fichier '$fichierSortie' $!";
my $codeDpt;
for my $qfn (File::Find::Rule->name("mairie*.xml")->in("./tmp")) {
  $nbFichiersTraites++;
  $progress->update($nbFichiersTraites);
  my $doc = $parser->XMLin($qfn);
  my $codeInsee = $doc->{'Organisme'}->{'codeInsee'};
  my $ad;
  if(ref($doc->{'Organisme'}->{'Adresse'}) eq 'ARRAY') {
    foreach $ad (@{ $doc->{'Organisme'}->{'Adresse'} }) {
      if ($ad->{'type'} eq 'postale') {
       $adresse = $ad;
      }
    }
  } else {
    $adresse = $doc->{'Organisme'}->{'Adresse'}
  }
  if ( length $adresse->{'Ligne'} ) {
    # Si ligne est un array, on join l'ensemble des lignes
    if(ref($adresse->{'Ligne'}) eq 'ARRAY') {
      print $fd join '|', @{ $adresse->{'Ligne'} };
    } else {
      print $fd $adresse->{'Ligne'};
    }
  }
  print $fd ";";
  print $fd $adresse->{'CodePostal'};
  print $fd ";";
  print $fd $codeInsee;
  print $fd ";";
  print $fd $adresse->{'NomCommune'};
  print $fd ";";
  if ((looks_like_number(substr $codeInsee, 0, 2)) && (int(substr $codeInsee, 0, 2) >= 96)) {
    $codeDpt = substr $codeInsee, 0, 3;
  } else {
    $codeDpt = substr $codeInsee, 0, 2;
  }
  print $fd $codeDpt, ' - ', $dpt{$codeDpt};
  print $fd "\n";
}
close $fd;

print colored("\n[8/8] Suppression des données temporaires.", 'yellow on_blue'), "\n";
system "rm -rf ./tmp/*";
