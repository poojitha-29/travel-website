import { useEffect } from "react";

export default function PaymentResponse() {
  useEffect(() => {
    console.log(window.location.href);
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Processing Payment...</h2>
      <p>Please wait.</p>
    </div>
  );
}
