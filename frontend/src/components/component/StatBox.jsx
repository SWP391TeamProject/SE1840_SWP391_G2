import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../data/theme";
import ProgressCircle from "./ProgressCircle";



const StatBox = ({ title, subtitle, icon, progress, increase, chart }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#fff" }}>
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: "#fff" }}>
          {subtitle}
        </Typography>
        <Typography variant="h5" fontStyle="italic" sx={{ color: "#fff" }}>
          {increase}
        </Typography>
      </Box>
      <Box display="end" justifyContent="center" mt="2px">
        {chart}
      </Box>
    </Box>
  );
};

export default StatBox;
