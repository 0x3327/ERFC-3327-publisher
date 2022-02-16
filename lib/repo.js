const CLI = require('clui');
const git = require('simple-git/promise')();
const Spinner = CLI.Spinner;
const slugify = require('slugify');

const inquirer = require('./inquirer');


const remoteRepoPath = 'git@github.com:0x3327/3327-operations.git';

module.exports = {

    setupNewBranch: async(path, issue) => {
        await git.cwd(path);
        const branch = slugify(issue.name + '-' + issue.value, {remove: /[\[*+~.()'"!:@\]]/g});
        await git.checkout(['-B' + branch]);
        const research = await inquirer.newResearchQuestions(issue);
        return [branch, research.name];
    },

    cloneRepo: async (dest, repoFolder) => {
        repoFolder = repoFolder || '';
        const fullPath = dest + repoFolder;
        const status = new Spinner('Cloning 3327 research repository...');
        status.start();

        try {
            await git.clone(remoteRepoPath, fullPath);
            await git.cwd(fullPath);
        } catch(e) {
            //
        } finally {
            status.stop();
        }
    },

    pullRepo: async (path) => {
        const status = new Spinner('Synchronising main branch...');
        status.start();

        try {
            await git.cwd(path);
            await git.branch('main')
            await git.pull(remoteRepoPath, 'main')

        } finally {
            status.stop();
        }
    },

    checkoutBranch: async (path, branch) => {
        await git.cwd(path);
        await git.checkout(branch);
    }
};
