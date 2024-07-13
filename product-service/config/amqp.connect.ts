import amqp from 'amqplib'

async function connectAMQP() {
    const amqpServer = "amqp://localhost:5672";
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
    return { connection, channel };
}
export {connectAMQP}