const files = require('./files');
const github = require('./github');
const repo = require('./repo');
const parser = require('./parse');
const compile = require('./run');
const inquirer = require('./inquirer');

module.exports = {
    ...require('./conf'),
    files,
    github,
    repo,
    parser,
    compile,
    inquirer
}
