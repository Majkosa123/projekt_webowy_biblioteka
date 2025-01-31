const mqtt = require("mqtt");

let client;
let io;

const setupMQTT = (socketIo) => {
  io = socketIo;

  const options = {
    keepalive: 30,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    clientId: "booksphere_" + Math.random().toString(16).substr(2, 8),
  };

  client = mqtt.connect("mqtt://test.mosquitto.org:1883", options);

  client.on("connect", () => {
    console.log("✅ Połączono z publicznym brokerem MQTT");
    console.log("MQTT Client ID:", client.options.clientId);

    const topics = [
      "booksphere/books/status",
      "booksphere/books/availability",
      "booksphere/notifications",
      "booksphere/chat/messages",
      "booksphere/chat/notifications",
      "booksphere/chat/status",
    ];

    topics.forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`📫 Zasubskrybowano temat MQTT: ${topic}`);
        }
      });
    });

    client.publish(
      "booksphere/notifications",
      JSON.stringify({
        type: "SYSTEM",
        message: "System biblioteczny online",
        timestamp: new Date().toISOString(),
      })
    );
  });

  client.on("message", (topic, message) => {
    console.log(`📨 Otrzymano wiadomość MQTT w temacie: ${topic}`);
    try {
      const data = JSON.parse(message.toString());

      if (io) {
        io.emit("42", [
          "book_notification",
          {
            source: "MQTT",
            topic: topic,
            ...data,
          },
        ]);
      }
    } catch (error) {
      console.error("❌ Błąd przetwarzania wiadomości MQTT:", error);
    }
  });

  client.on("error", (error) => {
    console.error("❌ Błąd MQTT:", error);
  });

  client.on("reconnect", () => {
    console.log("🔄 Ponowne łączenie z brokerem MQTT...");
  });

  return client;
};

const publishBookStatus = (statusData) => {
  if (client && client.connected) {
    const payload = {
      type: "STATUS_CHANGE",
      message: `Status książki "${statusData.book.title}" zmieniony na: ${statusData.book.status}`,
      book: statusData.book,
      timestamp: new Date().toISOString(),
    };
    client.publish("booksphere/books/status", JSON.stringify(payload));
    console.log("📤 Opublikowano zmianę statusu przez MQTT");
  }
};

const publishBookAvailability = (book) => {
  if (client && client.connected) {
    const payload = {
      type: "AVAILABILITY",
      message: `Książka "${book.title}" jest teraz dostępna!`,
      book: book,
      timestamp: new Date().toISOString(),
    };
    client.publish("booksphere/books/availability", JSON.stringify(payload));
    console.log("📤 Opublikowano informację o dostępności przez MQTT");
  }
};

const publishChatMessage = (messageData) => {
  if (client && client.connected) {
    const payload = {
      type: "CHAT_MESSAGE",
      ...messageData,
      timestamp: new Date().toISOString(),
    };
    client.publish("booksphere/chat/messages", JSON.stringify(payload));
    console.log("📤 Opublikowano wiadomość czatu przez MQTT");
  }
};

const publishChatNotification = (notificationData) => {
  if (client && client.connected) {
    const payload = {
      type: "CHAT_NOTIFICATION",
      ...notificationData,
      timestamp: new Date().toISOString(),
    };
    client.publish("booksphere/chat/notifications", JSON.stringify(payload));
    console.log("📤 Opublikowano powiadomienie czatu przez MQTT");
  }
};

module.exports = {
  setupMQTT,
  publishBookStatus,
  publishBookAvailability,
  publishChatMessage,
  publishChatNotification,
};
