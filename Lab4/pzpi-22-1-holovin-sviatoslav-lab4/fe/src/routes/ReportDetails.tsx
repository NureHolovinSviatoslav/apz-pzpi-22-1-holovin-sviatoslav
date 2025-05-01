import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useReportQuery } from "../features/useReportQuery";

export const ReportDetails = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  const { id = "" } = useParams<{ id: string }>();
  const {
    data: report,
    isLoading,
    isError,
    error: fetchError,
  } = useReportQuery(id);

  useEffect(() => {
    if (isError) {
      setError((fetchError as Error)?.message || "Unknown error");
    }
  }, [isError, fetchError]);

  if (isLoading) return <Loader />;

  if (!report) {
    return (
      <div style={{ padding: 16 }}>
        <h4
          style={{ textTransform: "uppercase", fontWeight: "bold", margin: 30 }}
        >
          Звіт локації не знайдено
        </h4>
      </div>
    );
  }

  return (
    <>
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
          Звіт локації #{id}
        </h4>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 10,
        }}
      >
        <div style={{ color: "red" }}>
          {error && `Щось пішло не так: ${error}`}
        </div>
      </div>

      <div ref={reportRef}>
        <section
          style={{
            borderRadius: 5,
            backgroundColor: "#f5f5f5",
            padding: "1rem",
            marginBottom: "1rem",
            display: "grid",
            gridTemplateColumns: ".3fr 1fr",
            gap: "0.5rem 1rem",
            alignItems: "center",
          }}
        >
          <p
            style={{ fontSize: "1.2rem", fontWeight: "bold", margin: ".5rem" }}
          >
            Назва:
          </p>
          <p style={{ fontSize: "1.2rem", margin: ".5rem" }}>{report.name}</p>

          <p
            style={{ fontSize: "1.2rem", fontWeight: "bold", margin: ".5rem" }}
          >
            Адреса:
          </p>
          <p style={{ fontSize: "1.2rem", margin: ".5rem" }}>
            {report.address}
          </p>
        </section>

        <h4
          style={{
            textTransform: "uppercase",
            fontWeight: "bold",
            margin: "2rem 0 1rem",
          }}
        >
          Інвентарі локації
        </h4>

        {report.inventories.length > 0 ? (
          report.inventories.map((inv) => (
            <div
              key={inv.inventory_id}
              style={{
                marginBottom: "2rem",
                borderRadius: 5,
                backgroundColor: "#f5f5f5",
                padding: "1rem",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <strong>ID інвентарю:</strong> {inv.inventory_id} &nbsp;|&nbsp;
                <strong>Використано:</strong> {inv.used_quantity} /{" "}
                {inv.max_quantity}
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      Вакцина
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                      Кількість
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inv.stored_vaccines.map((v) => (
                    <tr key={v.vaccine_id}>
                      <td
                        style={{ border: "1px solid #ccc", padding: "0.5rem" }}
                      >
                        {v.name}
                      </td>
                      <td
                        style={{ border: "1px solid #ccc", padding: "0.5rem" }}
                      >
                        {v.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>Немає інвентарів для відображення</p>
        )}
      </div>
    </>
  );
};

export default ReportDetails;
