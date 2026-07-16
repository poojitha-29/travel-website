import { useState } from "react";

export default function PayNow() {
  const [form, setForm] = useState({
    customer_name: "",
    mobile: "",
    email: "",
    amount: "",
    remarks: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    alert("Form ready. Payment integration next step.");
  };

  return (
    <div className="container py-5">
      <h2>Pay Now</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input
            className="form-control"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Mobile Number</label>
          <input
            className="form-control"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Amount (₹)</label>
          <input
            type="number"
            min="1"
            className="form-control"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Purpose / Remarks</label>
          <textarea
            className="form-control"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button className="btn btn-primary">
          Proceed To Payment
        </button>
      </form>
    </div>
  );
}
