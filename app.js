const path = require("path");
const fs = require("fs");
const util = require('util');
const chalk = require("chalk");
const getUserInput = require("./lib/getUserInput.js");
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const TEMPLATE_DIR = path.resolve(__dirname, "templates");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

function copyCSS() {
    console.log
    fs.copyFile(path.join(TEMPLATE_DIR, "style.css"), path.join(OUTPUT_DIR, "style.css"), (err) => {
        if (err) throw err;
    });
}

async function promptTeamInfo() {
    const teamList = await getUserInput.promptTeamInfo();
    if (teamList) {
        // use the employee list to generate a HTML file
        const html = render(teamList);
        // chech the directory exists, if not create it
        console.log(OUTPUT_DIR)
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }
        await writeFileAsync(outputPath, html, "utf8");
        // copy the style.css file.
        copyCSS();
        console.log(chalk.green(`Successfully generated the team file.`, chalk.magenta(` \nSee here: ${outputPath}`)));
    }
}

promptTeamInfo();