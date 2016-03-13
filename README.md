# jscomplex
A Sweet reporter for maintainability index via escomplex

## Installation 

```
sudo npm install jscomplex -g
```

## Pre-requisites

```
node version >= 4.2.6
```

## Use

```
jscomplex "['./lib/*.js', './bin/*.js']"
```





## Help

```
jscomplex -h
```
Output

```bash
  Usage: jscomplex.bin [options] <path>

  Options:

    -h, --help                        output usage information
    -V, --version                     output the version number
    -f, --format <format>             specify the output format of the report
    -M, --mi <maintainability index>  specify the per-module maintainability index threshold
    -l, --logicalor                   disregard operator || as source of cyclomatic complexity
    -w, --switchcase                  disregard switch statements as source of cyclomatic complexity
    -i, --forin                       treat for...in statements as source of cyclomatic complexity
    -t, --trycatch                    treat catch clauses as source of cyclomatic complexity
    -n, --newmi                       use the Microsoft-variant maintainability index (scale of 0 to 100)
    -Q, --nocoresize                  don't calculate core size or visibility matrix

  Examples:

    # Analize all *.js files from "lib" folder
    $ jscomplex "['./lib/*.js']"

    # Analize all *.js files from "lib" and "bin" folder
    $ jscomplex "['./lib/*.js', './bin/*.js']"

    # Analize all *.js files
    $ jscomplex "['./**/*.js']"
```


## Enjoy it!