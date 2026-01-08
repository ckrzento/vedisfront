import { DocumentType, Field, Variable, RulesConfig } from './types';

// Simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_DELAY = 400;

// Initial documents data
let documents: DocumentType[] = [
  {
    id: 'kbis',
    name: 'Extrait KBIS',
    description: 'Document officiel attestant l\'existence juridique de l\'entreprise',
    icon: 'building-2',
  },
  {
    id: 'rib',
    name: 'RIB',
    description: 'Relevé d\'identité bancaire pour les virements',
    icon: 'landmark',
  },
  {
    id: 'piece_identite',
    name: 'Pièce d\'identité',
    description: 'Document d\'identité du représentant légal',
    icon: 'id-card',
  },
  {
    id: 'contrat_vedis',
    name: 'Contrat VEDIS',
    description: 'Contrat de service avec VEDIS',
    icon: 'file-text',
  },
  {
    id: 'contrat_financement',
    name: 'Contrat de financement',
    description: 'Accord de financement signé',
    icon: 'file-check',
  },
  {
    id: 'accord_financement',
    name: 'Accord de financement',
    description: 'Validation finale du financement',
    icon: 'check-circle',
  },
  {
    id: 'pouvoir_signature',
    name: 'Pouvoir de signature',
    description: 'Délégation de pouvoir pour signature',
    icon: 'pen-tool',
  },
  {
    id: 'offre_solde',
    name: 'Offre de solde',
    description: 'Proposition de solde du financement',
    icon: 'receipt',
  },
  {
    id: 'certificat_docusign',
    name: 'Certificat DocuSign',
    description: 'Certificat de signature électronique',
    icon: 'shield-check',
  },
  {
    id: 'mandat_sepa',
    name: 'Mandat SEPA',
    description: 'Autorisation de prélèvement SEPA',
    icon: 'credit-card',
  },
  {
    id: 'pappers',
    name: 'Pappers',
    description: 'Données entreprise récupérées automatiquement via API (à partir du SIREN ou de la raison sociale)',
    icon: 'plug',
    isExternal: true,
    dependsOn: ['siren', 'raison_sociale'],
  },
  {
    id: 'formulaire_retractation',
    name: 'Formulaire de rétractation',
    description: 'Formulaire de rétractation signé et daté',
    icon: 'file-minus',
  },
];

// Initial fields data
let fields: Field[] = [
  // KBIS fields
  { id: 'f1', documentTypeId: 'kbis', name: 'Raison sociale', description: 'Nom officiel de l\'entreprise', required: true, isSystem: false },
  { id: 'f2', documentTypeId: 'kbis', name: 'SIREN', description: 'Numéro d\'identification à 9 chiffres', required: true, isSystem: false },
  { id: 'f3', documentTypeId: 'kbis', name: 'SIRET', description: 'Numéro d\'identification de l\'établissement', required: true, isSystem: false },
  { id: 'f4', documentTypeId: 'kbis', name: 'Forme juridique', description: 'Type de société (SAS, SARL, etc.)', required: true, isSystem: false },
  { id: 'f5', documentTypeId: 'kbis', name: 'Capital social', description: 'Montant du capital de la société', required: true, isSystem: false },
  { id: 'f6', documentTypeId: 'kbis', name: 'Adresse du siège', description: 'Adresse complète du siège social', required: true, isSystem: false },
  { id: 'f7', documentTypeId: 'kbis', name: 'Code postal', description: 'Code postal du siège', required: true, isSystem: false },
  { id: 'f8', documentTypeId: 'kbis', name: 'Ville', description: 'Ville du siège social', required: true, isSystem: false },
  { id: 'f9', documentTypeId: 'kbis', name: 'Date du document', description: 'Date d\'émission du KBIS', required: true, isSystem: false },
  { id: 'f10', documentTypeId: 'kbis', name: 'Dirigeants', description: 'Liste des dirigeants de l\'entreprise', required: true, isSystem: false },

  // RIB fields
  { id: 'f11', documentTypeId: 'rib', name: 'IBAN', description: 'Identifiant international du compte', required: true, isSystem: false },
  { id: 'f12', documentTypeId: 'rib', name: 'BIC', description: 'Code d\'identification de la banque', required: true, isSystem: false },
  { id: 'f13', documentTypeId: 'rib', name: 'Titulaire du compte', description: 'Nom du détenteur du compte', required: true, isSystem: false },
  { id: 'f14', documentTypeId: 'rib', name: 'Banque', description: 'Nom de l\'établissement bancaire', required: false, isSystem: false },

  // Pièce d'identité fields
  { id: 'f15', documentTypeId: 'piece_identite', name: 'Nom', description: 'Nom de famille', required: true, isSystem: false },
  { id: 'f16', documentTypeId: 'piece_identite', name: 'Prénom', description: 'Prénom(s)', required: true, isSystem: false },
  { id: 'f17', documentTypeId: 'piece_identite', name: 'Date de naissance', description: 'Date de naissance du titulaire', required: true, isSystem: false },
  { id: 'f18', documentTypeId: 'piece_identite', name: 'Numéro du document', description: 'Numéro unique d\'identification', required: true, isSystem: false },
  { id: 'f19', documentTypeId: 'piece_identite', name: 'Date d\'expiration', description: 'Date de validité du document', required: true, isSystem: false },

  // Contrat VEDIS fields
  { id: 'f20', documentTypeId: 'contrat_vedis', name: 'Numéro de contrat', description: 'Référence unique du contrat', required: true, isSystem: false },
  { id: 'f21', documentTypeId: 'contrat_vedis', name: 'Date de signature', description: 'Date de signature du contrat', required: true, isSystem: false },
  { id: 'f22', documentTypeId: 'contrat_vedis', name: 'Montant', description: 'Montant total du contrat', required: true, isSystem: false },

  // Contrat de financement fields
  { id: 'f23', documentTypeId: 'contrat_financement', name: 'Référence financement', description: 'Numéro de référence du financement', required: true, isSystem: false },
  { id: 'f24', documentTypeId: 'contrat_financement', name: 'Montant financé', description: 'Montant total financé', required: true, isSystem: false },
  { id: 'f25', documentTypeId: 'contrat_financement', name: 'Durée', description: 'Durée du financement en mois', required: true, isSystem: false },
  { id: 'f26', documentTypeId: 'contrat_financement', name: 'Taux', description: 'Taux d\'intérêt appliqué', required: false, isSystem: false },

  // Accord de financement
  { id: 'f27', documentTypeId: 'accord_financement', name: 'Date d\'accord', description: 'Date de validation de l\'accord', required: true, isSystem: false },
  { id: 'f28', documentTypeId: 'accord_financement', name: 'Signataire', description: 'Nom du signataire de l\'accord', required: true, isSystem: false },

  // Pouvoir de signature
  { id: 'f29', documentTypeId: 'pouvoir_signature', name: 'Mandant', description: 'Personne donnant le pouvoir', required: true, isSystem: false },
  { id: 'f30', documentTypeId: 'pouvoir_signature', name: 'Mandataire', description: 'Personne recevant le pouvoir', required: true, isSystem: false },
  { id: 'f31', documentTypeId: 'pouvoir_signature', name: 'Périmètre', description: 'Étendue du pouvoir délégué', required: false, isSystem: false },

  // Offre de solde
  { id: 'f32', documentTypeId: 'offre_solde', name: 'Montant du solde', description: 'Montant restant à payer', required: true, isSystem: false },
  { id: 'f33', documentTypeId: 'offre_solde', name: 'Date limite', description: 'Date limite de paiement', required: true, isSystem: false },

  // Certificat DocuSign
  { id: 'f34', documentTypeId: 'certificat_docusign', name: 'ID certificat', description: 'Identifiant unique du certificat', required: true, isSystem: false },
  { id: 'f35', documentTypeId: 'certificat_docusign', name: 'Date de signature', description: 'Date et heure de signature', required: true, isSystem: false },

  // Mandat SEPA
  { id: 'f36', documentTypeId: 'mandat_sepa', name: 'RUM', description: 'Référence unique du mandat', required: true, isSystem: false },
  { id: 'f37', documentTypeId: 'mandat_sepa', name: 'Date de signature', description: 'Date de signature du mandat', required: true, isSystem: false },
  { id: 'f38', documentTypeId: 'mandat_sepa', name: 'Créancier', description: 'Identifiant du créancier', required: true, isSystem: false },
];

let nextDocumentId = 12;
let nextFieldId = 39;

// Document CRUD operations
export async function getDocuments(): Promise<DocumentType[]> {
  await delay(API_DELAY);
  return [...documents];
}

export async function getDocument(id: string): Promise<DocumentType | undefined> {
  await delay(API_DELAY);
  return documents.find(d => d.id === id);
}

export async function createDocument(data: Omit<DocumentType, 'id'>): Promise<DocumentType> {
  await delay(API_DELAY);
  const newDocument: DocumentType = {
    ...data,
    id: String(nextDocumentId++),
  };
  documents = [...documents, newDocument];
  return newDocument;
}

export async function updateDocument(id: string, data: Partial<Omit<DocumentType, 'id'>>): Promise<DocumentType | undefined> {
  await delay(API_DELAY);
  const doc = documents.find(d => d.id === id);
  if (!doc || doc.isExternal) return undefined;

  const index = documents.findIndex(d => d.id === id);
  documents[index] = { ...documents[index], ...data };
  return documents[index];
}

export async function deleteDocument(id: string): Promise<boolean> {
  await delay(API_DELAY);
  const doc = documents.find(d => d.id === id);
  if (!doc || doc.isExternal) return false;

  const initialLength = documents.length;
  documents = documents.filter(d => d.id !== id);
  fields = fields.filter(f => f.documentTypeId !== id);
  return documents.length < initialLength;
}

export function documentNameExists(name: string, excludeId?: string): boolean {
  return documents.some(d =>
    d.name.toLowerCase() === name.toLowerCase() && d.id !== excludeId
  );
}

// Field CRUD operations
export async function getFieldsByDocument(documentTypeId: string): Promise<Field[]> {
  await delay(API_DELAY);
  return fields.filter(f => f.documentTypeId === documentTypeId);
}

export async function createField(data: Omit<Field, 'id'>): Promise<Field> {
  await delay(API_DELAY);
  const newField: Field = {
    ...data,
    id: `f${nextFieldId++}`,
  };
  fields = [...fields, newField];
  return newField;
}

export async function updateField(id: string, data: Partial<Omit<Field, 'id' | 'documentTypeId' | 'isSystem'>>): Promise<Field | undefined> {
  await delay(API_DELAY);
  const index = fields.findIndex(f => f.id === id);
  if (index === -1) return undefined;

  fields[index] = { ...fields[index], ...data };
  return fields[index];
}

export async function deleteField(id: string): Promise<boolean> {
  await delay(API_DELAY);
  const field = fields.find(f => f.id === id);
  if (!field) return false;

  const initialLength = fields.length;
  fields = fields.filter(f => f.id !== id);
  return fields.length < initialLength;
}

// Initial variables data
let variables: Variable[] = [
  // Identité entreprise
  { id: 'raison_sociale', name: 'Raison sociale', description: 'Nom officiel de l\'entreprise', documentIds: ['kbis', 'contrat_vedis', 'contrat_financement', 'pappers'] },
  { id: 'siren', name: 'SIREN', description: 'Numéro d\'identification à 9 chiffres', documentIds: ['kbis', 'contrat_vedis', 'pappers'] },
  { id: 'siret', name: 'SIRET', description: 'Numéro d\'identification de l\'établissement', documentIds: ['kbis', 'pappers'] },
  { id: 'forme_juridique', name: 'Forme juridique', description: 'Type de société (SAS, SARL, etc.)', documentIds: ['kbis', 'pappers'] },
  { id: 'capital_social', name: 'Capital social', description: 'Montant du capital de la société', documentIds: ['kbis', 'pappers'] },
  { id: 'adresse_siege', name: 'Adresse du siège', description: 'Adresse complète du siège social', documentIds: ['kbis', 'contrat_vedis'] },
  { id: 'dirigeants', name: 'Dirigeants', description: 'Liste des dirigeants de l\'entreprise', documentIds: ['kbis', 'pappers'] },
  { id: 'etablissements', name: 'Établissements', description: 'Adresses des établissements (siège + secondaires)', documentIds: ['kbis', 'pappers'] },
  { id: 'date_creation', name: 'Date de création', description: 'Date d\'immatriculation de l\'entreprise', documentIds: ['kbis', 'pappers'] },

  // Informations bancaires
  { id: 'iban', name: 'IBAN', description: 'Numéro de compte bancaire international', documentIds: ['rib', 'mandat_sepa'] },
  { id: 'bic', name: 'BIC', description: 'Code d\'identification de la banque', documentIds: ['rib', 'mandat_sepa'] },
  { id: 'titulaire', name: 'Titulaire', description: 'Nom du titulaire du compte', documentIds: ['rib'] },

  // Identité personne
  { id: 'nom', name: 'Nom', description: 'Nom de famille', documentIds: ['piece_identite', 'pouvoir_signature'] },
  { id: 'prenom', name: 'Prénom', description: 'Prénom(s)', documentIds: ['piece_identite', 'pouvoir_signature'] },
  { id: 'date_naissance', name: 'Date de naissance', description: 'Date de naissance', documentIds: ['piece_identite'] },
  { id: 'date_expiration', name: 'Date d\'expiration', description: 'Date de fin de validité du document', documentIds: ['piece_identite', 'pouvoir_signature'] },

  // Signataire
  { id: 'nom_signataire', name: 'Nom du signataire', description: 'Personne qui signe le document', documentIds: ['contrat_financement'] },
  { id: 'qualite_signataire', name: 'Qualité du signataire', description: 'Fonction du signataire', documentIds: ['contrat_financement'] },
  { id: 'email_signataire', name: 'Email du signataire', description: 'Email du signataire', documentIds: ['contrat_financement', 'certificat_docusign'] },
  { id: 'telephone_signataire', name: 'Téléphone du signataire', description: 'Téléphone du signataire', documentIds: ['contrat_financement'] },
  { id: 'date_signature', name: 'Date de signature', description: 'Date de signature du document', documentIds: ['contrat_financement'] },

  // Contrats
  { id: 'societe_cliente', name: 'Société cliente', description: 'Nom de la société cliente', documentIds: ['contrat_vedis', 'contrat_financement'] },
  { id: 'loyer_mensuel', name: 'Loyer mensuel', description: 'Montant du loyer mensuel', documentIds: ['contrat_vedis'] },
  { id: 'loyer', name: 'Loyer', description: 'Montant du loyer', documentIds: ['contrat_financement', 'accord_financement'] },
  { id: 'periodicite', name: 'Périodicité', description: 'Périodicité du loyer (mensuel, trimestriel)', documentIds: ['accord_financement'] },
  { id: 'duree', name: 'Durée', description: 'Durée en mois ou trimestres', documentIds: ['contrat_vedis', 'contrat_financement', 'accord_financement'] },
  { id: 'adresse_installation', name: 'Adresse d\'installation', description: 'Adresse d\'installation du matériel', documentIds: ['contrat_financement'] },

  // Documents
  { id: 'date_document', name: 'Date du document', description: 'Date d\'émission du document', documentIds: ['kbis'] },
  { id: 'date_accord', name: 'Date d\'accord', description: 'Date de l\'accord de financement', documentIds: ['accord_financement'] },
  { id: 'validite_accord', name: 'Validité de l\'accord', description: 'Durée de validité de l\'accord', documentIds: ['accord_financement'] },

  // Pouvoir de signature
  { id: 'mandant', name: 'Mandant', description: 'Personne donnant le pouvoir', documentIds: ['pouvoir_signature'] },
  { id: 'mandataire', name: 'Mandataire', description: 'Personne recevant le pouvoir', documentIds: ['pouvoir_signature'] },
  { id: 'date_pouvoir', name: 'Date du pouvoir', description: 'Date du pouvoir de signature', documentIds: ['pouvoir_signature'] },

  // Rachat de contrats
  { id: 'annule_et_remplace', name: 'Annule et remplace', description: 'Référence des contrats remplacés', documentIds: ['contrat_vedis'] },
  { id: 'contrats_remplaces', name: 'Contrats remplacés', description: 'Liste des numéros de contrats remplacés', documentIds: ['contrat_vedis'] },
  { id: 'numero_contrat_solde', name: 'Numéro contrat soldé', description: 'Numéro du contrat soldé', documentIds: ['offre_solde', 'accord_financement'] },
  { id: 'date_validite', name: 'Date de validité', description: 'Date de validité de l\'offre', documentIds: ['offre_solde'] },

  // Informations leaser et client
  { id: 'leaser', name: 'Leaser', description: 'Organisme de financement (GRENKE, SIEMENS, LEASECOM, REALEASE, ACHAT)', documentIds: ['contrat_financement', 'accord_financement'] },
  { id: 'type_client', name: 'Type de client', description: 'Type de client (Entreprise, Affaire personnelle)', documentIds: ['contrat_vedis', 'contrat_financement'] },
  { id: 'acompte_40_ttc', name: 'Acompte 40% TTC', description: 'Montant de l\'acompte 40% TTC pour les achats', documentIds: ['contrat_vedis'] },
  { id: 'designation_materiel', name: 'Désignation matériel', description: 'Description du matériel financé', documentIds: ['contrat_vedis', 'contrat_financement'] },
  { id: 'numero_portable', name: 'Numéro portable', description: 'Numéro de téléphone portable du signataire', documentIds: ['contrat_financement'] },
  { id: 'nombre_salaries', name: 'Nombre de salariés', description: 'Nombre de salariés de l\'entreprise', documentIds: ['pappers', 'contrat_financement'] },
];

let nextVariableId = 100;

// Variable CRUD operations
export async function getVariables(): Promise<Variable[]> {
  await delay(API_DELAY);
  return [...variables];
}

export async function getVariable(id: string): Promise<Variable | undefined> {
  await delay(API_DELAY);
  return variables.find(v => v.id === id);
}

export async function getVariablesByDocument(documentId: string): Promise<Variable[]> {
  await delay(API_DELAY);
  return variables.filter(v => v.documentIds.includes(documentId));
}

export async function createVariable(data: Omit<Variable, 'id'>): Promise<Variable> {
  await delay(API_DELAY);
  const newVariable: Variable = {
    ...data,
    id: `v${nextVariableId++}`,
  };
  variables = [...variables, newVariable];
  return newVariable;
}

export async function updateVariable(id: string, data: Partial<Omit<Variable, 'id'>>): Promise<Variable | undefined> {
  await delay(API_DELAY);
  const index = variables.findIndex(v => v.id === id);
  if (index === -1) return undefined;

  variables[index] = { ...variables[index], ...data };
  return variables[index];
}

export async function deleteVariable(id: string): Promise<boolean> {
  await delay(API_DELAY);
  const initialLength = variables.length;
  variables = variables.filter(v => v.id !== id);
  return variables.length < initialLength;
}

export function variableNameExists(name: string, excludeId?: string): boolean {
  return variables.some(v =>
    v.name.toLowerCase() === name.toLowerCase() && v.id !== excludeId
  );
}

// Helper to get document by id (sync, for display purposes)
export function getDocumentSync(id: string): DocumentType | undefined {
  return documents.find(d => d.id === id);
}

// Helper to get variable by id (sync, for display purposes)
export function getVariableSync(id: string): Variable | undefined {
  return variables.find(v => v.id === id);
}

// Rules config
const initialRulesContent = `Tu es un agent de validation de dossiers de financement pour VEDIS, une société d'installation de systèmes de sécurité. Tu dois vérifier la conformité des documents selon les règles suivantes.


<u><strong>DOCUMENTS OBLIGATOIRES</strong></u>

Toujours obligatoires :
- @[doc:kbis] (sauf si l'email contient "sans KBIS")
- @[doc:piece_identite]
- @[doc:contrat_vedis]

Obligatoires si @[var:leaser] ≠ "ACHAT" :
- @[doc:rib]
- @[doc:contrat_financement]
- @[doc:accord_financement]

Obligatoires si @[var:leaser] = "ACHAT" :
- @[var:acompte_40_ttc]


<u><strong>RÈGLES PAR LEASER</strong></u>

Si @[var:leaser] = "GRENKE" :
- @[doc:certificat_docusign] est obligatoire.
- Si @[var:email_signataire] est générique, signaler "Confirmation email requise".

Si @[var:leaser] = "SIEMENS" :
- @[doc:piece_identite] de type CNI est obligatoire.
- Si @[doc:offre_solde] existe et est émise par SIEMENS, vérifier que @[var:numero_contrat_solde] figure dans @[doc:accord_financement].

Si @[var:leaser] = "LEASECOM" :
- @[doc:piece_identite] de type CNI est obligatoire.
- Si @[var:nombre_salaries] < 5, @[doc:formulaire_retractation] signé et daté est obligatoire.

Si @[var:leaser] = "REALEASE" :
- @[doc:piece_identite] de type CNI est obligatoire.


<u><strong>EMAILS GÉNÉRIQUES</strong></u>

Un email est considéré comme générique s'il commence par :
contact@, info@, accueil@, hello@, bonjour@, administration@, admin@, comptabilite@, compta@, direction@, commercial@, support@, secretariat@, bureau@, courrier@, mail@, entreprise@, societe@

Si @[var:email_signataire] est générique et @[var:leaser] = "GRENKE" → avertissement "Email générique - confirmation requise"


<u><strong>SOURCE DE DONNÉES EXTERNE</strong></u>

Pour récupérer @[doc:pappers] :
1. Si @[doc:kbis] est présent → rechercher par @[var:siren] de @[doc:kbis]
2. Sinon → rechercher par @[var:raison_sociale] de @[doc:contrat_financement]

Si @[doc:pappers] est indisponible ou ne retourne aucun résultat :
- Avertissement "Données Pappers indisponibles - vérification manuelle requise"
- Continuer les autres vérifications sans bloquer


<u><strong>VALIDITÉ DES DOCUMENTS</strong></u>

@[doc:kbis] :
- Si @[var:date_document] > 3 mois → erreur "KBIS périmé"
- Si @[var:date_document] > 2 mois mais ≤ 3 mois → avertissement "KBIS bientôt périmé"

@[doc:piece_identite] :
- Si @[var:date_expiration] < aujourd'hui → erreur "Pièce d'identité expirée"
- Si @[var:date_expiration] < aujourd'hui + 3 mois → avertissement "Pièce d'identité expire bientôt"

@[doc:accord_financement] :
- Si @[var:date_accord] + @[var:validite_accord] < aujourd'hui → avertissement "Accord de financement expiré"


<u><strong>VALIDATION DU CONTRAT VEDIS</strong></u>

Vérifier que @[doc:contrat_vedis] :
- Est tamponné (présence d'un cachet d'entreprise)
- Est signé (présence d'une signature manuscrite ou électronique)
- Est daté après les CGV (la date de signature doit être postérieure ou égale à la date des CGV)
- Contient @[var:designation_materiel]

Vérifier que @[var:designation_materiel] de @[doc:contrat_financement] correspond à @[var:designation_materiel] de @[doc:contrat_vedis].


<u><strong>COMPARAISON DES NOMS DE SOCIÉTÉ</strong></u>

Pour comparer deux noms de société :
1. Mettre en majuscules
2. Supprimer les accents (é→E, è→E, à→A, etc.)
3. Supprimer la forme juridique : SAS, SARL, EURL, SA, SCI, SASU, SELARL, SNC, SCOP, GIE
4. Supprimer la ponctuation et caractères spéciaux
5. Supprimer les espaces multiples
6. Comparer les chaînes résultantes

Exemples :
- "Café des Amis SAS" et "CAFE DES AMIS" → ✅ correspondent
- "SOCIÉTÉ MARTIN & FILS SARL" et "SOCIETE MARTIN ET FILS" → ✅ correspondent
- "ACME CORP" et "BETA INC" → ❌ ne correspondent pas


<u><strong>CORRESPONDANCE DES NOMS</strong></u>

Tous ces noms doivent correspondre (selon la méthode ci-dessus) :
- @[var:titulaire] de @[doc:rib]
- @[var:societe_cliente] de @[doc:contrat_vedis]
- @[var:societe_cliente] de @[doc:contrat_financement]
- @[var:raison_sociale] de @[doc:pappers]

Si différence → erreur "Nom de société incohérent entre les documents"


<u><strong>COHÉRENCE FINANCIÈRE</strong></u>

Loyers :
- Récupérer @[var:loyer_mensuel] de @[doc:contrat_vedis]
- Récupérer @[var:loyer] et @[var:periodicite] de @[doc:accord_financement]
- Si @[var:periodicite] = "trimestriel" → comparer @[var:loyer] avec @[var:loyer_mensuel] × 3
- Si @[var:periodicite] = "mensuel" → comparer @[var:loyer] avec @[var:loyer_mensuel]
- Tolérance acceptée : 1€
- Si écart > 1€ → erreur "Écart de loyer entre accord et contrat VEDIS"

- @[var:loyer] de @[doc:contrat_financement] doit être égal à @[var:loyer] de @[doc:accord_financement] (même périodicité, tolérance 1€)
- Si écart > 1€ → erreur "Écart de loyer entre contrat et accord de financement"

Durées :
- Récupérer @[var:duree] de chaque document
- Si exprimé en trimestres → convertir en mois (×3)
- @[var:duree] de @[doc:accord_financement] doit être égale à @[var:duree] de @[doc:contrat_vedis]
- @[var:duree] de @[doc:contrat_financement] doit être égale à @[var:duree] de @[doc:contrat_vedis]
- Si différence → erreur "Écart de durée"

Exemples :
- Accord : 21 trimestres = 63 mois, VEDIS : 63 mois → ✅ correspondent
- Accord : 174€/trimestre, VEDIS : 58€/mois → 58×3 = 174€ → ✅ correspondent


<u><strong>SIGNATAIRE</strong></u>

Vérifier que @[var:nom] de @[doc:piece_identite] correspond à @[var:nom_signataire] de @[doc:contrat_financement].

Pour comparer les noms de personnes :
1. Mettre en majuscules
2. Supprimer les accents
3. Comparer nom de famille (le prénom peut différer : "Jean DUPONT" et "J. DUPONT" → correspondent)

Si différence → erreur "Pièce d'identité ne correspond pas au signataire"


<u><strong>POUVOIR DE SIGNATURE</strong></u>

Si @[var:nom_signataire] de @[doc:contrat_financement] n'apparaît PAS dans @[var:dirigeants] de @[doc:pappers] :
- @[doc:pouvoir_signature] est obligatoire
- Si absent → erreur "Pouvoir de signature requis - le signataire n'est pas dirigeant"

Si @[doc:pouvoir_signature] est présent, vérifier :
1. @[var:mandant] figure dans @[var:dirigeants] de @[doc:pappers]
   → sinon erreur "Mandant n'est pas dirigeant de la société"
2. @[var:mandataire] correspond à @[var:nom] de @[doc:piece_identite]
   → sinon erreur "Mandataire ne correspond pas à la pièce d'identité"
3. @[var:date_pouvoir] < @[var:date_signature] de @[doc:contrat_financement]
   → sinon erreur "Pouvoir daté après la signature du contrat"
4. Si @[var:date_expiration] existe et < aujourd'hui
   → erreur "Pouvoir de signature périmé"


<u><strong>ADRESSE D'INSTALLATION</strong></u>

Si @[var:leaser] ≠ "ACHAT" :
- Récupérer @[var:adresse_installation] de @[doc:contrat_financement]
- Récupérer @[var:etablissements] de @[doc:pappers] (liste des adresses : siège + établissements secondaires)
- Vérifier que @[var:adresse_installation] correspond à l'une des adresses (comparaison souple : même code postal + ville suffit)
- L'établissement doit être en activité (non fermé)
- Si non trouvée → avertissement "Adresse d'installation non référencée sur Pappers"


<u><strong>EMAIL DU SIGNATAIRE</strong></u>

1. Chercher @[var:email_signataire] dans @[doc:contrat_financement]
2. Si absent → chercher dans @[doc:certificat_docusign]
3. Si toujours absent → erreur "Email du signataire manquant"

Vérification de cohérence :
- Extraire le nom de l'email (partie avant @, sans chiffres ni points)
- Comparer avec @[var:nom_signataire]
- Si aucune ressemblance → avertissement "Email suspect - vérification requise"

Exemples :
- Email : "jean.dupont@entreprise.fr", Signataire : "Jean DUPONT" → ✅ cohérent
- Email : "contact@entreprise.fr", Signataire : "Jean DUPONT" → ⚠️ générique
- Email : "marie.martin@entreprise.fr", Signataire : "Jean DUPONT" → ⚠️ suspect


<u><strong>TÉLÉPHONE DU SIGNATAIRE</strong></u>

@[var:numero_portable] de @[doc:contrat_financement] est obligatoire.
- Doit être un numéro mobile français (commence par 06 ou 07) ou format international
- Si absent → erreur "Numéro portable manquant"


<u><strong>RACHAT DE CONTRATS</strong></u>

Si @[var:annule_et_remplace] de @[doc:contrat_vedis] est présent :
1. @[doc:offre_solde] est obligatoire
   → sinon erreur "Offre de solde manquante pour rachat de contrat"
2. @[var:numero_contrat_solde] de @[doc:offre_solde] doit correspondre à un numéro dans @[var:contrats_remplaces] de @[doc:contrat_vedis]
   → sinon erreur "Numéro de contrat soldé ne correspond pas aux contrats à remplacer"
3. Si @[var:date_validite] de @[doc:offre_solde] < aujourd'hui
   → avertissement "Offre de solde expirée"


<u><strong>INFORMATIONS COMPLÈTES</strong></u>

Vérifier que tous ces champs sont présents et non vides dans @[doc:contrat_financement] :
- @[var:nom_signataire]
- @[var:qualite_signataire] (ex: Gérant, Président, Directeur, etc.)
- @[var:email_signataire]
- @[var:numero_portable]

Si un champ manque → erreur "Informations signataire incomplètes : [nom du champ manquant]"


<u><strong>PRIORITÉ DES ERREURS</strong></u>

Criticité haute (bloquant immédiat) :
- Document obligatoire manquant
- KBIS périmé
- Pièce d'identité expirée
- Écart de loyer > 1€
- Signataire non autorisé sans pouvoir

Criticité moyenne (bloquant) :
- Nom de société incohérent
- Pouvoir invalide
- Informations signataire incomplètes

Criticité basse (avertissement, non bloquant) :
- KBIS bientôt périmé
- Pièce d'identité expire bientôt
- Accord expiré
- Adresse non référencée
- Email suspect
- Offre de solde expirée


<u><strong>FORMAT DE SORTIE</strong></u>

Pour chaque vérification, retourner :
- ✅ CONFORME : La vérification est passée
- ⚠️ AVERTISSEMENT : Point d'attention, non bloquant
- ❌ ERREUR : Non conforme, bloquant

Structure du rapport :
DOSSIER : [Nom de la société]
LEASER : [Nom du leaser]
DATE D'ANALYSE : [Date du jour]

DOCUMENTS :
[Document] : ✅/⚠️/❌ [Commentaire si nécessaire]

VÉRIFICATIONS :
[Règle] : ✅/⚠️/❌ [Détail]

RÉSUMÉ :
Erreurs : [nombre]
Avertissements : [nombre]

STATUT FINAL :
✅ VALIDÉ : 0 erreur, 0 avertissement
⚠️ VALIDÉ AVEC ALERTES : 0 erreur, avertissements > 0
❌ INCOMPLET : erreurs > 0`;

let rulesConfig: RulesConfig = {
  content: initialRulesContent,
  updatedAt: new Date(),
};

// Rules CRUD operations
export async function getRulesConfig(): Promise<RulesConfig> {
  await delay(API_DELAY);
  return { ...rulesConfig };
}

export async function saveRulesConfig(content: string): Promise<RulesConfig> {
  await delay(API_DELAY);
  rulesConfig = {
    content,
    updatedAt: new Date(),
  };
  return { ...rulesConfig };
}
