import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  Pagination,
} from "@mui/material";
import Header from "components/Header";
import { useGetProductsQuery } from "state/api";

const PAGE_SIZE = 12;

const Product = ({
  _id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.18)" : "rgba(0,0,0,0.08)"}`,
        background: isDark
          ? "linear-gradient(155deg, rgba(34,211,238,0.09) 0%, rgba(139,92,246,0.05) 42%, rgba(8,8,12,0.95) 100%)"
          : theme.palette.background.paper,
        boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.45), 0 0 40px rgba(34, 211, 238, 0.04)" : "0 12px 40px rgba(0,0,0,0.06)",
        transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s, border-color 0.2s",
        "&:hover": {
          transform: "translateY(-8px) scale(1.01)",
          boxShadow: isDark
            ? "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,211,238,0.25), 0 0 60px rgba(139,92,246,0.12)"
            : "0 20px 48px rgba(0,0,0,0.1)",
          borderColor: isDark ? "rgba(34, 211, 238, 0.45)" : "rgba(0,0,0,0.1)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          borderRadius: "20px 0 0 20px",
          background: "linear-gradient(180deg, #22d3ee 0%, #8b5cf6 100%)",
          opacity: 0.9,
        },
      }}
    >
      <CardContent sx={{ flex: 1, pt: 2.5, px: 2.25, pb: 1 }}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: "0.28em",
            fontWeight: 700,
            fontSize: "0.58rem",
            color: "primary.main",
            display: "block",
            mb: 1,
            textTransform: "uppercase",
          }}
        >
          {category}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: "1.15rem",
            lineHeight: 1.3,
            letterSpacing: "-0.03em",
            color: "text.primary",
            mb: 1,
            minHeight: "2.6rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            mb: 1.5,
            fontSize: "1.35rem",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            fontFamily: '"Space Grotesk", sans-serif',
            background: isDark
              ? "linear-gradient(90deg, #67e8f9, #22d3ee, #c4b5fd)"
              : "none",
            WebkitBackgroundClip: isDark ? "text" : "unset",
            WebkitTextFillColor: isDark ? "transparent" : "unset",
            backgroundClip: isDark ? "text" : "unset",
            color: isDark ? undefined : theme.palette.primary.dark,
          }}
        >
          ${Number(price).toFixed(2)}
        </Typography>
        <Rating
          value={rating}
          readOnly
          size="small"
          sx={{
            mb: 1.25,
            "& .MuiRating-iconFilled": { color: "primary.main" },
            "& .MuiRating-iconEmpty": {
              color: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "4.2rem",
          }}
        >
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          variant="outlined"
          size="medium"
          fullWidth
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            borderRadius: "12px",
            py: 1,
            fontWeight: 600,
          }}
        >
          {isExpanded ? "Show less" : "Details"}
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: "text.secondary",
        }}
      >
        <CardContent sx={{ pt: 0, px: 2.25, pb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              background: isDark ? "rgba(34, 211, 238, 0.05)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(0,0,0,0.06)"}`,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              ID · Supply
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {_id} · {supply} in stock
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Yearly performance
            </Typography>
            <Typography variant="body2">
              Sales: {stat?.yearlySalesTotal ?? "—"} · Units: {stat?.yearlyTotalSoldUnits ?? "—"}
            </Typography>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetProductsQuery({
    page: page - 1,
    pageSize: PAGE_SIZE,
  });

  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, md: 3 }, maxWidth: 1600, mx: "auto" }}>
      <Header
        title="Products"
        subtitle="Live SKUs with stock levels and roll-up performance — filter and paginate without leaving the grid."
      />
      {isError ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error?.data?.message ?? error?.error ?? "Could not load products."}
        </Typography>
      ) : !isLoading && data ? (
        <>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))",
            }}
            gap={2.5}
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 1" },
            }}
          >
            {rows.map(
              ({
                _id,
                name,
                description,
                price,
                rating,
                category,
                supply,
                stat,
              }) => (
                <Product
                  key={_id}
                  _id={_id}
                  name={name}
                  description={description}
                  price={price}
                  rating={rating}
                  category={category}
                  supply={supply}
                  stat={stat?.[0]}
                />
              )
            )}
          </Box>
          {rows.length === 0 ? (
            <Typography sx={{ mt: 3 }} color="text.secondary">
              No products in the database. From the server folder, run: npm run seed
            </Typography>
          ) : null}
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, p) => setPage(p)}
              color="primary"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "10px",
                  fontWeight: 600,
                },
                "& .Mui-selected": {
                  background: `linear-gradient(135deg, ${theme.palette.primary[400]}, ${theme.palette.secondary[500]}) !important`,
                  color: "#020617 !important",
                },
              }}
            />
          </Box>
        </>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Loading catalog…
        </Typography>
      )}
    </Box>
  );
};

export default Products;
