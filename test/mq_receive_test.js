let RabbitMQ = require('../mq/mq');
let mq = new RabbitMQ({name: 'mq_OnResult'});

mq.receive(async (data, ch, msg) => {
  try {
    data = JSON.parse(data);
  } catch (e) {
    data = data;
  }
  let title = data.title;
  
  console.log('receive msg: ' + title);
  
  // ack the msg
  ch.ack(msg);
});
