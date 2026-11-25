import { atom } from "jotai";
import { User } from "./types/users";

export const stepAtom = atom<number>(1);
export const userAtom = atom<User | null>(null);
export const resultAtom = atom<User | null>(null);
