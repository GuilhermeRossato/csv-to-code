// CODE IN THIS TOOL DOES NOT FOLLOW BEST PRACTICES
// YOU PROCEED AT YOUR OWN RISK

window.addEventListener("load", () => {
    document.querySelectorAll(`input[type="checkbox"]`).forEach(el => el.onchange = onConvertClick);
});

function onConvertClick() {
    document.querySelector("#error").innerText = "";
    document.querySelectorAll('textarea')[1].style.backgroundColor = "rgb(255, 255, 242)";
    try {
        const language = document.querySelector('select#language').value;
        let columnSeparator = document.querySelector('#columnSeparator').value;
        if (columnSeparator === "\\n") {
            columnSeparator = "\n";
        } else if (columnSeparator === "\\t") {
            columnSeparator = "\t";
        }
        let lineSeparator = document.querySelector('#lineSeparator').value;
        if (lineSeparator === "\\n") {
            lineSeparator = "\n";
        } else if (lineSeparator === "\\t") {
            lineSeparator = "\t";
        }
        const quoteCharacter = document.querySelector('#quoteCharacter').value;
        const quoteInside = document.querySelector('#quoteInside').value;
        const includeLoop = document.querySelector('#includeLoop').checked;
        const stripLines = document.querySelector('#stripLines').checked;
        convert(
            document.querySelectorAll('textarea')[0],
            document.querySelectorAll('textarea')[1],
            language,
            columnSeparator,
            lineSeparator,
            quoteCharacter,
            quoteInside,
            includeLoop,
            stripLines
        );
        setTimeout(() => {
            document.querySelectorAll('textarea')[1].style.backgroundColor = "rgb(255, 255, 255)";
        }, 60);
    } catch (err) {
        document.querySelectorAll('textarea')[1].style.backgroundColor = "rgb(237, 237, 237)";
        document.querySelector("#error").innerText = err;
    }
}

function getFilePositionByIndex(source, index) {
    let line = 1;
    let column = 1;
    for (let i = 0; i < index; i++) {
        if (source[i] === '\n') {
            line++;
            column = 0;
        }
        column++;
    }
    return `Line ${line} and Col ${column}`;
}

function testTokenizer() {
    function testTokenizerOutput(content, expected) {
        const result = tokenizeCSV(content);
        if (expected.length !== result.length) {
            if (result.length === 0) {
                throw new Error(`${JSON.stringify(content)} => Expected ${expected.length} tokens but got none`);
            } else if (result.length + 1 === expected.length) {
                throw new Error(`${JSON.stringify(content)} => Expected ${expected.length} tokens but got one extra: ${JSON.stringify(result[result.length-1])}`);
            } else {
                throw new Error(`${JSON.stringify(content)} => Expected ${expected.length} tokens, got ${result.length}`);
            }
        }
        for (let i = 0; i < expected.length; i++) {
            for (let key in expected[i]) {
                if (expected[i][key] !== result[i][key]) {
                    throw new Error(`${JSON.stringify(content)} => Expected key '${key}' at token ${i} to be ${JSON.stringify(expected[i][key])}, got ${JSON.stringify(result[i][key])}`);
                }
            }
        }
        console.log(content, result);
    }

    testTokenizerOutput("h", [{type: "text", value: "h"}]);
    testTokenizerOutput("hello,world", [{type: "text", value: "hello"}, {type: "column-separator"}, {type: "text", value: "world"}]);
    testTokenizerOutput("hello,world\n", [{type: "text", value: "hello"}, {type: "column-separator"}, {type: "text", value: "world"}, {type: "line-separator"}]);
    testTokenizerOutput("hello,\"world\"", [{type: "text", value: "hello"}, {type: "column-separator"}, {type: "text", value: "world"}]);
    testTokenizerOutput("\"wo\"\"r\nld\",yes", [{type: "text", value: "wo\"r\nld"}, {type: "column-separator"}, {type: "text", value: "yes"}]);
    testTokenizerOutput(",,,", [{type: "column-separator", index: 0}, {type: "column-separator", index: 1}, {type: "column-separator", index: 2}]);
    testTokenizerOutput(",,a,", [{type: "column-separator", index: 0}, {type: "column-separator", index: 1}, {type: "text", value: "a", index: 2}, {type: "column-separator", index: 3}]);
    testTokenizerOutput("\"wh,at\",,\nhey,there", [{type: "text", index: 0, value: "wh,at"}, {type: "column-separator"}, {type: "column-separator"}, {type: "line-separator"}, {type: "text", value: "hey"}, {type: "column-separator"}, {type: "text", value: "there"}]);
    testTokenizerOutput("hey,hi\n\"is,csv\",\n\"is,csv\",\n", [{type: "text", index: 0, value: "hey"}, {type: "column-separator"}, {type: "text", value: "hi"}, {type: "line-separator"}, {type: "text", value: "is,csv"}, {type: "column-separator"}, {type: "line-separator"}, {type: "text", value: "is,csv"}, {type: "column-separator"}, {type: "line-separator"}]);
    testTokenizerOutput("hey,hi\n\"is,csv\",\n\"is,csv\",", [{type: "text", index: 0, value: "hey"}, {type: "column-separator"}, {type: "text", value: "hi"}, {type: "line-separator"}, {type: "text", value: "is,csv"}, {type: "column-separator"}, {type: "line-separator"}, {type: "text", value: "is,csv"}, {type: "column-separator"}]);
}