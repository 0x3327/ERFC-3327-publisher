const inquirer = require('inquirer');
const { githubAuth } = require('./github');
const { parseRemoteRepoLink } = require('./parse');

module.exports = {
    askWhatToDo: () =>
        inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'Setup a new research',
                    value: 'setupnew',
                    short: 'Creating a new research',
                },
                {
                    name: 'Compile references & TOC',
                    value: 'compileresearch',
                    short: 'Compiling a research',
                },
                {
                    name: 'Create a presentation',
                    value: 'createpresentation',
                    short: 'Creating a presentation',
                },
                {
                    name: 'Compile your presentation and start presenting',
                    value: 'compilepresentation',
                    short: 'Compiling a presentation, ready to present',
                },
                new inquirer.Separator(),
                {
                    name: 'Publish your research and presentation',
                    value: 'publishresearch',
                    short: 'Publishing your work',
                },
                {
                    name: 'Synchronise research repository',
                    value: 'syncrepo',
                    short: 'Synchronizing repository',
                },
                new inquirer.Separator(),
                {
                    name: 'Change configuration',
                    value: 'changecfg',
                    short: 'Changing configuration',
                },
                {
                    name: 'Quit the publisher',
                    value: 'quit',
                    short: 'Quitting...',
                },
            ],
            default: 'public',
            pageSize: 50,
        }),

    getPathForRepo: (currentDir) =>
        inquirer.prompt({
            name: 'repoPath',
            type: 'input',
            message: 'Enter project path (new folder will be created inside):',
            default: currentDir,
        }),

    getFolderForRepo: () =>
        inquirer.prompt({
            name: 'repoFolder',
            type: 'input',
            message: 'Enter folder name: ',
            default: '3327-research',
        }),

    selectResearchProposal: (choices) =>
        inquirer.prompt({
            type: 'list',
            name: 'proposal',
            message: 'Please select your research proposal',
            choices,
            default: 'public',
        }),

    selectResearch: (_choices) => {
        const choices = _choices.map((choice) => ({
            name: `${choice.name} - ${choice.title}`,
            value: choice,
        }));

        return inquirer.prompt({
            type: 'list',
            name: 'research',
            message: 'Please enter the research',
            choices,
            default: 'public',
        });
    },

    newResearchQuestions: (issue) =>
        inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'Please enter your research title (can be changed):',
            default: issue.name.substring(5),
            validate(value) {
                if (value.length) {
                    return true;
                }
                return 'Please enter your research title.';
            },
        }),

    changeConf: () =>
        inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Select the option',
            choices: [
                {
                    name: 'Add a new Repository',
                    value: 'addremoterepo',
                    short: 'Adding new Remote Repository',
                },
                {
                    name: 'Switch the working Repository',
                    value: 'switchrepo',
                    short: 'Switching',
                },
            ],
        }),

    addRemoteRepo: () =>
        inquirer.prompt({
            name: 'repoLink',
            type: 'input',
            message: 'Enter remote repo path:',
            default: '',
            async validate(link) {
                //Checks if the link provided leads to a valid github repo

                const { owner, repo } = parseRemoteRepoLink(link);

                const resp = await githubAuth().request(
                    'GET /repos/{owner}/{repo}',
                    {
                        owner,
                        repo,
                    }
                );

                return resp.status === 200;
            },
        }),

    selectWorkingRepo: (choices) =>
        inquirer.prompt({
            type: 'list',
            name: 'repoPath',
            message: 'Please select the new Working DIR: ',
            choices,
            default: 'public',
        }),

    pressEnterToContinue: () =>
        inquirer.prompt({
            name: 'pressEnter',
            type: 'input',
            message: '\nPress ENTER to continue',
            prefix: '',
        }),
};
