import { Box } from "@mui/material";
import GeographyChart from "../../components/component/GeographyChart";
import { tokens } from "../../components/data/theme";
import { useTheme } from "@mui/material";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      {/* <Header title="Geography Chart" subtitle="Simple Geography Chart" /> */}
      <Box height="75vh" border={"1px solid ${colors.grey[100]}"}>
        <GeographyChart />
      </Box>
    </Box>
  );
};

export default Geography;
