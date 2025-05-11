import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useVaccineMutation } from "../features/useVaccineMutation";
import { useVaccineQuery } from "../features/useVaccineQuery";
import { getStyledDataGrid } from "../utils/getStyledDataGrid";

const StyledDataGrid = getStyledDataGrid();

export const VaccineSearch = () => {
  const query = useVaccineQuery();
  const mutation = useVaccineMutation();
  const [error, setError] = useState<string>("");

  const rows = useMemo(() => query.data ?? [], [query.data]);

  const columns = useMemo(() => {
    return [
      {
        field: "name",
        headerName: "Назва",
        type: "string",
        width: 200,
        filterable: false,
        sortable: false,
      },
      {
        field: "description",
        headerName: "Опис",
        type: "string",
        width: 300,
        filterable: false,
        sortable: false,
      },
      {
        field: "min_temperature",
        headerName: "Мін. температура",
        type: "number",
        width: 150,
        filterable: false,
        sortable: false,
      },
      {
        field: "max_temperature",
        headerName: "Макс. температура",
        type: "number",
        width: 150,
        filterable: false,
        sortable: false,
      },
      {
        field: "min_humidity",
        headerName: "Мін. вологість",
        type: "number",
        width: 150,
        filterable: false,
        sortable: false,
      },
      {
        field: "max_humidity",
        headerName: "Макс. вологість",
        type: "number",
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
        width: 85,
        renderCell: (cellValues) => {
          return (
            <>
              <Link to={`/vaccines/update/${cellValues.row.vaccine_id}`}>
                <IconButton aria-label="edit">
                  <Edit />
                </IconButton>
              </Link>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  setError("");
                  const id = cellValues.row.vaccine_id;
                  const confirm = window.confirm(
                    `Видалити вакцину ${cellValues.row.name}?`,
                  );
                  if (!confirm) {
                    return;
                  }
                  mutation
                    .mutateAsync({
                      type: "delete",
                      data: { vaccine_id: id },
                    })
                    .catch((error) => {
                      setError(error.message);
                    });
                }}
              >
                <Delete />
              </IconButton>
            </>
          ) as React.JSX.Element;
        },
      },
    ] as GridColDef[];
  }, [mutation]);

  useEffect(() => {
    if (query.isError) {
      setError((query.error as Error)?.message);
    }
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
            {error && <>{`Щось пішло не так: ${error}`}</>}
          </div>
          <Link to="/vaccines/create">
            <Button variant="contained" color="success">
              Додати вакцину
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
          getRowId={(row) => row.vaccine_id}
          columns={columns}
          columnBuffer={3}
          pageSizeOptions={[]}
          getRowHeight={() => "auto"}
          columnHeaderHeight={75}
          rowSelection={false}
          localeText={{
            noRowsLabel: "Даних немає",
          }}
        />
      </div>
    </>
  );
};

export default VaccineSearch;
