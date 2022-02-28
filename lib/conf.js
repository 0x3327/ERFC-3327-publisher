const Configstore = require('configstore');
const { Octokit } = require("@octokit/rest");

const pkg = require('../package.json');
const conf = new Configstore(pkg.name);

let octokit = new Octokit({
    auth: conf.get('github.token')
});

// initialize the REPO_DB - all repo information will be stored here
if (!conf.get('REPO_DB')){
    conf.set('REPO_DB', [{
        'remoteRepoLink': 'git@github.com:bojinovic/test_name.git',
        'remoteRepoOwner': 'bojinovic',
        'remoteRepoName': 'test_name',

        'repo.installed': false,
        'repo.path': '',
        'repo.folder': '',
    }]);

    conf.set('currentRepoId', 0);
}


let fields = ['remoteRepoLink', 'remoteRepoOwner', 'remoteRepoName', 'repo.installed', 'repo.path', 'repo.folder', 'my-research'];


const loadStateFrom_REPO_DB = () => {

    fields.map(field => conf.set(field, conf.get('REPO_DB')[conf.get('currentRepoId')][field]));

}


conf.custStore = (key, value) => {

    const REPO_DB = conf.get('REPO_DB');

    REPO_DB[conf.get('currentRepoId')][key] = value;

    conf.set('REPO_DB', REPO_DB);

    conf.set(key, value);
}


module.exports = {

    conf,
    octokit,
    // storeStateTo_REPO_DB,
    loadStateFrom_REPO_DB

}
