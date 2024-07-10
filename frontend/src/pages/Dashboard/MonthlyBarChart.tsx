import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getPaymentByStatus } from '@/services/StatisticServices';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: [],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  grid: {
    show: false
  }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart({ selectedLabel }) {
  const theme = useTheme();
  
  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  const [option, setOptions] = useState(barChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        ...prevState.xaxis,
        labels: {
          style: {
            colors: new Array(12).fill(secondary) // Assuming 12 months
          }
        }
      }
    }));
  }, [primary, info, secondary]);

  const [series,setSeries] = useState([
    {
      data: [80, 95, 70, 42, 65, 55, 78]
    }
  ]);

  useEffect(() => {
    getPaymentByStatus(selectedLabel)
      .then(response => {
        if (Array.isArray(response)) {
          const data = response;
          const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          const formattedData = data.map(item => {
            const date = new Date(item.date);
            const monthName = monthNames[date.getMonth()];
            return { ...item, monthName };
          });

          setSeries([
            {
              data: formattedData.map(item => item.totalAmount)
            }
          ]);
  
          setOptions((prevState) => ({
            ...prevState,
            xaxis: {
              ...prevState.xaxis,
              categories: formattedData.map(item => item.monthName)
            }
          }));
        } else {
          console.error("Response data is not an array", response);
        }
      })
      .catch(error => {
        console.error("Error fetching data", error);
      });
  }, [selectedLabel]);


  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={option} series={series} type="bar" height={365} />
    </Box>
  );
}
