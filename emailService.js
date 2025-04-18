require("dotenv").config();
const amqp = require("amqplib");

async function emailService() {
  const connection = await amqp.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();

  const exchange = "orders";
  const queueName = "emailqueueService";

  await channel.assertExchange(exchange, "fanout", { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchange, "");

  channel.prefetch(1);
  console.log("📨 Email service waiting for messages...");

  channel.consume(
    queueName,
    async (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        console.log("📧 Email sent for order:", order.orderId);
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
}

emailService();
