# CSV to Code

This web app transform a CSV text into interpretable code so that you don't have to load and parse
the data into a program as it executes and can just load it statically as code.

[Click here to access it.](http://grossato.com/csv-to-code/)

Input:

```csv
header1,header2
line1value1,line1value2
line2value1,line2value2
```

JS Output (other languages available):

```js
const data = [
    {
        "header1": "line1value1",
        "header2": "line1value2",
    },
    {
        "header1": "line2value1",
        "header2": "line2value2",
    }
];
```

Currently supports: PHP, Javascript/NodeJS, C (ASCII)

## Why

Without this program you might need to do all the "production-wise" steps required to load the CSV dinamically:

 1. Downloading a csv-reading library that might or might not have multiple dependencies
 2. Understanding the new library interface so that you can create code to read your data
 3. Move (or upload) the csv file to the correct place so that your script can read it
 4. Creating the code to read the a file
 5. Test if the data has been loaded correctly (that means executing your program)
 6. Finally writing the process you want to do

For quick scripts or processes, loading the data statically and changing when necessary will be several minutes faster, that's all.

## License

Licence is AGPL-3.0:

You may copy, use, redistribute, change with the code in this repository, as long as you don't blame me for  any harm caused by its usage. In case you do modify it or include the source of this repository with other software then you have to publish the source code of said project fully. It is not a violation of this license to use the code produced by this tool freely in any possible, imaginable, scenario, even evil ones, without credits.

Other details can be checked in the [LICENSE.md](https://github.com/GuilhermeRossato/csv-to-code/blob/master/LICENSE.md) file.
