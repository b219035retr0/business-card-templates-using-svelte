<script>
	let formData = {
	  name: "Name",
	  designation: "Prof",
	  address: "Address",
	  phoneNumber: "PhoneNumber",
	  website: "Website",
	};
  
	let showPrompt = false;
  
	let currentPage = "home";
  
	const changePage = (page) => {
	  currentPage = page;
	};
  
	const submitForm = () => {
	  showPrompt = true;
	};
  
	const closePrompt = () => {
	  showPrompt = false;
	};
  </script>
  
  <style>
	.business-card-container {
	  display: flex;
	  justify-content: space-between;
	}
  
	.input-section,
	.preview-section {
	  width: 40%;
	  padding: 20px;
	  background-color: #f0f0f0;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	}
  
	.input-section h3,
	.preview-section h3 {
	  font-size: 20px;
	  margin-bottom: 10px;
	}
  
	.form-group {
	  margin-bottom: 10px;
	}
  
	.form-group label {
	  display: block;
	  margin-bottom: 5px;
	}
  
	.form-group input {
	  width: 100%;
	  padding: 10px;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	}
  
	.form-group input::placeholder {
	  color: #aaa;
	}
  
	.button-section {
	  display: flex;
	  justify-content: space-between;
	}
  
	.button-section button {
	  width: 48%;
	  padding: 10px;
	  background-color: #007bff;
	  color: #fff;
	  border: none;
	  border-radius: 5px;
	  cursor: pointer;
	}
  
	.button-section button:hover {
	  background-color: #0056b3;
	}
  
	.preview-section .business-card-front,
	.prompt-content .business-card-front {
	  width: 300px;
	  height: 200px;
	  border: 2px solid #333;
	  background-color: lightblue;
	  font-family: 'Times New Roman', Times, serif;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	}
	.preview-section .business-card-back,
	.prompt-content .business-card-back {
	  width: 300px;
	  height: 200px;
	  border: 2px solid #333;
	  background-color: lightblue;
	  font-family: 'Times New Roman', Times, serif;
	  display: flex;
	  flex-direction: column;
	  align-items: left;
	  justify-content: center;
	}
	.preview-section .business-card-front:hover,
	.preview-section .business-card-back:hover {
	  background-color: lightcoral;
	}
  
	.business-card-text {
	  max-width: 80%;
	}
  
	.prompt {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  background-color: rgba(0, 0, 0, 0.7);
	}
  
	.prompt-content {
	  background-color: #fff;
	  padding: 20px;
	  border-radius: 5px;
	  text-align: center;
	}
	.prompt-content .business-card-front:hover,
	.prompt-content .business-card-back:hover {
	  background-color: lightcoral;
	}
    .ml-1-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 228px;
  height: 200px;
  object-fit: cover;
}
.phil-dunphy,
.real-estate-agent {
  position: absolute;
  top: 203.8px;
  left: 0.3px;
  display: inline-block;
  width: 203.8px;
  height: 81.7px;
  transform: rotate(-89.92deg);
  transform-origin: 0 0;
}
.real-estate-agent {
  top: 203.6px;
  left: 21.3px;
  font-size: 13px;
  width: 189.6px;
  height: 73.2px;
}
.phil-dunphy-parent {
  position: absolute;
  top: -32.9px;
  left: 239px;
  width: 94.7px;
  height: 203.9px;
  transform: rotate(-0.07deg);
  transform-origin: 0 0;
}
.property-1default,
.vector-icon {
  position: absolute;
  overflow: hidden;
}
.vector-icon {
  height: 33.25%;
  width: 19.03%;
  top: 34.5%;
  right: 60.63%;
  bottom: 32.25%;
  left: 20.33%;
  max-width: 100%;
  max-height: 100%;
}
.property-1default {
  top: 20px;
  left: 20px;
  background-color: #fff;
  width: 300px;
  height: 200px;
}
.pp-1-icon {
  position: absolute;
  top: 0;
  left: 47px;
  width: 253px;
  height: 200px;
  object-fit: cover;
}
.vector-icon2 {
  position: absolute;
  height: 25%;
  width: 16.67%;
  top: 3.5%;
  right: 58.33%;
  bottom: 71.5%;
  left: 25%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.phil-dunphy2,
.real-estate-agent2 {
  position: absolute;
  top: 0;
  left: -127.9px;
  display: inline-block;
  width: 103.6px;
  transform: rotate(0.07deg);
  transform-origin: 0 0;
}
.real-estate-agent2 {
  top: 18px;
  left: -134.9px;
  font-size: 10px;
  width: 134.9px;
  height: 13.5px;
}
.phil-dunphy-container {
  position: absolute;
  top: 151px;
  left: 149.9px;
  width: 31.6px;
  height: 134.9px;
  transform: rotate(0deg);
  transform-origin: 0 0;
}
.vector-icon3,
.vector-icon4 {
  position: absolute;
  height: 6.97%;
  width: 2.87%;
  top: 0;
  right: 97.13%;
  bottom: 93.03%;
  left: 0;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.vector-icon4 {
  top: 24.14%;
  bottom: 68.88%;
}
.div {
  position: absolute;
  top: 133px;
  left: 19px;
  display: inline-block;
  width: 433.7px;
  height: 53.4px;
}
.philgmailcom,
.toit-street-usa,
.wwwphildunphycom {
  position: absolute;
  top: 0;
  left: 19px;
  display: inline-block;
  width: 434px;
  height: 29px;
}
.philgmailcom,
.toit-street-usa {
  top: 89px;
  width: 433.7px;
  height: 53.4px;
}
.toit-street-usa {
  top: 46px;
}
.vector-parent {
  position: absolute;
  height: 93.2%;
  width: 151%;
  top: 11.5%;
  right: -107.67%;
  bottom: -4.7%;
  left: 56.67%;
  font-size: 10px;
}
.vector-icon5 {
  position: absolute;
  height: 5.5%;
  width: 3.67%;
  top: 78%;
  right: 39.33%;
  bottom: 16.5%;
  left: 57%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.vector-icon6 {
  position: absolute;
  top: 114px;
  left: 170px;
  width: 13px;
  height: 11px;
}
.pp-1-parent,
.property-1variant2 {
  position: absolute;
  background-color: #fff;
  width: 300px;
  height: 200px;
  overflow: hidden;
}
.pp-1-parent {
  top: 0;
  left: 0;
  font-size: 13px;
}
.property-1variant2 {
  top: 240px;
  left: 20px;
}
.property-1default-parent {
  position: relative;
  border-radius: 5px;
  border: 1px dashed #9747ff;
  box-sizing: border-box;
  width: 100%;
  height: 460px;
  overflow: hidden;
  text-align: left;
  font-size: 20px;
  color: #153462;
  font-family: "Red Rose";
}

  </style>
  {#if currentPage === "home"}
  <div class="business-card-container">
	<div class="input-section">
	  <h3>Your Business Card:</h3>
	  <div class="form-group">
		<label for="name">Name:</label>
		<input type="text" id="name" bind:value={formData.name} placeholder="Your Name" />
	  </div>
	  <div class="form-group">
		<label for="designation">Designation:</label>
		<input type="text" id="designation" bind:value={formData.designation} placeholder="Your Designation" />
	  </div>
	  <div class="form-group">
		<label for="address">Address:</label>
		<input type="text" id="address" bind:value={formData.address} placeholder="Your Address" />
	  </div>
	  <div class="form-group">
		<label for="phoneNumber">Phone Number:</label>
		<input type="text" id="phoneNumber" bind:value={formData.phoneNumber} placeholder="Your Phone Number with Country Code" />
	  </div>
	  <div class="form-group">
		<label for="website">Website:</label>
		<input type="text" id="website" bind:value={formData.website} placeholder="Your Website" />
	  </div>
	  <div class="button-section">
		<button on:click={submitForm}>Submit</button>
	  </div>
	</div>
  
	<div class="preview-section">
	  <h3>Front Side:</h3>
	  <div class="business-card-front">
		<div class="property-1default-parent">
			<div class="property-1default">
			  <img class="ml-1-icon" alt="" src="./public/ml_1.png" />
	  
			  <div class="phil-dunphy-parent">
				<b class="phil-dunphy">PHIL DUNPHY</b>
				<div class="real-estate-agent">REAL ESTATE AGENT</div>
			  </div>
			  <img class="vector-icon" alt="" src="./public/Vector.png" />
			</div>
			<div class="property-1variant2">
			  <div class="phil-dunphy-parent">
				<b class="phil-dunphy">PHIL DUNPHY</b>
				<div class="real-estate-agent">REAL ESTATE AGENT</div>
			  </div>
			  <img class="vector-icon" alt="" src="./public/vector.svg" />
	  
			  <div class="pp-1-parent">
				<img class="pp-1-icon" alt="" src="./public/pp_1.png" />
	  
				<img class="vector-icon2" alt="" src="./public/vectorb.png" />
	  
				<div class="phil-dunphy-container">
				  <b class="phil-dunphy2">PHIL DUNPHY</b>
				  <div class="real-estate-agent2">REAL ESTATE AGENT</div>
				</div>
				<div class="vector-parent">
				  <img class="vector-icon3" alt="" src="./public/vector2.svg" />
	  
				  <img class="vector-icon4" alt="" src="./public/vector3.svg" />
	  
				  <div class="div">+91 2390471802</div>
				  <div class="wwwphildunphycom">www.phildunphy.com</div>
				  <div class="philgmailcom">phil@gmail.com</div>
				  <div class="toit-street-usa">20, Toit Street, USA</div>
				</div>
				<img class="vector-icon5" alt="" src="./public/vector4.svg" />
	  
				<img class="vector-icon6" alt="" src="./public/vector5.svg" />
			  </div>
			</div>
		  </div>
		 </div>
	  <h3>Reverse Side:</h3>
	  <div class="business-card-back">
		<div class="business-card-text">{formData.name}</div>
		<div class="business-card-text">{formData.designation}</div>
		<div class="business-card-text">{formData.address}</div>
		<div class="business-card-text">{formData.phoneNumber}</div>
		<div class="business-card-text">{formData.website}</div>
	  </div>
	  <button on:click={closePrompt}>Close</button>
	</div>
  </div>
  {/if}
  
  {#if showPrompt}
  <div class="prompt">
	<div class="prompt-content">
	  <p>Form Submitted!</p>
	  <h3>Front Side:</h3>
	  <div class="business-card-front">
		<div class="property-1default-parent">
			<div class="property-1default">
			  <img class="ml-1-icon" alt="" src="./public/ml_1.png" />
	  
			  <div class="phil-dunphy-parent">
				<b class="phil-dunphy">PHIL DUNPHY</b>
				<div class="real-estate-agent">REAL ESTATE AGENT</div>
			  </div>
			  <img class="vector-icon" alt="" src="./public/Vector.png" />
			</div>
			<div class="property-1variant2">
			  <div class="phil-dunphy-parent">
				<b class="phil-dunphy">PHIL DUNPHY</b>
				<div class="real-estate-agent">REAL ESTATE AGENT</div>
			  </div>
			  <img class="vector-icon" alt="" src="./public/vector.svg" />
	  
			  <div class="pp-1-parent">
				<img class="pp-1-icon" alt="" src="./public/pp_1.png" />
	  
				<img class="vector-icon2" alt="" src="./public/vectorb.png" />
	  
				<div class="phil-dunphy-container">
				  <b class="phil-dunphy2">PHIL DUNPHY</b>
				  <div class="real-estate-agent2">REAL ESTATE AGENT</div>
				</div>
				<div class="vector-parent">
				  <img class="vector-icon3" alt="" src="./public/vector2.svg" />
	  
				  <img class="vector-icon4" alt="" src="./public/vector3.svg" />
	  
				  <div class="div">+91 2390471802</div>
				  <div class="wwwphildunphycom">www.phildunphy.com</div>
				  <div class="philgmailcom">phil@gmail.com</div>
				  <div class="toit-street-usa">20, Toit Street, USA</div>
				</div>
				<img class="vector-icon5" alt="" src="./public/vector4.svg" />
	  
				<img class="vector-icon6" alt="" src="./public/vector5.svg" />
			  </div>
			</div>
		  </div>
		 </div>
	  <h3>Reverse Side:</h3>
	  <div class="business-card-back">
		<div class="business-card-text">{formData.name}</div>
		<div class="business-card-text">{formData.designation}</div>
		<div class="business-card-text">{formData.address}</div>
		<div class="business-card-text">{formData.phoneNumber}</div>
		<div class="business-card-text">{formData.website}</div>
	  </div>
	  <button on:click={closePrompt}>Close</button>
	</div>
  </div>
  {/if}
  