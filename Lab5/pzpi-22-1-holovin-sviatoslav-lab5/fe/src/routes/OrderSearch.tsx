import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useOrderMutation } from "../features/useOrderMutation";
import { useOrderQuery } from "../features/useOrderQuery";
import { getStyledDataGrid } from "../utils/getStyledDataGrid";

const StyledDataGrid = getStyledDataGrid();

export const OrderSearch = () => {
  const query = useOrderQuery();
  const mutation = useOrderMutation();
  const [error, setError] = useState<string>("");

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const columns = useMemo(() => {
    return [
      {
        field: "username",
        headerName: "Створив",
        type: "string",
        width: 200,
        filterable: false,
        sortable: false,
      },
      {
        field: "order_date",
        headerName: "Дата замовлення",
        type: "dateTime",
        width: 200,
        filterable: false,
        sortable: false,
        valueGetter: (params) => new Date(params.value as string),
        renderCell: (params) =>
          params.value ? (params.value as Date).toLocaleString() : "-",
      },
      {
        field: "order_status",
        headerName: "Статус",
        type: "string",
        width: 150,
        filterable: false,
        sortable: false,
      },
      {
        field: "actions",
        headerName: "Дії",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        width: 105,
        renderCell: (cellValues) => (
          <>
            <Link to={`/orders/update/${cellValues.row.order_id}`}>
              <IconButton aria-label="edit">
                <Edit />
              </IconButton>
            </Link>
            <IconButton
              aria-label="delete"
              onClick={() => {
                setError("");
                const id = cellValues.row.order_id;
                if (!window.confirm(`Видалити замовлення #${id}?`)) return;
                mutation
                  .mutateAsync({ type: "delete", data: { order_id: id } })
                  .catch((e) => setError(e.message));
              }}
            >
              <Delete />
            </IconButton>
          </>
        ),
      },
    ] as GridColDef[];
  }, [mutation]);

  useEffect(() => {
    if (query.isError) setError((query.error as Error)?.message || "");
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
          <Link to="/orders/create">
            <Button variant="contained" color="success">
              Додати замовлення
            </Button>
          </Link>
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
          getRowId={(row) => row.order_id}
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

export default OrderSearch;
