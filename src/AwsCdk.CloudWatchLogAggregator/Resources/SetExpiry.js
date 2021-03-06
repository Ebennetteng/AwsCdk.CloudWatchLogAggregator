﻿// Code taken from here: https://github.com/theburningmonk/lambda-logging-kinesis-demo/blob/master/functions/set-retention/handler.js

const AWS = require('aws-sdk');
const cloudWatchLogs = new AWS.CloudWatchLogs();
const retentionDays = process.env.retention_days;
const prefix = process.env.prefix;

const setExpiry = async (logGroupName) => {
    let params = {
        logGroupName: logGroupName,
        retentionInDays: retentionDays
    };

    await cloudWatchLogs.putRetentionPolicy(params).promise();
};

module.exports.handler = async (event, context) => {
    console.log(JSON.stringify(event));

    const logGroupName = event.detail.requestParameters.logGroupName;
    console.log(`log group: ${logGroupName}`);

    if (prefix && !logGroupName.startsWith(prefix)) {
        console.log(`ignoring the log group [${logGroupName}] because it doesn't match the prefix [${prefix}]`);
    } else {
        await setExpiry(logGroupName);
        console.log(`updated [${logGroupName}]'s retention policy to ${retentionDays} days`);
    }
};
