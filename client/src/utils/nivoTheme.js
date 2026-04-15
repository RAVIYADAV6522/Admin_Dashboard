export const getNivoTheme = (theme) => ({
  axis: {
    domain: {
      line: {
        stroke: theme.palette.secondary[200],
      },
    },
    legend: {
      text: {
        fill: theme.palette.secondary[200],
      },
    },
    ticks: {
      line: {
        stroke: theme.palette.secondary[200],
        strokeWidth: 1,
      },
      text: {
        fill: theme.palette.secondary[200],
      },
    },
  },
  legends: {
    text: {
      fill: theme.palette.secondary[200],
    },
  },
  tooltip: {
    container: {
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.mode === "dark" ? "rgba(34, 211, 238, 0.25)" : "rgba(0,0,0,0.08)"}`,
      borderRadius: 8,
    },
  },
});
