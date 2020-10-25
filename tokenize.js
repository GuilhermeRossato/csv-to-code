// CODE IN THIS TOOL DOES NOT FOLLOW BEST PRACTICES
// YOU PROCEED AT YOUR OWN RISK

/**
 * @returns {({type: 'text', value: string, index: number} | {type: 'column-separator', index: number} | {type: 'line-separator', index: number})[]}
 */
function tokenizeCSV(source, columnSeparator = ',', lineSeparator = "\n", quoteCharacter = '"', quoteInside = '""') {
    const tokens = [];
    let limiter = 100 + source.length * 3;
    for (let i = 0; i < source.length; i++) {
        if (limiter <= 0) {
            throw new Error("Too many loops at index " + i);
            break;
        } else {
            limiter--;
        }
        const isLastTokenColumnSeparator = !tokens[tokens.length-1] || (tokens[tokens.length-1] && (tokens[tokens.length-1].type === "column-separator" || tokens[tokens.length-1].type === "line-separator"));

        const isTokenQuoteCharacter = source.substr(i, quoteCharacter.length) === quoteCharacter;
        if (isTokenQuoteCharacter) {
            tokens.push({
                type: "text",
                value: "",
                index: i
            });
            for (i += quoteCharacter.length; i < source.length; i++) {
                if (limiter <= 0) {
                    throw new Error("Too many loops at index " + i);
                    break;
                } else {
                    limiter--;
                }
                const isTokenInsideQuote = source.substr(i, quoteInside.length) === quoteInside;
                if (isTokenInsideQuote) {
                    tokens[tokens.length-1].value += '"';
                    i+= quoteInside.length-1;
                    continue;
                }
                const isExitToken = source.substr(i, quoteCharacter.length) === quoteCharacter;
                if (isExitToken) {
                    break;
                }
                tokens[tokens.length-1].value += source[i];
            }
            if (i >= source.length) {
                throw new Error(`Unclosed quote character starting at ${getFilePositionByIndex(source, i)}`);
            }
        } else {
            let hasAddedToken = false;
            for (; i < source.length; i++) {
                if (limiter <= 0) {
                    throw new Error("Too many loops at index " + i);
                    break;
                } else {
                    limiter--;
                }
                const isColumnSeparator = source.substr(i, columnSeparator.length) === columnSeparator;
                if (isColumnSeparator) {
                    tokens.push({
                        type: "column-separator",
                        index: i
                    });
                    i += columnSeparator.length;
                    break;
                }
                const isTokenNewLine = source.substr(i, lineSeparator.length) === lineSeparator;
                if (isTokenNewLine) {
                    tokens.push({
                        type: "line-separator",
                        index: i
                    });
                    i += lineSeparator.length;
                    break;
                }
                if (!hasAddedToken) {
                    hasAddedToken = true;
                    tokens.push({
                        type: "text",
                        value: "",
                        index: i
                    });
                }
                tokens[tokens.length-1].value += source[i];
            }
            i--;
        }
        continue;
    }
    return tokens;
}
