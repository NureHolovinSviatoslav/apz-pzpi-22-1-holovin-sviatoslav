import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import { useNotificationQuery } from "../features/useNotificationQuery";
import { getStyledDataGrid } from "../utils/getStyledDataGrid";

const StyledDataGrid = getStyledDataGrid();

export const NotificationSearch = () => {
  const query = useNotificationQuery();
  const [error, setError] = useState<string>("");

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const columns = useMemo(() => {
    return [
      {
        field: "notification_id",
        headerName: "ID",
        type: "number",
        width: 100,
        filterable: false,
        sortable: false,
      },
      {
        field: "phone",
        headerName: "Телефон",
        type: "string",
        width: 150,
        filterable: false,
        sortable: false,
        renderCell: (v) =>
          v.value ? (
            <a className="link" href={`tel:${v.value}`}>
              {v.value}
            </a>
          ) : (
            "-"
          ),
      },
      {
        field: "sent_at",
        headerName: "Відправлено",
        type: "dateTime",
        width: 200,
        valueFormatter: (p) => new Date(p.value).toLocaleString(),
        filterable: false,
        sortable: false,
      },
      {
        field: "message",
        headerName: "Повідомлення",
        type: "string",
        width: 300,
        filterable: false,
        sortable: false,
      },
      {
        field: "notification_type",
        headerName: "Тип",
        type: "string",
        width: 150,
        filterable: false,
        sortable: false,
      },
    ] as GridColDef[];
  }, []);

  useEffect(() => {
    if (query.isError) setError((query.error as Error)?.message);
  }, [query.isError, query.error]);

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
          loading={query.isLoading}
          rows={rows}
          getRowId={(r) => r.notification_id}
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

export default NotificationSearch;
