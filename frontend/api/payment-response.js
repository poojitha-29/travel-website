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
    console.log(
  "Payment Callback:",
  callback.merchantTxnNo,
  callback.responseCode
);

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

    
  
    // =========================================================
    // WATI - SEND PDF RECEIPT, FALL BACK TO TEXT TEMPLATE
    // =========================================================
    if (isSuccess) {
      try {
        const { data: payment, error: paymentError } = await supabase
          .from("payments")
          .select("customer_name, mobile, paid_at")
          .eq("merchant_txn_no", callback.merchantTxnNo)
          .single();

        if (paymentError || !payment) {
          console.error("WATI: Could not fetch customer details:", paymentError);
        } else {
          let whatsappNumber = String(payment.mobile || "").replace(/\D/g, "");

          if (whatsappNumber.length === 11 && whatsappNumber.startsWith("0")) {
            whatsappNumber = whatsappNumber.substring(1);
          }

          if (whatsappNumber.length === 10) {
            whatsappNumber = "91" + whatsappNumber;
          }

          console.log("WATI FINAL WHATSAPP NUMBER:", whatsappNumber);

          if (!whatsappNumber) {
            console.error("WATI: Customer mobile number not found");
          } else {
            const sendTemplate = async (templateName, parameters, broadcastName) => {
              const url =
                `${process.env.WATI_API_ENDPOINT}/api/v1/sendTemplateMessage` +
                `?whatsappNumber=${encodeURIComponent(whatsappNumber)}`;

              const response = await fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${process.env.WATI_API_TOKEN}`
                },
                body: JSON.stringify({
                  template_name: templateName,
                  broadcast_name: broadcastName,
                  parameters
                })
              });

              const result = await response.text();

              console.log("WATI TEMPLATE:", templateName);
              console.log("WATI STATUS:", response.status);
              console.log("WATI RESULT:", result);

              return response.ok;
            };

            const amount = String(callback.amount || "");
            const transactionNumber = String(callback.merchantTxnNo || "");

            const receiptUrl =
              `https://www.sangeethaholidays.com/api/generate-receipt?txn=${encodeURIComponent(transactionNumber)}`;

            const pdfParameters = [
              { name: "pdf_link", value: receiptUrl },
              { name: "1", value: String(payment.customer_name || "") },
              { name: "2", value: amount },
              { name: "3", value: transactionNumber }
            ];

            let pdfSent = false;

            try {
              pdfSent = await sendTemplate(
                process.env.WATI_RECEIPT_TEMPLATE_NAME,
                pdfParameters,
                "payment_receipt_pdf"
              );
            } catch (pdfError) {
              console.error("WATI PDF template request failed:", pdfError);
            }

            if (!pdfSent) {
              console.log("WATI: Trying existing text-only template");

              const textParameters = [
                { name: "1", value: String(payment.customer_name || "") },
                { name: "2", value: amount },
                { name: "3", value: transactionNumber },
                {
                  name: "4",
                  value: payment.paid_at
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        timeZone: "Asia/Kolkata"
                      }).format(new Date(payment.paid_at))
                    : "Date unavailable"
                }
              ];

              await sendTemplate(
                process.env.WATI_TEMPLATE_NAME,
                textParameters,
                "payment_received"
              );
            }
          }
        }
      } catch (watiError) {
        console.error("WATI WhatsApp error:", watiError);
      }
    }


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
