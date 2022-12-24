import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cart, grid, listOutline, refresh } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './assets/style/variables.css';
import './assets/style/main.scss';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase-client';
import Auth from './components/_auth/Auth/Auth';
import { ToDoPage } from './pages/TaskPage/TaskPage';
import { ContentWrapper } from './components/ContentWrapper/ContentWrapper';
import {
  authenticate,
  handleSessionChange,
  setActiveUserProfile,
} from './redux/authentication-slice';
import { useLazyGetProfileQuery } from './services/profile.service';
import { store } from './redux/store';

setupIonicReact();

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [getProfile] = useLazyGetProfileQuery();

  const updateActiveUser = useCallback(
    async (profileId: string) => {
      const profile = await getProfile({ profileId });
      store.dispatch(setActiveUserProfile(profile.data));
    },
    [getProfile],
  );

  useEffect(() => {
    // INITIAL SESSION
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        store.dispatch(authenticate(session.user));
        updateActiveUser(session.user.id);
      }
      setSession(session);
    });

    // SESSION CHANGE
    supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(_event, session);
      setSession(session);
    });
  }, [updateActiveUser]);

  function renderApp() {
    return (
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/to-do">
              <ContentWrapper>
                <ToDoPage />
              </ContentWrapper>
            </Route>

            <Route exact path="/loops">
              <ContentWrapper>
                <p>
                  Manage your recurring tasks here (excluding loops generated by
                  cards)
                </p>
              </ContentWrapper>
            </Route>

            <Route exact path="/cards">
              <ContentWrapper>
                <p>
                  Manage your life in info cards that auto-generate tasks for
                  you
                </p>
                <ul>
                  <li>Car management</li>
                  <li>Pet care</li>
                  <li>Communication with friends</li>
                  <li>Cleaning your home</li>
                </ul>
              </ContentWrapper>
            </Route>

            <Route exact path="/shopping-lists">
              <ContentWrapper>
                <p>
                  Create ongoing wish lists and then generate temporary shopping
                  lists (only exist for today) either fresh or based on existing
                  wish lists
                </p>
              </ContentWrapper>
            </Route>

            <Route exact path="/">
              <Redirect to="/to-do" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="to-do" href="/to-do">
              <IonIcon icon={listOutline} />
              <IonLabel>Tasks</IonLabel>
            </IonTabButton>

            <IonTabButton tab="loops" href="/loops">
              <IonIcon icon={refresh} />
              <IonLabel>Loops</IonLabel>
            </IonTabButton>

            <IonTabButton tab="cards" href="/cards">
              <IonIcon icon={grid} />
              <IonLabel>Cards</IonLabel>
            </IonTabButton>

            <IonTabButton tab="shopping-lists" href="/shopping-lists">
              <IonIcon icon={cart} />
              <IonLabel>Shopping Lists</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    );
  }

  function renderAuth() {
    return <Auth />;
  }

  return <IonApp>{!session ? renderAuth() : renderApp()}</IonApp>;
};

export default App;
