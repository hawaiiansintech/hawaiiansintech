import drive from "drive-db";

export default async (req, res) => {
  // TODO: Before mergin
  // Swap back from staging spreadsheet
  // const db = await drive("1W7cOTU2nUfT-3N88Aa09ZtZYv_KhtYkbCtpdm_9FeT4");
  const db = await drive("1Yq9XC-c_tuTiB4MrKtw1p6HRAr9MTDYa9iXybaytk1U");
  let sanitizeResult = db.filter(
    (item) => item.name != "" && item.exclude !== "Yes"
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(sanitizeResult));
};
