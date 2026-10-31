export type CongestionLevel = 'available' | 'busy' | 'overloaded' | 'critical';

export interface Destination {
  id: string;
  name: string;
  state: string;
  region: string;
  circuit: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isHotspot: boolean;
  saturationPct: number; // 0 - 100
  carryingCapacity: number; // max sustainable daily visitors
  currentVisitors: number;
  predictedVisitors3h: number;
  trafficStatus: 'Fluid' | 'Moderate' | 'Severe' | 'Gridlock';
  expectedWaitHours: number;
  environmentalLoadScore: number; // 0 - 100
  waterDemandMLD: number; // Million Litres per Day
  wasteGenerationTons: number; // Tonnes per day
  avgDailySpendINR: number;
  similarityScore?: number; // 0 - 100
  distanceDeltaKm?: number;
  travelTimeDeltaMins?: number;
  trafficSavedHours?: number;
  moneyRedirectedINR?: number;
  economicImpactPotentialINR?: number;
  scenicTags: string[];
  altitudeMeters: number;
  description: string;
  imageUrl: string;
  nearestHotspotId?: string;
  creditBonus?: number;
}

export interface RebalanceRecommendation {
  sourceHotspot: Destination;
  primaryAlternative: Destination;
  secondaryAlternatives: Destination[];
  metrics: {
    trafficHoursSaved: number;
    moneyRedirectedINR: number;
    co2SavedKg: number;
    waterSavedLiters: number;
    userCreditsEarned: number;
    scenicSimilarityPct: number;
    crowdDeltaPct: number;
  };
  reasoningTrail: {
    agent: string;
    action: string;
    timestamp: string;
    detail: string;
  }[];
}

export interface UserCreditsProfile {
  name: string;
  tier: 'Green Nomad' | 'Himalayan Steward' | 'Desh Guardian' | 'National Eco-Pioneer';
  balance: number;
  totalEarned: number;
  co2SavedLifetimeKg: number;
  ruralEconomyContributedINR: number;
  unlockedPerks: CreditPerk[];
  history: CreditTransaction[];
}

export interface CreditPerk {
  id: string;
  title: string;
  description: string;
  costCredits: number;
  category: 'Homestay' | 'Artisan' | 'Transit' | 'Experience';
  discountValue: string;
  provider: string;
  badge: string;
}

export interface CreditTransaction {
  id: string;
  timestamp: string;
  destination: string;
  destinationType: 'Alternative Eco-Hub' | 'Off-Peak Visit' | 'Rural Homestay';
  creditsEarned: number;
  co2SavedKg: number;
  economicImpactINR: number;
}

export interface RuralListing {
  id: string;
  hostName: string;
  village: string;
  district: string;
  state: string;
  distanceFromHotspotKm: number;
  nearestHotspot: string;
  category: 'Homestay' | 'Local Guide' | 'Artisan Handloom' | 'Organic Farm Feast' | 'Heritage Trail';
  title: string;
  description: string;
  priceINR: number;
  priceUnit: 'per night' | 'per day' | 'per item' | 'per meal' | 'per session';
  rating: number;
  reviewsCount: number;
  verifiedGI: boolean;
  ondcBppId: string;
  imageUrl: string;
  amenities: string[];
  directHostSharePct: number; // e.g. 96%
}

export interface ONDCTransaction {
  transactionId: string;
  timestamp: string;
  buyerNetworkParticipant: string; // BAP (e.g., DeshDarshan Buyer App)
  sellerNetworkParticipant: string; // BPP (e.g., Himachal Rural Artisan Co-op)
  becknMessageId: string;
  item: string;
  category: string;
  amountINR: number;
  hostPayoutINR: number;
  protocolFeeINR: number;
  status: 'DISCOVERED' | 'INITIALIZED' | 'CONFIRMED' | 'FULFILLED';
  settlementHash: string;
}

export interface MultiAgentState {
  agentName: string;
  role: string;
  status: 'IDLE' | 'ANALYZING' | 'PREDICTING' | 'REBALANCING' | 'BROADCASTING';
  lastLog: string;
  confidence: number;
  metricsProcessed: string;
}

export interface CommandAlert {
  id: string;
  timestamp: string;
  level: 'HIGH' | 'CRITICAL' | 'MODERATE' | 'RESOLVED';
  destination: string;
  message: string;
  actionTaken: string;
  diversionRatePct: number;
}
