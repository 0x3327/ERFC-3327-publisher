const _ = require('lodash');
const fs = require('fs');

module.exports = {
    parseResearchTemplate: (file, title, author, number) => {
        let fl = fs.readFileSync(file, 'utf8');

        fl = _.replace(fl, 'Research Title', title);
        fl = _.replace(fl, 'Nikola Tesla', author);
        fl = _.replace(fl, '3327', number);
        fl = _.replace(fl, '01/01/2022', new Date(_.now()).toLocaleDateString("en-US"));
        fs.writeFileSync(file, fl);
    }
};
