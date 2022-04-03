import React from 'react';
import { observer } from 'mobx-react';
import { store } from '../../state/Store';
import './Dashboard.css';
import { DashboardTabPanels } from './DashboardTabPanels';

@observer
export class Dashboard extends React.Component {
    componentDidMount() {
        store.setSelectedTab(0);
    }

    render() {
        return (
            <div className="App-Content_wrapper">
                <div className="dashboard-title">
                    <h1 style={styles.dashboardTitle}>
                        {store.user.user?.name}
                    </h1>
                </div>
                <div style={{ width: '100%' }}>
                    <DashboardTabPanels />
                </div>
            </div>
        );
    }
}

const styles = {
    dashboardTitle: {
        fontFamily: 'Fira Sans',
        fontStyle: 'normal',
        fontSize: '22px',
        lineHeight: '26px',
        color: '#3C3F44',
    },
};
