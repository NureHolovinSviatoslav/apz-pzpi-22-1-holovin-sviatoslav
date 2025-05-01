import { Delete, Edit, Summarize } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useLocationMutation } from "../features/useLocationMutation";
import { useLocationQuery } from "../features/useLocationQuery";
import { getStyledDataGrid } from "../utils/getStyledDataGrid";

const StyledDataGrid = getStyledDataGrid();

export const LocationSearch = () => {
  const query = useLocationQuery();
  const mutation = useLocationMutation();
  const [error, setError] = useState<string>("");

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const columns = useMemo(() => {
    return [
      {
        field: "name",
        headerName: "Назва локації",
        type: "string",
        width: 200,
        filterable: false,
        sortable: false,
      },
      {
        field: "address",
        headerName: "Адреса",
        type: "string",
        width: 250,
        filterable: false,
        sortable: false,
      },
      {
        field: "responsible_user_phone",
        headerName: "Телефон відповідального",
        type: "string",
        width: 200,
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
        field: "actions",
        headerName: "Дії",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        width: 105,
        renderCell: (cellValues) => (
          <>
            <Link to={`/locations/report/${cellValues.row.location_id}`}>
              <IconButton aria-label="report">
                <Summarize />
              </IconButton>
            </Link>
            <Link to={`/locations/update/${cellValues.row.location_id}`}>
              <IconButton aria-label="edit">
                <Edit />
              </IconButton>
            </Link>
            <IconButton
              aria-label="delete"
              onClick={() => {
                setError("");
                const id = cellValues.row.location_id;
                const confirm = window.confirm(
                  `Видалити локацію ${cellValues.row.name}?`,
                );
                if (!confirm) return;
                mutation
                  .mutateAsync({
                    type: "delete",
                    data: { location_id: id },
                  })
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
          <Link to="/locations/create">
            <Button variant="contained" color="success">
              Додати локацію
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
          getRowId={(row) => row.location_id}
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

export default LocationSearch;
