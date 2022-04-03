import React from 'react';
import UserProfileForm from './UserProfileForm';
import './UserProfilePage.css';

export function UserProfilePage() {
    const rootRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            className="UserProfilePage App-Content_wrapper card-centered"
            ref={rootRef}
        >
            <UserProfileForm />
        </div>
    );
}
