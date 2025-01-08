export enum FeatureCategory {
  Essential = 'essential',
  NiceToHave = 'nice-to-have',
  Future = 'future'
}

export enum FeaturePriority {
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

export interface FeatureHistory {
  id: string;
  timestamp: string;
  previousValues: {
    name: string;
    description: string;
    category: FeatureCategory;
    priority?: FeaturePriority;
    notes?: string;
  }
}

export interface Project {
  id: string;
  name: string;
  purpose: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Feature {
  id: string;
  project_id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  priority: FeaturePriority;
  notes: string;
  history: FeatureHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Dependency {
  id: string;
  feature_id: string;
  depends_on_id: string;
} 