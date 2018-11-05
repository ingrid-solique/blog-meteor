import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import './main.html';

const Categoria = new Mongo.Collection('categorias');
const Post = new Mongo.Collection('posts');
const Comentario = new Mongo.Collection('comentarios');

/*********** Início Área Pública ***********/
FlowRouter.route('/blog', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'listPost',
      contentLogin: 'listPost'
    });
  }
});

FlowRouter.route('/post', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'listPost',
      contentLogin: 'listPost'
    });
  }
});

FlowRouter.route('/post/:id', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'postShow',
      contentLogin: 'postShow'
    });
  }
});

Template.menu.helpers({
  listMenu: () => {
    return Categoria.find();
  }
});

Template.listPost.helpers({
  listPost: () => {
    console.log('User: ', Meteor.userId());
    return Post.find();
  }
});

Template.postShow.helpers({
  show: () => {
      var id = FlowRouter.getParam('id');

      return Post.findOne({
        _id: id
      });
  }
});

/*********** Fim Área Pública ***********/

/*********** Início Área Privada ***********/

/*********** CATEGORIAS ********/
FlowRouter.route('/categoria/add', {
    action: () => {
      BlazeLayout.render('main', {
        contentLogin: 'addCategoria'
      });
    }
});

FlowRouter.route('/categoria', {
  action: () => {
    BlazeLayout.render('main', {
      contentLogin: 'listCategoria'
    })
  }
});

FlowRouter.route('/categoria/edit/:id', {
  action: () => {
    BlazeLayout.render('main', {
      contentLogin: 'editCategoria'
    })
  }
});

FlowRouter.route('/categoria/remove/:id', {
  action: () => {
    var id = FlowRouter.getParam('id');
    Categoria.remove(id);
    FlowRouter.go('/categoria');
  }
});

Template.addCategoria.events({
  'click #saveCategoria': (event, template) => {
    event.preventDefault();

    let categoria = {
      nome: template.find('input[name="nome"]').value
    };

    Categoria.insert(categoria);
    FlowRouter.go('/categoria');
  }
});

Template.listCategoria.helpers({
  listCtg: () => {
    return Categoria.find();
  }
});

Template.editCategoria.helpers({
  data: () => {
    var id = FlowRouter.getParam('id');

    return Categoria.findOne({
      _id: id
    });
  }
});

Template.editCategoria.events({
  'click #editCategoria': (event, template) => {
    var id = FlowRouter.getParam('id');
    
    let categoria = {
      nome: template.find('input[name="nome"]').value
    };
    event.preventDefault();

    Categoria.update({
        _id: id
    }, categoria);
    FlowRouter.go('/categoria');
  }
});

/*********** Fim CATEGORIAS ***********/

/*********** POSTS ***********/
FlowRouter.route('/postt/add', { 
  action: () => {
    BlazeLayout.render('main', {
      contentLogin: 'addPost'
    });
  }
});

FlowRouter.route('/post/edit/:id', { 
  action: () => {
    BlazeLayout.render('main', {
      contentLogin: 'editPost'
    });
  }
});

FlowRouter.route('/post/remove/:id', {
  action: () => {
    var id = FlowRouter.getParam('id');
    Post.remove(id);
    FlowRouter.go('/post');
  }
});

Template.addPost.helpers({
  listaCategorias: () => {
    return Categoria.find();
  }
});

Template.addPost.events({
  'click #savePost': (event, template) => {
    event.preventDefault();

    var selected = template.findAll( "input[type=checkbox]:checked");
    var categoria = selected.map(function(item){ 
      return item.value
    });

    let post = {
      titulo: template.find('input[name="titulo"]').value,
      subtitulo: template.find('input[name="subtitulo"]').value,
      conteudo: template.find('textarea[name="conteudo"]').value,
      categorias: categoria,
      usuario: Meteor.userId()
    };
    
    console.log(post);

    Post.insert(post);
    FlowRouter.go('/post');
  }
});

Template.editPost.helpers({
  ehAtivo: function(_id, categorias) {
    for(var i=0; i<categorias.length; i++){
      if(categorias[i] == _id){
        return true;
      }
    }
    return false;
  },
});

Template.editPost.helpers({
  listaCategorias: () => {
    return Categoria.find();
  }
});

Template.editPost.helpers({
  data: () => {
    var id = FlowRouter.getParam('id');

    return Post.findOne({
      _id: id
    });
  }
});

Template.editPost.events({
  'click #editPost': (event, template) => {
    event.preventDefault();

    var id = FlowRouter.getParam('id');

    var selected = template.findAll( "input[type=checkbox]:checked");
    var categoria = selected.map(function(item){ 
      return item.value
    });

    let post = {
      titulo: template.find('input[name="titulo"]').value,
      subtitulo: template.find('input[name="subtitulo"]').value,
      conteudo: template.find('textarea[name="conteudo"]').value,
      categorias: categoria
    };

    Post.update({
      _id: id
    }, post);
    FlowRouter.go('/post');
  }
});

/*********** Fim POSTS ***********/

