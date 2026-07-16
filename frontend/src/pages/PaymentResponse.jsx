import { useEffect, useState } from "react";

export default function PaymentResponse() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    console.log("FULL URL");
    console.log(window.location.href);

    console.log("SEARCH");
    console.log(window.location.search);

    console.log("HASH");
    console.log(window.location.hash);

    setUrl(window.location.href);
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h2>Payment Response Debug</h2>

      <p>Open F12 Console and send screenshot.</p>

      <textarea
        value={url}
        readOnly
        rows={8}
        style={{
          width: "100%",
          marginTop: "20px"
        }}
      />
    </div>
  );
}
