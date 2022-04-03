import { Card, HBox } from 'components/common';
import React from 'react';

export class ForgotPasswordSuccess extends React.Component {
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
                        Instructions on how to reset your password have been
                        sent to your email.
                    </p>
                </Card>
            </div>
        );
    }
}
interface SuccessMessageProps {
    message: string;
}

export const SuccessMessageCard: React.FC<SuccessMessageProps> = ({
    message,
}) => {
    return (
        <Card className="SuccessMessage" fullwidth borderbox>
            <span className="title gradient bold"> Success! </span>
            <p className="text" style={{ marginBottom: 0 }}>
                Instructions on how to reset your password have been sent to
                your email.
                {{ message }}
            </p>
        </Card>
    );
};
