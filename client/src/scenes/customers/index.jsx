import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { getDataGridStyles } from "utils/dataGridStyles";

const Customers = () => {
  const theme = useTheme();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });

  const { data, isLoading } = useGetCustomersQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
  });

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        const v = params.value;
        if (v == null || String(v).length < 10) return v ?? "—";
        return String(v).replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
      },
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subtitle="List of Customer" />
      <Box
        mt="40px"
        height="75vh"
        sx={getDataGridStyles(theme)}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={rows}
          columns={columns}
          rowCount={total}
          paginationModel={paginationModel}
          paginationMode="server"
          pageSizeOptions={[25, 50, 100]}
          onPaginationModelChange={setPaginationModel}
        />
      </Box>
    </Box>
  );
};

export default Customers;
