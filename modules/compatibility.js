const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {green} = require("chalk");
const fs = require('fs');
const touch = require("touch");



const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);


const run = () => {


    if (conf.get('erfc-version') != '2') {

        if (conf.get('repo.installed')) {

            conf.set('REPO_DB', [{
                'remoteRepoLink': 'git@github.com:0x3327/3327-operations.git',
                'remoteRepoOwner': '0x3327',
                'remoteRepoName': '3327-operations',

                'repo.installed': true,
                'repo.path': conf.get('repo.path'),
                'repo.folder': '3327-research',

                'my-research': conf.get('my-research')
            }]);


        } else {

            conf.set('REPO_DB', [{
                'remoteRepoLink': 'git@github.com:0x3327/3327-operations.git',
                'remoteRepoOwner': '0x3327',
                'remoteRepoName': '3327-operations',

                'repo.installed': false,
                'repo.path': '',
                'repo.folder': '',

                'my-research': []
            }]);

        }

        conf.set('currentRepoId', 0);

        conf.set('erfc-version', '2');

    }

}



module.exports = { run };
