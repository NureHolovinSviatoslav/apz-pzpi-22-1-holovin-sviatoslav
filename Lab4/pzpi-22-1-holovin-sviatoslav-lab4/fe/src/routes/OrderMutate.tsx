import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Loader from "../components/Loader";
import { useOrderMutation } from "../features/useOrderMutation";
import { useOrderQuery } from "../features/useOrderQuery";
import { Order } from "../types/Order";
import { useEdit } from "../utils/useEdit";

const schema = yup.object({
  username: yup.string().required("Заповніть поле"),
  order_date: yup.date().typeError("Має бути датою").required("Заповніть поле"),
  order_status: yup.string().required("Заповніть поле"),
}) as yup.ObjectSchema<Order>;

export const OrderMutate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const {
    id: orderId,
    isEdit,
    isLoading,
    values,
  } = useEdit(useOrderQuery, setError);
  const mutation = useOrderMutation();

  const form = useForm<Order>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      order_date: new Date(),
      order_status: "",
    },
    values,
    resetOptions: { keepDefaultValues: true },
  });

  const handleSubmit = form.handleSubmit((data) => {
    setError("");
    mutation
      .mutateAsync({
        type: isEdit ? "update" : "create",
        data,
      })
      .then(() => navigate("/orders"))
      .catch((e) => setError(e.message));
  });

  const handleReset = () => {
    setError("");
    form.reset();
  };

  if (isLoading) return <Loader />;

  if (isEdit && !values) {
    return (
      <div style={{ padding: 16 }}>
        <h4
          style={{ textTransform: "uppercase", fontWeight: "bold", margin: 30 }}
        >
          Замовлення не знайдено
        </h4>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
            marginBlock: 30,
          }}
        >
          {isEdit ? "Редагувати" : "Додати"} замовлення
          {isEdit && ` # ${orderId}`}
        </h4>
      </div>

      <div style={{ color: "red", paddingBottom: 10 }}>
        {error && `Щось пішло не так: ${error}`}
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
          }}
          onSubmit={handleSubmit}
        >
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormControl
                size="small"
                fullWidth
                sx={{ m: 1, minWidth: 120, maxWidth: "95%" }}
              >
                <TextField
                  label="Автор замовлення"
                  placeholder="Введіть автора замовлення"
                  onChange={field.onChange}
                  value={field.value}
                  type="search"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              </FormControl>
            )}
          />

          <Controller
            name="order_status"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormControl
                size="small"
                fullWidth
                sx={{ m: 1, minWidth: 120, maxWidth: "95%" }}
              >
                <TextField
                  label="Статус замовлення"
                  placeholder="Введіть статус замовлення"
                  onChange={field.onChange}
                  value={field.value}
                  type="search"
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              </FormControl>
            )}
          />

          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <Button type="submit" variant="contained">
              {isEdit ? "Зберегти" : "Створити"}
            </Button>
            <Button variant="contained" color="error" onClick={handleReset}>
              Очистити
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderMutate;
