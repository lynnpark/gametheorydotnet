/*
* Global Variables
*/
var matrix;
var arr = [];
var alphabet = 'ABCD'.split('');
var alphend = 'ZYXW'.split('');

/*
* Box Class
* Each box has Player 1's and Player 2's payoffs.
*
*/
var Box = function(i, j) {
	var x = Math.floor((Math.random() * 100) + 1); //p1's payoff
	var y = Math.floor((Math.random() * 100) + 1); //p2's payoff
	this.payoffs = [x, y];
	this.isBestReply = [0, 0]; // 1 if it is best reply
	this.uid = String(i)+String(j); //id
};


function initMatrix(numStrats) {
	matrix = new Array(numStrats);
	for (var n = 0; n < numStrats; n++) {
		matrix[n] = new Array(numStrats);
	}

	for (var i = 0; i < numStrats; i++) {
		for (var j = 0; j < numStrats; j++) {
			var box = new Box(i, j);
			matrix[i][j] = box;
			arr.push({
				uid: box.uid, 
				fSizePO: ko.observable(30),
				fSizePT: ko.observable(30)  
			});
		}
	}
}

function grid(rows,cols) {
	var table;
	var size = (1 / rows * 525) + "px";
	var ind = 0;
	var pone, ptwo;

	table = "<table><tr class = 'header' style = \"height:50px;\"><th></th>";
	for (var j = 0 ; j < cols ; j++) {
		table += "<th><p2>" + alphend[j] + "</p2></th>";
	}

	table += "</tr>";
	for (var i = 0 ; i < rows ; i++) {
		table += "<tr><th><p1>" + alphabet[i] +"</p1></th>";

		for (var j = 0 ; j < cols ; j++) {
			pone = matrix[i][j].payoffs[0];
			ptwo = matrix[i][j].payoffs[1];
			table += "<td><p1 data-bind = \"style : arr()[" 
				+ ind 
				+ "].fontSPO\">" 
				+ pone 
				+ "</p1><p2 data-bind = \"style : arr()[" 
				+ ind 
				+ "].fontSPT\">" 
				+ ptwo 
				+ "</p2></td>";
			ind ++;
		}
		table += "</tr>";
	}
	table += "</table>";

	$("#container").append(table);
	$("tr").css("height", size);
	$("td").css("width", size);
}


function solve(vm, numStrats) {
	// find P1's best replies
	for (var j = 0; j < numStrats; j++) {
		var m = -500;
		var mInd = -1; 
		 for (var i = 0; i < numStrats; i++) {
			var box = matrix[i][j];
			if (box.payoffs[0] > m) {
				m = box.payoffs[0];
				mInd = i; 
			}
		}
		matrix[mInd][j].isBestReply[0] = 1;
		console.log("P1: " + mInd + " "+ j);
	}

	// find P2's best replies
	for (var j = 0; j < numStrats; j++) {
		var n = -500;
		var nInd = -1;
		 for (var i = 0; i < numStrats; i++) {
			var box = matrix[j][i];
			if (box.payoffs[1] > n) {
				n = box.payoffs[1];
				nInd = i; 
			}
		}
		matrix[j][nInd].isBestReply[1] = 1;
		console.log("P2: " + j + " "+ nInd);
	}

	// change color of best replies
	for (var i = 0; i < numStrats; i++) {
		for (var j = 0; j < numStrats; j++) {
			if (matrix[i][j].isBestReply[0] === 1){
				chFontPO(matrix[i][j].uid, vm);
			}
			if (matrix[i][j].isBestReply[1] === 1){
				chFontPT(matrix[i][j].uid, vm);
			}
		}
	}
}


var viewModel = function(size, arr){
	this.size = ko.observable(size);
	this.arr = ko.observableArray(arr);

	ko.utils.arrayForEach(this.arr(), function(item){
		//SPO: strategy for player one
		item["fontSPO"] = ko.computed(function() {
			return {"font-size" : item.fSizePO() + "px"};
		});

		//SPT: strategy for player two
		item["fontSPT"] = ko.computed(function() {
			return {"font-size" : item.fSizePT() + "px"};
		});
	});

	this.fontSize = ko.computed(function () {
		return {"font-size" : this.size() + "px"};
	}, this);

}


function chFontPO(iud, vm) {
	var item;
	for (var q = 0 ; q < vm.arr().length ; q++) {
		item = vm.arr()[q];
		if (item.uid === iud) {
			item.fSizePO(70);
			return
		}
	}
}

function chFontPT(iud, vm) {
	var item;
	for (var q = 0 ; q < vm.arr().length ; q++) {
		item = vm.arr()[q];
		if (item.uid === iud) {
			item.fSizePT(70);
			return
		}
	}
}

$(document).ready(function() {
	$("#choose").dialog({
		modal: 'true',
		title: 'Simultaneous Games',
		buttons: {
			"2" : function() {
				var numStrats = 2;
				init(numStrats);
				$(this).dialog('close');
			},
			"3" : function() {
				var numStrats = 3;
				init(numStrats);
				$(this).dialog('close');
			}
		}
	});
});


function init(numStrats){
	initMatrix(numStrats);
	grid(numStrats,numStrats); //adds grids to global variable arr
	var vm = new viewModel(30, arr); //size is font size
	ko.applyBindings(vm, document.getElementById('viewCont'));

	$("#btnclick").click(function(){
		solve(vm, numStrats);
	});
}