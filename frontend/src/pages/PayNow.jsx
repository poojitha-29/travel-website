import React, { useState } from "react";

export default function PayNow() {
  const [form, setForm] = useState({
    customer_name: "",
    mobile: "",
    email: "",
    amount: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert(
        `Payment record created successfully.\nTransaction No: ${data.merchantTxnNo}`
      );

      console.log(data);

      setForm({
        customer_name: "",
        mobile: "",
        email: "",
        amount: "",
        remarks: "",
      });
    } catch (error) {
      console.error(error);

      alert(error.message || "Failed to create payment record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "24px",
      }}
    >
      <h1>Pay Now</h1>
      <p>
        Enter your details and payment amount to proceed.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label>Full Name *</label>
          <input
            type="text"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Mobile Number *</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Amount (₹) *</label>
          <input
            type="number"
            min="1"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Purpose / Remarks</label>
          <textarea
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 24px",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Proceed To Payment"}
        </button>
      </form>
    </div>
  );
}
