
# cli tableau

<a href="https://travis-ci.org/github/keymetrics/cli-tableau" title="PM2 Tests">
  <img src="https://travis-ci.org/keymetrics/cli-tableau.svg?branch=master" alt="Build Status"/>
</a>


### Horizontal Tables
```javascript
var Table = require('cli-tableau');

var table = new Table({
    head: ['TH 1 label', 'TH 2 label'],
    colWidths: [100, 200],
    borders: false
});

table.push(
    ['First value', 'Second value'],
    ['First value', 'Second value']
);

console.log(table.toString());
```

### Vertical Tables

```javascript
var Table = require('cli-tableau');
var table = new Table();

table.push(
    { 'Some key': 'Some value' },
    { 'Another key': 'Another value' }
);

console.log(table.toString());
```

### Cross Tables
Cross tables are very similar to vertical tables, with two key differences:

1. They require a `head` setting when instantiated that has an empty string as the first header
2. The individual rows take the general form of { "Header": ["Row", "Values"] }

```javascript
var Table = require('cli-tableau');
var table = new Table({ head: ["", "Top Header 1", "Top Header 2"] });

table.push(
    { 'Left Header 1': ['Value Row 1 Col 1', 'Value Row 1 Col 2'] },
    { 'Left Header 2': ['Value Row 2 Col 1', 'Value Row 2 Col 2'] }
);

console.log(table.toString());
```

### Custom styles

The ```chars``` property controls how the table is drawn:
```javascript
var table = new Table({
  chars: {
    'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗',
    'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝',
    'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼',
    'right': '║' , 'right-mid': '╢' , 'middle': '│'
  }
});

table.push(
    ['foo', 'bar', 'baz'],
    ['frob', 'bar', 'quuz']
);

console.log(table.toString());
// Outputs:
//
//╔══════╤═════╤══════╗
//║ foo  │ bar │ baz  ║
//╟──────┼─────┼──────╢
//║ frob │ bar │ quuz ║
//╚══════╧═════╧══════╝
```

Empty decoration lines will be skipped, to avoid vertical separator rows just
set the 'mid', 'left-mid', 'mid-mid', 'right-mid' to the empty string:
```javascript
var table = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''} });
table.push(
    ['foo', 'bar', 'baz'],
    ['frobnicate', 'bar', 'quuz']
);

console.log(table.toString());
// Outputs: (note the lack of the horizontal line between rows)
//┌────────────┬─────┬──────┐
//│ foo        │ bar │ baz  │
//│ frobnicate │ bar │ quuz │
//└────────────┴─────┴──────┘
```

By setting all chars to empty with the exception of 'middle' being set to a
single space and by setting padding to zero, it's possible to get the most
compact layout with no decorations:
```javascript
var table = new Table({
  chars: {
    'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
    'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
    'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '',
    'right': '' , 'right-mid': '' , 'middle': ' '
  },
  style: { 'padding-left': 0, 'padding-right': 0 }
});

table.push(
    ['foo', 'bar', 'baz'],
    ['frobnicate', 'bar', 'quuz']
);

console.log(table.toString());
// Outputs:
//foo        bar baz
//frobnicate bar quuz
```

## Credits

- Guillermo Rauch &lt;guillermo@learnboost.com&gt; ([Guille](http://github.com/guille))
