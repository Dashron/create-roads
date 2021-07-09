// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = {
  prompt: ({ prompter, args }) => {
    // TODO: Add a way to read in a json schema file
    return prompter
      .prompt([{
        type: 'confirm',
        name: 'softDelete',
        message: "Do you want this resource to use soft deletes?"
      }, 
      // TODO: Make this relevant. It should use the parentResourceName and auto include the relevant fields in model, representation, resource, etc.
      // Get the example from dashboard module and campaign users
      {
        type: 'confirm',
        name: 'isSubResource',
        message: "Is there many of this resource attached to another resource? e.g. this is a blog post resource, of which many are owned by a single user"
      }])
      .then((answers) => {
        if (answers.isSubResource) {
          return prompter.prompt([{
            type: 'input',
            name: 'parentResourceName',
            message: "What is the single resource associated with this multi-resource? e.g. this quesiton is asking for the single 'User' resource of the previous example"
          }]).then(nextAnswers => Object.assign({}, answers, nextAnswers))  
        } else {
          return answers;
        }
      });
  }
};