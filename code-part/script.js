// Sena Altıntaş - 150118007
// Mehmet Akif Akkaya - 150118041


// Definition of the Node class to hold the States
class Node {
    constructor(value, parent, depth) {
        this.value = value;
        this.parent = parent;
        this.depth = depth;
    }
    getValue() {
        return this.value;
    }
}


// variables for calculation and conditions
var frontierList = [];
var loop = 1;
var isDFS;
var isRandom;
var isHeuristic;
var depthLimit;
var minScore = 999999;
var minNode;
var foundTime;
var minPeg = 33;
var expandedNodes = 0;
var frontierSize = -1;
var explored = 1;
var memory = -1;
var isFoundAnySolution = 0;
var isOptimal = 0;


// Depth-First Search
function DFS() {
    document.getElementById("info").style.display = "initial";
    document.getElementById("select").style.display = "none";

    // Check if user has set time limit
    if ((document.getElementById("time-input").value) <= 0) {
        document.getElementById("input-error").style.display = "initial";
        document.getElementById("info").style.display = "none";
        document.getElementById("select").style.display = "initial";
    } else {
        setTimeout(() => {
            // get time limit from input
            var timeLimit = document.getElementById("time-input").value * 60;
            var start = Date.now(); // timer start

            isDFS = 1;
            isRandom = 0;
            isHeuristic = 0;

            var initialState = createInitialState(); // create initial state
            let root = new Node(initialState, null, 0); // create root node
            frontierList.push(root); // place root to frontier
            while (true) {
                var delta = Date.now() - start; // calculate total time
                // if time is up stop and print outputs
                if (Math.floor(delta / 1000) >= timeLimit || frontierList.length == 0) {
                    if (isOptimal == 1) {
                        document.write("Optimum solution found.");
                    } else {
                        document.write("Sub-optimum Solution Found with " + minPeg + " remaining pegs<br>");

                    }
                    if (isFoundAnySolution == 1) {
                        document.write("Total time to find the solution: " + Math.floor((foundTime - start) / 1000) + " seconds<br>");

                    }
                    document.write("The number of nodes expanded during the search: " + expandedNodes);
                    document.write("<br>Max number of nodes stored in the memory during the search: " + memory);
                    
                    var node = minNode;
                    var nodeArray = []

                    // find and reverse the parents of the solution node to print all the steps of the solution
                    for (var i = 0; i <= minNode.depth; i++) {
                        nodeArray.push(node);
                        node = (node.parent);
                    }

                    // print all steps
                    for (var i = nodeArray.length - 1; i > -1; i--) {
                        document.write("<h2>Step " + (nodeArray.length - i) + "</h2>");
                        printState(nodeArray[i].value);
                        document.write("<br>");
                    }
                    return;
                }

                // Expand the node from the end of the frontierlist and add the children of the node to the end of the frontierlist
                frontierList.push(...Array.from(findChilds(frontierList.pop()).keys()));

                // find the largest frontierlist
                if (frontierList.length > frontierSize) {
                    frontierSize = frontierList.length;
                }

                // find max number of nodes stored in the memory during the search.
                if (frontierSize + explored > memory) {
                    memory = frontierSize + explored;
                }

                // When a node is expanded, it increases the number of expanded nodes.
                expandedNodes++;
            }

        }, 1000);
    }
}


// Depth-First Search with a Node Selection Heuristic
function heuristicDFS() {
    document.getElementById("info").style.display = "initial";
    document.getElementById("select").style.display = "none";

    // Check if user has set time limit
    if ((document.getElementById("time-input").value) <= 0) {
        document.getElementById("input-error").style.display = "initial";
        document.getElementById("info").style.display = "none";
        document.getElementById("select").style.display = "initial";
    } else {
        setTimeout(() => {
            // get time limit from input
            var timeLimit = document.getElementById("time-input").value * 60;
            var start = Date.now(); // timer start
            isDFS = 1;
            isRandom = 0;
            isHeuristic = 1;
            var initialState = createInitialState(); // create initial state
            let root = new Node(initialState, null, 0); // create root node
            frontierList.push(root); // place root to frontier
            while (true) {
                var delta = Date.now() - start; // calculate total time
                // if time is up stop and print outputs
                if (Math.floor(delta / 1000) >= timeLimit || frontierList.length == 0) {
                    if (isOptimal == 1) {
                        document.write("Optimum solution found.");
                    } else {
                        document.write("Sub-optimum Solution Found with " + minPeg + " remaining pegs<br>");

                    }

                    if (isFoundAnySolution == 1) {
                        document.write("Total time to find the solution: " + Math.floor((foundTime - start) / 1000) + " seconds<br>");

                    }
                    document.write("The number of nodes expanded during the search: " + expandedNodes);
                    document.write("<br>Max number of nodes stored in the memory during the search: " + memory);
                    var node = minNode;
                    var nodeArray = []

                    // find and reverse the parents of the solution node to print all the steps of the solution
                    for (var i = 0; i <= minNode.depth; i++) {
                        nodeArray.push(node);
                        node = (node.parent);
                    }

                    // print all steps
                    for (var i = nodeArray.length - 1; i > -1; i--) {
                        document.write("<h2>Step " + (nodeArray.length - i) + "</h2>");
                        printState(nodeArray[i].value);
                        document.write("<br>");
                    }
                    return;
                }

                // Expand the node from the end of the frontierlist and add the children of the node to the end of the frontierlist
                frontierList.push(...Array.from(findChildsOrderByHue(frontierList.pop()).keys()));
                
                // find the largest frontierlist
                if (frontierList.length > frontierSize) {
                    frontierSize = frontierList.length;

                }

                // find max number of nodes stored in the memory during the search.
                if (frontierSize + explored > memory) {
                    memory = frontierSize + explored;
                }

                // When a node is expanded, it increases the number of expanded nodes.
                expandedNodes++;
            }

        }, 1000);
    }


}


// Iterative Deepening Search
function IterativeDFS() {

    document.getElementById("info").style.display = "initial";
    document.getElementById("select").style.display = "none";

    // Check if user has set time limit
    if ((document.getElementById("time-input").value) <= 0) {
        document.getElementById("input-error").style.display = "initial";
        document.getElementById("info").style.display = "none";
        document.getElementById("select").style.display = "initial";
    } else {
        setTimeout(() => {
            // get time limit from input
            var timeLimit = document.getElementById("time-input").value * 60;
            var start = Date.now();
            isDFS = 1;
            isRandom = 0;
            isHeuristic = 0;
            var initialState = createInitialState(); // create initial state
            let root = new Node(initialState, null, 0); // create root node
            var children;


            // iterative DFS starting from 0
            for (depthLimit = 0; depthLimit < 100; depthLimit++) {

                frontierList.push(root); // start frontier list.

                // DFS until all nodes in frontierlist are expanded
                while (frontierList.length > 0) {
                    var delta = Date.now() - start; // calculate total time
                    // if time is up stop and print outputs
                    if (Math.floor(delta / 1000) >= timeLimit || frontierList.length == 0) {
                        document.write("Sub-optimum Solution Found with " + minPeg + " remaining pegs<br>");

                        if (isFoundAnySolution == 1) {
                            document.write("Total time to find the solution: " + Math.floor((foundTime - start) / 1000) + " seconds<br>");

                        }
                        document.write("The number of nodes expanded during the search: " + expandedNodes);
                        document.write("<br>Max number of nodes stored in the memory during the search: " + memory);
                        var node = minNode;
                        var nodeArray = []

                        // find and reverse the parents of the solution node to print all the steps of the solution
                        for (var i = 0; i <= minNode.depth; i++) {
                            nodeArray.push(node);
                            node = (node.parent);
                        }

                        // print all steps
                        for (var i = nodeArray.length - 1; i > -1; i--) {
                            document.write("<h2>Step " + (nodeArray.length - i) + "</h2>");
                            printState(nodeArray[i].value);
                            document.write("<br>");
                        }
                        return;
                    }

                    children = Array.from(findChilds(frontierList.pop()).keys());

                    // Expand the node from the end of the frontierlist and add the children of the node to the end of the frontierlist
                    if (children.length >= 1 && children[0].depth <= depthLimit) {
                        frontierList.push(...children);
                    }

                    // find the largest frontierlist
                    if (frontierList.length > frontierSize) {
                        frontierSize = frontierList.length;

                    }

                    // find max number of nodes stored in the memory during the search.
                    if (frontierSize + explored > memory) {
                        memory = frontierSize + explored;
                    }

                    // When a node is expanded, it increases the number of expanded nodes.
                    expandedNodes++;
                }
            }
        }, 1000);
    }

}

// Breadth-First Search
function BFS() {
    document.getElementById("info").style.display = "initial";
    document.getElementById("select").style.display = "none";

    // Check if user has set time limit
    if ((document.getElementById("time-input").value) <= 0) {
        document.getElementById("input-error").style.display = "initial";
        document.getElementById("info").style.display = "none";
        document.getElementById("select").style.display = "initial";
    } else {
        setTimeout(() => {
            // get time limit from input
            var timeLimit = document.getElementById("time-input").value * 60;
            var start = Date.now(); // start timer

            isDFS = 1;
            isRandom = 0;
            isHeuristic = 0;

            var initialState = createInitialState(); // create initial state
            let root = new Node(initialState, null, 0); // create root node
            frontierList.push(root); // start frontierlist
            while (true) {
                var delta = Date.now() - start; // calculate total time
                // if time is up stop and print outputs
                if (Math.floor(delta / 1000) >= timeLimit || frontierList.length == 0) {
                    var node = minNode;
                    var nodeArray = []

                    // find and reverse the parents of the solution node to print all the steps of the solution
                    for (var i = 0; i <= minNode.depth; i++) {
                        nodeArray.push(node);
                        node = (node.parent);
                    }

                    // print all steps if exists
                    if (isFoundAnySolution == 1) {
                        if (isOptimal == 1) {
                            document.write("Optimum solution found.");
                        } else {
                            document.write("Sub-optimum Solution Found with " + minPeg + " remaining pegs<br>");

                        }
                    } else {
                        document.write("No result is not found within the specified time.<br>Depth of the deepest expanded node: " + minNode.depth + "<br>");
                    }

                    if (isFoundAnySolution == 1) {
                        document.write("Total time to find the solution: " + Math.floor((foundTime - start) / 1000) + " seconds<br>");

                    }
                    document.write("The number of nodes expanded during the search: " + expandedNodes);
                    document.write("<br>Max number of nodes stored in the memory during the search: " + memory);

                    for (var i = nodeArray.length - 1; i > -1; i--) {
                        document.write("<h2>Step " + (nodeArray.length - i) + "</h2>");
                        printState(nodeArray[i].value);
                        document.write("<br>");
                    }
                    return;
                }

                // Expand the node from the end of the frontierlist and add the children of the node to the end of the frontierlist
                frontierList.push(...Array.from(findChilds(frontierList.shift()).keys()));

                // find the largest frontierlist
                if (frontierList.length > frontierSize) {
                    frontierSize = frontierList.length;

                }

                // find max number of nodes stored in the memory during the search.
                if (frontierSize + explored > memory) {
                    memory = frontierSize + explored;
                }

                // When a node is expanded, it increases the number of expanded nodes.
                expandedNodes++;
            }

        }, 1000);
    }
}


// heuristic: choose the minimum sum of the absolute values ​​of the difference of the indexes of the pegs with the center.
// Function that returns the children of the given node by sorting them according to heuristic
function findChildsOrderByHue(node) {
    var children = new Map(); // create map to return
    var gfg = node.getValue(); // get array of state
    var tempState = structuredClone(gfg); // copy array of state
    var score; // heuristic score. small is good. 

    // traverse the entire array
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {

            // if find blank area stop and find children.
            if (node.value[i][j] == 0) {
                gfg = structuredClone(tempState); // clone before change.

                // check if there is a top-down movement
                if (i > 1 && (gfg[i - 1][j] == 1 && gfg[i - 2][j] == 1)) {

                    // value of child.
                    gfg[i][j] = 1;
                    gfg[i - 1][j] = 0;
                    gfg[i - 2][j] = 0;

                    score = 0; // reset score

                    score = getScore(gfg); // find score

                    // add child to map with score and depth
                    children.set(new Node(gfg, node, node.depth + 1), score);
                }

                // check if there is a left-right movement
                gfg = structuredClone(tempState);
                if (j > 1 && (gfg[i][j - 1] == 1 && gfg[i][j - 2] == 1)) {

                    // value of child.
                    gfg[i][j] = 1;
                    gfg[i][j - 1] = 0;
                    gfg[i][j - 2] = 0;

                    score = 0; // reset score

                    score = getScore(gfg); // find score

                    // add child to map with score and depth
                    children.set(new Node(gfg, node, node.depth + 1), score);

                }
                gfg = structuredClone(tempState);

                // check if there is a right-left movement
                if (j < 5 && (gfg[i][j + 1] == 1 && gfg[i][j + 2] == 1)) {

                    // value of child.
                    gfg[i][j] = 1;
                    gfg[i][j + 1] = 0;
                    gfg[i][j + 2] = 0;

                    score = 0; // reset score

                    score = getScore(gfg); // find score

                    // add child to map with score and depth
                    children.set(new Node(gfg, node, node.depth + 1), score);

                }
                gfg = structuredClone(tempState);

                // check if there is a down-up movement
                if (i < 5 && (gfg[i + 1][j] == 1 && gfg[i + 2][j] == 1)) {

                    // value of child.
                    gfg[i][j] = 1;
                    gfg[i + 1][j] = 0;
                    gfg[i + 2][j] = 0;

                    score = 0; // reset score

                    score = getScore(gfg); // find score

                    // add child to map with score and depth
                    children.set(new Node(gfg, node, node.depth + 1), score);

                }
            }
        }
    }

    explored += children.size; // add number of children.

    // if find new solution
    if (children.size == 0) {
        // control if new best solution
        if (32 - node.depth <= minPeg) {
            if (getScore(node.value) < minScore) {
                minScore = getScore(node.value);
                minNode = structuredClone(node);
                minPeg = 32 - node.depth
                foundTime = Date.now();
                if (getScore(node.value) == 0) {
                    isOptimal = 1; // Optimal solution
                }
            }
        }
    }



    return new Map([...children.entries()].sort((a, b) => b[1] - a[1]));
}

// Function that returns the children of the given node by sorting them according to algorithms
function findChilds(node) {
    var children = new Map(); // create map to return
    var gfg = node.getValue(); // get array of state
    var tempState = structuredClone(gfg); // copy array of state
    var removedPegNumber;

    // traverse the entire array
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {

            // if find blank area stop and find children.
            if (node.value[i][j] == 0) {
                gfg = structuredClone(tempState); // clone before change.

                // check if there is a top-down movement
                if (i > 1 && (gfg[i - 1][j] == 1 && gfg[i - 2][j] == 1)) {

                    // value of child.
                    gfg[i][j] = 1;
                    gfg[i - 1][j] = 0;
                    gfg[i - 2][j] = 0;


                    removedPegNumber = findPegNumber(i - 1, j); // find index of peg

                    // add child to map with depth and index of peg
                    children.set(new Node(gfg, node, node.depth + 1), removedPegNumber);

                }
                gfg = structuredClone(tempState);

                // check if there is a left-right movement
                if (j > 1 && (gfg[i][j - 1] == 1 && gfg[i][j - 2] == 1)) {

                    // value of child.
                    gfg[i][j] = 1;
                    gfg[i][j - 1] = 0;
                    gfg[i][j - 2] = 0;
                    removedPegNumber = findPegNumber(i, j - 1); // find index of peg

                    // add child to map with depth and index of peg
                    children.set(new Node(gfg, node, node.depth + 1), removedPegNumber);

                }
                gfg = structuredClone(tempState);

                // check if there is a right-left movement
                if (j < 5 && (gfg[i][j + 1] == 1 && gfg[i][j + 2] == 1)) {

                    // value of child.
                    gfg[i][j] = 1;
                    gfg[i][j + 1] = 0;
                    gfg[i][j + 2] = 0;
                    removedPegNumber = findPegNumber(i, j + 1); // find index of peg

                    // add child to map with depth and index of peg
                    children.set(new Node(gfg, node, node.depth + 1), removedPegNumber);

                }
                gfg = structuredClone(tempState);


                // check if there is a down-top movement
                if (i < 5 && (gfg[i + 1][j] == 1 && gfg[i + 2][j] == 1)) {

                    // value of child.
                    gfg[i][j] = 1;
                    gfg[i + 1][j] = 0;
                    gfg[i + 2][j] = 0;
                    removedPegNumber = findPegNumber(i + 1, j); // find index of peg

                    // add child to map with depth and index of peg
                    children.set(new Node(gfg, node, node.depth + 1), removedPegNumber);

                }
            }
        }
    }


    explored += children.size; // add number of children.

    if (isFoundAnySolution == 0 && children.size == 0) {
        isFoundAnySolution = 1;
    }

    // if find new solution
    if (32 - node.depth <= minPeg) {
        // control if new best solution
        if (getScore(node.value) < minScore) {
            minScore = getScore(node.value);
            minNode = structuredClone(node);
            minPeg = 32 - node.depth
            foundTime = Date.now();
            if (getScore(node.value) == 0) {
                isOptimal = 1;
            }
        }
    }


    if (isDFS == 1) {
        // if Random sort randomly
        if (isRandom == 1) {
            return shuffleMap(children);
        } else { // if DFS then sort from largest to smallest
             
            return new Map([...children.entries()].sort((a, b) => b[1] - a[1]));
        }
    } else { // if BFS then sort from smallest to largest
        return new Map([...children.entries()].sort((b, a) => b[1] - a[1]));
    }
}


// Shuffle map for random DFS
function shuffleMap(map) {
    const keys = Array.from(map.keys());
    keys.sort(() => Math.random() - 0.5);
    const shuffledMap = new Map();
    for (const key of keys) {
        shuffledMap.set(key, map.get(key));
    }
    return shuffledMap;
}


// Find index of peg
function findPegNumber(i, j) {
    var pegNumber;
    if (i < 2) {
        pegNumber = (i * 3) + (j - 1)
    } else if (i < 5) {
        pegNumber = 7 + ((i - 2) * 7) + j;
    } else {
        pegNumber = ((i - 5) * 3) + (j - 1) + 27;
    }

    return pegNumber;
}

// Create initial state
function createInitialState() {
    var gfg = new Array(7);
    for (var i = 0; i < gfg.length; i++) {
        gfg[i] = new Array(7);
    }

    var h = 0;
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if (isWall(h)) {
                gfg[i][j] = -1; // Wall
            } else if (h == 24) {
                gfg[i][j] = 0; // Blank
            } else {
                gfg[i][j] = 1; // Peg
            }
            h++;
        }
    }
    return gfg;
}

// Print state value
function printState(gfg) {
    document.write("<div style='width:350; background-color: #e0e0e0;'>");
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if (gfg[i][j] == -1) {
                document.write("<img style='width: 50px; height:50px;' src='https://i.hizliresim.com/3vqjcwh.png' />");
            } else if (gfg[i][j] == 0) {
                document.write("<img style='width: 50px; height:50px;' src='https://i.hizliresim.com/bz5rkyg.png' />");
            } else {
                document.write("<img style='width: 50px; height:50px;' src='https://i.hizliresim.com/qvx9bns.png' />");
            }
        }
        document.write("<br>");
    }
    document.write("</div>");

}

// Control is Wall or not
function isWall(index) {
    if (index == 0 || index == 1 || index == 5 || index == 6
        || index == 7 || index == 8 || index == 12 || index == 13
        || index == 35 || index == 36 || index == 40 || index == 41
        || index == 42 || index == 43 || index == 47 || index == 48) {
        return true;
    }
}


// Calculate score
function getScore(gfg) {
    var scoreCounter = 0;
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            if (gfg[i][j] == 1) {
                scoreCounter += Math.abs(findPegNumber(i, j) - 17);
            }
        }
    }
    return scoreCounter;
}

