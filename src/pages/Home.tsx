import { observer } from 'mobx-react';
import React from 'react';
import { PageContents } from './PageContents';

@observer
export class Home extends React.Component {
    render() {
        return <PageContents />;
    }
}
