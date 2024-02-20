import { useMediaQuery, useTheme } from '@mui/material';

export const useBreakpoints = () => {
    const theme = useTheme();

    return {
        isXSScreen: useMediaQuery(theme.breakpoints.up('xs')),
        isSMScreen: useMediaQuery(theme.breakpoints.up('sm')),
        isMDScreen: useMediaQuery(theme.breakpoints.up('md')),
        isLGScreen: useMediaQuery(theme.breakpoints.up('lg')),
        isXLScreen: useMediaQuery(theme.breakpoints.up('xl')),
    };
};
