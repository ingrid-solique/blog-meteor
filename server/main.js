import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
  const Categoria = new Mongo.Collection('categorias');
  const Post = new Mongo.Collection('posts');
  const Comentario = new Mongo.Collection('comentarios');
});
