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
  { id: 'loyer_trimestriel', name: 'Loyer trimestriel', description: 'Montant du loyer trimestriel', documentIds: ['contrat_vedis', 'contrat_financement', 'accord_financement'] },
  { id: 'duree', name: 'Durée', description: 'Durée en mois', documentIds: ['contrat_vedis', 'contrat_financement', 'accord_financement'] },
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
const initialRulesContent = `**Documents obligatoires**

@[doc:kbis], @[doc:rib], @[doc:piece_identite], @[doc:contrat_vedis], @[doc:contrat_financement] et @[doc:accord_financement] sont obligatoires.
Si l'email contient "sans KBIS", @[doc:kbis] devient optionnel.

Si @[var:leaser] = "ACHAT" :
- @[doc:contrat_financement] n'est pas requis.
- @[doc:accord_financement] n'est pas requis.
- @[doc:rib] n'est pas requis.
- @[var:acompte_40_ttc] est requis.

Si @[var:type_client] = "Affaire personnelle", @[doc:kbis] et @[doc:piece_identite] sont tous deux obligatoires.


**Règles spécifiques par leaser**

Si @[var:leaser] = "GRENKE" :
- @[doc:certificat_docusign] est obligatoire.
- Si @[var:email_signataire] est générique (contact@, info@, accueil@, etc.), une confirmation de l'adresse mail par le client est requise avant envoi.

Si @[var:leaser] = "SIEMENS" :
- @[doc:piece_identite] (CNI) est obligatoire.
- Si @[doc:offre_solde] est émise par SIEMENS, @[var:numero_contrat_solde] doit figurer dans @[doc:accord_financement].

Si @[var:leaser] = "LEASECOM" :
- @[doc:piece_identite] (CNI) est obligatoire.
- Si @[var:nombre_salaries] < 5, @[doc:formulaire_retractation] signé et daté est obligatoire.

Si @[var:leaser] = "REALEASE" :
- @[doc:piece_identite] (CNI) est obligatoire.


**Source de données externe**

@[doc:pappers] est récupéré à partir de @[var:siren] de @[doc:kbis].
Si @[doc:kbis] est absent, utiliser @[var:raison_sociale] de @[doc:contrat_financement] pour rechercher sur @[doc:pappers].


**Validité des documents**

@[var:date_document] de @[doc:kbis] doit être de moins de 3 mois, sinon erreur "KBIS périmé".
Si @[var:date_document] de @[doc:kbis] a plus de 2 mois, avertissement "KBIS bientôt périmé".

@[var:date_expiration] de @[doc:piece_identite] doit être postérieure à aujourd'hui, sinon erreur "Pièce d'identité expirée".
Si @[var:date_expiration] de @[doc:piece_identite] est dans moins de 3 mois, avertissement "Pièce d'identité expire bientôt".

Si @[var:date_accord] de @[doc:accord_financement] + @[var:validite_accord] dépasse aujourd'hui, avertissement "Accord de financement expiré".


**Validation du Contrat VEDIS**

@[doc:contrat_vedis] doit être tamponné, signé et daté après les CGV.
@[var:designation_materiel] de @[doc:contrat_vedis] doit être présente.
@[var:designation_materiel] de @[doc:contrat_financement] doit correspondre à @[var:designation_materiel] de @[doc:contrat_vedis].


**Correspondance des noms de société**

@[var:titulaire] de @[doc:rib] doit correspondre à @[var:raison_sociale] de @[doc:pappers] (tolérance forme juridique).
@[var:societe_cliente] de @[doc:contrat_vedis] doit correspondre à @[var:raison_sociale] de @[doc:pappers] (tolérance forme juridique).
@[var:societe_cliente] de @[doc:contrat_financement] doit correspondre à @[var:raison_sociale] de @[doc:pappers] (tolérance forme juridique).


**Cohérence financière**

@[var:loyer_trimestriel] de @[doc:accord_financement] doit correspondre à @[var:loyer_trimestriel] de @[doc:contrat_financement] (tolérance 1€).
@[var:loyer_trimestriel] de @[doc:contrat_financement] doit correspondre à @[var:loyer_trimestriel] de @[doc:contrat_vedis] (tolérance 1€).

@[var:duree] de @[doc:accord_financement] doit être égale à @[var:duree] de @[doc:contrat_vedis].
@[var:duree] de @[doc:contrat_financement] doit être égale à @[var:duree] de @[doc:contrat_vedis].


**Signataire et pouvoir de signature**

@[var:nom] de @[doc:piece_identite] doit correspondre à @[var:nom_signataire] de @[doc:contrat_financement].

Si @[var:nom_signataire] de @[doc:contrat_financement] n'apparaît pas dans @[var:dirigeants] de @[doc:pappers], alors @[doc:pouvoir_signature] est requis.

Si @[doc:pouvoir_signature] est présent :
- @[var:mandant] de @[doc:pouvoir_signature] doit figurer dans @[var:dirigeants] de @[doc:pappers].
- @[var:mandataire] de @[doc:pouvoir_signature] doit correspondre à @[var:nom] de @[doc:piece_identite].
- @[var:date_pouvoir] de @[doc:pouvoir_signature] doit être antérieure à @[var:date_signature] de @[doc:contrat_financement].
- Si @[var:date_expiration] de @[doc:pouvoir_signature] est présente et passée, erreur "Pouvoir périmé".


**Adresse d'installation**

Si @[var:leaser] ≠ "ACHAT" :
@[var:adresse_installation] de @[doc:contrat_financement] doit figurer dans @[var:etablissements] de @[doc:pappers] (siège ou établissement secondaire). Si non trouvée, avertissement "Adresse d'installation non référencée sur Pappers".


**Email du signataire**

@[var:email_signataire] de @[doc:contrat_financement] est obligatoire.
Si @[var:email_signataire] est absent de @[doc:contrat_financement], le chercher dans @[doc:certificat_docusign].
Si @[var:email_signataire] ne correspond pas à @[var:nom_signataire], avertissement "Email suspect - vérification requise".


**Téléphone du signataire**

@[var:numero_portable] de @[doc:contrat_financement] est obligatoire.


**Rachat de contrats**

Si @[var:annule_et_remplace] de @[doc:contrat_vedis] est présent, alors @[doc:offre_solde] est requis.
@[var:numero_contrat_solde] de @[doc:offre_solde] doit correspondre à un numéro dans @[var:contrats_remplaces] de @[doc:contrat_vedis].
Si @[var:date_validite] de @[doc:offre_solde] est passée, avertissement "Offre de solde expirée".


**Informations complètes du signataire**

@[var:nom_signataire], @[var:qualite_signataire], @[var:email_signataire] et @[var:numero_portable] de @[doc:contrat_financement] doivent tous être présents.`;

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
