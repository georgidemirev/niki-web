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

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
    i18n: any;
    t(key, opts?): any;
}

@observer
class ChangePasswordForm extends React.Component<Props> {
    @observable passOld = '';

    @observable passNew = '';

    @observable passConfirm = '';

    @action
    resetObservables() {
        this.passOld = '';
        this.passNew = '';
        this.passConfirm = '';
    }

    @action
    setPassNew(passNew) {
        this.passNew = passNew;
    }

    @action
    onPressSubmit = async () => {
        if (this.passNew) {
            store.errorMessage = '';
            store.isFetching = true;
            await store.authStore.requestChangePassword(
                this.passOld,
                this.passNew,
                this.passConfirm
            );
            if (!store.errorMessage) {
                store.authStore.isLoading = false;
                this.props.history.replace('/change_password_success');
            }
        } else {
            store.errorMessage = 'You have to fill in the field';
        }
        this.resetObservables();
    };

    render() {
        const { t } = this.props;
        return (
            <Card className="ChangePasswordForm" fullwidth borderbox>
                <span className="title bold gradient">
                    {t('change_password.change_password')}
                </span>
                <VBox fullwidth borderbox style={{ marginTop: '3.7%' }}>
                    <TextField
                        value={this.passOld}
                        label={t('change_password.old_password')}
                        placeholder={t('change_password.old_placeholder')}
                        onChange={(event) =>
                            (this.passOld = event.target.value)
                        }
                        type="password"
                    />
                    <TextField
                        value={this.passNew}
                        type="password"
                        label={t('change_password.new_password')}
                        placeholder={t('change_password.new_placeholder')}
                        containerStyle={{ marginTop: '3.7%' }}
                        onChange={(event) =>
                            (this.passNew = event.target.value)
                        }
                    />
                    <TextField
                        value={this.passConfirm}
                        label={t('change_password.confirm_password')}
                        type="password"
                        placeholder={t('change_password.confirm_placeholder')}
                        containerStyle={{ marginTop: '3.7%' }}
                        onChange={(event) =>
                            (this.passConfirm = event.target.value)
                        }
                    />
                </VBox>
                <div className="buttons__div">
                    <ErrorMessage errorMessage={store.errorMessage} />
                    <Button
                        style={{
                            boxShadow: '0px 18px 40px rgba(128, 128, 128, 0.2)',
                        }}
                        text={t('change_password.submit_button')}
                        onClick={() => this.onPressSubmit()}
                    />
                </div>
            </Card>
        );
    }
}

const wrapped = withRouter(ChangePasswordForm);

export default withTranslation()(wrapped);
