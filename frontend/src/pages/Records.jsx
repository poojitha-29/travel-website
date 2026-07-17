import React, { useEffect, useState } from "react";
import { supabaseAdmin } from "../services/supabaseAdmin";

export default function Records() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [payments, setPayments] = useState([]);

  const login = () => {
    if (
      username === "sangeetha" &&
      password === "travel@2026"
    ) {
      sessionStorage.setItem("records-auth", "yes");
      setLoggedIn(true);
    } else {
      alert("Invalid Login");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("records-auth") === "yes") {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    loadPayments();
  }, [loggedIn]);

  const loadPayments = async () => {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setPayments(data || []);
  };

  if (!loggedIn) {
    return (
      <div style={{ maxWidth: 400, margin: "80px auto" }}>
        <h2>Records Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />

        <br />
        <br />

        <button onClick={login}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment Records</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Txn No</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.merchant_txn_no}</td>
              <td>{p.customer_name}</td>
              <td>{p.mobile}</td>
              <td>{p.amount}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
