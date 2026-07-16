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
        key !== "secureHash" &&
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

export default async function handler(req, res) {
  try {
    const callback = req.body || {};

    console.log("========== ICICI CALLBACK ==========");
    console.log(JSON.stringify(callback, null, 2));

    const receivedHash = callback.secureHash || "";

    const calculatedHash = generateSecureHash(
      callback,
      process.env.ICICI_KEY
    );

    const hashValid =
      receivedHash.toLowerCase() ===
      calculatedHash.toLowerCase();

    const isSuccess =
      callback.responseCode === "0000" &&
      hashValid;

    await supabase
      .from("payments")
      .update({
        status: isSuccess ? "SUCCESS" : "FAILED",

        payment_mode:
          callback.paymentMode || null,

        payment_id:
          callback.paymentID || null,

        txn_id:
          callback.txnID || null,

        response_code:
          callback.responseCode || null,

        response_message:
          callback.respDescription || null,

        paid_at:
          new Date().toISOString(),

        gateway_response: callback
      })
      .eq(
        "merchant_txn_no",
        callback.merchantTxnNo
      );

    return res.redirect(
      302,
      `https://www.sangeethaholidays.com/payment-response?status=${
        isSuccess ? "success" : "failed"
      }&txn=${callback.merchantTxnNo}`
    );

  } catch (error) {
    console.error(error);

    return res.redirect(
      302,
      "https://www.sangeethaholidays.com/payment-response?status=error"
    );
  }
}
