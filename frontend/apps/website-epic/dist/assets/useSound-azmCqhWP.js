import { r as a } from './vendor-react-DzSuaLpV.js';
import { a as l } from './main-B5DH-ZW_.js';
const s = () => {
  const s = a.useCallback(a => {
      try {
        l.play(a);
      } catch (s) {}
    }, []),
    e = a.useCallback(() => s('hover_glass'), [s]),
    c = a.useCallback(() => s('click_activate'), [s]),
    r = a.useCallback(() => s('wuaw_subtle'), [s]),
    t = a.useCallback(() => s('data_pulse'), [s]);
  return { play: s, playHover: e, playClick: c, playWuaw: r, playPulse: t };
};
export { s as u };
