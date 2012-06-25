/*
 * Copyright 2011 Brent Buchholz
 * 
 * This file is part of jsMusic. 
 * 
 * jsMusic is free software: you can redistribute it and/or modify it under the 
 * terms of the GNU General Public License as published by the Free Software 
 * Foundation, either version 3 of the License, or (at your option) any 
 * later version. 
 * 
 * jsMusic is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License 
 * for more details. 
 * 
 * You should have received a copy of the GNU General Public License along 
 * with jsMusic. If not, see http://www.gnu.org/licenses/
 * 
 */

var fretEdgeGap = 10;
var stringEdgeGap = 10;
var fretboardMargin = 10;
var numStrings = 6;
var numFrets = 4;
var fretSpacing = 60;
var stringSpacing = 30;
var fretboardWidth = (numStrings - 1) * stringSpacing + 2 * fretEdgeGap;
var fretboardHeight = (numFrets + 1) * fretSpacing + stringEdgeGap;
var stringY1 = fretboardMargin + fretSpacing - stringEdgeGap;
var stringY2 = fretboardHeight + fretboardMargin;
var fretX1 = fretboardMargin;
var fretX2 = fretX1 + fretboardWidth;

var strings = [], frets = [], clickRegions = [];

function init(stringCount,fretCount)
{
	numStrings = stringCount;
	numFrets = fretCount;
	setStrings();
	setFrets();
	setClickRegions();
}

function getClickedIdArray()
{
	var clicked = [];
	for(var i = 0; i < clickRegions.length; i++)
	{
		if(clickRegions[i].isClicked)
		{
			clicked.push(clickRegions[i].id);
		}
	}
	return clicked;
}

function clickedIdArrayToString(idArray)
{
	var keyString = "";
	for(var i = 0; i < idArray.length; i++)
	{
		if(i != 0)
		{
			keyString += ", ";
		}
		keyString += idArray[i];
	}
	return keyString;
}

function setClickRegions()
{
	var i = 0;
	for(s in strings)
	{
		for(f in frets)
		{
			clickRegions[i] = createClickRegion(strings[s],frets[f],i);
			i++;			
		}
	}
}
 
function setStrings()
{
	for(var i = 0; i < numStrings; i++)
	{
		var stringX = fretboardMargin + fretEdgeGap + i * stringSpacing;
		strings[i] = {x: stringX, y1: stringY1, y2: stringY2, id: i};
	}
}

function setFrets()
{
	for(var i = 0; i <= numFrets; i++)
	{
		var fretY = fretboardMargin + (i + 1) * fretSpacing;
		frets[i] = {x1: fretX1, x2: fretX2, y: fretY, id: i};
	}
}

function createClickRegion(s,f,i)
{
	var r = {};
	r.x = s.x - stringSpacing / 2;
	r.y = f.y - fretSpacing;
	r.w = stringSpacing;
	r.h = fretSpacing;
	r.centerX = s.x;
	r.centerY = r.y + fretSpacing / 2;
	r.id = "{s:" + s.id + "-f:" + f.id + "}";
	r.index = i;
	r.isClicked = false;
	return r;
}

function drawString(context, s)
{	
	context.beginPath();
	context.moveTo(s.x - 0.5, s.y1 - 0.5);
	context.lineTo(s.x - 0.5, s.y2 - 0.5);
	context.stroke();
}

function drawFret(context, f)
{
	context.beginPath();
	context.moveTo(f.x1 - 0.5, f.y - 0.5);
	context.lineTo(f.x2 - 0.5, f.y - 0.5);
	context.stroke();
}

function drawNote(context,region)
{
	context.beginPath();
	context.arc(region.centerX,region.centerY,stringSpacing/3,0,2 * Math.PI, false);
	context.stroke();
}

function drawFretboard(context,canvas)
{	
	//clear Fretboard
	clearCanvas(canvas);

	//draw strings
	for(var i = 0; i < numStrings; i++)
	{
		drawString(context, strings[i]);
	}
	
	//draw frets
	for(var i = 0; i <= numFrets; i++)
	{
		drawFret(context, frets[i]);		
	}

	//highlight clicked notes
	for(var i = 0; i < clickRegions.length; i++)
	{
		var r = clickRegions[i];
		if(r.isClicked)
		{
			drawNote(context,r);
		}
	}
}

function clearCanvas(canvas)
{
	var ctx = canvas.getContext("2d");
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

function getClickedRegion(x, y)
{
	var clickedRegion = false;
	
	for(var i = 0; i < clickRegions.length; i++)
	{
		var region = clickRegions[i];
		var leftEdge = region.x, rightEdge = region.x + region.w;
		var topEdge = region.y, bottomEdge = region.y + region.h;

		if(rightEdge >= x &&
		   leftEdge <= x &&
		   bottomEdge >= y &&
		   topEdge <= y)
		{
			clickedRegion = region;
		}
	}
	return clickedRegion;
}

function loadFretboardToDiv(divId)
{
	var canvas = document.createElement("canvas");
	canvas.id = "fretboard1";
	
	var p = document.createElement("p");
	p.id = "fretboard1p";
	
	var div = document.getElementById(divId);
	div.appendChild(canvas);
	div.appendChild(p);
	
	createFretboard(canvas, p);
}	

function toggle(region)
{
	clickRegions[region.index].isClicked = !clickRegions[region.index].isClicked;
}
	
function createFretboard(canvasEl, canvasParaEl) 
{	
	canvasEl.height = fretboardHeight + fretboardMargin * 2;
	canvasEl.width = fretboardWidth + fretboardMargin * 2;
	
	//check if context exists
	if (canvasEl && canvasEl.getContext) 
	{		
		//get context
		var context = canvasEl.getContext("2d");
		if(context)
		{
			context.lineWidth = 1;
			init(6,4);
			drawFretboard(context,canvasEl);

			//listener
			canvasEl.addEventListener('click', function(e) {
				
				var x = e.offsetX, y = e.offsetY;
				var output = '';
				var region = getClickedRegion(x, y);

				if(region)
				{
					toggle(region);
					context.lineWidth = 1;
					drawFretboard(context,canvasEl);
				}

				var idStr = clickedIdArrayToString(getClickedIdArray());
				output += "Selected Ids: " + idStr;

				canvasParaEl.innerHTML = output;

			},false);
		}
	}

}
