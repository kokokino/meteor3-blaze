import { Template } from 'meteor/templating';
import { TasksCollection } from "../api/TasksCollection"; 
import '/imports/api/tasksMethods.js'; // this import in this client UI allows for optimistic execution
import './App.html';
import './Task';

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  Meteor.subscribe('tasks');
});

Template.mainContainer.helpers({
  tasks() {
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
});

Template.form.events({
  "submit .task-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.callAsync("tasks.insert", {
      text,
      createdAt: new Date(), // current time
    });      

    // Clear form
    target.text.value = '';
  }
});
