/*
 * Global vars
 */

var numPlayers = 2;
var numStrats = 2;
var payoffs = [];
var cy;


$(function(){
	init();
	
});

function init() {
	var tree = addNodes();
	cy = window.cy = cytoscape(tree);

	cy.on('tap', '#solve', function() {
		console.log('yizzle'); //worked!!!!!!!!!!!!!
		solve();
	});

	cy.on('tap', function(evt){
		console.log( 'tap ' + evt.cyTarget.id() );
		addNode(evt.cyTarget.id());
	});
}

function addNodes(){
	var tree = {
		container: document.getElementById('cy'),
		boxSelectionEnabled: false,
		autounselectify: true,

		layout: {
			name : 'dagre',
			rankDir: 'LR',
			rankSep: '300'
		},

		style: [
			{
				selector: 'node',
				style: {
					'content': 'data(label)',
					'text-opacity': 0.5,
					'text-valign': 'center',
					'text-halign': 'right',
					'background-color': '#11479e'
				}
			},

			{
				selector: 'edge',
				style: {
					'label': 'data(label)',
					'width': 4,
					'target-arrow-shape': 'triangle',
					'line-color': '#9dbaea',
					'target-arrow-color': '#9dbaea'
				}
			},

            {
            	selector: '.autorotate',
            	style: {
            		'edge-text-rotation': 'autorotate'
            	}
            },

            {
            	selector: '.top-center',
            	style: {
                	'text-valign': 'top',
                	'text-halign': 'center'
              	}
            }, 

            {
            	selector: '.soln',
            	style: {
            		'content': 'data(label)',
            		'shape' : 'rectangle',
                	'text-valign': 'center',
                	'text-halign': 'center',
                	'border-color': '#0af597',
                	'border-width' : 4,
                	'background-color' : '#FFF',
                	'width' : 170,
                	'text-opacity': 1,
                	'text-outline-color': '#0af597',
                	'text-outline-width': 1.5
              	}
            }, 

            {
            	selector: '.equilibrium',
            	style: {
            		'background-color': '#FFF',
                	'text-outline-color': '#0af597',
                	'text-outline-width': 2,
                	'text-opacity': 1
              	}
            }, 

            {
            	selector: '.payoffs',
            	style: {
                	'background-color': '#FFF',
                	'text-opacity' : 1
              	}
            },

            {
            	selector: '.noEdge',
            	style: {
                	'label': 'data(label)',
					'width': 4,
					'target-arrow-shape': 'triangle',
					'line-color': '#FFF',
					'target-arrow-color': '#FFF'
              	}
            },

            {
            	selector: '.notBR',
            	style: {
					'width': 4,
					'target-arrow-shape': 'triangle',
					'line-color': '#FFF',
					'target-arrow-color': '#FFF',
					'opacity' : 0.66
              	}
            }
		],

		elements: {
			nodes: [
				{ data: { id: 'solve', label: 'Click to show solution' }, classes: 'soln' },
				{ data: { id: '1', label: 'Player 1' }, classes: 'top-center' },
			],
			edges: [	
			]

		},
	};

	var parents = [];
	var alphabet = 'ABCDEFG'.split('');

	//make n strats for Player 1
	for (var n = 0; n<numStrats; n++) {
		node = { 
			data: { 
				id: String(2) + String(n), 
				label: 'Player 2' 
			}, 
			classes: 'top-center'
		};
		tree.elements.nodes.push(node);
		parents.push(node.data.id);
		console.log(node.data.id);

		edge = { 
			data: { 
				source: '1', 
				target: node.data.id, 
				label: alphabet[n] 
			}, 
			classes: 'autorotate' 
		};
		tree.elements.edges.push(edge);
	}

	var node, edge; 
	var pstb = [];
	var path;

	for (var i = 0; i < numPlayers-2; i++){
		for (var k = 0; k < parents.length; k++){
			for (var j = 0; j < numStrats; j++) {
				node = { 
					data: { 
						id: String(i+3) + String(k) + String(j), 
						label: 'Player' + (i+3) 
					}, 
					classes: 'top-center'
				};

				tree.elements.nodes.push(node);
				pstb.push(node.data.id);

				edge = { 
					data: { 
						source: parents[k], 
						target: node.data.id, 
						label: alphabet[j] 
					}, 
					classes: 'autorotate' 
				};
				tree.elements.edges.push(edge);
			}
		}
		parents = pstb;
		pstb = [];
	}

	return tree;
}

function addPayoffs(){
	//add labels for payoffs
	var lblarr = [];
	for (var z = 0; z < numPlayers; z++) {
		lblarr.push("P" + String(z+1));
	}
	var lbl = lblarr.join('  ');

	node = { 
		data: { 
			id: 'lbls', 
			label: lbl
		}, 
		classes: 'payoffs'
	};
	tree.elements.nodes.push(node);

	edge = {
		data: {
			source: parents[0],
			target: 'lbls'
		},
		classes: 'noEdge'
	};
	tree.elements.edges.push(edge);

	payoffs = makePayoffs();

	var nd = 0;
	//add payoffs
	for (var m = 0; m < parents.length; m++){
		for (var p = 0; p < numStrats; p++) {
			node = { 
				data: { 
					//id: 'p' + m + p, 
					//id: nd,
					id: 'p' + nd,
					label: payoffs[nd].join('  ')
				}, 
				classes: 'payoffs'
			};

			tree.elements.nodes.push(node);
			pstb.push(node.data.id);

			console.log(node.data.id);

			edge = { 
				data: { 
					source: parents[m], 
					target: node.data.id, 
					label: alphabet[p] 
				}, 
				classes: 'autorotate' 
			};
			tree.elements.edges.push(edge);
			nd++;
		}
	}

}

function makePayoffs() {
	var payoffs = [];
	var pyf;
	for (var i = 0 ; i < Math.pow(numStrats, numPlayers); i++) {
		pyf = [];
		for (var j = 0; j < numPlayers; j++) {
			pyf.push(Math.floor((Math.random() * 100) + 1));
		}
		payoffs.push(pyf);
	}
	return payoffs;
}

function addNode(nodeid){
	var node = { 
		group: "nodes",
		data: { 
			id: 'eh', 
			label: 'Player'  
		}, 
		classes: 'top-center'
	};

	//tree.elements.nodes.push(node);
	//pstb.push(node.data.id);

	cy.add(node);

	var edge = {
		group: "edges", 
		data: { 
			source: nodeid, 
			target: node.data.id, 
			label: "z"
		}, 
		classes: 'autorotate' 
	};
	//tree.elements.edges.push(edge);

	cy.add(edge);
}



function solve() {
	var numGroups = payoffs.length/numStrats;
	var max, maxInd, mi;
	var maxInds = {};
	var n = 0; 
	var temp = [];
	var toCmp = Array.apply(null, Array(payoffs.length)).map(function (_, i) {return i;});
	var maxStrat;

	for (var i = numPlayers ; i > 0 ; i--){
		mi = [];
		for (var j = 0 ; j < numGroups ; j++) {
			max = -1;
			maxInd = -1;
			for (var k = 0 ; k < numStrats ; k++) {
				if (max < payoffs[toCmp[n]][i-1]) {
					maxInd = toCmp[n];
					max = payoffs[toCmp[n]][i-1];
				}
				n++;
			}
			temp.push(maxInd);
			mi.push(maxInd);
			console.log('player ' + i + ' index: ' + maxInd + '   max: ' + max);
		}
		maxInds['Player' + i] = mi;
		toCmp = temp;
		console.log(toCmp);
		temp = [];
		n = 0;
		numGroups = numGroups/numStrats;
	}
	console.log(maxInds);
	
	showSoln(maxInds);
}

function showSoln(inds) {
	var eq = '#p' + inds.Player1[0];
	var eqNode = cy.$(eq);
	eqNode.removeClass('payoffs');
	eqNode.addClass('equilibrium');

}