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
      color: theme.palette.primary.main,
    },
  },
});
