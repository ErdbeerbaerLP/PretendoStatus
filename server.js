import express from "express";
import checkers from "./index.js";
import nodecallspython from "node-calls-python";
import fs from "fs";

const app = express();
const py = nodecallspython;
py.addImportPath("PretendoClients");
const pymodule = py.importSync("./status.py");

const min = 5;

let {
    DEVICE_ID,
    SERIAL_NUMBER,
    SYSTEM_VERSION,
    REGION_ID,
    COUNTRY_ID,
    REGION_NAME,
    COUNTRY_NAME,
    LANGUAGE,
    USERNAME,
    PASSWORD,
    CERT,
    DS_MAC_ADDRESS, DS_SERIAL_NUMBER,
    DS_REGION_ID, DS_COUNTRY_ID, DS_REGION_NAME,
    DS_LANGUAGE_ID, DS_DEVICE_CERT,DS_DEVICE_NAME, DS_PID, DS_PID_HMAC, DS_USERNAME, DS_NEX_PASSWORD
} = process.env;

DEVICE_ID = parseInt(DEVICE_ID);
SYSTEM_VERSION = parseInt(SYSTEM_VERSION, 16);
REGION_ID = parseInt(REGION_ID);

DS_REGION_ID = parseInt(DS_REGION_ID);
DS_LANGUAGE_ID = parseInt(DS_LANGUAGE_ID);

const argsWiiU = [
    DEVICE_ID, SERIAL_NUMBER, SYSTEM_VERSION,
    REGION_ID, COUNTRY_ID, REGION_NAME,
    COUNTRY_NAME, LANGUAGE, USERNAME,
    PASSWORD, CERT
];
const args3DS = [
    DS_MAC_ADDRESS, DS_SERIAL_NUMBER,
    DS_REGION_ID,
    DS_LANGUAGE_ID, DS_DEVICE_CERT,DS_DEVICE_NAME, DS_PID, DS_PID_HMAC, DS_NEX_PASSWORD
];

/** @type {Record<string, boolean>} */
const status = {
    "website": false,
    "forum": false,
    "accounts": false,
    "conntest": false,
    "juxtweb": false,
    "juxtwebbeta": false,
    "juxt": false,
    "sssl": false,

    "friends": false,
    "splatoon": false,
    "mk8": false,
    "smm": false,
    "minecraft": false,
    "pikmin3": false,
    "wiiuchat": false,
    "drluigi": false,
    "smashu": false,
    "tippingstars": false,
    "pokken": false,

    "mk7": false,
    "steeldiver": false,
    "smash3d": false,
    "luigi": false,
    "mh4u": false,
    "triforce": false,
    "icarus": false,
    "ironfall": false,
    "kirbyclash": false,
    "pokexy": false,
    "ykwblasters": false,
    "miraclecure": false,
    "rumbleworld": false,
};
// a bit of a crutch but whatever
const checked = {
    "website": false,
    "forum": false,
    "accounts": false,
    "conntest": false,
    "juxtweb": false,
    "juxtwebbeta": false,
    "juxt": false,
    "sssl": false,

    "friends": false,
    "splatoon": false,
    "mk8": false,
    "smm": false,
    "minecraft": false,
    "pikmin3": false,
    "wiiuchat": false,
    "drluigi": false,
    "smashu": false,
    "tippingstars": false,
    "pokken": false,

    "mk7": false,
    "steeldiver": false,
    "smash3d": false,
    "luigi": false,
    "mh4u": false,
    "triforce": false,
    "icarus": false,
    "ironfall": false,
    "kirbyclash": false,
    "pokexy": false,
    "ykwblasters": false,
    "miraclecure": false,
    "rumbleworld": false,
}
if(!fs.existsSync("recent.json"))
    fs.writeFileSync("recent.json", JSON.stringify({
        "website": [new Date(0), new Date(0)],
        "forum": [new Date(0), new Date(0)],
        "accounts": [new Date(0), new Date(0)],
        "conntest": [new Date(0), new Date(0)],
        "juxtweb": [new Date(0), new Date(0)],
        "juxtwebbeta": [new Date(0), new Date(0)],
        "juxt": [new Date(0), new Date(0)],
        "sssl": [new Date(0), new Date(0)],
        "friends": [new Date(0), new Date(0)],
        "splatoon": [new Date(0), new Date(0)],
        "mk8": [new Date(0), new Date(0)],
        "minecraft": [new Date(0), new Date(0)],
        "pikmin3": [new Date(0), new Date(0)],
        "wiiuchat": [new Date(0), new Date(0)],
        "drluigi": [new Date(0), new Date(0)],
        "smashu": [new Date(0), new Date(0)],
        "tippingstars": [new Date(0), new Date(0)],
        "pokken": [new Date(0), new Date(0)],
        "mk7": [new Date(0), new Date(0)],
        "steeldiver": [new Date(0), new Date(0)],
        "smash3d": [new Date(0), new Date(0)],
        "luigi": [new Date(0), new Date(0)],
        "mh4u": [new Date(0), new Date(0)],
        "triforce": [new Date(0), new Date(0)],
        "icarus": [new Date(0), new Date(0)],
        "ironfall": [new Date(0), new Date(0)],
        "kirbyclash": [new Date(0), new Date(0)],
        "pokexy": [new Date(0), new Date(0)],
        "ykwblasters": [new Date(0), new Date(0)],
        "miraclecure": [new Date(0), new Date(0)],
        "rumbleworld": [new Date(0), new Date(0)],
    }));
/** @type {Record<string, [Date, Date]>} */
let last = JSON.parse(fs.readFileSync("recent.json", "utf-8"));
for(const key of Object.keys(last)) {
    last[key][0] = new Date(last[key][0]);
    last[key][1] = new Date(last[key][1]);
}
console.log(last);

const checkOne = async (name, res) => {
    if(!res && (status[name] || !checked[name])) {
        last[name] = [new Date(), new Date(0)];
    } else if(res && last[name] != null && Number(last[name][1]) == 0) {
        last[name][1] = new Date();
    }
    status[name] = res;
    checked[name] = true;
};

const checkAll = async () => {
    if(process.env.DISABLE_CHECKING) return;
    await checkOne("website", await checkers.checkWebsite());
    await checkOne("forum", await checkers.checkForum());
    await checkOne("accounts", await checkers.checkAccounts());
    await checkOne("conntest", await checkers.checkConntest());
    await checkOne("juxtweb", await checkers.checkJuxtWeb());
    await checkOne("juxtwebbeta", await checkers.checkJuxtWeb());
    await checkOne("juxt", await checkers.checkJuxt());
    await checkOne("sssl", await py.call(pymodule, "sssl"));

    await checkOne("friends", await py.call(pymodule, "friends", ...argsWiiU));
    await checkOne("splatoon", await py.call(pymodule, "splatoon", ...argsWiiU));
    await checkOne("mk8", await py.call(pymodule, "mk8", ...argsWiiU));
    await checkOne("smm", await py.call(pymodule, "smm", ...argsWiiU));
    await checkOne("minecraft", await py.call(pymodule, "minecraft", ...argsWiiU));
    await checkOne("pikmin3", await py.call(pymodule, "pikmin3", ...argsWiiU));
    await checkOne("wiiuchat", await py.call(pymodule, "wiiuchat", ...argsWiiU));
    await checkOne("drluigi", await py.call(pymodule, "drluigi", ...argsWiiU));
    await checkOne("smashu", await py.call(pymodule, "smashu", ...argsWiiU));
    await checkOne("pokken", await py.call(pymodule, "pokken", ...argsWiiU));

    await checkOne("mk7", await py.call(pymodule, "mk7", ...args3DS));
    await checkOne("smash3d", await py.call(pymodule, "smash3d", ...args3DS));
    await checkOne("steeldiver", await py.call(pymodule, "steeldiver", ...args3DS));
    await checkOne("luigi", await py.call(pymodule, "luigi", ...args3DS));
    await checkOne("mh4u", await py.call(pymodule, "mh4u", ...args3DS));
    await checkOne("triforce", await py.call(pymodule, "triforce", ...args3DS));
    await checkOne("icarus", await py.call(pymodule, "icarus", ...args3DS));
    await checkOne("ironfall", await py.call(pymodule, "ironfall", ...args3DS));
    await checkOne("kirbyclash", await py.call(pymodule, "kirbyclash", ...args3DS));
    await checkOne("pokexy", await py.call(pymodule, "pokexy", ...args3DS));
    await checkOne("tippingstars", await py.call(pymodule, "tippingstars", ...args3DS));
    await checkOne("ykwblasters", await py.call(pymodule, "ykwblasters", ...args3DS));
    await checkOne("miraclecure", await py.call(pymodule, "miraclecure", ...args3DS));
    await checkOne("rumbleworld", await py.call(pymodule, "rumbleworld", ...args3DS));

    fs.writeFileSync("recent.json", JSON.stringify(last));
};

checkAll();
setInterval(checkAll, min * 60 * 1000);

const getStatusText = status => status
    ? "good"
    : "bad";
const getDateText = last => {
    if(last == null) return `No downtime recorded`
    const startTimestamp = new Date(last[0]);  // Convert the first timestamp to Date
    const endTimestamp = new Date(last[1]);    // Convert the second timestamp to Date

    const timeDiff = endTimestamp - startTimestamp; // Difference in milliseconds
    const totalMinutes = Math.round(timeDiff / 60000); // Convert milliseconds to minutes

    const hours = Math.floor(totalMinutes / 60);  // Full hours
    const minutes = totalMinutes % 60;  // Remaining minutes after full hours

    return Number(last[0]) == 0
    ? "No downtime recorded"
    : Number(last[1]) == 0
    ? `Since ${startTimestamp.toUTCString()}`
    : hours > 0
    ? `Last down ${endTimestamp.toUTCString()} (${hours} hours ${minutes} minutes)`
    : `Last down ${endTimestamp.toUTCString()} (${minutes} minutes)`;
}
app.get("/api/check/:service", (req, res) => {
    const { service } = req.params;
    if(!(service in status)) return res.status(404).end("not found");
    console.log(last);
    res.status(200)
        .end(getStatusText(status[service]) + "\n" + getDateText(last[service]));
});

app.use(express.static("html/"));

app.listen(process.env.PORT ?? 8089);
