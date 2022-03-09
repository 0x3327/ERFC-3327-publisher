const pkg = require('../package.json');
const defaultConf = require('../default-config.json');
const { conf } = require('../lib/exports');

const run = () => {
    //If user has already installed the publisher it updates the configuration to be compatible with the new version

    if (!conf.get('erfc-version')) {
        if (conf.get('repo.installed')) {
            conf.set('REPO_DB', [
                {
                    'repo.link': defaultConf.repo.link,
                    'repo.installed': true,
                    'repo.path': conf.get('repo.path'),
                    'repo.folder': '3327-research',

                    'my-research': conf.get('my-research'),
                },
            ]);
        } else {
            conf.set('REPO_DB', [
                {
                    'repo.link': defaultConf.repo.link,
                    'repo.installed': false,
                    'repo.path': '',
                    'repo.folder': '',

                    'my-research': [],
                },
            ]);
        }

        conf.set('currentRepoId', 0);
        conf.set('erfc-version', pkg.version);
    }
};

module.exports = { run };
