import React from 'react';
import { Redirect } from 'react-router-dom';
import { store } from 'state/Store';

export function Root(props) {
    return (
        <>
            {!store.isAuthenticated ? (
                <Redirect to="/login" />
            ) : (
                <Redirect to="/home/dashboard" />
            )}
        </>
    );
}
