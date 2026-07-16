import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      customer_name,
      mobile,
      email,
      amount,
      remarks
    } = req.body;

    const merchantTxnNo =
      "SH" + Date.now();

    const { data, error } = await supabase
      .from("payments")
      .insert({
        merchant_txn_no: merchantTxnNo,
        customer_name,
        mobile,
        email,
        amount,
        remarks,
        status: "PENDING"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      merchantTxnNo,
      paymentId: data.id
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
