import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getNewUsersByYear } from '@/services/StatisticServices';
import { AxiosResponse } from "@/config/axiosConfig.ts";

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 4,
  },
  xaxis: {
    categories: [], // Populate with actual categories if needed
  },
};

interface MonthlyUserData {
  month: number,
  totalUser: number;
}

interface GetMonthlyUserResponse {
  data: MonthlyUserData[];
}
// ==============================|| INCOME AREA CHART ||============================== //

export default function NewUserAreaChart({ slot }) {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);
  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber - 1];
  };

  useEffect(() => {
    getNewUsersByYear(new Date().getUTCFullYear()).then((response: AxiosResponse<GetMonthlyUserResponse>) => {
      const data: MonthlyUserData[] = response.data; 
      setOptions((prevState) => ({
        ...prevState,
        colors: [theme.palette.primary.main, theme.palette.primary[700]],
        xaxis: {
          categories: slot === 'month' ? data.map((item) => getMonthName(item.month)) : [],
          labels: {
            style: {
              colors: new Array(12).fill(secondary),
            },
          },
          axisBorder: {
            show: true,
            color: line,
          },
          tickAmount: slot === 'month' ? 11 : 7,
        },
        yaxis: {
          labels: {
            style: {
              colors: [secondary],
            },
          },
        },
        grid: {
          borderColor: line,
          strokeDashArray: 4,
        },
      }));
    });
  }, [primary, secondary, line, theme, slot]);

  useEffect(() => {
    getNewUsersByYear(new Date().getUTCFullYear()).then((response: AxiosResponse<GetMonthlyUserResponse>) => {
      const data:MonthlyUserData[] = response.data;
      setSeries([
        {
          name: 'Page Views',
          data: slot === 'month' ? data.map((item) => item?.totalUser) : [],
        },
      ]);
    });
  }, [slot]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

NewUserAreaChart.propTypes = { slot: PropTypes.string };
