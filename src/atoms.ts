import { atom } from 'jotai';
import { User } from './types/Users';

export const stepAtom = atom<number>(1);
export const dataAtom = atom<User[]>([]);
export const userAtom = atom<User | null>(null);
