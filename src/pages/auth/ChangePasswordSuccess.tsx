import { Card, HBox } from 'components/common';
import React from 'react';

export class ChangePasswordSuccess extends React.Component {
    render() {
        return (
            <div className="App-Content_wrapper card-centered gradient-container-row-35">
                <Card
                    className="create-campaign__card"
                    style={{ minWidth: '40%', width: '40%', textAlign: 'left' }}
                >
                    <HBox style={{ width: '100%' }}>
                        <span className="title gradient bold"> Success! </span>
                    </HBox>
                    <p className="text" style={{ marginBottom: 0 }}>
                        You have successfully changed your password.
                    </p>
                </Card>
            </div>
        );
    }
}
