# game-of-life-web

A webpage that runs [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) in a browser window. The simulation starts as soon as the page loads.

This was an experiment to see how much faster using a virtual DOM can be when a lot of DOM manipulations are occuring on a web page. Information about DOM elements is cached and the DOM is only called when the colour of a box needs to change.
