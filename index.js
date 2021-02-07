const core = require('@actions/core');
// const github = require('@actions/github');
const fetch = require('node-fetch');
const FormData = require('form-data');

const api = "https://api.futureland.tv"; 

const prependZero = (num =>  num.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  }));


try {
    const journalName = core.getInput('publish-to') || "";
    const message = core.getInput('publish-message') || "Default publish message";
    const token = core.getInput('fl-credential') || "";

    // get the user's journals so we can get the id of the one to publish to 
    fetch(`${api}/users/log`, { method: 'GET', headers: { "Cookie": `token=${token};`, "Content-Type": "application/json" } })
    .then(res => res.json())
    .then(journals => {

        if (journals.message) throw new Error("Bad Futureland credential");

        const journal = journals.find(j => j.title.toLowerCase() === journalName.toLowerCase());

        if (journal === undefined) throw new Error(`Couldn't find journal "${journalName}"`)

        const now = new Date();

        const form = new FormData();
        form.append('notes', message);
        form.append('streakDate', `${now.getFullYear()}-${prependZero(now.getMonth())}-${prependZero(now.getDate())}`);
        form.append('journal_id', `${journal.id}`);
        form.append('private', `${journal.private}`);
        form.append('file', "undefined");

        // send it 
        fetch(`${api}/entries`, { method: 'POST', body: form, headers: { Cookie: `token=${token};` } })
        .then(res => res.json())
        .then(json => {
            // console.log(json)
        })
    })
} catch (error) {
    // core.setFailed(error.message);
    console.log(error)
}