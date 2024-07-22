import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import TotalRevenuePastAuctionBarChart from './TotalRevenuePastAuctionBarChart';

// ==============================|| DEFAULT - SALES REPORT ||============================== //

export default function PastAuctionReportCard() {
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h6">Sales Report</Typography>
        </Grid>
      </Grid>
      <TotalRevenuePastAuctionBarChart />
    </>
  );
}
