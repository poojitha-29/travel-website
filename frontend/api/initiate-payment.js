import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateSecureHash(payload, secretKey) {
  const sortedKeys = Object.keys(payload)
    .filter(
      (key) =>
        payload[key] !== null &&
        payload[key] !== undefined &&
        payload[key] !== ""
    )
    .sort();

  const message = sortedKeys
    .map((key) => String(payload[key]))
    .join("");

  return crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex")
    .toLowerCase();
}

function getTxnDate() {
  const d = new Date();

  const pad = (n) => String(n).padStart(2, "0");

  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const {
      customer_name,
      mobile,
      email,
      amount,
      remarks,
    } = req.body;

    const merchantTxnNo = `SH${Date.now()}`;

    const { error: insertError } = await supabase
      .from("payments")
      .insert({
        merchant_txn_no: merchantTxnNo,
        customer_name,
        mobile,
        email,
        amount,
        remarks,
        status: "PENDING",
      });

    if (insertError) {
      throw insertError;
    }

    const payload = {
      addlParam1: remarks || "PAYMENT",
      addlParam2: "SANGEETHA",
      aggregatorID: process.env.ICICI_AGG_ID,
      amount: Number(amount).toFixed(2),
      currencyCode: "356",
      customerEmailID: email,
      customerMobileNo: mobile,
      customerName: customer_name,
      merchantId: process.env.ICICI_MID,
      merchantTxnNo,
      payType: "0",
      returnURL: process.env.ICICI_RETURN_URL,
      transactionType: "SALE",
      txnDate: getTxnDate(),
    };

    payload.secureHash = generateSecureHash(
      payload,
      process.env.ICICI_KEY
    );

    const iciciResponse = await fetch(
      process.env.ICICI_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await iciciResponse.json();

    console.log("ICICI RESPONSE");
    console.log(JSON.stringify(data, null, 2));

    if (data.responseCode !== "R1000") {
      return res.status(400).json({
        success: false,
        error: "ICICI rejected request",
        iciciResponse: data,
      });
    }

    const paymentUrl =
      `${data.redirectURI}?tranCtx=${encodeURIComponent(data.tranCtx)}`;

    return res.status(200).json({
      success: true,
      merchantTxnNo,
      paymentUrl,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
