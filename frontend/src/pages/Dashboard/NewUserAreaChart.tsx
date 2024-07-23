import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getUserOnline } from '@/services/StatisticServices';
import { AxiosResponse } from '@/config/axiosConfig.ts';

// chart options

interface MonthlyUserData {
  month: number;
  totalUser: number;
}

interface GetMonthlyUserResponse {
  data: MonthlyUserData[];
}
// ==============================|| INCOME AREA CHART ||============================== //

export default function NewUserAreaChart({ slot }) {
  const theme = useTheme();
  const formatTimestampToDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(); // You can adjust the format as needed
  };
  const areaChartOptions = {
    chart: {
      height: 450,
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
      width: 2,
    },
    xaxis: {
      categories: [], // Populate with actual categories if needed
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return formatTimestampToDateTime(value);
        },
      },
    },
  };
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [onlineUsers, setOnlineUsers] = useState<Map<string, number> | null>(null);
  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);
  const getMonthName = (monthNumber) => {
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
    return monthNames[monthNumber - 1];
  };

  useEffect(() => {
    getUserOnline().then((response: AxiosResponse<Map<string, number>>) => {
      const data = response.data;
      const categories = Object.keys(data).map((email) => formatTimestampToDateTime(data[email]));
      setOnlineUsers(data);
      setOptions((prevState) => ({
        ...prevState,
        colors: [theme.palette.primary.main, theme.palette.primary[700]],
        xaxis: {
          categories: categories,
          labels: {
            style: {
              colors: new Array(Object.keys(data).length).fill(secondary),
            },
          },
          axisBorder: {
            show: true,
            color: line,
          },
          tickAmount: Object.keys(data).length - 1,
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return formatTimestampToDateTime(value);
            },
          },
        },
        grid: {
          borderColor: line,
        },
      }));
      setSeries([
        {
          name: 'Online Users',
          data: Object.values(data),
        },
      ]);
    });
  }, [primary, secondary, line, theme]);

  return <ReactApexChart options={options} series={series} type="line" height={450} />;
}

NewUserAreaChart.propTypes = { slot: PropTypes.string };
