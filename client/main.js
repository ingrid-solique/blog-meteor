import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';

import './main.html';

const Categoria = new Mongo.Collection('categorias');
const Post = new Mongo.Collection('posts');

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
  list: () => {
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

/*********** POSTS ********/
FlowRouter.route('/post/add', {
  action: () => {
    BlazeLayout.render('main', {
      content: 'addPost'
    });
  }
});

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
      categorias: categoria
    };
    
    console.log(post);

    Post.insert(post);
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
  }
});

Template.editPost.helpers({
  ehAtivo: function(_id, categorias) {
    console.log("_id", _id);
    console.log("categorias", categorias);
    for(var i=0; i<categorias.length; i++){
      console.log("categorias[i]", categorias[i]);
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
    //FlowRouter.go('/post');
  }
});

