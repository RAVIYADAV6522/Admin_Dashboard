import React, { useMemo, useState, useEffect, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import { useGetSalesQuery } from "state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ResponsiveLine } from "@nivo/line";
import { getNivoTheme } from "utils/nivoTheme";

/** Local calendar date as YYYY-MM-DD (avoids UTC vs local mixups in filters). */
function toYmd(d) {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return "1970-01-01";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const Daily = () => {
  const [startDate, setStartDate] = useState(() => new Date(2021, 0, 1));
  const [endDate, setEndDate] = useState(() => new Date(2021, 2, 31));
  const rangeInitRef = useRef(false);
  const { data, isLoading, isError, error } = useGetSalesQuery();
  const theme = useTheme();
  const nivoTheme = useMemo(() => getNivoTheme(theme), [theme]);

  const dailyRows = data?.dailyData;
  const hasDaily = Array.isArray(dailyRows) && dailyRows.length > 0;

  useEffect(() => {
    if (!hasDaily || !dailyRows || rangeInitRef.current) return;
    rangeInitRef.current = true;
    const sorted = [...dailyRows]
      .map((row) => row.date)
      .filter(Boolean)
      .sort();
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    if (!first || !last) return;
    const [y1, m1, d1] = first.split("-").map(Number);
    const [y2, m2, d2] = last.split("-").map(Number);
    setStartDate(new Date(y1, m1 - 1, d1));
    setEndDate(new Date(y2, m2 - 1, d2));
  }, [hasDaily, dailyRows]);

  const chartSeries = useMemo(() => {
    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };
    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: [],
    };

    if (!dailyRows?.length) {
      return [totalSalesLine, totalUnitsLine];
    }

    const startStr = toYmd(startDate);
    const endStr = toYmd(endDate);

    dailyRows.forEach(({ date, totalSales, totalUnits }) => {
      if (!date || typeof date !== "string") return;
      if (date < startStr || date > endStr) return;
      const splitDate = date.includes("-") ? date.slice(date.indexOf("-") + 1) : date;
      totalSalesLine.data.push({ x: splitDate, y: Number(totalSales) || 0 });
      totalUnitsLine.data.push({ x: splitDate, y: Number(totalUnits) || 0 });
    });

    return [totalSalesLine, totalUnitsLine];
  }, [dailyRows, startDate, endDate, theme]);

  const pointCount = chartSeries[0]?.data?.length ?? 0;
  const showChart = pointCount > 0;

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, md: 3 }, maxWidth: 1600, mx: "auto" }}>
      <Header title="Daily sales" subtitle="Day-by-day revenue and units for the selected window." />
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        flexWrap="wrap"
        mb={2}
        alignItems="center"
      >
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            From
          </Typography>
          <DatePicker
            selected={startDate}
            onChange={(date) => date && setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            To
          </Typography>
          <DatePicker
            selected={endDate}
            onChange={(date) => date && setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </Box>
      </Box>

      <Box height="70vh" minHeight={360} position="relative">
        {isLoading && (
          <Typography color="text.secondary">Loading sales data…</Typography>
        )}
        {isError && (
          <Typography color="error">
            {error?.data?.message ?? error?.error ?? "Could not load sales data."}
          </Typography>
        )}
        {!isLoading && !isError && !hasDaily && (
          <Typography color="text.secondary">
            No daily breakdown in the database. Run{" "}
            <Box component="code" sx={{ color: "secondary.main" }}>
              npm run seed
            </Box>{" "}
            on the server (or ensure OverallStat includes{" "}
            <Box component="code">dailyData</Box>).
          </Typography>
        )}
        {!isLoading && !isError && hasDaily && !showChart && (
          <Typography color="text.secondary">
            No days in this date range. widen the start/end dates — data is available for the seeded
            year range around 2021.
          </Typography>
        )}
        {!isLoading && !isError && showChart && (
          <ResponsiveLine
            data={chartSeries}
            theme={nivoTheme}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legend: "Date (MM-DD)",
              legendOffset: 56,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabel="data.yFormatted"
            pointLabelYOffset={-12}
            enableTouchCrosshair
            useMesh
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                justify: false,
                translateX: 20,
                translateY: 0,
                itemsSpacing: 4,
                itemDirection: "left-to-right",
                itemWidth: 88,
                itemHeight: 20,
                itemOpacity: 0.85,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
              },
            ]}
          />
        )}
      </Box>
    </Box>
  );
};

export default Daily;
