// CODE IN THIS TOOL DOES NOT FOLLOW BEST PRACTICES
// YOU PROCEED AT YOUR OWN RISK

/**
 * @param {string} source
 * @param {({type: 'text', value: string, index: number} | {type: 'column-separator', index: number} | {type: 'line-separator', index: number})[]} tokens
 * @returns {{headers: string[], rows: string[][]}}
 */
function listifyCSV(source, tokens) {
    const headers = [];
    const rows = [];
    let row = [];
    let state = "parsing-header"
    for (let token of tokens) {
        if (token.type === "text") {
            if (state === "parsing-header") {
                let key = token.value;
                if (!headers.includes(key)) {
                    headers.push(key);
                } else {
                    let index = 2;
                    while (headers.includes(key + index.toString())) {
                        index++;
                    }
                    headers.push(key + index.toString());
                }
                state = "expecting-header-separator";
            } else if (state === "parsing-data") {
                row.push(token.value);
                state = "expecting-separator";
            } else {
                throw new Error(`Unexpected text at state "${state}" at ${getFilePositionByIndex(source, token.index)}: ${JSON.stringify(token)}`);
            }
        } else if (token.type === "column-separator") {
            if (state === "parsing-header") {
                let key = headers.length.toString();
                if (!headers.includes(key)) {
                    headers.push(key);
                } else {
                    let index = 2;
                    while (headers.includes(key + index.toString())) {
                        index++;
                    }
                    headers.push(key + index.toString());
                }
                state = "parsing-header";
            } else if (state === "expecting-header-separator") {
                state = "parsing-header";
            } else if (state === "expecting-separator") {
                state = "parsing-data";
            } else if (state === "parsing-data") {
                row.push("");
            } else {
                throw new Error(`Unexpected column separator token at state "${state}" at ${getFilePositionByIndex(source, token.index)}: ${JSON.stringify(token)}`);
            }
        } else if (token.type === "line-separator") {
            if (state === "parsing-header") {
                let key = headers.length.toString();
                if (!headers.includes(key)) {
                    headers.push(key);
                } else {
                    let index = 2;
                    while (headers.includes(key + index.toString())) {
                        index++;
                    }
                    headers.push(key + index.toString());
                }
                state = "parsing-data";
            } else if (state === "expecting-header-separator") {
                state = "parsing-data";
            } else if (state === "expecting-separator" || state === "parsing-data") {
                rows.push(row);
                row = [];
                state = "parsing-data";
            } else {
                throw new Error(`Unexpected column separator token at state "${state}" at ${getFilePositionByIndex(source, token.index)}: ${JSON.stringify(token)}`);
            }
        } else {
            throw new Error(`Unknown token type ${JSON.stringify(token.type)} at ${getFilePositionByIndex(source, token.index)}`);
        }
    }
    if (row.length !== 0) {
        rows.push(row);
    }
    let len = headers.length || null;
    let warning;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (len === null) {
            len = row.length;
        } else if (row.length !== len) {
            warning = `CSV entry ${i+1} has only ${row.length} columns, but header implies there should be ${len} columns`;
            break;
        }
    }
    return {
        headers,
        rows,
        warning
    };
}
