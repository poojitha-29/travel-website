export default async function handler(req, res) {
  console.log("========== ICICI CALLBACK ==========");
  console.log("METHOD:", req.method);
  console.log("BODY:", req.body);
  console.log("QUERY:", req.query);

  return res.redirect(
    302,
    "https://www.sangeethaholidays.com/payment-response?received=true"
  );
}
