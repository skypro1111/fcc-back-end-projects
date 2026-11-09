import http from "http";
import fs from "fs";
import { WebSocketServer, WebSocket } from "ws";

const PORT = 3001;

const server = http.createServer((req, res) => {
  // Serve the browser client script so the provided chat UI works.
  if (req.url === "/script.js") {
    fs.readFile("./public/script.js", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
    return;
  }

  fs.readFile("./public/index.html", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading index.html");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

function broadcast(payload) {
  const message = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on("connection", (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );

  broadcast({ type: "system", text: `${username} joined` });

  socket.on("message", (data) => {
    let parsed;
    try {
      parsed = JSON.parse(data.toString());
    } catch {
      return;
    }
    broadcast({ type: "chat", username: parsed.username, text: parsed.text });
  });

  socket.on("close", () => {
    broadcast({ type: "system", text: `${username} left` });
  });
});

server.listen(PORT, () => {
  console.log("Chat server running at http://localhost:3001");
});
