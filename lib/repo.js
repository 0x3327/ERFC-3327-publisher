const { Spinner } = require('clui');
const git = require('simple-git/promise')();
const slugify = require('slugify');
const inquirer = require('./inquirer');
const { conf } = require('./conf');

module.exports = {
    setupNewBranch: async (path, issue) => {
        await git.cwd(path);
        const branch = slugify(`${issue.name}-${issue.value}`, {
            remove: /[[*+~.()'"!:@\]]/g,
        });
        await git.checkout([`-B${branch}`]);
        const research = await inquirer.newResearchQuestions(issue);
        return [branch, research.name];
    },

    cloneRepo: async (dest, repoFolder) => {
        const fullPath = `${dest}${repoFolder ? `/${repoFolder}` : ''}`;

        const status = new Spinner('Cloning 3327 research repository...');
        status.start();

        try {
            await git.clone(conf.get('repo.link'), fullPath);
            await git.cwd(fullPath);
        } catch (e) {
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
            await git.branch('main');
            await git.pull(conf.get('repo.link'), 'main');
        } finally {
            status.stop();
        }
    },

    checkoutBranch: async (path, branch) => {
        await git.cwd(path);
        await git.checkout(branch);
    },
};
