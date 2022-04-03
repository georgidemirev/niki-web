import Cookies from 'js-cookie';
import { action, observable } from 'mobx';
import { RegistrationForm } from 'models/classes';
import { store } from 'state/Store';
import api from '../api';

export class AuthStore {
    @observable isLoading = false;

    @action
    logInUser = async (email, password) => {
        const userData = { email, password };
        try {
            const response = await api.post('/auth/login', userData);
            Cookies.set('user-token', `Bearer ${response.data.token}`, {
                expires: 4,
            });
            await store.user.fetchUser();
            return response;
        } catch (error: any) {
            store.errorMessage = error.response?.data.msg;
        }
    };

    @action
    logOutUser = async () => {
        try {
            await api.post('/auth/logout');
            store.errorMessage = '';
            Cookies.remove('user-token');
            Cookies.remove('user-role');
            store.userIsLoggedIn = false;
            store.user.user = store.initUser();
        } catch (error: any) {
            store.errorMessage = 'Failed to log out. Please try again.';
            this.clearUserCache();
        }
    };

    @action clearUserCache = () => {
        store.errorMessage = '';
        Cookies.remove('user-token');
        Cookies.remove('user-role');
        store.userIsLoggedIn = false;
        store.user.user = store.initUser();
    };

    registerUser = async (form: RegistrationForm) => {
        try {
            const response = await api.post(
                '/auth/create_account/influencer',
                form
            );
            Cookies.set('user-token', `Bearer ${response.data.token}`, {
                expires: 4,
            });
            return await store.user.fetchUser();
        } catch (error: any) {
            throw error.response.data.msg;
        }
    };

    requestChangePassword = async (
        oldPassword,
        newPassword,
        passwordConfirm
    ) => {
        const userData = {
            old_password: oldPassword,
            new_password: newPassword,
            new_password_repeat: passwordConfirm,
        };

        try {
            const response = await api.post('/auth/change_password', userData);
            return response;
        } catch (error: any) {
            store.errorMessage = error.response.data.msg;
        }
    };

    requestCreateOrganization = async (email, name, organizationName) => {
        const userData = { email, name, organization_name: organizationName };
        try {
            const response = await api.post(
                '/auth/create_account/organization',
                userData
            );
            return response;
        } catch (error: any) {
            store.errorMessage = error.response.data.msg;
        }
    };

    requestActivateOrganization = async (
        enrollmentToken,
        password,
        passwordRepeat
    ) => {
        const userData = {
            enrollment_token: enrollmentToken,
            password,
            password_repeat: passwordRepeat,
        };

        try {
            const response = await api.post(
                '/auth/create_account/activate',
                userData
            );
            return response;
        } catch (error: any) {
            store.errorMessage = error.response.data.msg;
        }
    };

    checkForgetPassword = async (forgotPasswordToken) => {
        try {
            const response = await api.post(
                `/auth/forgot_password/check/${forgotPasswordToken}`
            );
            return response?.data.success;
        } catch (error: any) {
            store.errorMessage = error.response.data.msg;
        }
    };

    setForgetPassword = async (
        password,
        passwordRepeat,
        forgotPasswordToken
    ) => {
        const userData = { password, password_repeat: passwordRepeat };

        try {
            const response = await api.post(
                `/auth/forgot_password/set/${forgotPasswordToken}`,
                userData
            );
            return response;
        } catch (error: any) {
            store.errorMessage = error.response.data.msg;
        }
    };
}
