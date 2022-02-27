#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {green} = require("chalk");
const fs = require('fs');
const touch = require("touch");

const {conf, files, github, repo, parser, compile, inquirer} = require('../lib/exports')


const setup = async () => {

    // load the current Repo into context
    let fields = ['remoteRepoLink', 'remoteRepoOwner', 'remoteRepoName', 'repo.installed', 'repo.path', 'repo.folder'];
    fields.map(field => conf.set(field, conf.get('REPO_DB')[conf.get('currentRepoId')][field]));

    // Check if repo is already configured
    if (!conf.get('repo.installed')) {
        console.log(chalk.red('3327 Research repository not set yet. Please set it up first.'));
        const pathAnswers = await inquirer.getPathForRepo(process.cwd());
        const {repoFolder} = await inquirer.getFolderForRepo(process.cwd());
        console.log(repoFolder);
        try {
            await repo.cloneRepo(pathAnswers.repoPath, repoFolder);
        } catch (e) {
            console.log(chalk.red(e.message));
        }

        console.log(green('Repository cloned at ' + pathAnswers.repoPath + '/' + repoFolder));

        conf.set('repo.installed', true);
        conf.set('repo.path', pathAnswers.repoPath + '/' + repoFolder);
        conf.set('repo.folder', repoFolder);
        conf.set('my-research', []);

        // update the REPO_DB to reflect the new changes
        const REPO_DB = conf.get('REPO_DB');
        fields = ['repo.installed', 'repo.path', 'repo.folder', 'my-research'];
        fields.map(field => REPO_DB[conf.get('currentRepoId')][field] = conf.get(field));
        conf.set('REPO_DB', REPO_DB);

    }

    const repoPath = conf.get('repo.path');

    //Check if directory really exists
    if (!files.directoryExists(repoPath)) {
        await repo.cloneRepo(repoPath);
        console.log(green('Repository cloned at ' + repoPath));
    }

}


module.exports = {

    setup

}
