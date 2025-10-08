import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from "../api/TasksCollection"; 
import '/imports/api/TasksMethods.js'; // this import in this client UI allows for optimistic execution
import './App.html';
import './Task';
import "./Login.js";

const HIDE_COMPLETED_STRING = "hideCompleted";

const getUser = () => Meteor.user();
const isUserLoggedInChecker = () => Boolean(getUser());

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();

  Meteor.subscribe('tasks');
});

Template.mainContainer.helpers({
  tasks() {
    let result = [];
    if (isUserLoggedInChecker()) {
      const instance = Template.instance();
      const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

      const hideCompletedFilter = { isChecked: { $ne: true } };

      result = TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
        sort: { createdAt: -1, _id: -1 },
      }).fetch();      
    }

    return result;
  },
  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },
  incompleteCount() {
    result = '';
    if (isUserLoggedInChecker()) {
      const incompleteTasksCount = TasksCollection.find({ isChecked: { $ne: true } }).count();
      result = incompleteTasksCount ? `(${incompleteTasksCount})` : '';
    }

    return result;
  },
  isUserLoggedIn() {
    return isUserLoggedInChecker();
  },
  getUser() {
    return getUser();
  },
});

Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },
  'click .user'() {
    Meteor.logout();
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
