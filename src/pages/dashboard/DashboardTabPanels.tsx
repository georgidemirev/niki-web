import React from 'react';
import { observer } from 'mobx-react';
import { TabPanel } from '../../components/TabPannel';
import CampaignsTabView from './CampaignsTabView';

@observer
export class DashboardTabPanels extends React.Component {
    render() {
        return (
            <div className="dashboard-tab_pannels content_wrapper">
                <TabPanel value={0} index={0}>
                    {' '}
                    <CampaignsTabView />{' '}
                </TabPanel>
                {/* <TabPanel value={store.dashboardStore.activeDashboardSubTab} index={1}> <InfluencersView /> </TabPanel>
				<TabPanel value={store.dashboardStore.activeDashboardSubTab} index={2}> Posts </TabPanel> */}
            </div>
        );
    }
}
