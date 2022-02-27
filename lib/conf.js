const Configstore = require('configstore');
const { Octokit } = require("@octokit/rest");

const pkg = require('../package.json');
const conf = new Configstore(pkg.name);

let octokit = new Octokit({
    auth: conf.get('github.token')
});

// const DEFAULT_REMOTE_REPO_CONFIG = {
//
//     'repoPath': 'git@github.com:bojinovic/test_name.git',
//     'owner': 'bojinovic',
//     'repo': 'test_name',
//     'repoFolder': '/TEST_REPO'
//
// }
//
// if(!conf.get('remoteRepo')){
//
//     conf.set('remoteRepo', DEFAULT_REMOTE_REPO_CONFIG);
//
// }

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




module.exports = {

    conf,
    octokit

}
