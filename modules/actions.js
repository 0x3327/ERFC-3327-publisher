const chalk = require('chalk');
const fs = require('fs');
const touch = require('touch');
const fse = require('fs-extra');
const { exec } = require('child_process');

const {
    conf,
    github,
    repo,
    parser,
    compile,
    inquirer,
    utils,
} = require('../lib/exports');

const setupNewResearch = async () => {
    //Creates a new branch and sets up all template files needed

    const repoPath = conf.get('repo.path');

    const [issues, authUser] = await github.getIssues();
    const issueAnswer = await inquirer.selectResearchProposal(issues);
    const issue = issues.find((o) => o.value === issueAnswer.proposal);
    const [branch, researchName] = await repo.setupNewBranch(repoPath, issue);

    console.log(chalk.yellow(`Switching to new branch ${branch}`));

    //creating assets directory
    try {
        fs.mkdirSync(`${repoPath}/assets/ERFC-${issue.value}`);
        touch(`${repoPath}/assets/ERFC-${issue.value}/.gitignore`);
    } catch (e) {
        //we already have a directory
    } finally {
        console.log(chalk.yellow('Created assets directory'));
    }

    //creating template file
    fs.copyFileSync(
        `${repoPath}/ERFC-research-template.md`,
        `${repoPath}/_research/ERFC-${issue.value}.md`
    );
    console.log(chalk.green('Research template set:'));
    console.log(chalk.cyan(`${repoPath}/_research/ERFC-${issue.value}.md`));

    await parser.parseResearchTemplate(
        `${repoPath}/_research/ERFC-${issue.value}.md`,
        researchName,
        authUser.data.name,
        issue.value
    );

    console.log(chalk.green('Research assets folder created:'));
    console.log(chalk.cyan(`${repoPath}/assets/ERFC-${issue.value}`));
    const research = {
        name: `ERFC-${issue.value}`,
        number: issue.value,
        title: researchName,
        branch,
    };

    //check if research is already in the storage, if not, add it
    if (
        !conf
            .get('my-research')
            .filter((single) => single.number === research.number).length
    ) {
        conf.custom.store('my-research', [
            ...conf.get('my-research'),
            research,
        ]);
    }

    console.log(chalk.green('All done. Happy writing!'));
};

const updateConf = async () => {
    //Adds a new remote repo to the publisher config or selects between already available ones

    const answer = await inquirer.changeConf();

    if (answer.action === 'addremoterepo') {
        const { repoLink } = await inquirer.addRemoteRepo();

        const REPO_DB = conf.get('REPO_DB');

        const newEntry = {
            'repo.link': repoLink,
            'repo.installed': false,
            'repo.path': '',
            'repo.folder': '',
        };

        conf.set('REPO_DB', REPO_DB.concat(newEntry));

        conf.set('currentRepoId', conf.get('REPO_DB').length - 1);

        console.log('Added and switched to the new Working DIR');
    }

    if (answer.action === 'switchrepo') {
        const repoPaths = conf.get('REPO_DB').map((el) => el['repo.path']);

        const { repoPath } = await inquirer.selectWorkingRepo(repoPaths);

        const repoId = repoPaths.indexOf(repoPath);

        conf.set('currentRepoId', repoId);

        console.log(`New Working DIR: ${repoPath}`);
    }
};

const processCmd = async () => {
    //Handles the user's selections of actions

    console.log(`Working DIR: ${conf.get('repo.path')}\n`);

    const answers = await inquirer.askWhatToDo();

    //Quit the publisher
    if (answers.action === 'quit') {
        process.exit();
    }

    const repoPath = conf.get('repo.path');
    await repo.pullRepo(repoPath);

    //Setup a new research
    if (answers.action === 'setupnew') {
        await setupNewResearch();
    }

    //Compile a research
    if (answers.action === 'compileresearch') {
        const answer = await inquirer.selectResearch(conf.get('my-research'));
        await repo.checkoutBranch(repoPath, answer.research.branch);
        await compile.processResearch(
            `${repoPath}`,
            `${answer.research.name}.md`
        );
        await utils.delay(2000);
    }

    //Publishing research
    if (answers.action === 'publishresearch') {
        const answer = await inquirer.selectResearch(conf.get('my-research'));
        await compile.publishResearch(repoPath, answer.research);
        console.log(
            chalk.green('Published research as pull request. All done!')
        );
        await utils.delay(3000);
    }

    //Synchronize repo
    if (answers.action === 'syncrepo') {
        await compile.fetchAll(repoPath);
        console.log(chalk.green('Synchronised repository. All done!'));
    }

    //Creates a presentation folder and copies the template in it
    if (answers.action === 'createpresentation') {
        const answer = await inquirer.selectResearch(conf.get('my-research'));
        const [, authUser] = await github.getIssues();
        const presentationPath = `${repoPath}/presentations/${answer.research.name}`;
        //If the directory exists, do nothing
        if (fs.existsSync(presentationPath)) {
            console.log(chalk.yellow('Presentation directory already exists.'));
            await utils.delay(1000);
            await inquirer.pressEnterToContinue();
        }
        //If a directory doesn't exist, make one
        fs.mkdirSync(presentationPath);

        fse.copySync(
            `${repoPath}/presentations/3327-presentations-template`,
            `${presentationPath}`
        );
        fs.renameSync(
            `${presentationPath}/presentation_template.qmd`,
            `${presentationPath}/${answer.research.name}-presentation.qmd`
        );

        console.log(
            chalk.yellow(
                `Created presentation directory at: ${presentationPath}`
            )
        );

        await parser.parsePresentationTemplate(
            `${presentationPath}/${answer.research.name}-presentation.qmd`,
            answer.research.name,
            answer.research.title,
            authUser.data.name
        );
    }

    //Runs Quarto preview on the selected presentation. Preview renders the work by default.
    if (answers.action === 'compilepresentation') {
        const answer = await inquirer.selectResearch(conf.get('my-research'));

        exec(
            `quarto preview ${answer.research.name}-presentation.qmd`,
            { cwd: `${repoPath}/presentations/${answer.research.name}` },
            console.log(
                chalk.yellow(
                    "Nothing to compile. Presentation directory doesn't exist"
                )
            )
        );
    }

    if (answers.action === 'changecfg') {
        await updateConf();
    }

    await utils.delay(1000);

    await inquirer.pressEnterToContinue();
};

module.exports = {
    processCmd,
};
