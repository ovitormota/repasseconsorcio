// Loading.tsx
import { Box, LinearProgress, Typography } from '@mui/material';
import React from 'react';
import { defaultTheme } from '../../../content/themes';

interface LoadingProps {
    message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Aguarde, carregando...' }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Box sx={{ width: '60%' }}>
                <LinearProgress color="secondary" />
            </Box>
            <Typography variant="body2" mt={2} color={defaultTheme.palette.secondary.light}>
                {message}
            </Typography>
        </Box>
    );
};
