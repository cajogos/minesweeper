var SWEEPER = {
    // Elements for configuration and events
    gameArea: undefined,
    buttons: {
        start: undefined,
        reset: undefined
    },
    inputs: {
        rows: undefined,
        cols: undefined,
        mines: undefined
    },

    // Rows and columns
    MAX_ROWS: 50,
    MAX_COLS: 50,
    MIN_ROWS: 8,
    MIN_COLS: 8,
    NUM_ROWS: undefined,
    NUM_COLS: undefined,

    // Mines
    MINES: [],
    MAX_MINES: undefined,
    MIN_MINES: 8,
    NUM_MINES: undefined
};

/**
 * @param {object} sweeperOptions
 */
SWEEPER.init = function (sweeperOptions)
{
    if (typeof sweeperOptions === 'object')
    {
        this.setOptions(sweeperOptions);
    }

    try
    {
        this._checkElements();
    }
    catch (e)
    {
        swal({
            title: 'Failed to start elements!',
            text: e.message,
            icon: 'error',
            button: {
                visible: false
            },
            closeOnClickOutside: false,
            closeOnEsc: false
        });
    }

};

/**
 * @param {object} options
 */
SWEEPER.setOptions = function (options)
{
    for (var key in options)
    {
        if (options.hasOwnProperty(key))
        {
            if (this.hasOwnProperty(key))
            {
                this[key] = options[key];
            }
        }
    }
};


SWEEPER.startGame = function ()
{
    try
    {
        this._checkConfig();

        this.game = new SWEEPER.Game();
        this.game.init();
    }
    catch (e)
    {
        // TODO SHOW ERRORS
    }
    // TODO
};

SWEEPER._checkConfig = function ()
{
    // TODO
    console.warn('CHECK CONFIG NEEDS IMPLEMENTATION');
};

/**
 * Function responsible to check that the necessary HTML elements are present on the page.
 * @private
 */
SWEEPER._checkElements = function ()
{
    if (typeof this.gameArea === 'undefined')
    {
        throw Error('Game area has not been defined!');
    }

    // Buttons
    if (typeof this.buttons.start === 'undefined')
    {
        throw Error('No start button has been set!');
    }
    if (typeof this.buttons.reset === 'undefined')
    {
        throw Error('No reset button has been set!');
    }

    // Inputs
    if (typeof this.inputs.rows === 'undefined')
    {
        throw Error('No input element for number of rows!');
    }
    if (typeof this.inputs.cols === 'undefined')
    {
        throw Error('No input element for number of columns!');
    }
    if (typeof this.inputs.mines === 'undefined')
    {
        throw Error('No input element for number of mines!');
    }

    this._configElements();
};

/**
 * Function to configure the elements on page after they have been configured properly.
 * @private
 */
SWEEPER._configElements = function ()
{
    var self = this;

    // Buttons
    this.buttons.start.on('click', function (e)
    {
        self._handleStartButtonClick($(this), e);
    });
    this.buttons.reset.on('click', function (e)
    {
        self._handleResetButtonClick($(this), e);
    });

    // Inputs
    this.inputs.values = {};
    this.inputs.values.rows = $('#num-rows-value');
    this.inputs.values.cols = $('#num-cols-value');
    this.inputs.values.mines = $('#num-mines-value');

    this.inputs.rows.on('input', function (e)
    {
        self._handleRowsInputChange($(this), e);
    });
    this.inputs.rows.trigger('input');
    this.inputs.cols.on('input', function (e)
    {
        self._handleColsInputChange($(this), e);
    });
    this.inputs.cols.trigger('input');
    this.inputs.mines.on('input', function (e)
    {
        self._handleMinesInputChange($(this), e);
    });
    this.inputs.mines.trigger('input');
};

/**
 * Handle the click event of the start button.
 * @param {jQuery} button
 * @param {MouseEvent} event
 * @private
 */
SWEEPER._handleStartButtonClick = function (button, event)
{
    // Start the game
    this.startGame();
};

/**
 * Handle the click event of the reset button.
 * @param {jQuery} button
 * @param {MouseEvent} event
 * @private
 */
SWEEPER._handleResetButtonClick = function (button, event)
{
    // Stop current game and reset the board
    console.log('RESET BUTTON', button, event);
};

/**
 * Handle the change (input) event of the rows slider.
 * @param {jQuery} input
 * @param {MouseEvent} event
 * @private
 */
SWEEPER._handleRowsInputChange = function (input, event)
{
    var curValue = parseInt(input.val(), 10);
    if (curValue < this.MIN_ROWS)
    {
        curValue = this.MIN_ROWS;
    }
    else if (curValue > this.MAX_ROWS)
    {
        curValue = this.MAX_ROWS;
    }

    this.NUM_ROWS = curValue;

    this.inputs.rows.val(this.NUM_ROWS);
    this.inputs.values.rows.text(this.NUM_ROWS);

    this._handleNumOfMines();
};

/**
 * Handle the change (input) event of the columns slider.
 * @param {jQuery} input
 * @param {MouseEvent} event
 * @private
 */
SWEEPER._handleColsInputChange = function (input, event)
{
    var curValue = parseInt(input.val(), 10);
    if (curValue < this.MIN_COLS)
    {
        curValue = this.MIN_COLS;
    }
    else if (curValue > this.MAX_COLS)
    {
        curValue = this.MAX_COLS;
    }

    this.NUM_COLS = curValue;

    this.inputs.cols.val(this.NUM_COLS);
    this.inputs.values.cols.text(this.NUM_COLS);

    this._handleNumOfMines();
};

/**
 * Function used to determine how many mines the board can display.
 * @private
 */
SWEEPER._handleNumOfMines = function ()
{
    // Calculate maximum amount of mines floor(rows * cols / 2)
    this.MAX_MINES = Math.floor(this.NUM_ROWS * this.NUM_COLS / 2);
    if (this.NUM_MINES > this.MAX_MINES)
    {
        this.NUM_MINES = this.MAX_MINES;
    }

    this.inputs.mines.attr('max', this.MAX_MINES);

    this.inputs.mines.trigger('input');
};

/**
 * Handle the change (input) event of the mines slider.
 * @param {jQuery} input
 * @param {MouseEvent} event
 * @private
 */
SWEEPER._handleMinesInputChange = function (input, event)
{
    var curValue = parseInt(input.val(), 10);
    if (curValue < this.MIN_MINES)
    {
        curValue = this.MIN_MINES;
    }
    else if (curValue > this.MAX_MINES)
    {
        curValue = this.MAX_MINES;
    }

    this.NUM_MINES = curValue;

    this.inputs.mines.val(this.NUM_MINES);
    this.inputs.values.mines.text(this.NUM_MINES + ' (Max: ' + this.MAX_MINES + ')');
};