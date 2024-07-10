import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import SalesChart from './SalesChart';


// ==============================|| DEFAULT - SALES REPORT ||============================== //

export default function SaleReportCard() {

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Sales Report</Typography>
        </Grid>
        
      </Grid>
      <SalesChart />
    </>
  );
}
