import drive from "drive-db";

export default async (req, res) => {
  const db = await drive({
    sheet: "1W7cOTU2nUfT-3N88Aa09ZtZYv_KhtYkbCtpdm_9FeT4",
    tab: "2"
  });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(db));
};
