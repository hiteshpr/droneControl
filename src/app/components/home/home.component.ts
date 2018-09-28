import { Component, OnInit } from '@angular/core';
import { RestService } from '../../services/rest.service';
declare var htmlLib: any;
declare var gpLib: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentVisibleController = null;
  
	template = htmlLib.template;
  qs = htmlLib.qs;
  
  buttonValueArray = [];

  constructor(public rest: RestService ) { }

  ngOnInit() {
    this.onLoad();
  }


  /* Code for getting the JoyStick Input starts */
  
  /**
	 * Render a frame
	 */
  onFrame(){
    
    let conCheck = gpLib.testForConnections();
    
    if(conCheck){
      console.log(conCheck + " new connections");

      this.rebuildUI();
    } 

    // Update all the UI elements
    this.updateUI();

    requestAnimationFrame(this.onFrame.bind(this));    
  }
  
  
	/**
	 * onload handler
	 */
  onLoad() {
      
		 if (gpLib.supportsGamepads()) {
      this.rebuildUI();
			requestAnimationFrame(this.onFrame.bind(this));
		} else {
			this.qs("#sol").classList.remove("nodisp");
		} 
  }

  showController(n) {

		n = 0;

		let gamepads = document.querySelectorAll("#gamepad-container .gamepad");

    let gp = gamepads[0];

    gp.classList.remove('nodisp');

		this.currentVisibleController = n;
	}


  /**
	 * Reconstruct the UI for the current gamepads
	 */
	rebuildUI() {

		// Handle gamepad selector button clicks
		function onButtonClick(ev) {
			let b = ev.currentTarget;
			let gpIndex = b.getAttribute('data-gamepad-index');

			this.showController(gpIndex);
		}

		let gp = navigator.getGamepads();

		let bbbox = this.qs("#button-bar-box");
		bbbox.innerHTML = '';

		let gpContainer = this.qs("#gamepad-container");
		gpContainer.innerHTML = '';

		let haveControllers = false, curControllerVisible = false, firstController = null;

		// For each controller, generate a button from the
		// button template, set up a click handler, and append
		// it to the button box
		for (let i = 0; i < gp.length; i++) {

			// Chrome has null controllers in the array
			// sometimes when nothing's plugged in there--ignore
			// them
			if (!gp[i] || !gp[i].connected) { continue; }

			let gpIndex = gp[i].index;

			// Clone the selector button
			let button = this.template("#template-button",
				{
					"id": "button-" + gpIndex,
					"data-gamepad-index": gpIndex,
					"value": gpIndex
				});

			bbbox.appendChild(button);

			// Add the selector click listener
			button.addEventListener('click', onButtonClick);

			// Clone the main holder
			let gamepad = this.template("#template-gamepad",
				{
					"id": "gamepad-" + gpIndex,
					"data-gamepad-index": gpIndex
				});

			gpContainer.appendChild(gamepad);

			this.qs(".gamepad-title", gamepad).innerHTML = "Gamepad " + gpIndex;
			this.qs(".gamepad-id", gamepad).innerHTML = gp[i].id;

			let mapping = gp[i].mapping;
			this.qs(".gamepad-mapping", gamepad).innerHTML = "mapping: " + (mapping && mapping !== ''? mapping: "[<i>unspecified</i>]");

			// Add the buttons for this gamepad
			let j;
			let buttonBox = this.qs(".gamepad-buttons-box", gamepad)

			for (j = 0; j < gp[i].buttons.length; j++) {
				let buttonContainer = this.template("#template-gamepad-button-container",
					{
						"id": "gamepad-" + gpIndex + "-button-container-" + j
					});

					this.qs(".gamepad-button", buttonContainer).setAttribute("id", "gamepad-" + gpIndex + "-button-" + j);
					this.qs(".gamepad-button-label", buttonContainer).innerHTML = j;

				buttonBox.appendChild(buttonContainer);
			}

			// Add the axes for this gamepad
			let axesBox = this.qs(".gamepad-axes-box", gamepad);
			let axesBoxCount = ((gp[i].axes.length + 1) / 2)|0; // Round up (e.g. 3 axes is 2 boxes)

			for (j = 0; j < axesBoxCount; j++) {
				let axisPairContainer = this.template("#template-gamepad-axis-pair-container",
					{
						"id": "gamepad-" + gpIndex + "-axis-pair-container-" + j
					});

				this.qs(".gamepad-axis-pair", axisPairContainer).setAttribute("id", "gamepad-" + gpIndex + "-axispair-" + j);

				let pairLabel;

				// If we're on the last box and the number of axes is odd, just put one label on there
				if (j == axesBoxCount - 1 && gp[i].axes.length % 2 == 1) {
					pairLabel = j*2;
				} else {
					pairLabel = (j*2) + "," + ((j*2)+1);
				}
				this.qs(".gamepad-axis-pair-label", axisPairContainer).innerHTML = pairLabel;

				axesBox.appendChild(axisPairContainer);
			}

			// And remember that we have controllers now
			haveControllers = true;

			if (i == this.currentVisibleController) {
				curControllerVisible = true;
			}

			if (firstController === null) {
				firstController = i;
			}
		}

		// Show or hide the "plug in a controller" prompt as
		// necessary
		if (haveControllers) {
			this.qs("#prompt").classList.add("nodisp");
			this.qs("#main").classList.remove("nodisp");
		} else {
			this.qs("#prompt").classList.remove("nodisp");
			this.qs("#main").classList.add("nodisp");
		}

		if (curControllerVisible) {
			this.showController(this.currentVisibleController);
		} else {
			this.currentVisibleController = firstController;
			this.showController(firstController);
		}
  }
  

  /**
	 * Update the UI components based on gamepad values
	 */
  updateUI() {

		let gamepads = navigator.getGamepads();

		let mode = 'clamp'; // raw, norm, clamp

		// For each controller, show all the button and axis information
		for (let i = 0; i < gamepads.length; i++) {
			let gp = gamepads[i];
			let j;

			if (!gp || !gp.connected) { continue; }

			let gpElem = this.qs("#gamepad-" + i);
			
			// Show button values
			let buttonBox = this.qs(".gamepad-buttons-box", gpElem);

			for (j = 0; j < gp.buttons.length; j++) {
				let buttonElem = this.qs("#gamepad-" + i + "-button-" + j, buttonBox)
				let button = gp.buttons[j];

				// Put the value in there
				buttonElem.innerHTML = button.value;

				// Change color if pressed or not
				if (button.pressed) {
					buttonElem.classList.add("pressed");
				} else {
					buttonElem.classList.remove("pressed");
				}
			}

			// Show axis values
			let axesBox = this.qs(".gamepad-axes-box", gpElem);
			let axesBoxCount = ((gp.axes.length + 1) / 2)|0; // Round up (e.g. 3 axes is 2 boxes)
      
			for (j = 0; j < axesBoxCount; j++) {

				let axisPairContainer = this.qs("#gamepad-" + i + "-axis-pair-container-" + j, axesBox);
        let axisPairValue = this.qs(".gamepad-axis-pair-value", axisPairContainer);
				let axisPip = this.qs(".gamepad-axis-pip", axisPairContainer);
				let axisCross = this.qs(".gamepad-axis-crosshair", axisPairContainer);
				let valueX, valueY, valueStr;
				let deadzoneActive = false;
				valueX = gp.axes[j*2];

				if (deadzoneActive) {
					valueX = gpLib.deadzone(valueX);
				}

				// Set the value label
				valueStr = valueX.toFixed(2);

				// Position the raw indicator
				axisCross.style.left = (valueX + 1) / 2 * 100 + '%';

				// Position the pip over the raw indicator for now
				axisPip.style.left = axisCross.style.left;

				// If we're not a single axis in the last box, show the second axis in this box.
				// This handles a last box with a single axis (odd number of axes total).
				if (!(j == axesBoxCount - 1 && gp.axes.length % 2 == 1)) {
					valueY = gp.axes[j*2+1];

					if (deadzoneActive) {
						valueY = gpLib.deadzone(valueY);
					}
					
					// Set the value label
					valueStr += ',' + valueY.toFixed(2);

					// Position the raw indicator
					axisCross.style.left = (valueX + 1) / 2 * 100 + '%';
					axisCross.style.top = (valueY + 1) / 2 * 100 + '%';

					// Position the pip, clamping if necessary
					let clampCircle = this.qs(".gamepad-circle", axisPairContainer);

					
					
					// Clamp mode
						let clampX, clampY;
						[clampX, clampY] = gpLib.clamp(valueX, valueY, mode);
						axisPip.style.left = (clampX + 1) / 2 * 100 + '%';
						axisPip.style.top = (clampY + 1) / 2 * 100 + '%';

						clampCircle.classList.remove("nodisp");
						// Overwrite the value string with clamped values
						valueStr = clampX.toFixed(2) + ',' + clampY.toFixed(2);			
        }
        
        axisPairValue.innerHTML = valueStr;

        valueStr = valueStr.split(",");
        
        // Yaw Value
        if( j == 0){
          
          let prevYawValue = this.buttonValueArray[j];
          let newYawValue = valueStr[0];
          //console.log('value',valueStr);
          // Check for Yaw Value Change; if Yes, call Gimbal API
          if(newYawValue != prevYawValue){
            //call gimbal api; 
            
            this.buttonValueArray[0] = newYawValue;
            
            //if API successful update the buttonValueArray; 

            this.rest.setGimbalControl(this.buttonValueArray).subscribe((data) => {
              console.log('success', data);
              //this.buttonValueArray[0] = newYawValue;
            },
            (error) => {
              console.log(error);
              
            });

          }

        }

        // Pitch Value
        else if(j == 1){

          let prevPitchValue = this.buttonValueArray[j];
          let newPitchValue = valueStr[1];
          // Check for Pitch change; if Yes, call gimbal API
          if(newPitchValue != prevPitchValue){
            //call gimbal api; 
            this.buttonValueArray[1] = newPitchValue;
            //If API successful update the buttonValueArray

            this.rest.setGimbalControl(this.buttonValueArray).subscribe((data) => {
              console.log('success', data);
              //this.buttonValueArray[1] = newPitchValue
            },
            (error) => {
              console.log(error);
              
            });

          }
        }

			}
		}
	 }

   /* Code for getting the JoyStick Input ends */
  
    getChange(){
      console.log('change recorded');
    }

  



}
