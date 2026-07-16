import React from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentResponse() {
  const [params] = useSearchParams();

  const status = params.get("status");
  const txn = params.get("txn");

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {status === "success" && (
        <>
          <h1>✅ Payment Successful</h1>

          <p>
            Thank you for your payment.
          </p>

          <p>
            Transaction Reference:
            <br />
            <strong>{txn}</strong>
          </p>
        </>
      )}

      {status === "failed" && (
        <>
          <h1>❌ Payment Failed</h1>

          <p>
            The payment was not successful.
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <h1>⚠️ Processing Error</h1>

          <p>
            Please contact support.
          </p>
        </>
      )}

      {!status && (
        <>
          <h1>Payment Response</h1>
          <p>No transaction details found.</p>
        </>
      )}
    </div>
  );
}
