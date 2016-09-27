/*
 Tomloprod Modal 1.0.2
 
 The MIT License (MIT)
 
 Copyright (c) 2015 by Tomás López.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
 
var TomloprodModal = (function () {
    "use strict";
    var closeButton = null,
            closeOnEsc = true,
            draggable = true,
            closeOnOverlay = true,
			removeOverlay = false,
            handlers = {},
			mainContainer = [],
            showMessages = false,
			closeTimeout = null,
			uniqueName = null;
    /**
     * Adds the value to the specified property to a set of elements.
     * @param {Objects[]} els
     * @param {String} propiedad
     * @param {String} valor
     */
    function addPropertyValueFromClasses(els, propiedad, valor) {
        [].forEach.call(els, function (el) {
            el.style[propiedad] = valor;
        });
    }
    /**
     * Checks whether the element contains the specified class.
     * @param {Event.target} event
     * @param {String} className
     * @returns {Boolean}
     */
    function hasClass(event, className) {
        if (event.classList) {
            return event.classList.contains(className);
        }
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(event.className);
    }
	/**
     * Find parent with data-tm-modal
     * @param {Event.target} element
     * @returns {Object}
     */
	function findParentWithDataModal(elem) {
		try {
			if(elem.getAttribute('data-tm-modal')){
				return elem;
			}
		} catch(e) {
			return e;
		}
		while(!elem.getAttribute('data-tm-modal')) {
			return findParentWithDataModal(elem.parentNode);
		}
	}
    /**
     * Add a class to the element indicated.
     * @param {Event.target} event
     * @param {String} className
     */
    function addClass(event, className) {
        if (event.classList) {
            event.classList.add(className);
        } else {
            event.className += ' ' + className;
        }
    }

    /**
     * Return the position of the element indicated into array.
     * @param {Array} array
     * @param {String} item
     * @returns {Number}
     */
    function indexOf(array, item) {
        var conta = 0, len = array.length;
        for (conta = 0; conta < len; conta += 1) {
            if (array[conta].toString() === item.toString()) {
                return conta;
            }
        }
        return -1;
    }
    /**
     * Deletes the class indicated on the item indicated.
     * @param {event.target} event
     * @param {String} className
     */
    function removeClass(event, className) {
        if (event.classList) {
            event.classList.remove(className);
        } else {
			if(typeof event.className !== "undefined"){
				event.className = event.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
        }
    }
    /**
     * Move the modal window to the positions indicated.
     * @param {Object} modal
     * @param {Number} coordX
     * @param {Number} coordY
     */
    function move(modal, coordX, coordY) {
        modal.style.left = coordX + 'px';
        modal.style.top = coordY + 'px';

        if (showMessages) {
            console.info("TomloprodModal: Dragging. Coord X: " + coordX + 'px | Coord Y: ' + coordY + 'px');
        }
    }
	
    function getKey(event) {
        event = event || window.event;
        //////////// Esc
        if (event.keyCode === 27) {
            TomloprodModal.closeModal();
        }
    }
	function openOnClick(e){
	    if (e.target === document.body){ 
			return;
		}
	    var elem = findParentWithDataModal(e.target);	
		if (elem instanceof Element && hasClass(elem, 'tm-trigger')) {
			if(typeof elem !== "undefined"){
				TomloprodModal.openModal(elem.getAttribute('data-tm-modal'));
				e.preventDefault();
			}
		}
	}
	
	//////////// Apply individual configuration (with data attributes or param inside openModal) when the openModal method is called.
	function applyIndividualConfig(params){
		var attr = null;
		for (var i = 0; i < TomloprodModal.modal.attributes.length; i++) {
			attr = TomloprodModal.modal.attributes[i];
			// If attribute nodeName starts with 'data-'
			if (/^data-/.test(attr.nodeName)) {
				switch(attr.nodeName){
					case "data-tm-content": 
						TomloprodModal.modal.getElementsByClassName('tm-content')[0].innerHTML = attr.nodeValue; 
					break;
					case "data-tm-title": 
						TomloprodModal.modal.getElementsByClassName('tm-title-text')[0].innerHTML = attr.nodeValue; 
					break;
					case "data-tm-bgcolor":
						addPropertyValueFromClasses(TomloprodModal.modal.getElementsByClassName("tm-wrapper"), "backgroundColor", attr.nodeValue);
					break;
					case "data-tm-textcolor":
						addPropertyValueFromClasses(TomloprodModal.modal.getElementsByClassName("tm-content"), "color", attr.nodeValue);
						addPropertyValueFromClasses(TomloprodModal.modal.getElementsByClassName("tm-wrapper"), "color", attr.nodeValue);
					break;		
					case "data-tm-closetimer":
						closeTimeout = setTimeout(TomloprodModal.closeModal, attr.nodeValue);
					break;					
					
				}
			}
		}
		if(typeof params !== "undefined"){
			var configOption = null;
			if (typeof params !== "undefined") {
				for (configOption in params) {
					if (typeof params[configOption] !== "undefined") {
						switch (configOption) {
							case "title":
								TomloprodModal.modal.getElementsByClassName('tm-title-text')[0].innerHTML = params[configOption]; 
							break;
							case "borderRadius":
								addPropertyValueFromClasses(document.getElementsByClassName("tm-wrapper"), "-webkit-border-radius", params[configOption]);
								addPropertyValueFromClasses(document.getElementsByClassName("tm-wrapper"), "-moz-border-radius", params[configOption]);
								addPropertyValueFromClasses(document.getElementsByClassName("tm-wrapper"), "border-radius", params[configOption]);
							break;
							case "content":
								TomloprodModal.modal.getElementsByClassName('tm-content')[0].innerHTML = params[configOption]; 
							break;
							case "bgColor":
								addPropertyValueFromClasses(TomloprodModal.modal.getElementsByClassName("tm-wrapper"), "backgroundColor", params[configOption]);
							break;
							case "textColor":
								addPropertyValueFromClasses(TomloprodModal.modal.getElementsByClassName("tm-content"), "color", params[configOption]);
								addPropertyValueFromClasses(TomloprodModal.modal.getElementsByClassName("tm-wrapper"), "color", params[configOption]);
							break;
							case "closeTimer":
								closeTimeout = setTimeout(TomloprodModal.closeModal, params[configOption]);
							break;								
						}
					}
				}
			}
		
		}
	}
	
    return {
        modal: [],
        isOpen: false,

        openModal: function (modalID, params) {
		
            if (TomloprodModal.isOpen) {
                TomloprodModal.closeModal();
            }else{
				
				TomloprodModal.modal = document.getElementById(modalID);
				if (TomloprodModal.modal) {

					if(mainContainer){
						addClass(mainContainer, "tm-effect");
					}
					
					//////////// Individual configuration (data attributes) and params
					applyIndividualConfig(params);
					
					if (draggable && hasClass(TomloprodModal.modal, "tm-draggable")) {
						TomloprodModal.modal.setAttribute('onmousedown', 'TomloprodModal.startDragging(this,event);');
						TomloprodModal.modal.setAttribute('onmouseup', 'TomloprodModal.stopDragging(this);');
					}
					addClass(TomloprodModal.modal, 'tm-showModal');
					closeButton = TomloprodModal.modal.querySelector('.tm-closeButton');
					
					if (closeButton.addEventListener) {                
						closeButton.addEventListener("click", TomloprodModal.closeModal, false);
					} else if (closeButton.attachEvent) {         
						closeButton.attachEvent("onclick", TomloprodModal.closeModal);
					}
					
					if (closeOnOverlay && !removeOverlay) {
						if (document.querySelector(".tm-overlay").addEventListener) {                
							document.querySelector(".tm-overlay").addEventListener("click", TomloprodModal.closeModal, false);
						} else if (document.querySelector(".tm-overlay").attachEvent) {         
							document.querySelector(".tm-overlay").attachEvent("onclick", TomloprodModal.closeModal);
						}
					}
					if (closeOnEsc) {
						document.onkeyup = getKey;
					}
					TomloprodModal.isOpen = true;
					TomloprodModal.fire('opened');
				} else if (showMessages) {
					console.error("TomloprodModal: Cannot find the indicated modal window.");
				}
			}
        },
        registerHandler: function (event, callback) {
            var added = true;
            if (handlers[event]) {
                if (indexOf(handlers[event], callback) === -1) {
                    handlers[event].push(callback);
                } else {
                    added = false;
                    console.error("TomloprodModal: The event ''" + event + "'' already contain one handler with the next function:\n\n " + callback);
                }
            } else {
                handlers[event] = [callback];
            }
            if (showMessages && added) {
                console.info("TomloprodModal: There are one new handler registered to the event ''" + event + "'':\n\n " + callback + ". \n\nTotal handlers of ''" + event + "'' event: " + handlers[event].length);
            }
        },
        removeHandler: function (event, callback) {
            if (handlers[event]) {
                callback = callback || false;

                if (callback) {
                    var i = indexOf(handlers[event], callback);
                    if (i > -1) {
                        handlers[event].splice(i, 1);
                    } else {
                        return false;
                    }
                    if (showMessages) {
                        console.info("TomloprodModal: The handlers with the name ''" + event + "'' have been deleted successfully. (" + callback + ")");
                    }
                    return true;
                }
                delete handlers[event];
                if (showMessages) {
                    console.info("TomloprodModal: The handler ''" + event + "'' has been deleted successfully. (" + callback + ")");
                }
            } else {
                return false;
            }
        },
        fire: function (event) {
            if (!handlers[event]) {
                if (showMessages) {
                    console.info("TomloprodModal: There aren't any handlers registered for ''" + event + "''");
                }
                return false;
            }
            var i;
            for (i = 0; i < handlers[event].length; i += 1) {
                handlers[event][i].apply(window, Array.prototype.slice.call(arguments, 1));
            }
        },
		
		create: function(params){
		
			if(uniqueName === null){			
				uniqueName = "tm-create" + Math.floor(Date.now() / 1000) ;
				//////////// Create default modal window
				var defaultModalWindow = document.createElement("DIV");
				defaultModalWindow.id = uniqueName;
				defaultModalWindow.className = "tm-modal tm-effect tm-draggable";
					//////////// Create wrapper 
					var defaultModalWrapper = document.createElement("DIV");
					defaultModalWrapper.className = "tm-wrapper";
					defaultModalWindow.appendChild(defaultModalWrapper);
						//////////// Title
						var defaultModalTitle = document.createElement("DIV");
						defaultModalTitle.className = "tm-title";
						defaultModalWrapper.appendChild(defaultModalTitle);
							//////////// Xbutton
							var defaultModalTitleXButton = document.createElement("SPAN");
							defaultModalTitleXButton.className = "tm-XButton tm-closeButton";
							defaultModalTitle.appendChild(defaultModalTitleXButton);
							//////////// Title h3
							var defaultModalTitleH3 = document.createElement("H3");
							defaultModalTitleH3.className = "tm-title-text";
							defaultModalTitle.appendChild(defaultModalTitleH3);
						//////////// Content
						var defaultModalContent = document.createElement("DIV");
						defaultModalContent.className = "tm-content";
						defaultModalWrapper.appendChild(defaultModalContent);
						
						document.body.insertBefore(defaultModalWindow, document.body.firstChild);
			}
		
			TomloprodModal.openModal(uniqueName, params);
		
		},
		
        start: function (params) {
					
			//////////// Create modal overlay
			var overlay = document.createElement("DIV");
            overlay.className = "tm-overlay";
            document.body.appendChild(overlay);
		
			//////////// Apply parameters
            var configOption = null;
			if (typeof params !== "undefined") {
				for (configOption in params) {
					if (typeof params[configOption] !== "undefined") {
						switch (configOption) {
							case "draggable":
								draggable = params[configOption];
								break;
							case "bgColor":
								addPropertyValueFromClasses(document.getElementsByClassName("tm-wrapper"), "backgroundColor", params[configOption]);
								break;
							case "borderRadius":
								addPropertyValueFromClasses(document.getElementsByClassName("tm-wrapper"), "-webkit-border-radius", params[configOption]);
								addPropertyValueFromClasses(document.getElementsByClassName("tm-wrapper"), "-moz-border-radius", params[configOption]);
								addPropertyValueFromClasses(document.getElementsByClassName("tm-wrapper"), "border-radius", params[configOption]);
								break;
							case "textColor":
								addPropertyValueFromClasses(document.getElementsByClassName("tm-content"), "color", params[configOption]);
								addPropertyValueFromClasses(document.getElementsByClassName("tm-wrapper"), "color", params[configOption]);
								break;
							case "closeOnOverlay":
								closeOnOverlay = params[configOption];
								break;
							case "overlayColor":
								document.querySelector(".tm-overlay").style.backgroundColor = params[configOption];
								break;
							case "removeOverlay":
								if (params[configOption]) {
									removeOverlay = params[configOption];
									overlay = document.querySelector(".tm-overlay");
									if(overlay){
										overlay.parentNode.removeChild(document.querySelector(".tm-overlay"));
									}
								}
								break;
							case "showMessages":
								showMessages = params[configOption];
								break;
							case "closeOnEsc":
								closeOnEsc = params[configOption];
								break;
							case "idMainContainer":
								mainContainer = document.getElementById(params[configOption]);
								addClass(mainContainer, "tm-MainContainer");
								break;
							
						}
					}
				}
			}
			
		    //////////// For all major browsers, except IE 8 and earlier
		    if (document.addEventListener) {                
				document.addEventListener("click", openOnClick);
				//////////// For IE 8 and earlier versions
		    } else if (document.attachEvent) {         
				document.attachEvent("onclick", openOnClick);
		    }
        },
		
        stop: function () {
            document.onclick = null;
            var aHrefs = document.getElementsByTagName("A");
            for (var x = 0; x < aHrefs.length; x++) {
                var el = aHrefs[x];
                el.onclick = null;
            }
        },
        closeModal: function (event) {
            if (typeof event !== "undefined") {
                event.stopPropagation();
            }
			
			window.clearTimeout(closeTimeout);
			removeClass(mainContainer, 'tm-effect');
            removeClass(TomloprodModal.modal, 'tm-showModal');
            closeButton.removeEventListener('click', TomloprodModal.closeModal, false);
			if(TomloprodModal.isOpen){
				var inputsText = TomloprodModal.modal.querySelectorAll('.tm-emptyOnClose'), conta = 0;
				for (conta = 0; conta < inputsText.length; conta += 1) {
					if (inputsText[conta].tagName === "INPUT") {
						inputsText[conta].value = "";
					} else {
						inputsText[conta].innerHTML = "";
					}
				}
			}
			TomloprodModal.stopDragging(TomloprodModal.modal);
			TomloprodModal.modal = [];
            TomloprodModal.isOpen = false;
            TomloprodModal.fire("closed");
        },
        /** DRAG METHODS **/
        /**
         * Starts the dragging of modal window.
         * @param {Object} modal
         * @param {Event} event
         */
        startDragging: function (modal, event) {
            event = event || window.event;
            modal.style.cursor = 'move';
            var modalTop = modal.offsetTop,
                    modalLeft = modal.offsetLeft,
                    halfWidthModal = TomloprodModal.modal.offsetWidth / 2,
                    halfHeightModal = TomloprodModal.modal.offsetHeight / 2,
                    widthWindow = parseInt(window.innerWidth, 10),
                    heightWindow = parseInt(window.innerHeight, 10),
                    differenceX = event.clientX - modalLeft,
                    differenceY = event.clientY - modalTop;
            document.onmousemove = function (event) {
                event = event || window.event;
                // Drag end position
                var modalX = event.clientX - differenceX,
                        modalY = event.clientY - differenceY;

                // X Control
                if (modalX < halfWidthModal) {
                    modalX = halfWidthModal;
                }
                if (modalX + halfWidthModal > widthWindow) {
                    modalX = widthWindow - halfWidthModal;
                }
                // Y Control
                if (modalY < halfHeightModal) {
                    modalY = halfHeightModal;
                }
                if (modalY + halfHeightModal > heightWindow) {
                    modalY = heightWindow - halfHeightModal;
                }
                addClass(document.getElementsByTagName("body")[0], 'tm-avoidSelection');
                addClass(TomloprodModal.modal, 'tm-avoidSelection');
                move(modal, modalX, modalY);
            };
        },
        /**
         * Method called when stopped the dragging of the modal window.
         * @param {Object} modal
         */
        stopDragging: function (modal) {
			if(typeof modal.style !== "undefined"){
				modal.style.cursor = 'default';
				removeClass(document.getElementsByTagName("body")[0], 'tm-avoidSelection');
				removeClass(TomloprodModal.modal, 'tm-avoidSelection');
				TomloprodModal.fire('stopDragging');
				document.onmousemove = function () { };
			}
        }
    };
}());

