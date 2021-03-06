# tomloprodModal [![Release](https://img.shields.io/github/release/tomloprod/tomloprodModal.svg)](https://github.com/tomloprod/tomloprodModal) [![License](https://img.shields.io/github/license/tomloprod/tomloprodModal.svg)](http://www.opensource.org/licenses/mit-license.php)  [![Build Status](https://travis-ci.org/tomloprod/tomloprodModal.svg?branch=master)](https://travis-ci.org/tomloprod/tomloprodModal) [![npm version](https://badge.fury.io/js/tomloprodModal.svg)](https://badge.fury.io/js/tomloprodModal)[![Bower version](https://badge.fury.io/bo/tomloprodModal.svg)](http://badge.fury.io/bo/tomloprodModal)

<br>

**tomloprodModal** is a simple and configurable javascript library to create responsive and minimalist modal windows with no dependencies.
<p align="center">
<img src="https://github.com/tomloprod/tomloprodModal/blob/master/tomloprodModal-test.gif"/>
</p>

**DEMO:** http://codepen.io/tomloprod/pen/kkYxWY

<br>

### HTML & CSS Classes
---

* `tm-effect`: If has this class shows fade effects on modal windows and scale effect on main container (*if exist*).
* `tm-draggable`: Defines if the modal window can be dragged.
* `tm-emptyOnClose`: When has this CSS class, the content of this element (*input or tag*) will be cleared.
* `tm-trigger`: When an element has this CSS class, this element will be used for open the modal window indicated by his `data-tm-modal` attribute.





Example of modal window:

````html
<div 
	class="tm-modal 
	tm-effect tm-draggable" 
	data-tm-bgcolor = "#3498db"
	data-tm-textcolor = "white"
	id="logInPopUp">
	
	<div class="tm-wrapper">
		<div class="tm-title">
			<span class="tm-XButton tm-closeButton"></span>  
			<h3 class="tm-title-text">Login</h3> 
		</div>
		<div class="tm-content">
			<form style="text-align:center;">
				<p>
					<input class="tm-emptyOnClose" placeholder="User" required="" type="text">
				</p>
				<p>
					<input class="tm-emptyOnClose" placeholder="Password" required="" type="password">
				</p>
				<p>
					<input id="remember" name="remember" type="checkbox" value="1">
					<label for="remember">Remember me</label>
				</p>
				<p>
					<input value="Log in" type="submit">
				</p>
			</form>
		</div>
	</div>
</div>

<div id="myMainContainer"> Lorem ipsum... </div>

````
<br>

### Initialization
---

````javascript
TomloprodModal.start({
    closeOut: true,
    showMessages: true,
    bgColor: "#FFFFFF",
    textColor: "#333333"
});
````

<br>

### General Config Parameters
---

* `idMainContainer`: Used to display an scale animation when the modal window opens. (Dynamically add the `tm-MainContainer` class to the element)
* `draggable`: When `true`, all the modal window with the CSS class `tm-draggable` can be dragged. @default `true`
* `bgColor`: Defines modal background color. @default `#5c7d98`
* `overlayColor`: Defines overlay color. @default `rgba(0,0,0,0.8)`
* `textColor`: Defines text and X button color. @default `#FFFFFF`
* `closeOnOverlay`: Enables or disables closing the modal window by clicking the overlay. @default `true`
* `showMessages`: Enables or disables de log messages. @default `false`
* `removeOverlay`: When `true`, remove the overlay if exist. @default `false`
* `closeOnEsc`: Enables or disables pressing the escape key to close the currently open modal. @default `true`
* `borderRadius`: Assign a border-radius to the modal windows. @example `1em` @default `0`

<br>

### Individual Config Parameters 1: *data attributes*
---

* `data-tm-title`: Will replace the title of the element with `tm-title-text` class.
* `data-tm-content`: Will replace the content of the element with `tm-content` class.
* `data-tm-bgcolor`: Will change the background color by the indicated value for the modal window that has this data attribute. @example `#e74c3c`
* `data-tm-textcolor`: Will change the text color by the indicated value for the modal window that has this data attribute. @example `#FFFFFF`
* `data-tm-closetimer`: Will close the modal window when the milliseconds pass. @example `1000`

Example of modal window with individual data attributes:

````html
<div 
    data-tm-title="tomloprodModal 1" 
    data-tm-bgcolor = "#e74c3c"
    data-tm-textcolor = "white"
    data-tm-closetimer="3000"
    data-tm-content="My background color is red! :-) <p><b>And I will self-destruct in 3 seconds</b>" 
    class="tm-modal tm-effect tm-draggable" 
    id="testModal1">
    
    <div class="tm-wrapper">
        <div class="tm-title">
            <span class="tm-XButton tm-closeButton"></span>  
            <h3 class="tm-title-text"> </h3> 
        </div>
        <div class="tm-content"> </div>
    </div>
    
</div>

<div id="myMainContainer"> Lorem ipsum... </div>
````
<br>


### Individual Config Parameters 2: *params*
---

* `title`: Will replace the title of the element with the value of `title` param.
* `content`: Will replace the content of the elementwith the value of `title` param.
* `bgColor`: Will change the background color by the indicated value for the indicated modal window @example `#e74c3c`
* `textColor`: Will change the text color by the indicated value for the indicated modal window. @example `#FFFFFF`
* `closeTimer`: Will close the modal window when the indicated milliseconds pass. @example `1000`

Example of modal window with individual parameters:

````javascript
TomloprodModal.openModal("testModal", {
    bgColor: "#FFFFFF",
    textColor: "#333333",
	title: "Hi!",
    content: "Nothing to say",
	closeTimer: 1000
});
````
<br>

### Miscellaneous
---

````javascript

//////////// Create new modal with indicated params (without HTML)
TomloprodModal.create({
    bgColor: "#FFFFFF",
    textColor: "#333333",
	title: "Hi!",
    content: "Nothing to say",
	closeTimer: 1000
});

//////////// Stop operation of Tomloprod Modal.
TomloprodModal.stop();

//////////// Open the modal window with the indicated ID
TomloprodModal.openModal("logInPopUp");

//////////// Close the current modal window
TomloprodModal.closeModal();

//////////// Check if there are any open modal window
var isOpen = TomloprodModal.isOpen;

//////////// Gets the current modal window
var currentModalWindow = TomloprodModal.modal;
````

<br>

### Handlers
---


````javascript
///////////// Opening
TomloprodModal.registerHandler("opened", function () {
    console.info("Opening " + TomloprodModal.modal.id);
});

///////////// Closing
TomloprodModal.registerHandler("closed", function () {
    console.info("Closing " + TomloprodModal.modal.id);
});

///////////// Stop dragging
TomloprodModal.registerHandler("stopDragging", function () {
    console.info("Coord X: " + TomloprodModal.modal.style.left + ' | Coord Y: ' + TomloprodModal.modal.style.top);
});

///////////// Register and remove handlers
TomloprodModal.registerHandler("opened", myOpenedHandler);

function myOpenedHandler(){
     console.info("Opening " + TomloprodModal.modal.id);
}

//////////// Deletes the listener of the indicated handler.
TomloprodModal.removeHandler('opened', myOpenedHandler);

/////////// Or, if the handler is omitted, deletes all:
TomloprodModal.removeHandler('opened');
````
