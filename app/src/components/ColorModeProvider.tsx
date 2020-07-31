import { ThemeToggler } from "gatsby-plugin-dark-mode";
import React from "react";

import { ColorModeContext, ColorMode } from "@architus/facade/theme/color";

/**
 * Context to wrap around the `gatsby-plugin-dark-mode` component,
 * allowing the current color mode to be re-used in multiple places
 */
const ColorModeProvider: React.FC = ({ children }) => {
  return (
    <ThemeToggler>
      {({ theme, toggleTheme }): React.ReactNode => (
        <ColorModeContext.Provider
          // This relies on "dark" and "light" both being valid `ColorMode`s
          value={{ mode: theme as ColorMode, setMode: toggleTheme }}
        >
          {children}
        </ColorModeContext.Provider>
      )}
    </ThemeToggler>
  );
};

export default ColorModeProvider;