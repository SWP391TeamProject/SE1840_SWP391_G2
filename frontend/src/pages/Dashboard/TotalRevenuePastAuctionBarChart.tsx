import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from './MainCard';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getTotalRevenueByPastAuction } from '@/services/StatisticServices';
import { AxiosResponse } from '@/config/axiosConfig.ts';

// chart options
const columnChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent'],
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  yaxis: {
    title: {},
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter(val) {
        return `$ ${val} thousands`;
      },
    },
  },
  legend: {
    show: false,
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false,
        },
      },
    },
  ],
};

// const initialSeries = [
//   {
//     name: 'Income',
//     data: [180, 90, 135, 114, 120, 145]
//   },
//   {
//     name: 'Cost Of Sales',
//     data: [120, 45, 78, 150, 168, 99]
//   }
// ];

// ==============================|| SALES COLUMN CHART ||============================== //

export default function TotalRevenuePastAuctionBarChart() {
  const [series, setSeries] = useState([]);

  const [options, setOptions] = useState(columnChartOptions);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    getTotalRevenueByPastAuction(new Date().getFullYear())
      .then((response: AxiosResponse<any>) => {
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        // Ensure response is an array before mapping
        if (Array.isArray(response.data)) {
          const formattedData = response.data.map((item) => {
            const date = new Date(item.date);
            const monthName = monthNames[date.getMonth()];
            return { ...item, monthName };
          });
          const totalProfit = response.data.reduce((sum, item) => sum + item.totalAmount, 0);
          setTotalProfit(totalProfit);
          setSeries([
            {
              data: formattedData.map((item) => item.totalAmount),
            },
          ]);

          setOptions((prevState) => ({
            ...prevState,
            xaxis: {
              ...prevState.xaxis,
              categories: formattedData.map((item) => item.monthName),
            },
          }));
        } else {
          console.error('Response data is not an array:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []);

  useEffect(() => {
    setOptions((prevState: any) => ({
      // Adjust 'any' as per your options type
      ...prevState,
      xaxis: {
        ...prevState.xaxis,
        labels: {
          ...prevState.xaxis.labels,
          style: {
            colors: ['secondary', 'secondary', 'secondary', 'secondary', 'secondary', 'secondary'],
          },
        },
      },
      yaxis: {
        ...prevState.yaxis,
        labels: {
          style: {
            colors: ['secondary'],
          },
        },
      },
      grid: {
        borderColor: 'line',
      },
      plotOptions: {
        bar: {
          ...prevState.plotOptions.bar,
          columnWidth: '30%', // Example columnWidth adjustment
        },
      },
    }));
  }, [
    // List dependencies here
    'primary',
    'secondary',
    'line',
    'warning',
    'primaryMain',
    'successDark',
    'income',
    'cos',
    'xsDown',
  ]);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1.5}>
            <Typography variant="h6" color="secondary">
              Net Profit
            </Typography>
            <Typography variant="h4">${totalProfit}</Typography>
          </Stack>
          {/* <FormControl component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    color="warning"
                    checked={income}
                    onChange={handleLegendChange}
                    name="income"
                  />
                }
                label="Income"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cos}
                    onChange={handleLegendChange}
                    name="cos"
                  />
                }
                label="Cost of Sales"
              />
            </FormGroup>
          </FormControl> */}
        </Stack>
        <Box id="chart" sx={{ bgcolor: 'transparent' }}>
          <ReactApexChart options={options} series={series} type="bar" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
}
