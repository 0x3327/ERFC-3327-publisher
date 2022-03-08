const chalk = require('chalk');
const { github, conf } = require('../lib/exports');

const getGithubToken = async () => {
    //Fetch token from config store

    let token = conf.get('github.token');
    if (token) {
        return token;
    }

    console.log(chalk.red('Please connect your GitHub account first'));

    //No token found, use credentials to access GitHub account
    console.log(chalk.green('Connecting your GitHub account'));
    token = await github.getPersonalAccessToken();

    return token;
};

const authenticate = async () => {
    //Retrieve & Set Authentication Token

    const token = await getGithubToken();
    return github.githubAuth(token);
};

module.exports = {
    authenticate,
};
