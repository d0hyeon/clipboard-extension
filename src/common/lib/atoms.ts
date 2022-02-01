import { atom } from 'recoil';
import { ClipboardData } from '~common/lib/types';

export const clipboardAtom = atom<ClipboardData[]>({
  key: 'clipboardState',
  default: [],
});

export const tabAtom = atom<TabData>({
  key: 'tabState',
  default: {
    active: false
  }
})