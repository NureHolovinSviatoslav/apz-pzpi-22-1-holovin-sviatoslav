import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import { useLocationQuery } from "../features/useLocationQuery";
import { useSensorDataQuery } from "../features/useSensorDataQuery";
import { getStyledDataGrid } from "../utils/getStyledDataGrid";

const StyledDataGrid = getStyledDataGrid();

export const SensorDataSearch = () => {
  const locationQuery = useLocationQuery();
  const locations = useMemo(
    () => locationQuery.data ?? [],
    [locationQuery.data],
  );

  const query = useSensorDataQuery();
  const [error, setError] = useState<string>("");

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const columns = useMemo(() => {
    return [
      {
        field: "sensor_data_id",
        headerName: "ID",
        type: "number",
        filterable: false,
        sortable: false,
        width: 100,
      },
      {
        field: "location_id",
        headerName: "Локація",
        type: "number",
        width: 300,
        filterable: false,
        sortable: false,
        renderCell: (params) => {
          const location = locations.find(
            (l) => l.location_id === params.value,
          );
          return location?.name ?? "-";
        },
      },
      {
        field: "updated_at",
        headerName: "Час надсилання",
        type: "dateTime",
        width: 200,
        filterable: false,
        sortable: false,
        valueFormatter: (params) => new Date(params.value).toLocaleString(),
      },
      {
        field: "temperature",
        headerName: "Температура °C",
        type: "number",
        width: 150,
        filterable: false,
        sortable: false,
      },
      {
        field: "humidity",
        headerName: "Вологість %",
        type: "number",
        width: 150,
        filterable: false,
        sortable: false,
      },
    ] as GridColDef[];
  }, [locations]);

  useEffect(() => {
    if (query.isError) setError((query.error as Error)?.message);
    if (locationQuery.isError)
      setError((locationQuery.error as Error)?.message);
  }, [query.isError, query.error, locationQuery.isError, locationQuery.error]);

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: ".25rem",
          }}
        >
          <div style={{ color: "red" }}>
            {error && `Щось пішло не так: ${error}`}
          </div>
        </div>
      </div>

      <div
        style={{
          height: 550,
          borderRadius: "5px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <StyledDataGrid
          loading={query.isLoading || locationQuery.isLoading}
          rows={rows}
          getRowId={(row) => row.sensor_data_id}
          columns={columns}
          columnBuffer={3}
          pageSizeOptions={[]}
          getRowHeight={() => "auto"}
          columnHeaderHeight={75}
          rowSelection={false}
          localeText={{ noRowsLabel: "Даних немає" }}
        />
      </div>
    </>
  );
};

export default SensorDataSearch;
