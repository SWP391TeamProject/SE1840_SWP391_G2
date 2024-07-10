import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
//project import
import MainCard from "./MainCard";
import AnalyticEcommerce from "../../components/component/AnalyticEcommerce";
import PaymentsBarChart from "./PaymentsBarChart";
// import ReportAreaChart from "../../pages/Dashboard/ReportAreaChart";
import UniqueVisitorCard from "@/pages/Dashboard/UniqueVisitorCard";
import PastAuctionReportCard from "./PastAuctionReportCard";
// import GeolocationMap from "./GeolocationMap";

import { useEffect, useState } from "react";
import {
  getPaymentByStatus,
  getTotalItemSold,
  getTotalOrder,
  getTotalSale,
  getUserThisMonth,
} from "@/services/StatisticServices";

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

const actionSX = {
  mt: 0.75,
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

const status = [
  {
    value: "WITHDRAW",
    label: "WITHDRAW",
  },
  {
    value: "DEPOSIT",
    label: "DEPOSIT",
  },
  {
    value: "AUCTION_DEPOSIT",
    label: "AUCTION_DEPOSIT",
  },
  {
    value: "AUCTION_BID",
    label: "AUCTION_BID",
  },
  {
    value: "AUCTION_ORDER",
    label: "AUCTION_ORDER",
  },
  {
    value: "AUCTION_DEPOSIT_REFUND",
    label: "AUCTION_DEPOSIT_REFUND",
  },
  {
    value: "CONSIGNMENT_REWARD",
    label: "CONSIGNMENT_REWARD",
  },
];

const AdminDashboard = () => {
  const [newUsersThisMonth, setNewUsersThisMonth] = useState<number>(0);
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [totalItem, setTotalItem] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalSale, setTotalSale] = useState<number>(0);

  const [selectedLabel, setSelectedLabel] = useState(status[0].value);

  const handleChange = (event) => {
    setSelectedLabel(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userThisMonthResponse = await getUserThisMonth();
        if (userThisMonthResponse && userThisMonthResponse.data) {
          setNewUsersThisMonth(userThisMonthResponse.data);
        }

        const totalOrderResponse = await getTotalOrder();
        if (totalOrderResponse && totalOrderResponse.data) {
          setTotalOrder(totalOrderResponse.data);
        }

        const totalItemSoldResponse = await getTotalItemSold();
        if (totalItemSoldResponse && totalItemSoldResponse.data) {
          setTotalItem(totalItemSoldResponse.data);
        }

        const paymentWithdrawResponse = await getPaymentByStatus(selectedLabel);
        if (Array.isArray(paymentWithdrawResponse)) {
          const totalPayment = paymentWithdrawResponse.reduce(
            (sum, item) => sum + item.totalAmount,
            0
          );
          setTotalPayment(totalPayment);
        }

        const totalSaleResponse = await getTotalSale();
        if (totalSaleResponse && totalSaleResponse.data) {
          console.log(totalSaleResponse.data);
          setTotalSale(totalSaleResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedLabel]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      {/* <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid> */}
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Item Sold"
          count={totalItem.toLocaleString()}
          // percentage={59.3}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="This Month New Users"
          count={newUsersThisMonth.toLocaleString()}
          // percentage={20.5}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Orders"
          count={totalOrder.toLocaleString()}
          // percentage={27.4}
          isLoss
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce
          title="Total Sales"
          count={totalSale.toLocaleString()}
          // percentage={27.4}
          isLoss
          color="warning"
        />
      </Grid>

      <Grid
        item
        md={8}
        sx={{ display: { sm: "none", md: "block", lg: "none" } }}
      />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <UniqueVisitorCard />
        {/* <LineChart/> */}
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Payments Overview</Typography>
          </Grid>
          <Grid item />
          <Grid item>
            <TextField
              id="standard-select-currency"
              size="small"
              select
              value={selectedLabel}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": { py: 0.75, fontSize: "0.875rem" },
              }}
            >
              {status.map((option) => (
                <MenuItem value={option.value} key={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">
                This Year Statistics
              </Typography>
              <Typography variant="h3">
                ${totalPayment.toLocaleString()}
              </Typography>
            </Stack>
          </Box>
          <PaymentsBarChart selectedLabel={selectedLabel} />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <PastAuctionReportCard />
      </Grid>
      {/* <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, "& .MuiListItemButton-root": { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid> */}

      {/* ROW 4 */}
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Transaction History</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              "& .MuiListItemButton-root": {
                py: 1.5,
                "& .MuiAvatar-root": avatarSX,
                "& .MuiListItemSecondaryAction-root": {
                  ...actionSX,
                  position: "relative",
                },
              },
            }}
          >
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{ color: "success.main", bgcolor: "success.lighter" }}
                >
                  {/* <GiftOutlined /> */}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">Order #002434</Typography>
                }
                secondary="Today, 2:00 AM"
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{ color: "primary.main", bgcolor: "primary.lighter" }}
                >
                  {/* <MessageOutlined /> */}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">Order #984947</Typography>
                }
                secondary="5 August, 1:45 PM"
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar sx={{ color: "error.main", bgcolor: "error.lighter" }}>
                  {/* <SettingOutlined /> */}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">Order #988784</Typography>
                }
                secondary="7 hours ago"
              />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </MainCard>
      </Grid>
      
      
      {/* grid bracket */}
    </Grid>
  );
};

export default AdminDashboard;
