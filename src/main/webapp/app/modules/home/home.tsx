import { useAppSelector } from 'app/config/store';
import React from 'react';
import { Redirect } from 'react-router-dom';

export const Home = () => {
    const account = useAppSelector(state => state.authentication.account);

    return <Redirect to="/" />;
};
