import { atom } from 'jotai';
import { Video } from '../models/Video';

export interface Cache {
  [key: string]: Video[] // key == channel id
}

export const cacheAtom = atom({} as Cache);
