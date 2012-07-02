<html>
<head>
<title>  :: nineworldsdeep.com ::  </title>
<link rel="stylesheet" type="text/css" href="style.css" />
<script type="text/javascript" src="Fretboard.js"></script>
<script type="text/javascript" src="Keyboard.js"></script>
<script type="text/javascript">
	
	function load(){
		
		loadKeyboardToDiv('keyboardDiv1', 0);
		loadKeyboardToDiv('keyboardDiv2', 1);			
		loadKeyboardToDiv('keyboardDiv3', 2);
		loadFretboardToDiv('fretboardDiv');				
	}
	
</script>
</head>
 
<body onload="load()">
  <div id="centeredContainer" class="round">
	 <?php require("header.php"); ?>
	<div class="fragment round">
		<div class="fragheading round">
			Info			
		</div>
		<div class="fragcontent">
		  <p>
		  	This is just a place for me to mess about with
		  	some of the music related javascript projects
		  	I'm working on.
		  </p>
		</div>
	</div>
	<div class="fragment round">
		<div class="fragheading round">
			Keyboard			
		</div>
		<div class="fragcontent">
		  <div id="keyboardDiv1"></div>
		  <div id="keyboardDiv2"></div>  
		  <div id="keyboardDiv3"></div>  
		</div>
	</div>		
	<div class="fragment round">
		<div class="fragheading round">
			Guitar
		</div>
		<div class="fragcontent">
		  <div id="fretboardDiv"></div>
		</div>
	</div>		
	<div class="fragment round">
		<div class="fragheading round">
			Drums
		</div>
		<div class="fragcontent">
		  <a href="inprogress.php">In Progress</a> some test text<br />
		  	  
		</div>
	</div>	
	<div class="fragment round">
		<div class="fragheading round">
			Lyrics
		</div>
		<div class="fragcontent">
		  <a href="inprogress.php">In Progress</a> some test text<br />
		  	  
		</div>
	</div>
  </div>
</body>
</html>
