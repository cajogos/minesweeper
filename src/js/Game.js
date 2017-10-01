/**
 * @param {number} numRows
 * @param {number} numCols
 * @param {number} numMines
 * @constructor
 */
SWEEPER.Game = function (numRows, numCols, numMines)
{
    this.numRows = numRows;
    this.numCols = numCols;
    this.numMines = numMines;
    this.restMines = numMines;

    this.isGameStarted = false;
    this.isGameFinished = false;
    this.isFirstClick = false;

    this.timeCount = 0;
    this.timerId = undefined;

    // Elements
    this.mainContainer = undefined;
    this.functionBar = undefined;
    this.functionPanel = undefined;
    this.leftBox = undefined;
    this.rightBox = undefined;
    this.middleBox = undefined;
    this.faceButton = undefined;
    this.faceImg = undefined;
    this.mineArea = undefined;
    this.mineTable = undefined;
};
SWEEPER.Game.prototype.constructor = SWEEPER.Game;

/**
 * @returns {number}
 */
SWEEPER.Game.prototype.getNumRows = function ()
{
    return this.numRows;
};

/**
 * @returns {number}
 */
SWEEPER.Game.prototype.getNumCols = function ()
{
    return this.numCols;
};

/**
 * @returns {number}
 */
SWEEPER.Game.prototype.getNumMines = function ()
{
    return this.numMines;
};

/**
 * @type {number}
 */
SWEEPER.Game.BLOCK_TYPE_DEFAULT = 0;

/**
 * @type {number}
 */
SWEEPER.Game.BLOCK_TYPE_MINE = 9;

/**
 * Function called to start the set-up game
 * @param {function} callback
 */
SWEEPER.Game.prototype.init = function (callback)
{
    // Type checking
    if (typeof this.getNumRows() !== 'number')
    {
        throw Error('The number of rows is not a number!');
    }
    if (typeof this.getNumCols() !== 'number')
    {
        throw Error('The number of columns is not a number!');
    }
    if (typeof this.getNumMines() !== 'number')
    {
        throw Error('The number of mines is not a number!');
    }

    this._createMainContainer();

    // If there is a callback function
    if (typeof callback === 'function')
    {
        callback();
    }
};

SWEEPER.Game.prototype._createMainContainer = function ()
{
    // Each mine 18px + panel border + 3px + main_container's border 6px // TODO
    var fullWidth = 24 * this.getNumCols() + 6;

    // Main Container creation
    this.mainContainer = document.createElement('div');
    this.mainContainer.className = 'main_container';
    this.mainContainer.style.width = fullWidth + 'px';

    // Function Bar
    this._createFunctionBar();

    // Mine Area
    this._createMineArea();

    SWEEPER.getGameArea().append(this.mainContainer);
};

/**
 * Creates the function bar displayed at the top.
 * @private
 */
SWEEPER.Game.prototype._createFunctionBar = function ()
{
    // Function bar
    this.functionBar = document.createElement('div');
    this.functionBar.className = 'function_bar_div';

    // Function panel
    this.functionPanel = document.createElement('div');
    this.functionPanel.className = 'panel_down_div';

    // Left box
    this.leftBox = document.createElement('div');
    this.leftBox.className = 'function_left_div';
    this.leftBox.innerText = '' + this.getNumMines();
    this.functionPanel.appendChild(this.leftBox);

    // Right box
    this.rightBox = document.createElement('div');
    this.rightBox.className = 'function_right_div';
    this.rightBox.innerText = '0';
    this.functionPanel.appendChild(this.rightBox);

    // Middle box
    this.middleBox = document.createElement('div');
    this.middleBox.className = 'function_mid_div';
    // Face button
    this._createFaceButton();
    this.functionPanel.appendChild(this.middleBox);

    this.functionBar.appendChild(this.functionPanel);
    this.mainContainer.appendChild(this.functionBar);
};

/**
 * Creates the face button that displays the game state to the user.
 * @private
 */
SWEEPER.Game.prototype._createFaceButton = function ()
{
    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'container_border';
    buttonContainer.style.width = '30px';

    this.faceButton = document.createElement('div');
    this.faceButton.className = 'img_button_up';
    this.faceButton.style.width = '24px';
    this.faceButton.style.height = '24px';

    // Set whether the button is pushed/paused
    this.faceButton.setAttribute('pushed', false);

    // Face image icon
    this.faceImg = document.createElement('img');
    this.faceImg.border = 0;
    this.faceImg.src = "images/smile.gif";
    this.faceImg.style.padding = "0px";
    this.faceImg.style.margin = "2px 0 0 0px";

    // Event listeners
    var self = this;
    this.faceButton.onmousedown = function ()
    {
        this.className = 'img_button_down';
        this.setAttribute('pushed', true);
    };
    this.faceButton.onmouseout = function ()
    {
        if (this.getAttribute('pushed') === 'true')
        {
            this.className = 'img_button_up';
            this.setAttribute('pushed', false);
        }
    };
    this.faceButton.onmouseup = function ()
    {
        if (this.getAttribute('pushed') === 'false')
        {
            return false;
        }
        this.className = 'img_button_up';
        this.setAttribute('pushed', false);
        // RefreshMainFrame(); // TODO
    };

    this.faceButton.appendChild(this.faceImg);
    buttonContainer.appendChild(this.faceButton);
    this.middleBox.appendChild(buttonContainer);
};

/**
 * Creates the main mine play area.
 * @private
 */
SWEEPER.Game.prototype._createMineArea = function ()
{
    var i, j, index;
    var tempTr, tempTd, mineButton;

    // Mine Area
    this.mineArea = document.createElement('div');
    this.mineArea.className = 'panel_down_nopadding_div';

    // Mine Table
    this.mineTable = document.createElement('table');
    this.mineTable.className = 'mine_area_table';

    var mineTableBody = document.createElement('tbody');

    var tempArray = this._initMineArea(this.getNumRows(), this.getNumCols(), this.getNumMines());

    for (i = 0; i < this.getNumRows(); i++)
    {
        tempTr = document.createElement('tr');
        for (j = 0; j < this.getNumCols(); j++)
        {
            tempTd = document.createElement('td');
            index = i * this.getNumCols() + j;

            mineButton = this._createMineButton(tempArray[index], index); // TODO
            tempTd.appendChild(mineButton);
            tempTr.appendChild(tempTd);
        }
        mineTableBody.appendChild(tempTr);
    }
    this.mineTable.appendChild(mineTableBody);

    this.mineArea.appendChild(this.mineTable);

    this.mainContainer.appendChild(this.mineArea);
};

SWEEPER.Game.MOUSE_BUTTON_LEFT = 0;
SWEEPER.Game.MOUSE_BUTTON_MIDDLE = 1;
SWEEPER.Game.MOUSE_BUTTON_RIGHT = 2;

SWEEPER.Game.prototype._createMineButton = function (mineValue, mineIndex)
{
    var mine = document.createElement('div');
    var tempValue; // Value under current block
    var bomb, flag; // Object for mine and flag
    var source; // Click source // TODO NOT USED?
    var expanded, marked, detected; // Flags for guesses

    mine.id = 'mine_' + mineIndex;
    mine.className = 'mine_up';
    mine.style.width = '18px';
    mine.style.height = '18px';
    mine.setAttribute('mine_value', mineValue);
    mine.setAttribute('mine_index', mineIndex);

    // State of mine
    mine.setAttribute('marked', false);
    mine.setAttribute('opened', false);
    mine.setAttribute('expanded', false);
    mine.setAttribute('pushed', false);
    mine.setAttribute('detected', false);

    // mine.innerText = mineValue; // TODO TESTING ONLY

    // Event handlers
    var gameSelf = this;

    mine.onmousedown = function (event)
    {
        // If game finished - do nothing
        if (gameSelf.isGameFinished)
        {
            return false;
        }

        // Get attribute states
        expanded = this.getAttribute('expanded');
        marked = this.getAttribute('marked');
        detected = this.getAttribute('detected');

        // Left button
        if (event.button === SWEEPER.Game.MOUSE_BUTTON_LEFT)
        {
            // Do not respond to expanded and marked mines
            if (marked === 'true' || expanded === 'true')
            {
                return false;
            }
            this.setAttribute('pushed', true);
            this.className = 'mine_down';
        }

        // Right button
        if (event.button === SWEEPER.Game.MOUSE_BUTTON_RIGHT)
        {
            // Start timer
            gameSelf._beginTimer();

            if (expanded === 'false')
            {
                this.className = 'mine_up';
                if (marked === 'false')
                {
                    if (detected === 'true')
                    {
                        this.setAttribute('detected', false);
                        this.innerText = '';
                        return false;
                    }

                    // Mark as mine
                    flag = document.createElement('img');
                    flag.style.width = '15px';
                    flag.style.height = '15px';
                    flag.style.padding = '0px';
                    flag.style.margin = '0px';
                    flag.src = 'images/flag.gif';
                    // Avoid recreate
                    this.appendChild(flag);
                    this.setAttribute('marked', true);

                    gameSelf.restMines--;
                    if (gameSelf.restMines < 0)
                    {
                        gameSelf.restMines = 0;
                    }
                    gameSelf.leftBox.innerText = gameSelf.restMines.toString();

                    // CheckGameStatus // TODO
                }
                else
                {
                    // Set guess flag
                    gameSelf.restMines++;
                    gameSelf.leftBox.innerText = gameSelf.restMines.toString();

                    // Clear the mark
                    this.removeChild(this.firstChild);
                    this.setAttribute('marked', false);

                    if (detected === 'false')
                    {
                        this.setAttribute('detected', true);
                        this.innerText = '?';
                        this.className = 'mine_up';
                    }
                    else
                    {
                        this.setAttribute('detected', false);
                    }
                }

            }
        }

        // Middle button
        if (event.button = SWEEPER.Game.MOUSE_BUTTON_MIDDLE)
        {
            // Detect the surrounding blocks
            if (expanded === 'false' && marked === 'false')
            {
                this.className = 'mine_down';
            }
            // Avoid left mouse interference
            this.setAttribute('pushed', false);
            this.setAttribute('detecting', true);

            // Change visual of surrounding blocks
            var numCols = gameSelf.getNumCols();
            var numRows = gameSelf.getNumRows();
            var curIndex = parseInt(mine.getAttribute('mine_index'), 10);
            var curY = curIndex % numCols;
            var curX = Math.round((curIndex - curY) / numCols);

            var tempX, tempY, tempIndex, curMine;
            for (var i = -1; i <= 1; i++)
            {
                tempX = curX + i;
                if (tempX < 0 || tempX > (numRows - 1))
                {
                    continue;
                }
                for (var j = -1; j <= 1; j++)
                {
                    tempY = curY + j;
                    if (tempY > (numCols - 1) || tempY < 0)
                    {
                        continue;
                    }
                    tempIndex = tempX * numCols + tempY;
                    curMine = document.getElementById('mine_' + tempIndex);
                    if ((curMine !== null) &&
                        (curMine.getAttribute('marked') === 'false') &&
                        (curMine.getAttribute('expanded') === 'false') &&
                        (curMine.getAttribute('detected') === 'false'))
                    {
                        curMine.className = 'mine_down';
                    }
                }
            }
        }
    };

    mine.onmouseout = function (event)
    {
        if (gameSelf.isGameFinished)
        {
            return false;
        }

        if (this.getAttribute('pushed') === 'true')
        {
            this.className = 'mine_up';
            this.setAttribute('pushed', 'false');
        }

        if (this.getAttribute('detecting') === 'true')
        {
            if (this.getAttribute('expanded') === 'false' && this.getAttribute('marked') === 'false')
            {
                this.className = 'mine_up';
            }
            this.setAttribute('detecting', false);
            // Restore the visual style of the surrounding blocks
            var numCols = gameSelf.getNumCols();
            var numRows = gameSelf.getNumRows();
            var curIndex = parseInt(this.getAttribute('mine_index'), 10);
            var curY = curIndex % numCols;
            var curX = Math.round((curIndex - curY) / numCols);

            var tempX, tempY, tempIndex, curMine;
            for (var i = -1; i <= 1; i++)
            {
                tempX = curX + i;
                if (tempX < 0 || tempX > (numRows - 1))
                {
                    continue;
                }
                for (j = -1; j <= 1; j++)
                {
                    tempY = curY + j;
                    if (tempY > (numCols - 1) || tempY < 0)
                    {
                        continue;
                    }
                    tempIndex = tempX * numCols + tempY;
                    curMine = document.getElementById('mine_' + tempIndex);
                    if ((curMine !== null) &&
                        (curMine.getAttribute('marked') === 'false') &&
                        (curMine.getAttribute('expanded') === 'false'))
                    {
                        curMine.className = 'mine_up';
                    }
                }
            }
        }
    };

    mine.onmouseup = function (event)
    {
        if (gameSelf.isGameFinished)
        {
            return false;
        }

        // Is detecting happening?
        if (this.getAttribute('detecting') === 'true')
        {
            if ((this.getAttribute('expanded') === 'false') &&
                (this.getAttribute('marked') === 'false'))
            {
                this.className = 'mine_up';
            }
            this.setAttribute('detecting', false);

            // Surrounding mark doesn't match the number then restore visual style
            var numCols = gameSelf.getNumCols();
            var numRows = gameSelf.getNumRows();
            var curIndex = parseInt(this.getAttribute('mine_index'), 10);
            var curY = curIndex % numCols;
            var curX = Math.round((curIndex - curY) / numCols);
            var tempX, tempY, tempIndex, curMine, i, j;
            var markedCount = 0;

            if (this.getAttribute('expanded') === 'true')
            {
                for (i = -1; i <= 1; i++)
                {
                    tempX = curX + i;
                    if (tempX < 0 || tempX > (numRows - 1))
                    {
                        continue;
                    }
                    for (j = -1; j <= 1; j++)
                    {
                        tempY = curY + j;
                        if (tempY > (numCols - 1) || tempY < 0)
                        {
                            continue;
                        }
                        tempIndex = tempX * numCols + tempY;
                        curMine = document.getElementById('mine_' + tempIndex);
                        if ((curMine !== null) &&
                            (curMine.getAttribute('marked') === 'true'))
                        {
                            markedCount++;
                        }
                    }
                }
                if (markedCount === parseInt(this.getAttribute('mine_value'), 10))
                {
                    // Expand the unexpanded blocks
                    for (i = -1; i <= 1; i++)
                    {
                        tempX = curX + i;
                        if (tempX < 0 || tempX > (numRows - 1))
                        {
                            continue;
                        }
                        for (j = -1; j <= 1; j++)
                        {
                            tempY = curY + j;
                            if (tempY > (numCols - 1) || tempY < 0)
                            {
                                continue;
                            }
                            tempIndex = tempX * numCols + tempY;
                            curMine = document.getElementById('mine_' + tempIndex);
                            if ((curMine !== null) &&
                                (curMine.getAttribute('marked') === 'false') &&
                                (curMine.getAttribute('expanded') === 'false'))
                            {
                                curMine.setAttribute('pushed', true);
                                curMine.expandCover();
                            }
                        }
                    }
                    return false;
                }
            }
            for (i = -1; i <= 1; i++)
            {
                tempX = curX + i;
                if (tempX < 0 || tempX > (numRows - 1))
                {
                    continue;
                }
                for (j = -1; j <= 1; j++)
                {
                    tempY = curY + j;
                    if (tempY > (numCols - 1) || tempY < 0)
                    {
                        continue;
                    }
                    tempIndex = tempX * numCols + tempY;
                    curMine = document.getElementById('mine_' + tempIndex);
                    if ((curMine !== null) &&
                        (curMine.getAttribute('marked') === 'false') &&
                        (curMine.getAttribute('expanded') === 'false'))
                    {
                        curMine.className = 'mine_up';
                    }
                }
            }
            return false;
        }

        // Left button
        if (event.button === SWEEPER.Game.MOUSE_BUTTON_LEFT)
        {
            this.expandCover();
        }
    };

    mine.expandCover = function ()
    {
        if (gameSelf.isGameFinished)
        {
            return false;
        }

        // If mouse has moved out do nothing
        if (this.getAttribute('pushed') === 'false')
        {
            return false;
        }
        this.setAttribute('pushed', false);

        // First time click
        if (!gameSelf.isFirstClick)
        {
            gameSelf.isFirstClick = true;
            // If first click is mine - re-generate the mine position
            if (parseInt(this.getAttribute('mine_value'), 10) === SWEEPER.Game.BLOCK_TYPE_MINE)
            {
                var curIndex = parseInt(this.getAttribute('mine_index'), 10);
                var numCols = gameSelf.getNumCols();
                var numRows = gameSelf.getNumRows();
                var numMines = gameSelf.getNumMines();
                var tempArray = gameSelf._initMineArea(numRows, numCols, numMines, curIndex);
                var divIndex, mineDiv;
                for (divIndex = 0; divIndex < (numRows * numCols); divIndex++)
                {
                    mineDiv = document.getElementById('mine_' + divIndex);
                    mineDiv.setAttribute('mine_value', tempArray[divIndex]);
                }
            }
        }

        gameSelf._beginTimer();

        if (this.getAttribute('marked') === 'true' || this.getAttribute('expanded') === 'true')
        {
            return false;
        }
        this.setAttribute('detected', false);

        tempValue = parseInt(this.getAttribute('mine_value'), 10);
        switch (tempValue)
        {
            case SWEEPER.Game.BLOCK_TYPE_DEFAULT: // Nothing
                curIndex = parseInt(this.getAttribute('mine_index'), 10);
                this.innerText = '';
                gameSelf._expandMineArea(curIndex);
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
                this.className = 'mine_down_' + tempValue;
                this.setAttribute('expanded', true);
                this.innerText = tempValue.toString();
                break;
            case SWEEPER.Game.BLOCK_TYPE_MINE: // Found mine
                this.className = 'mine_down_bomb_blast';
                this.setAttribute('expanded', true);
                // Check whether exploded
                if (this.getAttribute('opened') === 'false')
                {
                    // Avoid re-creation
                    if (this.hasChildNodes())
                    {
                        this.removeChild(this.firstChild);
                    }

                    bomb = document.createElement('img');
                    bomb.style.width = '15px';
                    bomb.style.height = '15px';
                    bomb.style.padding = '0px';
                    bomb.style.margin = '0px';
                    bomb.src = 'images/bomb.gif';
                    this.appendChild(bomb);
                    gameSelf.gameOver(1);
                }
                this.setAttribute('opened', true);
                break;
        }

        gameSelf.checkGameStatus();
    };

    return mine;
};

/**
 * Check whether the game has finished. Using the following conditions:
 * 1. All blocks that are not a mine are opened.
 * 2. All mines have been tagged correctly.
 */
SWEEPER.Game.prototype.checkGameStatus = function ()
{
    var playerWon = true;
    var numCols = this.getNumCols();
    var numRows = this.getNumRows();

    var mine;
    for (i = 0; i < numRows * numCols; i++)
    {
        mine = document.getElementById('mine_' + i);
        if (mine.getAttribute('mine_value') === SWEEPER.Game.BLOCK_TYPE_MINE)
        {
            // If is a mine block
            if (mine.getAttribute('marked') === 'false')
            {
                playerWon = false;
                break;
            }
        }
        else
        {
            if (mine.getAttribute('expanded') === 'false')
            {
                playerWon = false;
                break;
            }
        }
    }

    if (playerWon)
    {
        this.gameOver(0);
    }
};

SWEEPER.Game.GAME_OVER_WIN = 0;
SWEEPER.Game.GAME_OVER_LOST = 1;
SWEEPER.Game.GAME_OVER_TIMEOUT = 2;

/**
 * @param {number} result
 */
SWEEPER.Game.prototype.gameOver = function (result)
{
    var title, message, state;
    switch (result)
    {
        case SWEEPER.Game.GAME_OVER_WIN:
            this.faceImg.src = 'images/win.gif';
            title = 'Well done!';
            message = 'You cleared ' + this.getNumMines() + ' mines in only ' + this.timeCount + ' seconds';
            state = 'success';
            break;
        case SWEEPER.Game.GAME_OVER_LOST:
            this._expandAll();
            this.faceImg.src = 'images/blast.gif';
            title = 'You lost!';
            message = 'You failed to clear ' + this.getNumMines() + ' mines, please try again!';
            state = 'error';
            break;
        case SWEEPER.Game.GAME_OVER_TIMEOUT:
            this._expandAll();
            this.faceImg.src = 'images/blast.gif';
            title = 'You ran out of time!';
            message = 'Whoa! It really takes you that long? Try again!';
            state = 'error';
            break;
    }

    swal({title: title, text: message, icon: state});

    // Reset stuff
    clearInterval(this.timerId);
    this.isGameStarted = false;
    this.isGameFinished = true;
};

/**
 * Handles the time spent playing.
 * @returns {boolean}
 * @private
 */
SWEEPER.Game.prototype._beginTimer = function ()
{
    if (this.isGameStarted)
    {
        return false;
    }
    var gameSelf = this;
    this.timerId = window.setInterval(function ()
    {
        gameSelf.timeCount++;
        if (gameSelf.timeCount > 999)
        {
            gameSelf.gameOver(2);
        }
        else
        {
            gameSelf.rightBox.innerText = gameSelf.timeCount.toString();
        }
    }, 1000);
    this.isGameStarted = true;
    return true;
};

/**
 * @param {number} source
 * @returns {null}
 * @private
 */
SWEEPER.Game.prototype._expandMineArea = function (source)
{
    source = parseInt(source, 10);

    var numCols = this.getNumCols();
    var numRows = this.getNumRows();
    var i, j, index, tempValue;

    j = source % numCols;
    i = Math.round((source - j) / numCols);

    mine = document.getElementById('mine_' + source);
    if ((mine.getAttribute('marked') === 'true') ||
        (mine.getAttribute('expanded') === 'true') ||
        (mine.getAttribute('detected') === 'true'))
    {
        return null;
    }

    tempValue = parseInt(mine.getAttribute('mine_value'), 10);
    switch (tempValue)
    {
        case SWEEPER.Game.BLOCK_TYPE_DEFAULT:
            mine.className = 'mine_down';
            if (mine.getAttribute('expanded') === 'true')
            {
                return null;
            }
            mine.setAttribute('expanded', true);

            // Row (i)
            // (i, j - 1)
            if ((j - 1) >= 0)
            {
                index = numCols * i + j - 1;
                this._expandMineArea(index);
            }

            // (i, j + 1)
            if ((j + 1) < numCols)
            {
                index = numCols * i + j + 1;
                this._expandMineArea(index);
            }
            // Row (i - 1)
            if ((i - 1) >= 0)
            {
                // (i - 1, j)
                index = numCols * (i - 1) + j;
                this._expandMineArea(index);

                // (i - 1, j - 1)
                if ((j - 1) >= 0)
                {
                    index = numCols * (i - 1) + j - 1;
                    this._expandMineArea(index);
                }

                // (i - 1, j + 1)
                if ((j + 1) < numCols)
                {
                    index = numCols * (i - 1) + j + 1;
                    this._expandMineArea(index);
                }
            }
            // Row (i + 1)
            if ((i + 1) < numRows)
            {
                // (i + 1, j)
                index = numCols * (i + 1) + j;
                this._expandMineArea(index);

                // (i + 1, j - 1)
                if ((j - 1) >= 0)
                {
                    index = numCols * (i + 1) + j - 1;
                    this._expandMineArea(index);
                }
                // (i + 1, j + 1)
                if ((j + 1) < numCols)
                {
                    index = numCols * (i + 1) + j + 1;
                    this._expandMineArea(index);
                }
            }
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            mine.className = 'mine_down_' + tempValue;
            oMine.innerText = tempValue.toString();
            oMine.setAttribute('expanded', true);
            break;
        case SWEEPER.Game.BLOCK_TYPE_MINE:
            break;
    }

    return null;
};

SWEEPER.Game.prototype._expandAll = function ()
{
    var i, tempValue, mine, bomb, error;
    var numCols = this.getNumCols();
    var numRows = this.getNumRows();
    var accumulate = numCols * numRows;

    for (i = 0; i < accumulate; i++)
    {
        mine = document.getElementById('mine_' + i);
        tempValue = parseInt(mine.getAttribute('mine_value'), 10);
        if (mine.getAttribute('expanded') === 'false')
        {
            switch (tempValue)
            {
                case SWEEPER.Game.BLOCK_TYPE_MINE:
                    // Keep flag if tagged correctly
                    if (mine.getAttribute('marked') === 'true')
                    {
                        mine.className = 'mine_down_bomb';
                        break;
                    }
                    // Show a mine flag otherwise
                    if (mine.hasChildNodes())
                    {
                        mine.removeChild(mine.firstChild);
                    }
                    mine.className = 'mine_down_bomb';

                    // Bomb image
                    bomb = document.createElement('img');
                    bomb.style.width = '15px';
                    bomb.style.height = '15px';
                    bomb.style.padding = '0px';
                    bomb.style.margin = '0px';
                    bomb.src = 'images/bomb.gif';
                    mine.appendChild(bomb);

                    mine.setAttribute('expanded', true);
                    break;
            }

            // If flag is wrong then show the error icon
            if (mine.getAttribute('marked') === 'true' && tempValue !== SWEEPER.Game.BLOCK_TYPE_MINE)
            {
                if (mine.hasChildNodes())
                {
                    mine.removeChild(mine.firstChild);
                }
                mine.className = 'mine_down_bomb';
                mine.innerText = '';

                // Error image
                error = document.createElement('img');
                error.style.width = '15px';
                error.style.height = '15px';
                error.style.padding = '0px';
                error.style.margin = '0px';
                error.src = 'images/error.gif';
                mine.appendChild(error);

                mine.setAttribute('expanded', true);
            }
        }
    }
};

/**
 * Initialise the mining area.
 * @param {number} numRows
 * @param {number} numCols
 * @param {number} numMines
 * @param {number|undefined} mineIndex
 * @private
 */
SWEEPER.Game.prototype._initMineArea = function (numRows, numCols, numMines, mineIndex)
{
    var accumulate = numRows * numCols;
    var minesArray = new Array(accumulate);
    var minesPos = new Array(accumulate);

    var i, j, k, l, index;
    var cur = 0; // TODO: CHECK IF NEEDED?

    // Init to self index
    for (i = 0; i < accumulate; i++)
    {
        minesPos[i] = i;
    }

    // Generate the random mine area
    for (i = 0; i < (2 * accumulate); i++)
    {
        // Generate two positions that between 0 and accumulate
        k = Math.round(Math.random() * accumulate);
        l = Math.round(Math.random() * accumulate);
        // Exchange the two positions
        var temp = minesPos[k];
        minesPos[k] = minesPos[l];
        minesPos[l] = temp;
    }

    // Init the minesArray to default (nothing)
    for (i = 0; i < numRows; i++)
    {
        for (j = 0; j < numCols; j++)
        {
            index = numCols * i + j;
            minesArray[index] = SWEEPER.Game.BLOCK_TYPE_DEFAULT;
        }
    }

    /**
     * SPECIAL CONDITION: If first click is a mine, regenerate the mine area, by putting the first
     * click index to the end of random array.
     */
    if (mineIndex)
    {
        for (i = 0; numMines; i++)
        {
            if (minesPos[i] === mineIndex)
            {
                var curPos = minesPos[i];
                minesPos[i] = minesPos[accumulate];
                minesPos[accumulate] = curPos;
                break;
            }
        }
    }

    // Set the mines' positions
    for (i = 0; i < numMines; i++)
    {
        minesArray[minesPos[i]] = SWEEPER.Game.BLOCK_TYPE_MINE;
    }

    // Generate the number beside a mine
    for (i = 0; i < numRows; i++)
    {
        for (j = 0; j < numCols; j++)
        {
            index = numCols * i + j;
            // If there is a mine
            if (minesArray[index] === SWEEPER.Game.BLOCK_TYPE_MINE)
            {
                // Row (i)
                // (i, j - 1)
                if ((j - 1) >= 0)
                {
                    index = numCols * i + j - 1;
                    if (minesArray[index] !== SWEEPER.Game.BLOCK_TYPE_MINE)
                    {
                        minesArray[index]++;
                    }
                }
                // (i, j + 1)
                if ((j + 1) < numCols)
                {
                    index = numCols * i + j + 1;
                    if (minesArray[index] !== SWEEPER.Game.BLOCK_TYPE_MINE)
                    {
                        minesArray[index]++;
                    }
                }

                // Row (i - 1)
                if ((i - 1) >= 0)
                {
                    // (i - 1, j)
                    index = numCols * (i - 1) + j;
                    if (minesArray[index] !== SWEEPER.Game.BLOCK_TYPE_MINE)
                    {
                        minesArray[index]++;
                    }
                    // (i - 1, j - 1)
                    if ((j - 1) >= 0)
                    {
                        index = numCols * (i - 1) + j - 1;
                        if (minesArray[index] !== SWEEPER.Game.BLOCK_TYPE_MINE)
                        {
                            minesArray[index]++;
                        }
                    }
                    // (i - 1, j + 1)
                    if ((j + 1) < numCols)
                    {
                        index = numCols * (i - 1) + j + 1;
                        if (minesArray[index] !== SWEEPER.Game.BLOCK_TYPE_MINE)
                        {
                            minesArray[index]++;
                        }
                    }
                }

                // Row (i + 1)
                if ((i + 1) < numRows)
                {
                    // (i + 1, j)
                    index = numCols * (i + 1) + j;
                    if (minesArray[index] !== SWEEPER.Game.BLOCK_TYPE_MINE)
                    {
                        minesArray[index]++;
                    }
                    // (i + 1, j - 1)
                    if ((j - 1) >= 0)
                    {
                        index = numCols * (i + 1) + j - 1;
                        if (minesArray[index] !== SWEEPER.Game.BLOCK_TYPE_MINE)
                        {
                            minesArray[index]++;
                        }
                    }
                    // (i + 1, j + 1)
                    if ((j + 1) < numCols)
                    {
                        index = numCols * (i + 1) + j + 1;
                        if (minesArray[index] !== SWEEPER.Game.BLOCK_TYPE_MINE)
                        {
                            minesArray[index]++;
                        }
                    }
                }
            }
        }
    }
    return minesArray;
};




