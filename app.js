const express = require('express');
// 中间件
const { graphqlHTTP } = require('express-graphql');
// schema
const schema = require('./schema/schema');
const mongoose = require('mongoose');
// cors
const cors = require('cors');

const app = express();

// 连接到数据库
mongoose.connect('mongodb://test:test123@localhost:27017/graphql', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to database');
});

//允许跨域访问
app.use(cors());

// 路由, 访问graphql资源
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true, // 调试模式
  }),
);

app.listen(4000, () => {
  console.log('server is listening on port 4000');
});
