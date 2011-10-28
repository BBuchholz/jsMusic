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

function createKeys()
{
	for(var i = 0; i < numOctaves; i++)
	{
		createOctaveKeys(i);
	}
}

function createOctaveKeys(octaveNum)
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
				key = createWhiteKey(whiteKeyIndex, keyboardIndex);
				whiteKeys[whiteKeyIndex] = key;
				allKeys[keyboardIndex] = key;
				whiteKeyIndex++;
				break;				
			case 6:
				blackKeyIndex++;
			case 1:
			case 3:
			case 8:
			case 10:
				key = createBlackKey(blackKeyIndex, keyboardIndex);
				blackKeys[blackKeyIndex] = key;
				allKeys[keyboardIndex] = key;
				blackKeyIndex++;
				break;
		}
		keyboardIndex++;
	}
	
	return key;
}

function createWhiteKey(wki, ki)
{
	var x = wki * whiteKeyWidth + keyboardMargin;
	var y = keyboardMargin;
	var w = whiteKeyWidth;
	var h = whiteKeyHeight;	
	return {x: x, y: y, w: w, h: h, id: ki};
}

function createBlackKey(bki, ki)
{
	var x = (bki + 1) * whiteKeyWidth - (blackKeyWidth * 0.5) + keyboardMargin;
	var y = keyboardMargin;
	var w = blackKeyWidth;
	var h = blackKeyHeight;
	return {x: x, y: y, w: w, h: h, id: ki};
}

function drawWhiteKey(context, w)
{
	context.strokeStyle = "black";
	context.strokeRect(w.x - 0.5,w.y - 0.5,w.w,w.h);	
}

function drawBlackKey(context, b)
{
	context.fillRect(b.x - 0.5,b.y - 0.5,b.w,b.h);	
}

function drawKeyboard(context)
{
	for(var i = 0; i < whiteKeys.length; i++)
	{
		drawWhiteKey(context,whiteKeys[i]);
	}
	
	for(var i = 0; i < blackKeys.length; i++)
	{
		//some indexes will be null
		if(blackKeys[i])
		{
			drawBlackKey(context,blackKeys[i]);
		}
	}
}

function getClickedKey(x,y)
{
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
	
	for(var i = 0; i < keys.length; i++)
	{
		var key = keys[i];
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
		}
	}
	return isClicked;
}

function loadToDiv(divId)
{
	var canvas = document.createElement("canvas");
	canvas.id = "keyboard1";
	
	var p = document.createElement("p");
	p.id = "keyboard1p";
	
	var div = document.getElementById(divId);
	div.appendChild(canvas);
	div.appendChild(p);
	
	createKeyboard(canvas, p);
}
	
function createKeyboard(canvasEl, canvasParaEl) 
{
	canvasEl.height = keyboardHeight + keyboardMargin * 2;
	canvasEl.width = keyboardWidth + keyboardMargin * 2;
	
	//check if context exists
	if (canvasEl && canvasEl.getContext) 
	{		
		//get context
		var context = canvasEl.getContext("2d");
		if(context)
		{
			createKeys();
			context.lineWidth = 1;

			drawKeyboard(context);
			
			//listener
			canvasEl.addEventListener('click', function(e) {
				
				var x = e.offsetX, y = e.offsetY;
				var output = '';
				var region = getClickedKey(x, y);

				if(region)
				{
					output = 'clicked ' + region.id;	
				}
				else
				{
					output = 'no region clicked';
				}

				canvasParaEl.innerHTML = output;

			},false);
		}
	}

}
