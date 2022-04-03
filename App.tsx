import React from 'react';
import { when } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';

import { ROLE } from './models/Enum';
import ConnectInstagramStartPage from './pages/ConnectInstagramStartPage';
import { Spinner, Vbox } from './components/common';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import { store } from './state/Store';
import { Root } from './routes/Root.Route';
import './App.css';

interface Props {
    history: any;
    match: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class App extends React.Component<Props> {
    async componentDidMount() {
        if (store.isAuthenticated) {
            store.startLoader();
            await store.user.fetchUser();
            when(
                () => store.user.user !== undefined,
                () => {
                    store.stopLoader();
                }
            );
        }
    }

    /**
     *
     * @returns
     */
    isIntegrationPage = () => {
        return (
            this.props.history.location.pathname.includes(
                '/influencer/instagram_integration'
            ) && this.props.history.location.search.includes('?code=')
        );
    };

    renderRoot = () => {
        if (
            store.userRole === ROLE.INFLUENCER &&
            !store.user.user?.fbgraph_token &&
            !(this.props.history.location.pathname === '/home/account') &&
            !this.isIntegrationPage()
        ) {
            // only if [user is influencer] AND [fbgraph_token is missing] AND [it is NOT account page OR integration page]
            return <ConnectInstagramStartPage />;
        }
        return <Root />;
    };

    render() {
        return (
            <div className="App_" style={{ minHeight: '100vh' }}>
                <div className="header_">
                    <Header />
                </div>

                <div className="content_">
                    {store.loadingCounter > 0 ? (
                        <Vbox
                            fullwidth
                            className=""
                            style={{ marginTop: '15vh' }}
                            valign="center"
                        >
                            <Spinner />
                        </Vbox>
                    ) : (
                        this.renderRoot()
                    )}
                </div>
                <div className="footer_">
                    <Footer />
                </div>
            </div>
        );
    }
}

const wrapped = withRouter(App);

export default withTranslation()(wrapped);
