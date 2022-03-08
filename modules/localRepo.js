const chalk = require('chalk');
const { conf, files, repo, inquirer } = require('../lib/exports');

const setup = async () => {
    //Checks if the current repo selected is installed and if not it sets it up

    conf.custom.loadState();

    //Check if repo is already configured
    if (!conf.get('repo.installed')) {
        console.log(
            chalk.red(
                '3327 Research repository not set yet. Please set it up first.'
            )
        );
        const pathAnswers = await inquirer.getPathForRepo(process.cwd());
        const { repoFolder } = await inquirer.getFolderForRepo(process.cwd());

        try {
            await repo.cloneRepo(pathAnswers.repoPath, repoFolder);
        } catch (e) {
            console.log(chalk.red(e.message));
        }

        console.log(
            chalk.green(
                `Repository cloned at ${pathAnswers.repoPath}/${repoFolder}`
            )
        );

        conf.custom.store('repo.installed', true);
        conf.custom.store('repo.path', `${pathAnswers.repoPath}/${repoFolder}`);
        conf.custom.store('repo.folder', repoFolder);
        conf.custom.store('my-research', []);
    }

    const repoPath = conf.get('repo.path');

    //Check if directory really exists
    if (!files.directoryExists(repoPath)) {
        await repo.cloneRepo(repoPath);
        console.log(chalk.green(`Repository cloned at ${repoPath}`));
    }

    conf.custom.loadUserSettings();
};

module.exports = {
    setup,
};
