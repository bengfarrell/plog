module.exports = function(status) {
    status = status.replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g, '  '); // replace all new lines (and friends) with double space

    let result = {
        status: status
    };

    const isValidHashStart = function(status, index) {
        if (index === 0 && status.charAt(hashStartIndex) !== ' ') {
            // # does not have a space after it and # is at beginning of string
            return true;
        } else if (status.charAt(hashStartIndex) !== ' ' && status.charAt(hashStartIndex - 2) === ' ') {
            // # does not have a space after it and # is preceded by space
            return true;
        }
        return false;
    };

    const isValidHashEnd = function(status, index) {
        if (index === status.length && status.charAt(index-1) !== ' ') {
            // # does not have a space before it and # is at end of string
            return true;
        } else if (status.charAt(index-1) !== ' ' && status.charAt(index + 1) === ' ') {
            // # does not have a space before it and # does have a space after it
            return true;
        }
        return false;
    };

    const hashtags = [];
    let hashStartIndex = status.indexOf('#');

    while (hashStartIndex !== -1) {
        hashStartIndex ++; // hash found, move up a char to look for next signal
        if (isValidHashStart(status, hashStartIndex)) {
            let endHash = status.length;

            if (isValidHashEnd(status, status.indexOf('#', hashStartIndex))) {
                // if next hash is a valid end hash, use it
                endHash = status.indexOf('#', hashStartIndex);
            } else if (status.indexOf(' ', hashStartIndex) !== -1) {
                // use next space to signify end
                endHash = status.indexOf(' ', hashStartIndex);
            }

            hashtags.push(status.substring(hashStartIndex, endHash));
            hashStartIndex = status.indexOf('#', endHash +1);
        } else {
            // isolated hash tag, ignore it, move on searching starting the next char
            hashStartIndex = status.indexOf('#', hashStartIndex);
        }
    }

    hashtags.forEach( tag => {
        tag = tag.substring(0, tag.length); // kill hash

        if (tag.indexOf('=') !== -1) {
            const key = tag.split('=')[0];
            let value = tag.split('=')[1];
            if (value == Number(value)) { value = Number(value) }
            result[key] = value;
        } else {
            result[tag] = true;
        }
    });
    return result;
};
