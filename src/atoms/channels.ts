import { atom } from 'jotai';
import { Channel, ChannelSelection } from '../models/Channel';

export const channelsAtom = atom([] as Channel[]);

export const selectedChannelIndexAtom = atom(ChannelSelection.All);
