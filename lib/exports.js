const { conf } = require('./conf');
const files = require('./files');
const github = require('./github');
const repo = require('./repo');
const parser = require('./parse');
const compile = require('./run');
const inquirer = require('./inquirer');
const utils = require('./utils');

module.exports = {
    conf,
    files,
    github,
    repo,
    parser,
    compile,
    inquirer,
    utils,
};
