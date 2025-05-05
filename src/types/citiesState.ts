import type { City } from './weather';

export interface CitiesState {
  items: City[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
