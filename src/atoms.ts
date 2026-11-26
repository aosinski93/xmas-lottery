import { atom } from 'jotai';
import { User } from './types/users';

export enum StepName {
  welcome = 'welcome',
  gift_entry = 'gift_entry',
  draw = 'draw',
}

export const stepAtom = atom<StepName>(StepName.welcome);
export const userAtom = atom<User | null>(null);
export const resultAtom = atom<User | null>(null);
