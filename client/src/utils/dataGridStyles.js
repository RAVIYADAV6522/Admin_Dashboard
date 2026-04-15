export const getDataGridStyles = (theme) => ({
  "& .MuiDataGrid-root": {
    border: `1px solid ${theme.palette.mode === "dark" ? "rgba(34, 211, 238, 0.15)" : "rgba(0,0,0,0.08)"}`,
    borderRadius: "16px",
    overflow: "hidden",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg, rgba(34,211,238,0.04) 0%, rgba(2,2,3,0.6) 100%)"
        : theme.palette.background.paper,
  },
  "& .MuiDataGrid-columnHeadersInner": {
    border: "none",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.background.alt,
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
    fontWeight: 600,
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.background.default,
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: theme.palette.background.alt,
    color: theme.palette.text.secondary,
    borderTop: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
  },
  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
    color: `${theme.palette.text.secondary} !important`,
  },
});
