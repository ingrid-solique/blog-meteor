import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import './main.html';

const Categoria = new Mongo.Collection('categorias');
const Post = new Mongo.Collection('posts');
const Comentario = new Mongo.Collection('comentarios');

FlowRouter.route('/blog', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'listPost'
    });
  }
});

Template.registerHelper("isEmpty", function (object) {
  return jQuery.isEmpty(object);
});

Template.registerHelper("truncate", function(text) {
  return text.substring(0, 200).concat("...");
});

/*********** CATEGORIAS ********/
FlowRouter.route('/categoria/add', {
    action: () => {
      BlazeLayout.render('main', {
        content: 'addCategoria'
      });
    }
});

FlowRouter.route('/categoria', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'listCategoria'
    })
  }
});

FlowRouter.route('/categoria/edit/:id', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'editCategoria'
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
FlowRouter.route('/post', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'listPost'
    });
  }
});

FlowRouter.route('/post/:id', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'postShow'
    });
  }
});

FlowRouter.route('/postt/add', { 
  action: () => {
    BlazeLayout.render('main', {
      content: 'addPost'
    });
  }
});

FlowRouter.route('/post/edit/:id', { 
  action: () => {
    BlazeLayout.render('main', {
      content: 'editPost'
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

Template.listPost.helpers({
  listPost: () => {
    return Post.find();
  }
});

Template.postShow.helpers({
  show: () => {
      var id = FlowRouter.getParam('id');

      return Post.findOne({
        _id: id
      });
  },
  autor: () => {
    var id = FlowRouter.getParam('id');

    post = Post.findOne({_id: id});

    usuarioNome = Meteor.users.findOne({ _id : post.usuario });

    console.log("user: ", usuarioNome);

    return usuarioNome;
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

/*********** COMENTARIOS ***********/
Template.comentarios.events({
  'click #saveComentario': (event, template) => {
    event.preventDefault();

    var id = FlowRouter.getParam('id');
    
    let comentario = {
      nome: template.find('input[name="nomeUser"]').value,
      comentario: template.find('textarea[name="comentario"]').value,
      post: id
    };

    Comentario.insert(comentario);
    template.find('input[name="nomeUser"]').value = " ";
    template.find('textarea[name="comentario"]').value = " ";
  }
});

Template.comentarios.helpers({
  listComentarios: () => {
    var id = FlowRouter.getParam('id');

    return Comentario.find({
      post: id
    });
  }
});


/*********** USUARIOS ********/
FlowRouter.route('/login', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'login'
    });
  }
});

FlowRouter.route('/registrar', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'registrarUser'
    });
  }
});

Template.registrarUser.events({
  'click #saveUsuario': (event, template) => {
    event.preventDefault();

    var nomeUser = template.find('input[name="registroUsuario"]').value;
    var emailVar = template.find('input[name="registroEmail"]').value;
    var passwordVar = template.find('input[name="registroPassword"]').value;

    var options = {
      username: nomeUser,
      emails: [{
        address: emailVar,
        verified: false
      }],
      password: passwordVar
    };

    Accounts.createUser(options , function(err){
      loginCallBack(error);
    });

    FlowRouter.go('/blog');
  }
});

Template.login.events({
  'click #logar': (event, template) => {
    event.preventDefault();

    var emailVar = template.find('input[name="loginEmail"]').value;
    var passwordVar = template.find('input[name="loginPassword"]').value;

    Meteor.loginWithPassword(emailVar, passwordVar);  

    FlowRouter.go('/blog');
  }
});

Template.sair.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
  }
});

