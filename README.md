在node项目里使用rabbitmq实践，纯封装和引用，不参杂任何业务

# rabbitmq-node


## Features

1. [rabbitmq](http://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)
2. [amqplib](http://www.squaremobius.net/amqp.node/)
3. [nodejs](https://nodejs.org/)

## steps

``` bash
# install rabbitmq on your computer
# https://17it.github.io/2018/09/03/centos%E6%90%AD%E5%BB%BArabbitmq%EF%BC%88%E4%B8%80%EF%BC%89/

```
``` bash
# install packages
npm i
```
``` bash
# node test
node test/mq_receive_test.js
# open another terminal
node test/mq_send_test.js
```

