import 'app/config/dayjs.ts';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import AppRoutes from 'app/routes';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import Footer from 'app/shared/layout/footer/footer';
import { Header } from 'app/shared/layout/header/header';
import { getProfile } from 'app/shared/reducers/application-profile';
import { getSession } from 'app/shared/reducers/authentication';
import { Container } from '@mui/material';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getSession());
        dispatch(getProfile());
    }, []);

    const currentLocale = useAppSelector(state => state.locale.currentLocale);
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
    const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
    const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
    const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

    return (
        <Router basename={baseHref}>
            <ToastContainer position={toast.POSITION.TOP_CENTER} className="toastify-container" toastClassName="toastify-toast" autoClose={5000} />
            <ErrorBoundary>
                <AppRoutes />
                <Header />
            </ErrorBoundary>
        </Router>
    );
};

export default App;
