// CODE IN THIS TOOL DOES NOT FOLLOW BEST PRACTICES
// YOU PROCEED AT YOUR OWN RISK
function convert(source, target, language, columnSeparator = ',', lineSeparator = "\n", quoteCharacter = '"', quoteInside = '""', includeLoop = false, stripLines = false) {
    if (typeof columnSeparator !== "string" || typeof lineSeparator !== "string") {
        throw new Error("Could not interpret csv separator character");
    }
    const tokens = tokenizeCSV(source.value);
    if (tokens.length === 0) {
        throw new Error("Could not interpret CSV or it is empty");
    }
    const { headers, rows, warning } = listifyCSV(source.value, tokens);
    if (headers.length === 0) {
        throw new Error("Could not extract headers from csv tokens (" + tokens.length + ")");
    } else if (rows.length === 0) {
        throw new Error("Could not extract rows from csv tokens (" + tokens.length + ")");
    }
    const csv = objectifyCSV(headers, rows);
    if (csv.length === 0) {
        throw new Error("Transformation of header and rows to object returned empty set!");
    }
    if (language === "PHP") {
        target.value = "$data = [";
        let isFirstRow = true;
        for (let row of csv) {
            target.value += `${isFirstRow ? "" : ","}\n\t[\n`;
            isFirstRow = false;
            const keys = Object.keys(row);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const isLastKey = i+1 === keys.length;
                target.value += `\t\t\"${key.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/(\n)/g, "\\n")}\" => \"${row[key].replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/(\n)/g, "\\n")}\"${isLastKey ? "" : ","}\n`;
            }
            target.value += `\t]`;
        }
        target.value += "\n];\n";
        if (includeLoop) {
            target.value += `\nforeach ($data as $index => $row) {\n\techo $index . PHP_EOL;\n\tforeach ($row as $key => $value) {\n\t\techo "\\t" . $key . " = " . $value . PHP_EOL;\n\t}\n}\n`;
        }
    } else if (language === "JS") {
        target.value = "const data = " + JSON.stringify(csv, null, "\t")+";\n";
        /*
        let isFirstRow = true;
        for (let row of csv) {
            target.value += `${isFirstRow ? "" : ","}\n\t[\n`;
            isFirstRow = false;
            const keys = Object.keys(row);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const isLastKey = i+1 === keys.length;
                target.value += `\t\t\"${key.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/(\n)/g, "\\n")}\": \"${row[key].replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/(\n)/g, "\\n")}\"${isLastKey ? "" : ","}\n`;
            }
            target.value += `\t]`;
        }
        target.value += "\n];\n";
        */
        if (includeLoop) {
            target.value += `\nfor (let index = 0; index < data.length; index++) {\n\tconsole.log(index);\n\tconst row = data[index];\n\tfor (let key in row) {\n\t\tconsole.log(\`\\t\${key}: \${row[key]}\`);\n\t}\n}\n`;
        }
    } else if (language === "C") {
        const headerCount = headers.length;
        const rowCount = csv.length;
        let longestStringLength = 0;
        for (let row of csv) {
            for (let key in row) {
                if (longestStringLength < key.length) {
                    longestStringLength = key.length;
                }
                if (longestStringLength < row[key].length) {
                    longestStringLength = row[key].length;
                }
            }
        }
        if (longestStringLength < 15) {
            longestStringLength = 15;
        }
        target.value = `const char data[${headerCount}][${rowCount + 1}][${longestStringLength + 1}] = {\n`;
        for (let j = 0; j < headers.length; j++) {
            const key = headers[j];
            target.value += `\t{\"${key.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/(\n)/g, "\\n")}\",`;
            for (let i = 0; i < csv.length; i++) {
                const row = csv[i];
                const isLastKey = i+1 === csv.length;
                target.value += `\"${row[key].replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/(\n)/g, "\\n")}\"${isLastKey ? "" : ","}`;
            }
            target.value += j+1 === headers.length ? "}\n" : "},\n";
        }
        target.value += "};\n";
        if (includeLoop) {
            target.value += "\nvoid iterate(void) {\n\tconst static unsigned int row_count = sizeof(data[0]) / sizeof(data[0][0]) - 1;\n\tconst static unsigned int column_count = sizeof(data) / sizeof(data[0]);\n\tunsigned int index, i;\n\tfor (index = 0; index < row_count; index++) {\n\t\tprintf(\"%d\\n\", index);\n\t\tfor (i = 0; i < column_count; i++) {\n\t\t\tconst char * key = data[i][0];\n\t\t\tconst char * value = data[i][index + 1];\n\t\t\tprintf(\"\\t%s = %s\\n\", key, value);\n\t\t}\n\t}\n}\n";
        }
    } else {
        throw new Error("Unhandled language: " + JSON.stringify(language));
    }
    if (stripLines) {
        target.value = target.value.replace(/\n/g, ' ').replace(/\s\s+/g, ' ');
    }
    if (warning) {
        throw new Error(warning);
    }
}
