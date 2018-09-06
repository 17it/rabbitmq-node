/* 简单封装 */
let amqp = require('amqplib');

class RabbitMQ {
  constructor(opt) {
    // common
    this.name = opt.name || 'amqp';
    this.host = opt.host || 'amqp://localhost';
    this.durable = opt.durable || true;
    
    // receive
    this.noAck = opt.noAck || false;
    this.prefetch = opt.prefetch || 1;
    
    // send
    this.persistent = opt.persistent || true;
    
    // fun
    this.open = amqp.connect(this.host);
  }
  
  receive(cb) {
    let _this = this;
    this.open
    .then((conn) => {
      conn.on("error", function (err) {
        // do something like send an email
        console.error('error Lost connection to RMQ.  Reconnecting in 10 seconds...');
        // todo 待验证
        return setTimeout(() => {
          _this.receive(cb);
        }, 10000);
      });
      conn.on("close", function (err) {
        // do something like send an email
        console.error('close Lost connection to RMQ.  Reconnecting in 10 seconds...');
        // todo 待验证
        return setTimeout(() => {
          _this.receive(cb);
        }, 10000);
      });
      
      return conn.createChannel();
    })
    .then((ch) => {
      return ch.assertQueue(this.name, {durable: this.durable})
      .then(() => {
        ch.prefetch(this.prefetch);
        console.log('channel created: ' + this.name);
        
        return ch.consume(this.name, (msg) => {
          let data = msg.content.toString();
          // ch.ack(msg);
          cb && cb(data, ch, msg);
        }, {noAck: this.noAck});
      })
    })
    .catch((err) => {
      // do something like send an email
      console.info('receive catch : ' + err);
    });
  }
  
  send(msg, cb) {
    let _this = this;
    this.open
    .then((conn) => {
      conn.on("error", function (err) {
        // do something like send an email
        console.error('error Lost connection to RMQ send.  Reconnecting in 10 seconds...');
        // todo 待验证
        return setTimeout(() => {
          _this.send(msg, cb);
        }, 10000);
      });
      conn.on("close", function (err) {
        // do something like send an email
        console.error('close Lost connection to RMQ send.  Reconnecting in 10 seconds...');
        // todo 待验证
        return setTimeout(() => {
          _this.send(msg, cb);
        }, 10000);
      });
      
      return conn.createChannel();
    })
    .then((ch) => {
      return ch.assertQueue(this.name, {durable: this.durable})
      .then(() => {
        return ch.sendToQueue(this.name, new Buffer(msg), {persistent: this.persistent})
      })
      .then((data) => {
        if (data) {
          cb && cb('success: ' + data);
          ch.close();
        }
      })
      .catch((e) => {
        console.info('send msg catch : ' + msg);
        setTimeout(() => {
          ch && ch.close();
        }, 500);
      });
    })
    .catch((err) => {
      // do something like send an email
      console.info('send catch : ' + msg);
    });
  }
}

module.exports = RabbitMQ;