window.addEventListener("load", function() {
    /** @type {HTMLInputElement} */
    const fileEl = document.querySelector("#fileEl");
    fileEl.addEventListener("change", function(x) {
        handleDrop(x, this.files);
        x.preventDefault();
    });

    function fillPageWithFile() {
        fileEl.style.position = "fixed";
        fileEl.style.width = "100vw";
        fileEl.style.height = "100vh";
        fileEl.style.top = "0";
        fileEl.style.left = "0";
        document.querySelector("#markDropArea").style.display = "flex";
    }

    function resetFileElement() {
        fileEl.style.position = "";
        fileEl.style.width = "";
        fileEl.style.height = "";
        fileEl.style.top = "";
        fileEl.style.left = "";
        document.querySelector("#markDropArea").style.display = "none";
    }

    const dropArea = document.querySelector("#main-content");

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    });

    let goBackTimer = null;

    dropArea.addEventListener("mouseleave", resetFileElement, false)

    function preventDefaults(e) {
        if (e.type === "dragover") {
            if (e.target instanceof HTMLInputElement) {
                return;
            } else {
                e.preventDefault();
                return;
            }
        }
        if (e.type === "dragenter") {
            fillPageWithFile();
            if (goBackTimer) {
                clearTimeout(goBackTimer);
            }
            goBackTimer = setTimeout(resetFileElement, 6000);
        }
        if (e.type === "dragleave") {
            if (goBackTimer) {
                clearTimeout(goBackTimer);
                goBackTimer = null;
            }
        }
        e.preventDefault();
    }

    dropArea.addEventListener('drop', handleDrop, false);

    let lastHandleDrop = null;
    function handleDrop(e, filesParam) {
        resetFileElement();
        let files;
        if (e.dataTransfer && e.dataTransfer.files) {
            files = e.dataTransfer.files;
        } else {
            files = filesParam;
        }
        if (!files) {
            console.log(e);
            throw new Error("No files to load");
        }
        if (lastHandleDrop !== null && (new Date()).getTime() - lastHandleDrop < 500) {
            // Prevent double-upload (both dragover and fileinputchange trigger may handle file drop)
            return;
        }
        lastHandleDrop = (new Date()).getTime();
        handleFiles(files);
    }

    function handleFiles(files) {
        if (!files.length) {
            debugger;
        }
        // console.log("Handling", files, "files");
        ([...files]).forEach(uploadFile);
    }

    function uploadFile(file, index) {
        let reader = new FileReader()
        reader.readAsText(file);
        reader.onloadend = () => addFileText(reader.result, index);
    }

    function addFileText(fileContent, fileIndex) {
        const textarea = document.querySelectorAll("textarea")[0];
        if (fileIndex === 0) {
            textarea.value = fileContent;
        } else {
            let lineSeparator = document.querySelector('#lineSeparator').value;
            if (lineSeparator === "\\n") {
                lineSeparator = "\n";
            } else if (lineSeparator === "\\t") {
                lineSeparator = "\t";
            }
            if (fileContent.includes(lineSeparator) && fileContent.substr(0, 3) === textarea.value.substr(0, 3)) {
                fileContent = fileContent.substr(fileContent.indexOf(lineSeparator));
                if (fileContent[0] === "\n") {
                    fileContent = fileContent.substr(1);
                }
            }
            if (textarea.value[textarea.value.length-1] !== "\n") {
                textarea.value += "\n";
            }
            textarea.value += fileContent;
        }
        console.log(textarea.value);
    }
});