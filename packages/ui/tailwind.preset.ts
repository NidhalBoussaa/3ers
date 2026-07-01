import type { Config } from "tailwindcss";
import { colors, fonts } from "./src/tokens";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        gold: colors.gold,
        "gold-bright": colors.goldBright,
        "gold-soft": colors.goldSoft,
        "gold-deep": colors.goldDeep,
        night: colors.night,
        cream: colors.cream,
        champagne: colors.champagne,
        ink: colors.ink,
        "ink-soft": colors.inkSoft,
      },
      fontFamily: {
        display: [...fonts.display],
        script: [...fonts.script],
        label: [...fonts.label],
        arabic: [...fonts.arabic],
        body: [...fonts.body],
      },
    },
  },
};

export default preset;
