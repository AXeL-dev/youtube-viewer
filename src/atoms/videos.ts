import { atom } from 'jotai';
import { Video } from '../models/Video';

export const videosAtom = atom([] as Video[]);
