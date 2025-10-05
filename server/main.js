import { Meteor } from "meteor/meteor";
import { TasksCollection } from "/imports/api/TasksCollection";
import "../imports/api/TasksPublications";
import "../imports/api/tasksMethods"; // [!code highlight]

Meteor.startup(async () => {
  if ((await TasksCollection.find().countAsync()) === 0) {
    [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ].forEach((taskName) => {
      Meteor.callAsync("tasks.insert", { // [!code highlight]
        text: taskName, // [!code highlight]
        createdAt: new Date(), // [!code highlight]
      });      
    });
  }
});