import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { store } from 'state/Store';

export function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) =>
                store.isAuthenticated === true ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
}
