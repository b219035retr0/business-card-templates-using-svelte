
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
    .frontbackground,
.s-apify {
  position: absolute;
  left: 0;

}
.frontbackground {
  top: 0;
  width: 302px;
  height: 200px;
  object-fit: cover;
}

.s-apify {
  top: 8px;
  display: inline-block;
  width: 282px;
  height: 61px;
 

}




.group-child {
  position: absolute;
  height: 100%;
  width: 24.54%;
  top: 0;
  right: 60.57%;
  bottom: 0;
  left: 14.89%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.group,
.s-apify-parent {
  position: absolute;
  top: 0;
  left: 0;
  width: 282px;
  height: 87.6px;
}
.group {
  top: 56px;
  left: 9px;
}
.property-1default {
  position: absolute;
  top: 20px;
  left: 20px;
  border-radius: 20px;
  background-color: #fff;
  width: 300px;
  height: 200px;
  overflow: hidden;
}
.b5cb99-6-1,
.s-apify1 {
  position: absolute;
  left: 0;
}
.b5cb99-6-1 {
  top: 0;
  width: 1009px;
  height: 597px;
  object-fit: cover;
}
.s-apify1 {
  top: 7px;
  display: inline-block;
  width: 937px;
  height: 182px;
}
.group-item {
  position: absolute;
  height: 46.35%;
  width: 7.39%;
  top: 0;
  right: 88.24%;
  bottom: 53.65%;
  left: 4.38%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.group1,
.s-apify-group,
.backsidebckg {
  position: absolute;
  top: 0;
  left: 0;
  width: 937px;
  height: 189px;
}
.group1,
.backsidebckg {
  top: 56px;
  left: 10px;
}
.backsidebckg {
  top: 0;
  left: 0;
  width: 165px;
  height: 200px;
  object-fit: cover;
}
.fluentcall-16-filled,
.icbaseline-call {
  position: absolute;
  top: 288px;
  left: 513px;
  width: 24px;
  height: 24px;
  overflow: hidden;
}
.fluentcall-16-filled {
  top: 292px;
  left: 517px;
  width: 16px;
  height: 16px;
}
.gina-linetti {
  position: absolute;
  top: 7px;
  left: 140px;
  display: inline-block;
  width: 532px;
  height: 133px;
}
.vector-icon {
  position: absolute;
  height: 6.41%;
  width: 2.71%;
  top: 15.77%;
  right: 97.27%;
  bottom: 77.82%;
  left: 0.02%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}
.div,
.quality-manager,
.soapifygmailcom,
.wwwgsoapifycom {
  position: absolute;
  top: 35px;
  left: 18.6px;
  display: inline-block;
  width: 532px;
  height: 133px;
}
.quality-manager,
.soapifygmailcom,
.wwwgsoapifycom {
  top: 69px;
  left: 21.7px;
}
.quality-manager,
.wwwgsoapifycom {
  top: 101px;
}
.quality-manager {
  top: 0;
  left: 8.6px;
  font-size: 15px;
  height: 121px;
}
.vector-parent {
  position: absolute;
  height: 117%;
  width: 184.57%;
  top: 22.5%;
  right: -139.67%;
  bottom: -39.5%;
  left: 55.1%;
  font-size: 13px;
}
.icround-mail-icon,
.mdiweb-icon {
  position: absolute;
  top: 149px;
  left: 166px;
  width: 16px;
  height: 16px;
  overflow: hidden;
}
.icround-mail-icon {
  top: 116px;
  width: 15px;
  height: 15px;
}
.rectangle-icon {
  position: absolute;
  top: 165px;
  left: 260px;
  border-radius: 10px;
  width: 30px;
  height: 30px;
  object-fit: cover;
}
.backsidebckg-parent {
  border-radius: 20px;
  background-color: #fff;
  overflow: hidden;
}
.frame-wrapper,
.property-1variant2-inner,
.backsidebckg-parent{
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  height: 200px;
}
.property-1variant2-inner {
  font-size: 30px;
  color: #1eb805;
  font-family: Pattaya;
}
.property-1variant2 {
  position: absolute;
  top: 240px;
  left: 20px;
  border-radius: 20px;
  background-color: #fff;
  width: 300px;
  height: 200px;
  overflow: hidden;
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
  font-size: 45px;
  color: #170d0d;
  font-family: Notable;
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
	</div>  </div>
  
	<div class="preview-section">
	  <h3>Front Side:</h3>
	  
	 <div class="property-1default-parent">
		<div class="property-1default">
		  <img class="frontbackground" alt="" src="./public/front.png" />
  
		  <div class="group">
			<div class="s-apify-parent">
			  <div class="s-apify">{formData.name}</div>
			  <img class="group-child" alt="" src="./public/group-4.svg" />
			</div>
		  </div>
		</div>
		<div class="property-1variant2">
		  <img class="b5cb99-6-1" alt="" src="./public/b5cb99-6-1@2x.png" />
  
		  <div class="group1">
			<div class="s-apify-group">
			  <div class="s-apify1">{formData.name} </div>
			  <img class="group-item" alt="" src="./public/group-4.svg" />
			</div>
		  </div> </div> </div>
	  <h3>Reverse Side:</h3>
	  <div class="property-1variant2-inner">
		<div class="frame-wrapper">
		  <div class="backsidebckg-parent">
			<img class="backsidebckg" alt="" src="./public/back.png" />

			<div class="icbaseline-call"></div>
			<div class="fluentcall-16-filled"></div>
			<div class="gina-linetti">{formData.name}</div>
			<div class="vector-parent">
			  <img class="vector-icon" alt="" src="./public/vector.svg" />

			  <div class="div">{formData.phoneNumber}</div>
			  <div class="soapifygmailcom">{formData.address}</div>
			  <div class="wwwgsoapifycom">{formData.website}</div>
			  <div class="quality-manager">{formData.designation}</div>
			</div>
			<img class="mdiweb-icon" alt="" src="./public/mdiweb.svg" />

			<img
			  class="icround-mail-icon"
			  alt=""
			  src="./public/icroundmail.svg"
			/>

			<img
			  class="rectangle-icon"
			  alt=""
			  src="./public/rectangle@2x.png"
			/>
		  </div>
		</div>
	  </div>  </div>
 {/if}
  {#if showPrompt}
  <div class="prompt">
	<div class="prompt-content">
	  <p>Form Submitted!</p>
	  <h3>Front Side:</h3>
	  <div class="business-card-front">
		<div class="business-card-text">{formData.name}</div>
		<div class="business-card-text">{formData.website}</div>
	  </div>
	  <h3>Reverse Side:</h3>
	  <div class="business-card-back">
		<div class="business-card-text">{formData.name} </div>
		<div class="business-card-text">{formData.designation}</div>
		<div class="business-card-text">{formData.address}</div>
		<div class="business-card-text">{formData.phoneNumber}</div>
		<div class="business-card-text">{formData.website}</div>
	  </div>
	  <button on:click={closePrompt}>Close</button>
	</div>
  </div>
  {/if}