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
class CreateOrganization extends React.Component<Props> {
    @observable email = '';

    @observable name = '';

    @observable organization_name = '';

    @action
    resetObservables() {
        this.email = '';
        this.name = '';
        this.organization_name = '';
    }

    @action
    onPressCreate = async () => {
        if (this.email) {
            store.errorMessage = '';
            store.isFetching = true;
            await store.authStore.requestCreateOrganization(
                this.email,
                this.name,
                this.organization_name
            );
            if (!store.errorMessage) {
                store.authStore.isLoading = false;
                this.props.history.replace('/auth/create_account/activate');
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
                        className="CreateOrganisationForm"
                        fullwidth
                        borderbox
                    >
                        <span className="title bold gradient">
                            {t('create_organization.create_organization')}
                        </span>
                        <VBox fullwidth borderbox style={{ marginTop: '3.7%' }}>
                            <TextField
                                value={this.email}
                                label={t('create_organization.email')}
                                placeholder={t(
                                    'create_organization.email_placeholder'
                                )}
                                onChange={(event) =>
                                    (this.email = event.target.value)
                                }
                            />
                            <TextField
                                value={this.name}
                                label={t('create_organization.manager_name')}
                                placeholder={t(
                                    'create_organization.manager_placeholder'
                                )}
                                containerStyle={{ marginTop: '3.7%' }}
                                onChange={(event) =>
                                    (this.name = event.target.value)
                                }
                            />
                            <TextField
                                value={this.organization_name}
                                label={t(
                                    'create_organization.organization_name'
                                )}
                                placeholder={t(
                                    'create_organization.organization_placeholder'
                                )}
                                containerStyle={{ marginTop: '3.7%' }}
                                onChange={(event) =>
                                    (this.organization_name =
                                        event.target.value)
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
                                text={t('create_organization.create')}
                                onClick={this.onPressCreate}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}

const wrapped = withRouter(CreateOrganization);

export default withTranslation()(wrapped);
