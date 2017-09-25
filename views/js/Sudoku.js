class Sudoku {
  constructor() {
    this.generation = 0;
    this.grid = [];
    this.logs = [];
    this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  getSector(y, x) {
    var limit = [], res =[], debug ='';
    // Depth
    if(y >= 0 && y <3) {
      debug = 'top';
      limit = [0, 3];

    } else if(y >= 3 && y <6) {
      debug = 'center';
      limit = [3, 6];

    } else {
      debug = 'bottom';
      limit = [6, 9];

    }
    // Length
    if(x >= 0 && x <3) {
      debug = 'left : '+debug;
      limit = [].merge(limit, [0, 3]);

    } else if(x >= 3 && x <6) {
      debug = 'center : '+debug;
      limit = [].merge(limit, [3, 6]);

    } else {
      debug = 'right : '+debug;
      limit = [].merge(limit, [6, 9]);

    }
    return this.grid.sector(limit[0], limit[1], limit[2], limit[3]);
  }

  prepare() {
    var i;
    for(i=0; i<9; i++) {
      var arr = [];
      if(i===0) {
        arr = arr.range(1, 9).shuffle();
      } else {
        arr.length = 9;
        arr.fill(0);
      }
      this.logs.push(new Array(9));
      this.grid.push(arr);
    }
    this.makeLogs();
  }

  undoLog(x, y) {
    this.logs[y][x] = {
      'x': x,
      'y': y,
      'value': 0,
      'tried': []
    };
  }

  makeLogs() {
    var x=0, y=0;
    for(y=0; y<this.grid.length; y++) {
      this.logs[y] = new Array();
      for(x=0; x<this.grid[y].length; x++) {
        this.logs[y][x] = {
          'x': x,
          'y': y,
          'value': this.grid[y][x],
          'tried': this.grid[y][x] >0 ? [this.grid[y][x]] : []
        };
      }
    }
  }

  log(x, y, number) {
    this.logs[y][x].x = x;
    this.logs[y][x].y = y;
    this.logs[y][x].value = number;
    this.logs[y][x].tried.push(number);
  }

  reset() {
    this.generation =0;
    this.logs = [];
    this.grid = [];
  }

  redoGrid() {
    this.reset();
    this.prepare();
    return this.fillGrid();
  }

  fillGrid() {

    var x=0, y=0, current, number, elligible =[],
      row, sector, column, results, missing;

    this.generation ++;

    for(y=0; y<this.grid.length; y++) {
      for(x=0; x<this.grid[y].length; x++) {
        current = this.grid[y][x];
        if(current === 0) {
          elligible = this.elligible(x, y);
          if(this.logs[y][x].tried.length >0) {
            elligible = [].diff(elligible, this.logs[y][x].tried);
          }
          if(elligible.length >0) {
            number = elligible[elligible.rand()];
            this.grid[y][x] = number;
            this.log(x, y, number);
          } else {

            /**
             * No elligible number were found.
             *  Find shortest array in column, row or sector elligibles.
             */

            row = [].diff(this.numbers, this.row(y));
            column = [].diff(this.numbers, this.column(x));
            sector = [].diff(this.numbers, this.sector(x, y));

            // Guess on the missing number.
            results = [
              {
                'ref': 'row',
                'values': row,
                'lth': row.length
              }, {
                'ref': 'column',
                'values': column,
                'lth': column.length
              }, {
                'ref': 'sector',
                'values': sector,
                'lth': sector.length
              }
            ].sortByKey('lth');
            missing = results.first().values.first();

            /**
             * Rewind to the first matching value
             * Draw a new value that was not used yet.
             */
            return this.rewind(x, y, missing);
          }
        }
      }
    }
  }

  rewind(x, y, missing) {
    var startX, current;
    if(y===0) {
      // Retry from start.
      this.redoGrid();
    } else  {
      for(var i = y; i >= 0; i--) {
        if(i < y) {
          startX = this.grid[i].length -1;
        } else {
          startX = x;
        }
        for(var j=startX; j>=0; j--) {
          current = this.grid[i][j];
          if(current === missing) {
            this.grid[i][j] = 0;
            this.logs[i][j].value = 0;
            return this.fillGrid();
          } else {
            this.grid[i][j] = 0;
            this.undoLog(j ,i);
          }
        }
      }
    }
  }

  elligible(x, y) {
    var res=[], column, sector, row;
    row = this.row(y);
    column = this.column(x);
    sector = this.sector(x, y);
    res = [].diff(this.numbers, row, column, sector);
    return res;
  }

  isArray(arr) {
    return typeof arr == 'object' && (arr instanceof Array);
  }

  clear(arr) {
    var res =[], i;
    if(this.isArray(arr)) {
      for(i=0; i<arr.length; i++) {
        if(arr[i] >0) {
          res.push(arr[i]);
        }
      }
    } else {
      throw TypeError('clear: arr is: '+typeof arr);
    }
    return res;
  }

  row(y) {
    return this.clear(this.grid[y]);
  }

  column(x) {
    return this.clear(this.grid.column(x));
  }

  sector(x, y) {
    return this.clear(this.getSector(y, x));
  }

  isValid(number, x, y) {
    var res=false, row, column;
    row = this.grid[y];
    column = this.grid.column(x);
    sector = this.getSector(y, x);
    res = (false === row.inArray(number));
    res &= (false === column.inArray(number));
    res &= (false === sector.inArray(number));
    return res;
  }

  generate() {
    this.prepare();
    this.fillGrid();
  }

  flattenGrid() {
    var y=0, x=0, res = [];
    for(y=0; y<this.grid.length; y++) {
      for(x=0; x<this.grid[y].length; x++) {
        res.push({
          'x': x,
          'y': y,
          'value': this.grid[y][x],
          'forget': false
        });
      }
    }
    return res;
  }

  forget(percent) {
    var x, forgotten, res, index, number;
    number = parseInt((9*9) * percent);
    res = this.flattenGrid();
    index = res.rand(number);
    if(index.length>0) {
      for(x=0; x<index.length; x++) {
        res[index[x]].forget = true;
      }
    }
    return res;
  }
}
