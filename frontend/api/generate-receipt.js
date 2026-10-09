
import { createClient } from "@supabase/supabase-js";
import PDFDocument from "pdfkit";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const txn = String(req.query.txn || "").trim();

    if (!txn || txn.length > 150) {
      return res.status(400).json({
        error: "Valid transaction number is required"
      });
    }

    const { data: payment, error } = await supabase
      .from("payments")
      .select(
        "merchant_txn_no, status, customer_name, payment_mode, payment_id, txn_id, paid_at, gateway_response"
      )
      .eq("merchant_txn_no", txn)
      .maybeSingle();

    if (error) {
      console.error("Receipt lookup failed:", error.message);
      return res.status(500).json({
        error: "Could not retrieve payment"
      });
    }

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found"
      });
    }

    if (payment.status !== "SUCCESS") {
      return res.status(409).json({
        error: "A receipt is available only for successful payments"
      });
    }

    // Use the amount recorded in the verified ICICI callback.
    const amountValue = Number(payment.gateway_response?.amount);

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      return res.status(422).json({
        error: "Verified payment amount is unavailable"
      });
    }

    const amount = `INR ${amountValue.toFixed(2)}`;

    const paymentDate = payment.paid_at
      ? new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata"
        }).format(new Date(payment.paid_at)) + " IST"
      : "Date unavailable";

    const method = String(payment.payment_mode || "Not provided");
    const customerName = String(payment.customer_name || "Customer");
    const transactionId = String(payment.merchant_txn_no);
    const gatewayTxnId = String(payment.txn_id || payment.payment_id || "Not provided");

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 45, bottom: 45, left: 50, right: 50 },
      info: {
        Title: "Sangeetha Holidays Payment Receipt",
        Author: "Sangeetha Holidays Pvt. Ltd."
      }
    });

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    doc.on("error", (pdfError) => {
      console.error("PDF generation failed:", pdfError);
    });

    doc.on("end", () => {
      const pdf = Buffer.concat(chunks);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="receipt-${transactionId.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf"`
      );
      res.setHeader("Cache-Control", "no-store");
      res.status(200).send(pdf);
    });

    const green = "#21845B";
    const darkGreen = "#176747";
    const dark = "#263B33";
    const muted = "#687871";
    const paleGreen = "#EAF5EF";
    const line = "#D9E7DF";

    // Compact, left-aligned company header.
    // Logo URL is public, but we embed the image into the PDF.
    const logoResponse = await fetch(
      "https://www.sangeethaholidays.com/sangeetha_holidays_logo_green.png"
    );

    if (logoResponse.ok) {
      const logoBuffer = Buffer.from(await logoResponse.arrayBuffer());
      doc.image(logoBuffer, 50, 38, {
        fit: [55, 55],
        align: "left",
        valign: "center"
      });
    }

    doc.fillColor(darkGreen)
      .font("Helvetica-Bold")
      .fontSize(15)
      .text("SANGEETHA HOLIDAYS", 118, 44);

    doc.fillColor(muted)
      .font("Helvetica")
      .fontSize(9)
      .text("PVT. LTD.", 118, 63)
      .text("Explore world with us", 118, 76);

    doc.moveTo(50, 105)
      .lineTo(545, 105)
      .lineWidth(1.5)
      .strokeColor(green)
      .stroke();

    doc.moveDown(3);

    doc.fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(21)
      .text("Payment Receipt", 50, 130);

    doc.fillColor(darkGreen)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("PAYMENT SUCCESSFUL", 50, 168);

    // Receipt reference and date.
    doc.roundedRect(50, 195, 495, 65, 7)
      .fillColor(paleGreen)
      .fill();

    doc.fillColor(muted)
      .font("Helvetica")
      .fontSize(8)
      .text("RECEIPT / TRANSACTION NO.", 64, 208)
      .text("PAYMENT DATE", 330, 208);

    doc.fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text(transactionId, 64, 226, { width: 245 })
      .text(paymentDate, 330, 226, { width: 200 });

    // Payment details.
    doc.fillColor(darkGreen)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Customer & Payment Details", 50, 286);

    const rows = [
      ["Customer name", customerName],
      ["Payment method", method],
      ["Gateway transaction ID", gatewayTxnId],
      ["Payment purpose", "Payment confirmation"]
    ];

    let y = 318;

    rows.forEach(([label, value]) => {
      doc.fillColor(muted)
        .font("Helvetica")
        .fontSize(9)
        .text(label, 60, y, { width: 160 });

      doc.fillColor(dark)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(value, 230, y, { width: 300 });

      doc.moveTo(60, y + 23)
        .lineTo(535, y + 23)
        .lineWidth(0.5)
        .strokeColor(line)
        .stroke();

      y += 43;
    });

    // Amount received.
    doc.roundedRect(50, y + 5, 495, 70, 7)
      .fillColor(paleGreen)
      .fill();

    doc.fillColor(dark)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("AMOUNT RECEIVED", 66, y + 31);

    doc.fillColor(darkGreen)
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(amount, 280, y + 26, {
        width: 245,
        align: "right"
      });

    const footerY = y + 105;

    doc.fillColor(muted)
      .font("Helvetica")
      .fontSize(8)
      .text(
        "This receipt acknowledges the payment recorded for the transaction above. It does not, by itself, confirm that a tour booking is fully completed.",
        50,
        footerY,
        { width: 495, lineGap: 3 }
      );

    doc.moveTo(50, footerY + 48)
      .lineTo(545, footerY + 48)
      .lineWidth(0.6)
      .strokeColor(line)
      .stroke();

    doc.fillColor(darkGreen)
      .font("Helvetica-Bold")
      .fontSize(9)
      .text("Sangeetha Holidays Pvt. Ltd.", 50, footerY + 60, {
        width: 495,
        align: "center"
      });

    doc.fillColor(muted)
      .font("Helvetica")
      .fontSize(8)
      .text("www.sangeethaholidays.com", 50, footerY + 75, {
        width: 495,
        align: "center"
      });

    doc.end();
  } catch (error) {
    console.error("Receipt API error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Could not generate receipt"
      });
    }
  }
}
