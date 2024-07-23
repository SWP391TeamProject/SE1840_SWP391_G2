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
import { useCurrency } from '@/CurrencyProvider';
import { useTheme } from '@mui/material/styles';

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
  const currency = useCurrency();
  const theme = useTheme();
  const line = theme.palette.divider;
  // chart options
  const columnChartOptions = {
    chart: {
      type: 'area',
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
      curve: 'smooth',
      width: 2,
    },

    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return currency.format(value);
        },
      },
      title: {
        formatter(val) {
          return `${currency.format(val)}`;
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${currency.format(val)}`;
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
          setTotalProfit(currency.format(totalProfit));
          setSeries([
            {
              name: 'Total Fee',
              data: formattedData.map((item) => item.totalAmount),
            },
            // {
            //       name: 'Cost Of Sales',
            //       data: [120, 45, 78, 150, 168, 99]
            //     }
          ]);

          setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, theme.palette.primary[700]],
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
      },
      grid: {
        borderColor: line,
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
    'theme',
  ]);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={1.5}>
            <Typography variant="h7" color="secondary">
              Net Profit
            </Typography>
            <Typography variant="h4">{totalProfit}</Typography>
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
          <ReactApexChart options={options} series={series} type="area" height={360} />
        </Box>
      </Box>
    </MainCard>
  );
}
