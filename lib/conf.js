const Configstore = require('configstore');
const fs = require('fs');
const pkg = require('../package.json');
const defaultConf = require('../default-config.json');

const conf = new Configstore(pkg.name);

conf.custom = {
    loadState: () => {
        //Loads from the REPO_DB all of the fields for the current repo

        [
            'repo.link',
            'repo.installed',
            'repo.path',
            'repo.folder',
            'my-research',
        ].forEach((field) =>
            conf.set(
                field,
                conf.get('REPO_DB')[conf.get('currentRepoId')][field]
            )
        );
    },

    loadUserSettings: async () => {
        //Overwrites default configuration if user configuration is present at the root of project dir

        const userConfPath = `${conf.get('repo.path')}/erfc-config.json`;
        let userConf;

        if (fs.existsSync(userConfPath)) {
            userConf = JSON.parse(fs.readFileSync(userConfPath, 'utf8'));
        }

        ['milestone', 'reviewers', 'valid-reactions-count'].forEach((key) => {
            if (userConf && userConf['RP-issue'][key]) {
                conf.set(`RP-issue.${key}`, userConf['RP-issue'][key]);
            } else {
                conf.set(`RP-issue.${key}`, defaultConf['RP-issue'][key]);
            }
        });
    },
    store: (key, value) => {
        //Stores the key both in the current context but also in the REPO_DB

        const REPO_DB = conf.get('REPO_DB');
        REPO_DB[conf.get('currentRepoId')][key] = value;
        conf.set('REPO_DB', REPO_DB);
        conf.set(key, value);
    },
};

module.exports = {
    conf,
};
