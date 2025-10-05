import { Template } from 'meteor/templating';
import { TasksCollection } from "../api/TasksCollection";
import '/imports/api/tasksMethods.js'; // this import in this client UI allows for optimistic execution
import './Task.html';


Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    let taskID = this._id;
    let checkedValue = Boolean(this.isChecked);
    Meteor.callAsync("tasks.toggleChecked", { _id: taskID, isChecked: checkedValue });
  },
});
