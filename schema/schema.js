const Book = require('../models/book');
const Author = require('../models/author');
const {
  GraphQLObjectType, // 生成基本的对象类型
  GraphQLString, // 字符串类型
  GraphQLSchema, // schema类型
  GraphQLID, // ID类型
  GraphQLInt, // 数字类型
  GraphQLNonNull, // 非空限制类
  GraphQLList, // 列表类型
} = require('graphql');

// 定义一个查询类型
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    // 这个对象又哪些属性
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // 书籍的返回数据中存在属性 authorId
        return Author.findById(parent.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // 作者的返回数据中，没有 authorId, 只有 本身的ID
        return Book.find({ authorId: parent.id });
      },
    },
  }),
});

// 查询对象的入口
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // 从哪里得到数据，比如数据库或其他来源
        // Mongodb mysql postgresql
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      },
    },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        // 没条件就是全部查询
        return Book.find({});
      },
    },
    authors: {
      type: GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      },
    },
  },
});

// 增删改查对象的入口
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }, // 这个new GraphQLNonNull表示参数不能为空
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        // 这里的 Author 是模型中定义好的数据库操作对象
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        // 保存数据到数据库
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        // 同上，这里也是models中定义好的对象
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        // 保存数据到数据库
        return book.save();
      },
    },
  },
});

// 导出一个实例
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
