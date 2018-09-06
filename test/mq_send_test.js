let RabbitMQ = require('../mq/mq');
let mq = new RabbitMQ({name: 'mq_OnResult'});

function sendMsg() {
  let msg = {
    title: 'this is a test title'
  };
  
  mq.send(JSON.stringify(msg), (err) => {
    console.log('send mq :' + err);
  });
}

setInterval(() => {
  sendMsg();
}, 1000);