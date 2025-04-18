require("dotenv").config();
const ampq = require("amqplib");

async function placeorder(order) {
  const connection = await ampq.connect(process.env.AMQP_URL);
  const channel = await connection.createChannel();

  const exchange = "orders";
  await channel.assertExchange(exchange, "fanout", { durable: true });

  channel.publish(exchange, "", Buffer.from(JSON.stringify(order)), {
    persistent: true,
  });
  console.log("SK@ Order Placed", order);

  await channel.close();
  await connection.close();
}

//placing an order
placeorder({
  orderId: 12,
  user: "saurav",
  item: "iPhone 15",
  price: 70000,
});
