
function objectifyCSV(headers, rows) {
    /** @type {Record<string, string>[]} */
    const list = [];
    for (let row of rows) {
        /** @type {Record<string, string>} */
        const obj = {};
        for (let index = 0; index < headers.length; index++) {
            const key = headers[index];
            obj[key] = row[index] || "";
        }
        list.push(obj);
    }
    return list;
}