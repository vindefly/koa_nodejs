const path = require('path');
const fs = require('fs');

function get_json_data(json_file) {
    try {
        if (fs.existsSync(path.join(__dirname, '../' + json_file))) {
            return JSON.parse(fs.readFileSync(path.join(__dirname, '../' + json_file)));
        } else {
            return null;
        }

    } catch (err) {
        console.log('get_json_data === ', err);
        return null;
    }
}

module.exports = get_json_data;