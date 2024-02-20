import React from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { defaultTheme } from '../../../content/themes';

export const NoDataIndicator = ({ message = 'Nenhum dado encontrado' }) => {
    return (
        <Box
            sx={{
                color: defaultTheme.palette.secondary.light,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
            }}
        >
            <SentimentDissatisfiedIcon sx={{ fontSize: 120, color: defaultTheme.palette.warning.main, mx: 'auto' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                {message}
            </Typography>
        </Box>
    );
};
