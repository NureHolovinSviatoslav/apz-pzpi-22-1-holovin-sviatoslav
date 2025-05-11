import { Button, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useDBExportMutation } from "../features/useDBExportMutation";
import { useDBImportMutation } from "../features/useDBImportMutation";

export const DBMutate = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [data, setData] = useState("");
  const [error, setError] = useState("");

  const exportMutation = useDBExportMutation();
  const importMutation = useDBImportMutation();

  const handleExport = async () => {
    setError("");
    try {
      const res = await exportMutation.mutateAsync({ password });
      setData(res.db);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleImport = async () => {
    setError("");
    try {
      await importMutation.mutateAsync({ password, data });
      navigate("/");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleClear = () => {
    setError("");
    setPassword("");
    setData("");
  };

  const isLoading = exportMutation.isLoading || importMutation.isLoading;

  if (isLoading) return <Loader />;

  return (
    <div style={{ paddingInline: 10 }}>
      <h4
        style={{
          textTransform: "uppercase",
          fontWeight: "bold",
          marginBlock: 30,
        }}
      >
        Експорт / Імпорт бази даних
      </h4>

      <div style={{ color: "red", paddingBottom: 10 }}>
        {error && `Щось пішло не так: ${error}`}
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 5,
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <FormControl fullWidth>
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Дані"
            value={data}
            onChange={(e) => setData(e.target.value)}
            multiline
            minRows={6}
            size="small"
          />
        </FormControl>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button variant="contained" onClick={handleExport}>
            Export
          </Button>
          <Button variant="contained" color="success" onClick={handleImport}>
            Import
          </Button>
          <Button variant="contained" color="error" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DBMutate;
