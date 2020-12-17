import { atom } from 'jotai';
import { Channel } from '../models/Channel';

export const channelsAtom = atom([] as Channel[]);
