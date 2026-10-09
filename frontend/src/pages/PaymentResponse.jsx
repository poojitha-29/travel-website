import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentResponse() {
  const [params] = useSearchParams();

  const status = params.get("status");
  const txn = params.get("txn");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!txn) {
      setLoading(false);
      return;
    }

    fetch(`/api/payment-status?txn=${encodeURIComponent(txn)}`)
      .then((response) => response.json())
      .then((data) => {
        setPayment(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payment:", error);
        setLoading(false);
      });
  }, [txn]);

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

          {loading ? (
            <p>Loading payment details...</p>
          ) : payment ? (
            <>
              <p>
                Amount Received:
                <br />
                <strong>₹{payment.amount}</strong>
              </p>

              {payment.paymentId && (
                <p>
                  Payment ID:
                  <br />
                  <strong>{payment.paymentId}</strong>
                </p>
              )}

              {payment.paymentMode && (
                <p>
                  Payment Mode:
                  <br />
                  <strong>{payment.paymentMode}</strong>
                </p>
              )}
              {payment.paidAt && (
  <p>
    Payment Date:
    <br />
    <strong>
      {new Date(payment.paidAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      })} IST
    </strong>
  </p>
)}
            </>
          ) : (
            <p>
              Payment details could not be loaded.
            </p>
          )}
        </>
      )}

      {status === "failed" && (
        <>
          <h1>❌ Payment Failed</h1>

          <p>
            The payment was not successful.
          </p>

          {loading ? (
            <p>Loading payment details...</p>
          ) : payment ? (
            <>
              <p>
                Transaction Reference:
                <br />
                <strong>{txn}</strong>
              </p>

              {payment.amount && (
                <p>
                  Amount:
                  <br />
                  <strong>₹{payment.amount}</strong>
                </p>
              )}
            </>
          ) : null}
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
