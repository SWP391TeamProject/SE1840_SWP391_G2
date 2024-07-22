import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getPaymentByStatus } from '@/services/StatisticServices';
import { useCurrency } from '@/CurrencyProvider';

// chart options


// ==============================|| REPORT AREA CHART ||============================== //

export default function ReportAreaChart() {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  
  const currency = useCurrency();

  const areaChartOptions = {
    chart: {
      height: 340,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 1.5,
    },
    grid: {
      strokeDashArray: 4,
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-05-19T00:00:00.000Z',
        '2018-06-19T00:00:00.000Z',
        '2018-07-19T01:30:00.000Z',
        '2018-08-19T02:30:00.000Z',
        '2018-09-19T03:30:00.000Z',
        '2018-10-19T04:30:00.000Z',
        '2018-11-19T05:30:00.000Z',
        '2018-12-19T06:30:00.000Z',
      ],
      labels: {
        format: 'MMM',
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
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
    tooltip: {
      x: {
        format: 'MM',
      },
    },
  };
  const [options, setOptions] = useState(areaChartOptions);
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.warning.main],
      xaxis: {
        ...prevState.xaxis,
        labels: {
          ...prevState.xaxis.labels,
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary],
          },
        },
        axisBorder: {
          ...prevState.xaxis.axisBorder,
          show: true, // Ensure axisBorder properties are preserved
        },
        axisTicks: {
          ...prevState.xaxis.axisTicks,
          show: true, // Ensure axisTicks properties are preserved
        },
      },
      yaxis: {
        ...prevState.yaxis, // Ensure yaxis properties are preserved
      },
      grid: {
        ...prevState.grid,
        borderColor: line,
        strokeDashArray: 0, // Add strokeDashArray if required by options type
      },
      legend: {
        labels: {
          colors: 'grey.500', // Adjust legend labels if necessary
        },
      },
      tooltip: {
        ...prevState.tooltip, // Ensure tooltip properties are preserved
      },
    }));
  }, [primary, secondary, line, theme]);

  const [series, setSeries] = useState([
    {
      name: 'Series 1',
      data: [58, 115, 28, 83, 63, 75, 35, 55],
    },
  ]);

  useEffect(() => {
    getPaymentByStatus()
      .then((response) => {
        if (Array.isArray(response)) {
          const data = response;
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

          const formattedData = data.map((item) => {
            const date = new Date(item.date);
            const monthName = monthNames[date.getMonth()];
            return { ...item, monthName };
          });

          setSeries([
            {
              data: data.map((item) => item.totalAmount),
              name: 'Payments1',
            },
          ]);

          setOptions((prevState) => ({
            ...prevState,
            xaxis: {
              ...prevState.xaxis,
              categories: data.map((item) => item.date),
            },
          }));
        } else {
          console.error('Response data is not an array', response);
        }
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []);

  return <ReactApexChart options={options} series={series} type="line" height={340} />;
}
