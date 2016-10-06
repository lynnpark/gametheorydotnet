 
function setPayoffs(strats, players) {

}

function makePayoffs(players) {
    var payoffs = new Array(players);
    var x;
    for (var i = 0 ; i < players ; i++) {
        x = Math.floor((Math.random() * 100) + 1);
        payoffs[i] = x;
    }
    return payoffs;
}


 var chart_config = {
    chart: {

        container: "#OrganiseChart6",
        levelSeparation:    20,
        siblingSeparation:  40,
        subTeeSeparation:   15,
        rootOrientation: "WEST",

        connectors: {
            type: "straight",
            style: {
                "stroke-width": 2,
                "stroke": "#ddd"
            }
        },

        node: {
            HTMLclass: "evolution-tree",
            drawLineThrough: true
        }
    },

    nodeStructure: {
        text: {
            name: "Player 1"
        },

        HTMLclass: "winner",

    }
 };


function makeTree() {
    var jsn;
    var strats, players;

    if (document.getElementById('st2').checked) {
        strats = document.getElementById('st2').value;
    }

    else if (document.getElementById('st3').checked) {
        strats = document.getElementById('st3').value;
    }

    else if (document.getElementById('st4').checked) {
        strats = document.getElementById('st4').value;
    }

    if (document.getElementById('pl2').checked) {
        players = document.getElementById('pl2').value;
    }

    else if (document.getElementById('pl3').checked) {
        players = document.getElementById('pl3').value;
    }

    else if (document.getElementById('pl4').checked) {
        players = document.getElementById('pl4').value;
    }

    setPayoffs(strats, players);

    var current = chart_config.nodeStructure; //current is the starting player
    
    current["children"] = [];

    //make n strats for second player
    for (var n = 0 ; n<strats ; n++) {
        current.children.push(
            {
               text: {
                name: "Player 2"
               },

               HTMLclass: "first-draw"
            }
        );  
    }

    var parents = current.children;
    var pstb = new Array();

    for (var i = 0 ; i<players-1 ; i++) {
        for (var j = 0; j<parents.length ; j++) {
            parent = parents[j];
            parent["children"] = [];
            for (var n = 0 ; n<strats ; n++) {
                var x = parent.children.push( 
                    {
                       text: {
                        name: "",
                       },
                       HTMLclass: "first-draw"
                    }
                );

                parent.children[x-1].text['name'] = "Player " + String(i+3);
            }
            pstb = pstb.concat(parent["children"]);
        }
        parents = pstb;
        pstb = new Array();

        if (i === players-2){
            for (var m = 0; m<parents.length; m++) {
                //console.log(parents[m].text);
                parents[m].text['name'] += "            " + 10 + " " + 21;
            }
        }
    }

    new Treant( chart_config );
};

