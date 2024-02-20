import React from 'react';
import Countdown from 'react-countdown';
import { ListItem, ListItemText } from '@mui/material';

export const AuctionTimer = ({ created }: any) => {
    const expirationDate = new Date(new Date(created).getTime() + 7 * 24 * 60 * 60 * 1000);

    return (
        <ListItem>
            <ListItemText
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', background: 'none !important' }}
                primary={`O leilão deste item encerra em `}
                secondary={
                    <Countdown
                        date={expirationDate}
                        renderer={({ days, hours, minutes, seconds, completed }) => {
                            if (completed) {
                                return 'Encerrado';
                            } else {
                                return `${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`;
                            }
                        }}
                    />
                }
            />
        </ListItem>
    );
};
