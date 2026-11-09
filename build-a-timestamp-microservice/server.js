import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

// Interpret date strings without an explicit offset (e.g. "05 October 2011")
// as UTC, so results do not depend on the machine's local time zone.
process.env.TZ = "UTC";

function toResponse(date) {
  return { unix: date.getTime(), utc: date.toUTCString() };
}

// Express 5 syntax for an optional route parameter (`/api/:date?` in Express 4)
app.get("/api{/:date}", (req, res) => {
  const { date } = req.params;

  if (date === undefined || date === "") {
    return res.json(toResponse(new Date()));
  }

  const parsed = /^-?\d+$/.test(date) ? new Date(Number(date)) : new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json(toResponse(parsed));
});

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
