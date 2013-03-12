canvas = document.getElementById('canMain');
ctx = canvas.getContext('2d');
canvasPath = document.getElementById('canPath');
ctxPath = canvasPath.getContext('2d');
divCost = document.getElementById('divCost');

txtCities = document.getElementById('txtCities');
cities = new Array();  //array holding the coords of all the cities
visCities = new Array();	//array holding the coords of the cities already visited
canWidth = canvas.width;
canHeight = canvas.height;
finalCost = 0;

//function to be called to get the random coordinates of the cities and map the point on the canvas
function init(){
	finalCost = 0;
	getCities();
	mapCities();	
	for(var i=1;i<cities.length;i++){	//starting the loop from 1 because the fist position of the visCities array is already set as the initial city
		chkMinCost();
	}	
	document.getElementById('btnSetCities').style.display = "none";	//hide the set cities button
	document.getElementById('btnGo').style.display = "inline-block";	//show the Go button	
}

//function to randomly get the coordinates of the number of cities entered by the user
function getCities(){
	var i, x, y, coord, ctr;
	for(i=0;i<parseInt(txtCities.value);i++){
		ctr = false;	//everytime the loop begins set ctr = false
		x = Math.floor(Math.random() * 500);	//calculate the random X coordinate for the point
		y = Math.floor(Math.random() * 300);	//calculate the random Y coordinate for the point
		coord = x.toString() + "," + y.toString();	//randomly generated x,y coordinate of the point
		for(var j=0;j<cities.length;j++){		//loop till the length of cities array
			if(cities[j] === coord)		//check that the randomly generated point does not already exists in the cities array
				ctr = true;		//if point already exists in cities array, set ctr = true
		}
		if(!ctr)	//if ctr = false, means that the point is a new one so add it to the cities array
			cities[i] = coord;		//adding the point to the cities array
		else{	//else if ctr = true, means the point exists in cities array, so run the loop for the same value of i again
			i-=1;	//reduce the value of i to run the loop again for the same turn
			continue;	//continue the loop
		}			
	}	
}

//function to the map the cities as points on the canvas
function mapCities(){
	var arrCoords = [];
	var cityX = canWidth + 50;	//initializing the variable with the maximum value so that for the first city, the condition is always true
	for(var i=0;i<cities.length;i++){
		arrCoords = cities[i].split(',');
		
		
		if(cityX >= parseInt(arrCoords[0])){	//checking the X-coord of the current city is less than that of the previous city,to get initial city
			cityX = parseInt(arrCoords[0]);	//updating the value of cityX to the X-xoord of the current city
			visCities[0] = cities[i];	//setting our initial city
			currCity = cities[i];
		}
		
		ctx.arc(parseInt(arrCoords[0]), parseInt(arrCoords[1]), 3, 0 , 2 * Math.PI, false);	//marking the current city on canvas
		ctx.fillStyle = "#000000";		
		ctx.fill();
		
		
		
	}
}

//	function to check the optimal path for the salesman and also to calculate the cost
//	so that the path between the cities visited is minimum and no city is visited twice
function chkMinCost(){	
		var xyCurr = [];	
		var xyCity = [];
		var cost = 3000; //setting a maximum cost to initialize the variable. This I decided according to the size of my canvas.
		var ctr = 0;
		xyCurr = visCities[visCities.length-1].split(','); //taking the coordinates of the last city in the visited cities array as our current city
		for(var i=0;i<cities.length;i++){	//loop till the total number of cities on the canvas
			ctr = 0;	//initialize counter to 0 everytime the loop starts
			for(var j=0;j<visCities.length;j++){	//loop till the total number of cities currently in the visited cities array
				if(cities[i] != visCities[j])	//checking so that a city is not visited twice
					ctr+=1;				
			}
			if(ctr === visCities.length){	
				xyCity = cities[i].split(','); //getting the coordinates of the next city
				thisCost = Math.sqrt((Math.pow((parseInt(xyCity[0]) - parseInt(xyCurr[0])),2) + Math.pow((parseInt(xyCity[1]) - parseInt(xyCurr[1])),2)));	//calculating the distance between the two cities
				if(thisCost < cost){ //checking the city with the minimum distance 	from the current city
					cost = thisCost;
					currCity = cities[i];
				}
			}
		}
		visCities.push(currCity);	//found the next city so put it in the visited cities array so that it is not repeated
		if(cost!=3000)
			finalCost += cost;	//calculating the final cost
}

//function to map the path between the cities on the canvas
function mapPath(){
	visCities.push(visCities[0]); //setting the starting city
	xyPre = new Array();	
	xyCurr = new Array();
	
	for(var i=1;i < visCities.length;i++){	//loop till the length of visited cities array
		xyCurr = visCities[i].split(',');	//coordinates of current city
		xyPre = visCities[i-1].split(',');	//coordinates of previous city
		
		ctxPath.beginPath();
		ctxPath.font = "bold 20px Verdana";
		ctxPath.fillStyle = "#31698A";
		if(i<visCities.length-1)
			ctxPath.fillText(i.toString(),parseInt(xyCurr[0]),parseInt(xyCurr[1]));
		else{ //calculate the distance from the last city back to the initial city and add it to the final cost
			ctxPath.fillText("I",parseInt(xyCurr[0]),parseInt(xyCurr[1]));
			finalCost += Math.sqrt((Math.pow((parseInt(xyCurr[0]) - parseInt(xyPre[0])),2) + Math.pow((parseInt(xyCurr[1]) - parseInt(xyPre[1])),2)));
		}
		
		//drawing a line from previous to the next city
		ctxPath.moveTo(parseInt(xyPre[0]),parseInt(xyPre[1]));
		ctxPath.lineTo(parseInt(xyCurr[0]),parseInt(xyCurr[1]));
		ctxPath.stroke();
	}
	
	document.getElementById('btnSetCities').style.display = "inline-block";	//set cities button to visible
	document.getElementById('btnGo').style.display = "none";	//hide the Go button
	divCost.innerHTML = "Cost: "+Math.round(finalCost);	//add the final cost to the innerHTML of the cost div to display it
	document.getElementById('divControls').style.display = "none";	//hide the controls div
	document.getElementById('divCost').style.display = "inline-block";	//show the cost div
	document.getElementById('imgReplace').style.display = "inline-block";	//show the replacement image so as the the display does not looks odd
}
