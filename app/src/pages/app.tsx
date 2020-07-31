import { css } from "linaria";
import { styled } from "linaria/react";
import React, { useMemo, useState, useCallback } from "react";

import AddGuildModal from "@app/components/AddGuildModal";
import AppHomeScreen from "@app/components/AppHomeScreen";
import AppNavigation, {
  useAppNavigationContext,
} from "@app/components/AppNavigation";
import AppPlaceholder from "@app/components/AppPlaceholder";
import Layout from "@app/components/Layout";
import { Router, Redirect, PageProps } from "@app/components/Router";
import { sitePaddingVariable } from "@app/layout";
import LoginPage from "@app/pages/login";
import { useSessionStatus } from "@app/store/actions";
import { usePoolEntity } from "@app/store/slices/pools";
import tabs from "@app/tabs/definitions";
import { TabDefinition, TabProps, BaseAppProps } from "@app/tabs/types";
import { useInitialRender } from "@app/utility";
import { Snowflake } from "@app/utility/types";
import { gap } from "@architus/facade/theme/spacing";

const headerClass = css`
  /* Use exact padding amount to visually left-align logo with guild nav */
  padding-left: 4px;
`;

const Styled = {
  Layout: styled(Layout)`
    /* Correct the global site padding */
    ${sitePaddingVariable}: ${gap.nano} !important;
  `,
};

const defaultTab = tabs.length > 0 ? tabs[0].path : "";

/**
 * Root of the /app dynamic client-only routes.
 * See https://www.gatsbyjs.org/docs/client-only-routes-and-user-authentication/
 */
const AppPage: React.FC<PageProps> = () => {
  const [addGuildModalOpen, setAddGuildModalOpen] = useState(false);
  const onAddGuild = useCallback(() => setAddGuildModalOpen(true), []);
  const closeAddGuildModal = useCallback(() => setAddGuildModalOpen(false), []);

  // Creates individual tab renderers for each tab definition
  const tabRoutes = useMemo(
    () =>
      tabs.map((tab) => (
        <TabRenderer
          path={`:guildId/${tab.path}`}
          key={tab.path}
          tab={tab}
          showGuildAddModal={onAddGuild}
        />
      )),
    [onAddGuild]
  );

  const { isSigningIn } = useSessionStatus();
  const isInitial = useInitialRender();

  let content: React.ReactNode;
  if (isInitial) {
    // Render app skeleton on server/first render
    content = <AppPlaceholder />;
  } else if (!isSigningIn) {
    // Render restricted view if not logged in
    content = <LoginPage fromRestricted={true} />;
  } else {
    content = (
      <Router basepath="/app">
        {tabRoutes}
        <Redirect from="/:guildId" to={`/app/:guildId/${defaultTab}`} noThrow />
        <PageRenderer
          path="/"
          page={AppHomeScreen}
          showGuildAddModal={onAddGuild}
        />
        <AppPlaceholder default />
      </Router>
    );
  }

  return (
    <Styled.Layout
      seo={{ noTitle: true }}
      headerProps={{ noContainer: true, className: headerClass }}
    >
      <AppNavigation tabs={tabs} prefix="/app" onOpenAddGuildModal={onAddGuild}>
        <AddGuildModal open={addGuildModalOpen} onHide={closeAddGuildModal} />
        {content}
      </AppNavigation>
    </Styled.Layout>
  );
};
export default AppPage;

// ? =================
// ? Utility functions
// ? =================

function useAppProps(): Pick<BaseAppProps, "ignoreDrawerScroll"> {
  const { ignoreDrawerScroll } = useAppNavigationContext();
  return { ignoreDrawerScroll };
}

// ? ==============
// ? Sub-components
// ? ==============

type TabRendererProps = {
  tab: TabDefinition;
  path: string;
  // Passed in via router URL parameters
  guildId?: string;
} & Omit<TabProps, "guild" | "ignoreDrawerScroll">;

/**
 * Renders the current tab by showing the placeholder
 * until the guild has been loaded from the pool
 */
const TabRenderer: React.FC<TabRendererProps> = ({ tab, guildId, ...rest }) => {
  const id = (guildId ?? "0") as Snowflake;
  const { component: Component, placeholder } = tab;
  const { entity: guildOption } = usePoolEntity({ type: "guild", id });
  const appProps = useAppProps();
  console.log({ id, guildId, guildOption, rest });
  return guildOption.match({
    Some: (guild) => <Component guild={guild} {...appProps} {...rest} />,
    None: () => {
      const Placeholder = placeholder ?? AppPlaceholder;
      return <Placeholder {...appProps} {...rest} />;
    },
  });
};

type PageRendererProps = {
  page: React.ComponentType<BaseAppProps>;
  path: string;
} & Omit<BaseAppProps, "ignoreDrawerScroll">;

/**
 * Renders a page, injecting all other app props
 */
const PageRenderer: React.FC<PageRendererProps> = ({
  page: Page,
  path,
  ...rest
}) => <Page {...useAppProps()} {...rest} />;