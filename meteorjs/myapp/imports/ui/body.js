import {Meteor} from 'meteor/meteor'
import { Template } from 'meteor/templating'
import {ReactiveDict} from 'meteor/reactive-dict';

import './task.js'
import './body.html'
import {Tasks} from '../api/tasks.js'



const div1 = document.createElement('div')
div1.style.width = '500px'
div1.style.height = '500px'
document.body.appendChild(div1)
const regl=require('regl')(div1)

console.log('regl')
console.log(regl)


// This clears the color buffer to black and the depth buffer to 1
regl.clear({
  color: [0, 0, 0, 1],
  depth: 1
})

// In regl, draw operations are specified declaratively using. Each JSON
// command is a complete description of all state. This removes the need to
// .bind() things like buffers or shaders. All the boilerplate of setting up
// and tearing down state is automated.
regl({

  // In a draw call, we can pass the shader source code to regl
  frag: `
  precision mediump float;
  uniform vec4 color;
  void main () {
    gl_FragColor = color;
  }`,

  vert: `
  precision mediump float;
  attribute vec2 position;
  void main () {
    gl_Position = vec4(position, 0, 1);
  }`,

  attributes: {
    position: [
      [-1, 0],
      [0, -1],
      [1, 1]
    ]
  },

  uniforms: {
    color: [1, 0, 0, 1]
  },

  count: 3
})()




Template.body.onCreated (function bodyOnCreated(){
  this.state=new ReactiveDict();
});


Template.body.helpers(
  {
    tasks(){
      const instance=Template.instance();
      if (instance.state.get('hideCompleted')){
        return Tasks.find({checked:{$ne:true}},{sort:{createdAt:-1}});
      }
      console.log('hello')
      console.log(Tasks.find({}));
      return Tasks.find({});
    }

  }
);




Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner:Meteor.userId(),
      username:Meteor.user().username,

    });

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event,instance){
    instance.state.set('hideCompleted',event.target.checked);
    console.log('toggle')
  }
});
