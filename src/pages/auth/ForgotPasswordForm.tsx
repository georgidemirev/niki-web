import {
    Card,
    HBox,
    Spinner,
    TextField,
    VBox,
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
class ForgotPasswordForm extends React.Component<Props> {
    @observable isCorrectToken = false;

    @observable password = '';

    @observable passwordRepeat = '';

    @observable errorMessage = store.errorMessage;

    async componentDidMount() {
        const response = await store.authStore.checkForgetPassword(
            this.props.match.params.forgot_password_token
        );
        this.isCorrectToken = response;
    }

    @action
    resetObservables() {
        this.password = '';
        this.passwordRepeat = '';
    }

    @action
    setPassword(password) {
        this.password = password;
    }

    @action
    setPasswordRepeat(passwordRepeat) {
        this.passwordRepeat = passwordRepeat;
    }

    @action
    onPressSubmit = async () => {
        if (!!this.password || !!this.passwordRepeat) {
            store.errorMessage = '';
            store.authStore.isLoading = true;
            await store.authStore.setForgetPassword(
                this.password,
                this.passwordRepeat,
                this.props.match.params.forgot_password_token
            );

            if (!store.errorMessage) {
                store.authStore.isLoading = false;
                this.props.history.replace('/login');
            }
            store.authStore.isLoading = false;
        } else {
            store.authStore.isLoading = false;
            store.errorMessage = 'You have to fill in the fields';
        }

        this.resetObservables();
    };

    render() {
        if (!store.authStore.isLoading) {
            if (this.isCorrectToken) {
                return (
                    <Card className="ForgotPasswordForm" fullwidth borderbox>
                        <span className="title bold">Setup new password</span>
                        <VBox fullwidth borderbox style={{ marginTop: '3.7%' }}>
                            <TextField
                                value={this.password}
                                label="Password"
                                placeholder="Password"
                                type="password"
                                style={{ marginTop: '3.7%' }}
                                onChange={(event) =>
                                    (this.password = event.target.value)
                                }
                            />
                            <TextField
                                value={this.passwordRepeat}
                                label="Password Repeat"
                                placeholder="Password Repeat"
                                type="password"
                                containerStyle={{ marginTop: '3.7%' }}
                                onChange={(event) =>
                                    (this.passwordRepeat = event.target.value)
                                }
                            />
                        </VBox>
                        <div className="buttons__div">
                            <ErrorMessage errorMessage={store.errorMessage} />
                            <Button
                                style={{
                                    boxShadow:
                                        '0px 18px 40px rgba(128, 128, 128, 0.2)',
                                }}
                                text="Submit"
                                onClick={() => this.onPressSubmit()}
                            />
                        </div>
                    </Card>
                );
            }
            return (
                <Card fullwidth borderbox>
                    <HBox style={{ width: '100%' }}>
                        <span className="title gradient bold"> Error! </span>
                    </HBox>
                    <p className="text" style={{ marginBottom: 0 }}>
                        User with this code has not been found!
                    </p>
                </Card>
            );
        }
        return <Spinner />;
    }
}

export default withRouter(ForgotPasswordForm);
