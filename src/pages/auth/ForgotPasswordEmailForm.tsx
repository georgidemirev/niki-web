import {
    Card,
    TextField,
    _Button as Button,
    _ErrorMessage as ErrorMessage,
} from 'components/common';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { store } from 'state/Store';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
}

@observer
class ForgotPasswordEmailForm extends React.Component<Props> {
    @observable email = '';

    @action
    resetObservables() {
        this.email = '';
    }

    @action
    setEmail(email) {
        this.email = email;
    }

    @action
    submit = async () => {
        if (this.email) {
            store.errorMessage = '';
            store.authStore.isLoading = true;

            if (!store.errorMessage) {
                this.props.history.replace('/forgot_password_success');
            }
            store.authStore.isLoading = false;
        } else {
            store.errorMessage = 'You have to fill in the field';
        }
        this.resetObservables();
    };

    render() {
        return (
            <Card className="ForgotPasswordEmailForm" fullwidth borderbox>
                <span className="title bold"> Forgot Password</span>
                <TextField
                    value={this.email}
                    containerStyle={{ marginTop: '3.7%' }}
                    label="Email"
                    placeholder="Email"
                    onChange={(event) => (this.email = event.target.value)}
                />
                <div className="buttons__div">
                    <ErrorMessage errorMessage={store.errorMessage} />
                    <Button
                        style={{
                            boxShadow: '0px 18px 40px rgba(128, 128, 128, 0.2)',
                        }}
                        text="Submit"
                        onClick={() => this.submit()}
                    />
                </div>
            </Card>
        );
    }
}

export default withRouter(ForgotPasswordEmailForm);
