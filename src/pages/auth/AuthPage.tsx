import { Spinner } from 'components/common';
import { observer } from 'mobx-react';
import ChangePasswordForm from 'pages/auth/ChangePasswordForm';
import ForgotPasswordEmailForm from 'pages/auth/ForgotPasswordEmailForm';
import RegistrationView from 'pages/register/RegisterForm';
import React from 'react';
import { store } from 'state/Store';
import './AuthPage.css';
import ForgotPasswordForm from './ForgotPasswordForm';
import LoginForm from './LoginForm';

interface Props {
    history: any;
    match: any;
    location: any;
    staticContext: any;
}

export const AuthPage: React.FC<Props> = observer(({ history, match }) => {
    const { forgot_password_token: forgotPasswordToken } = match.params;
    const rootRef = React.useRef<HTMLDivElement>(null);
    const path = history.location.pathname ?? '';

    const renderForgotPasswordForm = () => {
        if (forgotPasswordToken) return <ForgotPasswordForm />;
        return <ForgotPasswordEmailForm />;
    };
    return (
        <div className="App-Content_wrapper card-centered gradient-container">
            {!store.authStore.isLoading ? (
                <div className="auth-form__container" ref={rootRef}>
                    {path?.includes('/login') && <LoginForm />}
                    {path?.includes('/forgot_password') &&
                        renderForgotPasswordForm()}
                    {path.includes('/register') && <RegistrationView />}
                    {path.includes('/change_password') && (
                        <ChangePasswordForm />
                    )}
                </div>
            ) : (
                <Spinner />
            )}
        </div>
    );
});
