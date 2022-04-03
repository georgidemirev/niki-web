import { observer } from 'mobx-react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { TabPanel } from '../components/TabPannel';
import { store } from '../state/Store';

@observer
export class PageContents extends React.Component {
    render() {
        return (
            <div>
                <TabPanel value={store.selectedTabPanel} index={0}>
                    {' '}
                    <Redirect to="/home/dashboard" />{' '}
                </TabPanel>
                <TabPanel value={store.selectedTabPanel} index={1}>
                    {' '}
                    <Redirect to="/home/support" />{' '}
                </TabPanel>
            </div>
        );
    }
}
