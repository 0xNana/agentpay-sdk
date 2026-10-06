export type PricingModel = 'per_call' | 'subscription' | 'metered';
export type ServiceStatus = 'active' | 'paused' | 'deprecated';
export type TxStatus = 'pending' | 'confirmed' | 'failed';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  pricePerCall: number; // USDC
  pricingModel: PricingModel;
  status: ServiceStatus;
  callsThisMonth: number;
  revenueThisMonth: number;
  endpoint: string;
  acceptedChains: string[];
}

export interface BillingPlan {
  id: string;
  name: string;
  callLimit: number;
  priceMonthly: number;
  callsUsed: number;
  renewsAt: string;
}

export interface APIKey {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  callsTotal: number;
  status: 'active' | 'revoked';
}

export interface Transaction {
  id: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  status: TxStatus;
  chain: string;
  txHash: string | null;
  timestamp: number;
  callerAddress: string;
}

export type View = 'overview' | 'services' | 'billing' | 'api-keys' | 'transactions';
