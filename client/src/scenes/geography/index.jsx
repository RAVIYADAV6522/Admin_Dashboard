import React, { useEffect, useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveChoropleth } from "@nivo/geo";
import { useGetGeographyQuery } from "state/api";
import { getNivoTheme } from "utils/nivoTheme";

const Geography = () => {
  const theme = useTheme();
  const { data } = useGetGeographyQuery();
  const [geoFeatures, setGeoFeatures] = useState(null);
  const nivoTheme = useMemo(() => getNivoTheme(theme), [theme]);

  useEffect(() => {
    import("state/geoData").then((module) => {
      setGeoFeatures(module.geoData.features);
    });
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="GEOGRAPHY" subtitle="Find where your users are located." />
      <Box
        mt="40px"
        height="75vh"
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius="4px"
        position="relative"
      >
        {data && geoFeatures ? (
          <ResponsiveChoropleth
            data={data}
            theme={nivoTheme}
            features={geoFeatures}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            domain={[0, 60]}
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={150}
            projectionTranslation={[0.5, 0.5]}
            projectionRotation={[0, 0, 0]}
            borderWidth={1.3}
            borderColor="#ffffff"
            legends={[
              {
                anchor: "right",
                direction: "column",
                justify: true,
                translateX: -50,
                translateY: 0,
                itemsSpacing: 4,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: theme.palette.secondary[200],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: theme.palette.background.alt,
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default Geography;
