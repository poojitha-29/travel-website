export default async function handler(req, res) {
  res.status(200).json({
    mid: process.env.ICICI_MID,
    aggId: process.env.ICICI_AGG_ID,
    hasKey: !!process.env.ICICI_KEY,
    returnUrl: process.env.ICICI_RETURN_URL
  });
}
