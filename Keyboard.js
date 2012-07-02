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

//blackKeyWidth is set to 21 as it yields cleaner 
//lines for the calculations below
//change to 20 to see the difference
var blackKeyWidth = 21; 
var keyboardMargin = 10;
var numOctaves = 2; //hardcoded for now, but will be softcoded eventually. logic already allows for it to vary.
var blackKeyHeight = 60;
var octaveWidth = 11 * blackKeyWidth; 
var whiteKeyWidth = octaveWidth / 7; 
var whiteKeyHeight = blackKeyHeight * 1.5;
var keyboardWidth = octaveWidth * numOctaves;
var keyboardHeight = whiteKeyHeight;

var whiteKeys = [], blackKeys = [], allKeys = [];

function createKeys(divIndex)
{
	for(var i = 0; i < numOctaves; i++)
	{
		createOctaveKeys(i,divIndex);
	}
}

function getHighlightedKeyIndexes()
{
	var highlighted = [];
	for(var j = 0; j < allKeys.length; j++)
	{
		highlighted[j] = new Array();
		for(var i = 0; i < allKeys[j].length; i++)
		{
			if(allKeys[j][i].isClicked)
			{
				highlighted[j].push(i);
			}
		}
	}
	return highlighted;
}

function highlightedIndexArrayToString(indexArray, divIndex)
{
	var keyString = "";
	for(var i = 0; i < indexArray[divIndex].length; i++)
	{
		if(i != 0)
		{
			keyString += ", ";
		}
		keyString += indexArray[divIndex][i].toString();
	}
	return keyString;
}

function createOctaveKeys(octaveNum, divIndex)
{
	var whiteKeyIndex = octaveNum * 7;
	var blackKeyIndex = octaveNum * 7;
	var keyboardIndex = octaveNum * 12;
	var key;
		
	for(var i = 0; i < 12; i++)
	{		
		switch(i)
		{
			case 0:
			case 2:
			case 4:
			case 5:
			case 7:
			case 9:
			case 11:
				key = createWhiteKey(whiteKeyIndex, keyboardIndex, divIndex);
				whiteKeys[divIndex][whiteKeyIndex] = key;
				allKeys[divIndex][keyboardIndex] = key;
				whiteKeyIndex++;
				break;				
			case 6:
				blackKeyIndex++;
			case 1:
			case 3:
			case 8:
			case 10:
				key = createBlackKey(blackKeyIndex, keyboardIndex, divIndex);
				blackKeys[divIndex][blackKeyIndex] = key;
				allKeys[divIndex][keyboardIndex] = key;
				blackKeyIndex++;
				break;
		}
		keyboardIndex++;
	}
	
	return key;
}

function createWhiteKey(wki, ki, divIndex)
{
	var key = {};
	key.x = wki * whiteKeyWidth + keyboardMargin;
	key.y = keyboardMargin;
	key.w = whiteKeyWidth;
	key.h = whiteKeyHeight;	
	key.centerX = key.x + whiteKeyWidth / 2;
	key.nr = whiteKeyWidth / 4;
	key.centerY = key.y + whiteKeyHeight - key.nr * 2;
	key.id = ki;
	key.divId = divIndex;
	key.isClicked = false;
	return key;
}

function createBlackKey(bki, ki, divIndex)
{
	var key = {};
	key.x = (bki + 1) * whiteKeyWidth - (blackKeyWidth * 0.5) + keyboardMargin;
	key.y = keyboardMargin;
	key.w = blackKeyWidth;
	key.h = blackKeyHeight;
	key.centerX = key.x + blackKeyWidth / 2;
	key.nr = blackKeyWidth / 4;
	key.centerY = key.y + blackKeyHeight - key.nr * 2;
	key.id = ki;
	key.divId = divIndex;
	key.isClicked = false;
	return key;
}

function drawWhiteKey(context, w)
{
	context.beginPath();
	context.strokeStyle = "black";
	context.strokeRect(w.x - 0.5,w.y - 0.5,w.w,w.h);	
	if(w.isClicked)
	{
		drawWhiteKeyNote(context, w);
	}
}

function drawBlackKey(context, b)
{
	context.beginPath();
	context.fillStyle = "black";
	context.fillRect(b.x - 0.5,b.y - 0.5,b.w,b.h);	
	if(b.isClicked)
	{
		drawBlackKeyNote(context, b);
	}
}

function drawBlackKeyNote(context, b)
{
	context.beginPath();
	context.strokeStyle = "white";
	context.fillStyle = "white";
	context.arc(b.centerX,b.centerY,b.nr,0,2 * Math.PI, false);
	context.closePath();
	context.stroke();
	context.fill();
}

function drawWhiteKeyNote(context, w)
{
	context.beginPath();
	context.strokeStyle = "black";
	context.fillStyle = "black";
	context.arc(w.centerX,w.centerY,w.nr,0,2 * Math.PI, false);
	context.closePath();
	context.stroke();
	context.fill();
}

function drawKeyboard(canvas,context,divIndex)
{
	clearKeyboardCanvas(canvas,context);

	for(var i = 0; i < whiteKeys[divIndex].length; i++)
	{	
		drawWhiteKey(context,whiteKeys[divIndex][i]);
	}
	
	for(var i = 0; i < blackKeys[divIndex].length; i++)
	{
		//some indexes will be null
		if(blackKeys[divIndex][i])
		{
			drawBlackKey(context,blackKeys[divIndex][i]);
		}
	}
}

function clearKeyboardCanvas(canvas,context)
{
	context.setTransform(1,0,0,1,0,0);
	context.clearRect(0,0,canvas.width,canvas.height);
}

function getClickedKey(x,y)
{
	alert("x:" + x + " y:" + y);

	var isClicked = testClickedKey(blackKeys,x,y);
	
	if(!isClicked)
	{
		isClicked = testClickedKey(whiteKeys,x,y);
	}
	
	return isClicked;
}

function testClickedKey(keys, x, y)
{
	var isClicked = false;
	
	for(var j = 0; j < keys.length; j++)
	{
		for(var i = 0; i < keys[j].length; i++)
		{
			debugger;
			var key = keys[j][i];
			if(key)
			{
				var leftEdge = key.x, rightEdge = key.x + key.w;
				var topEdge = key.y, bottomEdge = key.y + key.h;

				if(rightEdge >= x &&
				   leftEdge <= x &&
				   bottomEdge >= y &&
				   topEdge <= y)
			{
				isClicked = key;
			}
			debugger;
		}
	}
	}
	return isClicked;
}

function loadKeyboardToDiv(divId, divIndex)
{
	var canvas = document.createElement("canvas");
	canvas.id = "keyboard_" + divId;
	
	var p = document.createElement("p");
	p.id = "keyboard_" + divId + "_p";

	whiteKeys[divIndex] = new Array();
	blackKeys[divIndex] = new Array();
	allKeys[divIndex] = new Array();
	var div = document.getElementById(divId);
	div.appendChild(canvas);
	div.appendChild(p);

	createKeyboard(canvas, p, divIndex);
}
	
function toggleKeyboardRegion(region)
{
	region.isClicked = !region.isClicked;
}

function initKeyboard(octaveCount,divIndex)
{
	numOctaves = octaveCount;
	keyboardWidth = octaveWidth * numOctaves;
	createKeys(divIndex);
}

function createKeyboard(canvasEl, canvasParaEl, divIndex) 
{
	initKeyboard(2,divIndex);
	canvasEl.height = keyboardHeight + keyboardMargin * 2;
	canvasEl.width = keyboardWidth + keyboardMargin * 2;
	
	//check if context exists
	if (canvasEl && canvasEl.getContext) 
	{		
		//get context
		var context = canvasEl.getContext("2d");
		if(context)
		{
			context.lineWidth = 1;

			drawKeyboard(canvasEl, context, divIndex);
			
			//listener
			canvasEl.addEventListener('click', function(e) {
				
				var x = e.offsetX, y = e.offsetY;
				var output = '';
				var region = getClickedKey(x, y);

				if(region)
				{
					toggleKeyboardRegion(region);
					drawKeyboard(canvasEl,context, divIndex);
				}
				
				var indxStr = highlightedIndexArrayToString(getHighlightedKeyIndexes(),divIndex); 
				output += "Selected Indexes: " + indxStr;

				canvasParaEl.innerHTML = output;

			},false);
		}
	}

}
