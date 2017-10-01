/**
 * @constructor
 */
SWEEPER.Game = function()
{

};
SWEEPER.Game.prototype.constructor = SWEEPER.Game;

SWEEPER.Game.prototype.init = function()
{
    var numRows = 8;
    var numCols = 8;
    var numMines = 10;
    var mineIndex = 1;
    this._initMineArea(numRows, numCols, numMines, mineIndex);
};

/**
 * Initialise the mining area.
 * @param numRows
 * @param numCols
 * @param numMines
 * @param mineIndex
 * @private
 */
SWEEPER.Game.prototype._initMineArea = function (numRows, numCols, numMines, mineIndex)
{
    var accumulate = numRows * numCols;
    var minesArray = new Array(accumulate);
    var minesPos = new Array(accumulate);

    var i, j, k, l, index, temp;
    var cur = 0;

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
        temp = minesPos[k];
        minesPos[k] = minesPos[l];
        minesPos[l] = temp;
    }

    // Init the minesArray to default (nothing)
    for (i = 0; i < numRows; i++)
    {
        for (j = 0; j < numCols; j++)
        {
            index = numCols * i + j;
            minesArray[index] = 0;
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
        minesArray[minesPos[i]] = 9; // TODO CHECK IF 9 IS A CONSTANT FOR MINE
    }

    // Generate the number beside a mine
    for (i = 0; i < numRows; i++)
    {
        for (j = 0; j < numCols; j++)
        {
            index = numCols * i + j;
            // If there is a mine
            if (minesArray[index] === 9)
            {
                // Row (i)
                // (i, j - 1)
                if ((j - 1) >= 0)
                {
                    index = numCols * i + j - 1;
                    if (minesArray[index] !== 9)
                    {
                        minesArray[index]++;
                    }
                }
                // (i, j + 1)
                if ((j + 1) < numCols)
                {
                    index = numCols * i + j + 1;
                    if (minesArray[index] !== 9)
                    {
                        minesArray[index]++;
                    }
                }

                // Row (i - 1)
                if ((i - 1) >= 0)
                {
                    // (i - 1, j)
                    index = numCols * (i - 1) + j;
                    if (minesArray[index] !== 9)
                    {
                        minesArray[index]++;
                    }
                    // (i - 1, j - 1)
                    if ((j - 1) >= 0)
                    {
                        index = numCols * (i - 1) + j - 1;
                        if (minesArray[index] !== 9)
                        {
                            minesArray[index]++;
                        }
                    }
                    // (i - 1, j + 1)
                    if ((j + 1) < numCols)
                    {
                        index = numCols * (i - 1) + j + 1;
                        if (minesArray[index] !== 9)
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
                    if (minesArray[index] !== 9)
                    {
                        minesArray[index]++;
                    }
                    // (i + 1, j - 1)
                    if ((j - 1) >= 0)
                    {
                        index = numCols * (i + 1) + j - 1;
                        if (minesArray[index] !== 9)
                        {
                            minesArray[index]++;
                        }
                    }
                    // (i + 1, j + 1)
                    if ((j + 1) < numCols)
                    {
                        index = numCols * (i + 1) + j + 1;
                        if (minesArray[index] !== 9)
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




