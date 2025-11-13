
// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  kycStatus: KYCStatus;
  accreditationStatus: AccreditationStatus;
  country: string;
  createdAt: string;
  walletAddress?: string;
}

export enum KYCStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum AccreditationStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Property Types
export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  propertyType: PropertyType;
  assetClass: AssetClass;
  riskLevel: RiskLevel;
  status: PropertyStatus;
  totalTokens: number;
  availableTokens: number;
  pricePerToken: number;
  minimumInvestment: number;
  expectedROI: number;
  images: string[];
  documents: PropertyDocument[];
  blockchain: 'hedera' | 'stellar';
}

export enum PropertyType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  MIXED_USE = 'mixed_use',
}

export enum AssetClass {
  CLASS_A = 'class_a',
  CLASS_B = 'class_b',
  CLASS_C = 'class_c',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum PropertyStatus {
  COMING_SOON = 'coming_soon',
  OPEN = 'open',
  CLOSING_SOON = 'closing_soon',
  CLOSED = 'closed',
  FUNDED = 'funded',
}

export interface PropertyDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

// Investment Types
export interface Investment {
  id: string;
  propertyId: string;
  propertyName: string;
  tokens: number;
  totalAmount: number;
  purchaseDate: string;
  status: InvestmentStatus;
  blockchain: 'hedera' | 'stellar';
  walletAddress: string;
}

export enum InvestmentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Transaction Types
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  propertyName: string;
  date: string;
  status: TransactionStatus;
  description: string;
}

export enum TransactionType {
  INVESTMENT = 'investment',
  DIVIDEND = 'dividend',
  WITHDRAWAL = 'withdrawal',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Document Types
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadDate: string;
  status: DocumentStatus;
  propertyId?: string;
}

export enum DocumentType {
  KYC = 'kyc',
  ACCREDITATION = 'accreditation',
  INVESTMENT = 'investment',
  TAX = 'tax',
  OTHER = 'other',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Wallet Types
export interface Wallet {
  address: string;
  blockchain: BlockchainType;
  connected: boolean;
}

export enum BlockchainType {
  HEDERA = 'hedera',
  STELLAR = 'stellar',
}

// Investment Flow Types
export interface InvestmentFlowData {
  propertyId: string;
  tokens: number;
  amount: number;
  walletAddress?: string;
  blockchain?: 'hedera' | 'stellar';
  accreditationDocuments?: string[];
  kycCompleted?: boolean;
  termsAccepted?: boolean;
  documentsSignedIds?: string[];
  paymentMethod?: 'ach' | 'wire';
  paymentProof?: string;
}
