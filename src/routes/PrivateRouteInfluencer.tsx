import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { store } from 'state/Store';

export function PrivateRouteInfluencer({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                return store.isAuthenticated ? (
                    store.userRole === 'influencer' ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/home/dashboard',
                                state: { from: props.location },
                            }}
                        />
                    )
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                );
            }}
        />
    );
}
