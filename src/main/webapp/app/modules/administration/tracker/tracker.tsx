import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { convertDateTimeToPtBRWithSeconds } from 'app/shared/util/date-utils';
import React from 'react';
import { Translate } from 'react-jhipster';
import { defaultTheme } from '../../../../content/themes/index';
import { DurationFormat } from 'app/shared/DurationFormat';

export const TrackerPage = () => {
  const activities = useAppSelector(state => state.administration.tracker.activities);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Typography color="secondary" fontWeight={'700'} fontSize={'20px'} sx={{ m: 3 }}>
        <Translate contentKey="tracker.title">Real-time user activities</Translate>
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Translate contentKey="tracker.table.userlogin">User</Translate>
              </TableCell>
              <TableCell>
                <Translate contentKey="tracker.table.ipaddress">IP Address</Translate>
              </TableCell>
              <TableCell>
                <Translate contentKey="tracker.table.page">Current page</Translate>
              </TableCell>
              <TableCell>
                <Translate contentKey="tracker.table.time">Time</Translate>
              </TableCell>
              <TableCell>
                <Translate contentKey="tracker.table.sessionTime">Session time</Translate>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity, i) => (
              <TableRow key={`log-row-${i}`}>
                <TableCell>{activity.userLogin}</TableCell>
                <TableCell>{activity.ipAddress}</TableCell>
                <TableCell>{activity.page}</TableCell>
                <TableCell>{convertDateTimeToPtBRWithSeconds(activity.time)}</TableCell>
                <TableCell>
                  <DurationFormat value={new Date().getTime() - new Date(activity.time).getTime()} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default TrackerPage;
