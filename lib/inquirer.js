const inquirer = require('inquirer');
const files = require('./files');
const {DEFAULT_REMOTE_REPO_CONFIG, conf, octokit} = require('./conf')



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
                new inquirer.Separator(),
                {name: 'Change configuration', value: 'changecfg', short: 'Changing configuration'},
                {name: 'Quit the publisher', value: 'quit', short: 'Quitting...'},

            ],
            default: 'public',
            pageSize: 50
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

    getFolderForRepo: (currentDir) => {
        return inquirer.prompt({
            name: 'repoFolder',
            type: 'input',
            message: 'Enter folder name: ',
            default:  '3327-research'
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
            message: 'Please enter the research you would like to compile',
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

    changeConf: () => {
        return inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Select the option',
            choices: [
                {name: 'Add a new Repository', value: 'addremoterepo', short: 'Adding new Remote Repository'},
                {name: 'Switch the working Repository', value: 'switchrepo', short: 'Switching'},
            ],
        })
    },

    addRemoteRepo: () => {
        return inquirer.prompt({
            name: 'remoteRepoLink',
            type: 'input',
            message: 'Enter remote repo path:',
            default: '',
            validate: async function (value) {

                    const owner = value.split(':')[1].split('/')[0];
                    let repo = value.split(':')[1].split('/')[1];
                    repo = repo.substring(0, repo.length - 4);

                    const resp = await octokit.request('GET /repos/{owner}/{repo}', {
                        owner,
                        repo,
                    })

                    return resp.status === 200

                }
        });
    },

    selectWorkingRepo: (choices) => {

        return inquirer.prompt({
            type: 'list',
            name: 'repoPath',
            message: 'Please select the new Working DIR: ',
            choices: choices,
            default: 'public'
        })
    },

    pressEnterToContinue: () => {
        return inquirer.prompt({
            name: 'pressEnter',
            type: 'input',
            message: '\nPress ENTER to continue',
            prefix: ''
        });
    },
};
