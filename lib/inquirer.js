const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
    askWhatToDo: () => {
        return inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                {name: 'Setup a new research', value: 'setupnew', short: 'Creating a new research'},
                {name: 'Compile references & TOC', value: 'compileresearch', short: 'Compiling a research'},
                {name: 'Create a presentation', value: 'createpresentation', short: 'Creating a presentation'},
                {name: 'Compile a presentation', value: 'compilepresentation', short: 'Compiling a presentation a presentation'},
                new inquirer.Separator(),
                {name: 'Publish a research', value: 'publishresearch', short: 'Publishing your work'},
                {name: 'Synchronise research repository', value: 'syncrepo', short: 'Synchronizing repository'},
            ],
            default: 'public'
        })
    },

    getPathForRepo: (currentDir) => {
        return inquirer.prompt({
            name: 'repoPath',
            type: 'input',
            message: 'Enter project path (new folder will be created inside):',
            default:  currentDir
        });
    },

    selectResearchProposal: (choices) => {
        return inquirer.prompt({
            type: 'list',
            name: 'proposal',
            message: 'Please select your research proposal',
            choices: choices,
            default: 'public'
        })
    },

    selectResearch: (choices) => {
        choices = choices.map(choice => {
            return {
                name: choice.name + ' - ' + choice.title,
                value: choice
            }
        });

        return inquirer.prompt({
            type: 'list',
            name: 'research',
            message: 'Please research you would like to compile',
            choices: choices,
            default: 'public'
        })
    },

    newResearchQuestions: (issue) =>{
        return inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'Please enter your research title (can be changed):',
            default: issue.name.substring(5),
            validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your research title.';
                    }
                }
        });
    },
};
