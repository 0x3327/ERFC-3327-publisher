#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {green} = require("chalk");
const fs = require('fs');
const touch = require("touch");

const {conf, files, github, repo, parser, compile, inquirer, loadStateFrom_REPO_DB} = require('../lib/exports')


const setup = async () => {

    loadStateFrom_REPO_DB();

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

        conf.custStore('repo.installed', true);
        conf.custStore('repo.path', pathAnswers.repoPath + '/' + repoFolder);
        conf.custStore('repo.folder', repoFolder);
        conf.custStore('my-research', []);

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
