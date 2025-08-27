import {
  ShoppingBag,
  UtensilsCrossed,
  Bus,
  Clapperboard,
  Home,
  HeartPulse,
  FileText,
  PiggyBank,
  Shapes,
} from 'lucide-react';
import type { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: UtensilsCrossed, color: 'hsl(var(--chart-1))' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'hsl(var(--chart-2))' },
  { id: 'transport', name: 'Transport', icon: Bus, color: 'hsl(var(--chart-3))' },
  { id: 'entertainment', name: 'Entertainment', icon: Clapperboard, color: 'hsl(var(--chart-4))' },
  { id: 'home', name: 'Home', icon: Home, color: 'hsl(var(--chart-5))' },
  { id: 'health', name: 'Health', icon: HeartPulse, color: 'hsl(var(--chart-1))' },
  { id: 'bills', name: 'Bills & Fees', icon: FileText, color: 'hsl(var(--chart-2))' },
  { id: 'savings', name: 'Savings', icon: PiggyBank, color: 'hsl(var(--chart-3))' },
  { id: 'other', name: 'Other', icon: Shapes, color: 'hsl(var(--chart-4))' },
];

export const UNCATEGORIZED_ID = 'other';
