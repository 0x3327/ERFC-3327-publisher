const _ = require('lodash');
const fs = require('fs');

module.exports = {
    parseResearchTemplate: (file, title, author, number) => {
        let fl = fs.readFileSync(file, 'utf8');

        fl = _.replace(fl, 'Research Title', title);
        fl = _.replace(fl, 'Nikola Tesla', author);
        fl = _.replace(fl, '3327', number);
        fl = _.replace(
            fl,
            '01/01/2022',
            new Date(_.now()).toLocaleDateString('en-US')
        );
        fs.writeFileSync(file, fl);
    },

    parseRemoteRepoLink: (link) => {
        //Extracts the owner and the name of the repo

        const owner = link.split(':')[1].split('/')[0];
        let repo = link.split(':')[1].split('/')[1];
        repo = repo.substring(0, repo.length - 4);

        return { link, owner, repo };
    },

    parsePresentationTemplate: (file, title, subtitle, author) => {
        let pr = fs.readFileSync(file, 'utf8');

        pr = _.replace(pr, '3327 Presentation', title);
        pr = _.replace(pr, 'Available slides', subtitle);
        pr = _.replace(pr, 'Nikola Tesla', author);

        fs.writeFileSync(file, pr);
    },
};
