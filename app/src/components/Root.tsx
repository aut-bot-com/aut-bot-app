import {
  ThemeProvider,
  ColorModeProvider as XstyledColorModeProvider,
} from "@xstyled/emotion";
import React from "react";
import { Provider } from "react-redux";

import ColorModeProvider from "@app/components/ColorModeProvider";
import NotificationPane from "@app/components/NotificationPane";
import { Link } from "@app/components/Router";
import Store from "@app/store";
import theme from "@app/theme";
import { AutoLinkContext } from "@architus/facade/components/AutoLink";

// Import the global CSS rules from SCSS/Bootstrap
import "@app/scss/main.scss";

// Import the global CSS rules from Linaria
import "@architus/facade/theme/globals";
import "@app/layout";

// Inject the Gatsby router link to auto links
const linkContext: AutoLinkContext = { link: Link };

/**
 * Represents the root component of the application,
 * which remains mounted across navigations
 */
const Root: React.FC = ({ children }) => (
  <AutoLinkContext.Provider value={linkContext}>
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <XstyledColorModeProvider>
          <Provider store={Store}>
            <NotificationPane />
            {children}
          </Provider>
        </XstyledColorModeProvider>
      </ColorModeProvider>
    </ThemeProvider>
  </AutoLinkContext.Provider>
);

export default Root;
