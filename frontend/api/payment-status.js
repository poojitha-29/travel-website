import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { txn } = req.query;

    if (!txn) {
      return res.status(400).json({
        error: "Transaction number is required"
      });
    }

    const { data, error } = await supabase
      .from("payments")
      .select(
        "merchant_txn_no, status, payment_mode, payment_id, txn_id, gateway_response"
      )
      .eq("merchant_txn_no", txn)
      .single();

    if (error || !data) {
      console.error(error);

      return res.status(404).json({
        error: "Payment not found"
      });
    }

    const amount = data.gateway_response?.amount || null;

    return res.status(200).json({
      status: data.status,
      merchantTxnNo: data.merchant_txn_no,
      paymentMode: data.payment_mode,
      paymentId: data.payment_id,
      txnId: data.txn_id,
      amount: amount
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
}
