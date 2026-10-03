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
    // WATI - SEND PAYMENT SUCCESS MESSAGE
    // =========================================================

    if (isSuccess) {
      try {
        // Get customer details from Supabase
        const { data: payment, error: paymentError } =
          await supabase
            .from("payments")
            .select("customer_name, mobile")
            .eq(
              "merchant_txn_no",
              callback.merchantTxnNo
            )
            .single();

        if (paymentError) {
          console.error(
            "WATI: Could not fetch customer details:",
            paymentError
          );
        } else if (payment) {

          // Format mobile number for WhatsApp
          let whatsappNumber = String(
            payment.mobile || ""
          ).replace(/\D/g, "");

          if (whatsappNumber.length === 10) {
            whatsappNumber = "91" + whatsappNumber;
          }

          if (!whatsappNumber) {
            console.error(
              "WATI: Customer mobile number not found"
            );
          } else {

            const watiUrl =
              `${process.env.WATI_API_ENDPOINT}/api/v1/sendTemplateMessage?whatsappNumber=${encodeURIComponent(
                whatsappNumber
              )}`;

            const watiPayload = {
              template_name:
                process.env.WATI_TEMPLATE_NAME,

              broadcast_name:
                "payment_received",

              parameters: [
                {
                  name: "1",
                  value: String(
                    payment.customer_name || ""
                  )
                },
                {
                  name: "2",
                  value: String(
                    callback.amount || ""
                  )
                },
                {
                  name: "3",
                  value: String(
                    callback.merchantTxnNo || ""
                  )
                }
              ]
            };

            const watiResponse =
              await fetch(watiUrl, {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                  "Authorization":
                    `Bearer ${process.env.WATI_API_TOKEN}`
                },

                body: JSON.stringify(watiPayload)
              });

            const watiResult =
              await watiResponse.text();

            console.log(
              "========== WATI RESPONSE =========="
            );

            console.log(
              "WATI STATUS:",
              watiResponse.status
            );

            console.log(
              "WATI RESULT:",
              watiResult
            );
          }
        }

      } catch (watiError) {
        console.error(
          "WATI WhatsApp error:",
          watiError
        );
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
