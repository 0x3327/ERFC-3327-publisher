#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const {green} = require("chalk");
const fs = require('fs');
const touch = require("touch");


const {conf, files, github, repo, parser, compile, inquirer} = require('../lib/exports')

const setupNewResearch = async () => {

    const repoPath = conf.get('repo.path');

    const [issues, authUser] = await github.getIssues();
    const issueAnswer = await inquirer.selectResearchProposal(issues);
    const issue = issues.find(o => o.value === issueAnswer.proposal);
    const [branch, researchName]
        = await repo.setupNewBranch(repoPath, issue);

    console.log(chalk.yellow(`Switching to new branch ${branch}`));


    // creating assets directory
    try {
        fs.mkdirSync(repoPath + `/assets/ERFC-${issue.value}`);
        touch(repoPath + `/assets/ERFC-${issue.value}/.gitignore`);
    } catch (e) {
        // we already have a directory
    } finally {
        console.log(chalk.yellow('Created assets directory'));
    }

    // creating template file
    fs.copyFileSync(repoPath + '/ERFC-research-template.md'
        , repoPath + '/_research/' + `ERFC-${issue.value}.md`)
    console.log(chalk.green('Research template set:'));
    console.log(chalk.cyan(repoPath + '/_research/' + `ERFC-${issue.value}.md`));

    await parser
        .parseResearchTemplate(
            repoPath + `/_research/ERFC-${issue.value}.md`,
            researchName,
            authUser.data.name,
            issue.value
        );

    console.log(chalk.green('Research assets folder created:'));
    console.log(chalk.cyan(repoPath + `/assets/ERFC-${issue.value}`));
    const research = {
        name: `ERFC-${issue.value}`,
        number: issue.value,
        title: researchName,
        branch
    };

    //check if research is already in the storage, if not, add it
    if (!conf.get('my-research').filter(
        single => single['number'] === research.number
    ).length) {
        conf.custStore('my-research', [...conf.get('my-research'), research]);
    }

    console.log(chalk.green('All done. Happy writing!'));

}


const updateConf = async () => {

    const answer = await inquirer.changeConf();

    if (answer.action === 'addremoterepo') {

        const {remoteRepoLink} = await inquirer.addRemoteRepo();
        const remoteRepoOwner = remoteRepoLink.split(':')[1].split('/')[0];
        let remoteRepoName = remoteRepoLink.split(':')[1].split('/')[1];
        remoteRepoName = remoteRepoName.substring(0, remoteRepoName.length - 4);

        const REPO_DB = conf.get('REPO_DB');

        const newEntry = {
            remoteRepoLink,
            remoteRepoOwner,
            remoteRepoName,
            'repo.installed': false,
            'repo.path': '',
            'repo.folder': ''
        }

        conf.set('REPO_DB', REPO_DB.concat(newEntry));

        conf.set('currentRepoId', conf.get('REPO_DB').length - 1);

        console.log(`Added and switched to the new Working DIR`)

    }

    if (answer.action === 'switchrepo') {

        const repoPaths = conf.get('REPO_DB').map(el => el['repo.path']);

        const {repoPath} = await inquirer.selectWorkingRepo(repoPaths);

        const repoId = repoPaths.indexOf(repoPath);

        conf.set('currentRepoId', repoId);

        console.log(`New Working DIR: ${repoPath}`);
    }

}

const processCmd = async () => {

    console.log(`Working DIR: ${conf.get('repo.path')}\n`)

    const answers = await inquirer.askWhatToDo();

    // Quit the publisher
    if (answers.action === 'quit') {
        process.exit()
    }

    const repoPath = conf.get('repo.path');
    await repo.pullRepo(repoPath)

    //Setup a new research
    if (answers.action === 'setupnew') {
        await setupNewResearch();
    }

    //Compile a research
    if (answers.action === 'compileresearch') {
        const answer = await inquirer.selectResearch(conf.get('my-research'));
        await repo.checkoutBranch(repoPath, answer.research.branch);
        await compile.processResearch(`${repoPath}`, `${answer.research.name}.md`)

        await new Promise(function(resolve){ setTimeout(resolve, 2000);});

    }

    //Publishing research
    if (answers.action === 'publishresearch') {
        const answer = await inquirer.selectResearch(conf.get('my-research'));
        await compile.publishResearch(repoPath, answer.research)
        console.log(green('Published research as pull request. All done!'));
    }

    //Synchronize repo
    if (answers.action === 'syncrepo') {
        await compile.fetchAll(repoPath);
        console.log(green('Synchronised repository. All done!'));
    }

    //Presentations
    //TODO: Implement presentations when presentation template is ready
    if (answers.action === 'createpresentation' || answers.action === 'compilepresentation') {
        console.log(chalk.red('Presentations are not yet implemented'))
    }

    if (answers.action === 'changecfg') {

        await updateConf();
    }

    await new Promise(function(resolve){ setTimeout(resolve, 2000);});

    await inquirer.pressEnterToContinue();

};

module.exports = {

    processCmd

}
