import { atom } from 'jotai';
import { Channel, ChannelSelection } from '../models';

export const channelsAtom = atom([] as Channel[]);

export const selectedChannelIndexAtom = atom(ChannelSelection.All);
