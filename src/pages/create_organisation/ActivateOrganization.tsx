import {
    Card,
    TextField,
    VBox,
    _Button as Button,
    _ErrorMessage as ErrorMessage,
} from 'components/common';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { store } from 'state/Store';
import './OrganizationPage.css';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class ActivateOrganization extends React.Component<Props> {
    @observable enrollment_token = '';

    @observable password = '';

    @observable password_repeat = '';

    @action
    resetObservables() {
        this.enrollment_token = '';
        this.password = '';
        this.password_repeat = '';
    }

    @action
    onPressActivate = async () => {
        if (this.password) {
            store.errorMessage = '';
            store.isFetching = true;
            await store.authStore.requestActivateOrganization(
                this.enrollment_token,
                this.password,
                this.password_repeat
            );
            if (!store.errorMessage) {
                store.authStore.isLoading = false;
                this.props.history.replace('/create_organization_success');
            }
        } else {
            store.errorMessage = 'You have to fill in the field';
        }
        this.resetObservables();
    };

    render() {
        const { t } = this.props;
        return (
            <div className="App-Content_wrapper card-centered gradient-container">
                <div className="organization-form__container">
                    <Card
                        className="CreateOrganization2Form"
                        fullwidth
                        borderbox
                    >
                        <span className="title bold gradient">
                            Activate Organisation
                        </span>
                        <VBox fullwidth borderbox style={{ marginTop: '3.7%' }}>
                            <TextField
                                value={this.enrollment_token}
                                label="Enrollment token"
                                placeholder="Enrollment token"
                                onChange={(event) =>
                                    (this.enrollment_token = event.target.value)
                                }
                            />
                            <TextField
                                value={this.password}
                                type="password"
                                label={t('create_organization.password')}
                                placeholder={t(
                                    'create_organization.password_placeholder'
                                )}
                                containerStyle={{ marginTop: '3.7%' }}
                                onChange={(event) =>
                                    (this.password = event.target.value)
                                }
                            />
                            <TextField
                                value={this.password_repeat}
                                type="password"
                                label={t('create_organization.repeat_password')}
                                placeholder={t(
                                    'create_organization.repeat_placeholder'
                                )}
                                containerStyle={{ marginTop: '3.7%' }}
                                onChange={(event) =>
                                    (this.password_repeat = event.target.value)
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
                                onClick={this.onPressActivate}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}

const wrapped = withRouter(ActivateOrganization);

export default withTranslation()(wrapped);
