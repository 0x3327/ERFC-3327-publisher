#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {green} = require("chalk");
const fs = require('fs');
const touch = require("touch");
const {files, github, repo, parser, compile, inquirer} = require('../lib/exports')


const getGithubToken = async () => {
    // Fetch token from config store
    let token = github.getStoredGithubToken();
    if (token) {
        return token;
    }

    console.log(chalk.red('Please connect your GitHub account first'));

    // No token found, use credentials to access GitHub account
    console.log(green('Connecting your GitHub account'));
    token = await github.getPersonalAccessToken();

    return token;
};


const authenticate = async () => {

    // Retrieve & Set Authentication Token
    const token = await getGithubToken();
    return github.githubAuth(token);

}


module.exports = {

    authenticate



}
