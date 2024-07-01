import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../components/data/theme";
import { mockTransactions } from "../../components/data/mockData";
import Header from "../Header";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../../components/component/LineChart";
import GeographyChart from "../../components/component/GeographyChart";
import BarChart from "../../components/component/BarChart";
import StatBox from "../../components/component/StatBox";
import ProgressCircle from "../../components/component/ProgressCircle";
import ChartOne from "../../components/component/ChartOne";
import ChartTwo from "../../components/component/ChartTwo";
import CharThree from "../../components/component/ChartThree";
import ChartFour from "../../components/component/ChartFour";
import DataTable from "../../components/component/DataTable";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="40px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="40px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={"#6261cc"}
          display="flex"
          alignItems="center"
          justifyContent="end"
          borderRadius={"6px"}
          height={"170px"}
        >
          <StatBox
            title="12,361"
            subtitle="Users"
            progress="0.75"
            increase="+14%"
            // icon={<EmailIcon sx={{ color: "#fff", fontSize: "26px" }} />}
            chart={<ChartOne />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={"#edad21"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={"6px"}
          height={"170px"}
        >
          <StatBox
            title="431,225"
            subtitle="Users Online"
            progress="0.50"
            increase="+21%"
            borderRadius={"6px"}
            height={"170px"}
            // icon={<PointOfSaleIcon sx={{ color: "#fff", fontSize: "26px" }} />}
            chart={<ChartTwo />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={"#3d99f5"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={"6px"}
          height={"170px"}
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            // icon={<PersonAddIcon sx={{ color: "#fff", fontSize: "26px" }} />}
            chart={<CharThree />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={"#db5d5d"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={"6px"}
          height={"170px"}
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            // icon={<TrafficIcon sx={{ color: "#fff", fontSize: "26px" }} />}
            chart={<ChartFour />}
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          borderRadius={"6px"}
          backgroundColor={"#212631"}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="500" color={"#f3f4f7"}>
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontSize="14px"
                lineHeight="21px"
                color={"#fff9"}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>*/}
        {/* <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={"#212631"}
          borderRadius="6px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box> */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor={"#212631"}
            padding="30px"
            borderRadius="10px"
            overflow="auto"
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h5" fontWeight="500" color={"#f3f4f7"}>
                  Users Geolocation
                </Typography>
                <Typography
                  variant="h3"
                  fontSize="14px"
                  lineHeight="21px"
                  color={"#fff9"}
                >
                  Map of the distribution of users around the world
                </Typography>
              </Box>
            </Box>
            <Box>
              <DataTable />
            </Box>
          </Box>
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={"#212631"}
            padding="30px"
            borderRadius="10px"
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ marginBottom: "15px" }}
            >
              Geography Based Traffic
            </Typography>

            <Box height="200px">
              <GeographyChart isDashboard={true} />
            </Box>
          </Box>


        {/* <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius={"6px"}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
            Transaction History
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box> */}

        {/* End */}
      </Box>
    </Box>
  );
};

export default Dashboard;
