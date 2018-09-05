module.exports.getRegexCaptureAsArray = ({str, regexp}) => {
    let matches = [], test = [];
    while((test = regexp.exec(str))) {
        matches.push(test.slice(1));
    }
    return matches;
};

