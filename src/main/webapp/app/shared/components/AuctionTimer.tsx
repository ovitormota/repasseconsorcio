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
                // Create an array to hold non-zero values
                const nonZeroValues = [];

                // Check and add non-zero values
                if (days > 0) nonZeroValues.push(days === 1 ? '1 dia' : `${days} dias`);
                if (hours > 0) nonZeroValues.push(`${hours} horas`);
                if (minutes > 0) nonZeroValues.push(`${minutes} minutos`);
                if (seconds > 0) nonZeroValues.push(`${seconds} segundos`);

                // Join the non-zero values with commas and return
                return nonZeroValues.join(', ');
              }
            }}
          />
        }
      />
    </ListItem>
  );
};
