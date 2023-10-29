<script>
	import Download from "../../../Download.svelte";
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
	.prompt-content .business-card-front,
	.preview-section .business-card-back,
	.prompt-content .business-card-back {
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
  
	.preview-section .business-card-front:hover,
	.preview-section .business-card-back:hover,
	.prompt-content .business-card-front:hover,
	.prompt-content .business-card-back:hover {
	  background-color: lightcoral;
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


	:root {
		/* fonts */
		--font-josefin-sans: "Josefin Sans";
		--font-josefin-slab: "Josefin Slab";
		--font-island-moments: "Island Moments";

		/* Colors */
		--color-black: #000;
	}

	/* front css */
	.front1-child {
		position: absolute;
		top: calc(50% - 41px);
		left: calc(50% - 150px);
		width: 300px;
		height: 89px;
	}

	.cakes-cookies,
	.chocobella {
		position: absolute;
		top: calc(50% - 28px);
		left: calc(50% - 62px);
		display: inline-block;
		width: 128px;
		height: 36px;
	}

	.cakes-cookies {
		top: calc(50% + 8px);
		left: calc(50% - 42px);
		font-size: 12px;
		font-family: var(--font-josefin-slab);
		width: 84px;
		height: 6px;
	}

	.front1 {
		position: relative;
		border-radius: 12px;
		width: 300px;
		height: 200px;
		overflow: hidden;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: top;
		cursor: pointer;
		text-align: center;
		font-size: 40px;
		color: var(--color-black);
		font-family: var(--font-island-moments);
	}


	/* back css */

	.back1-child {
		position: absolute;
		top: 0;
		left: 0;
		width: 192px;
		height: 200px;
	}

	.cakes-cookies1,
	.chocobella1 {
		position: absolute;
		top: 22px;
		left: 17px;
		display: inline-block;
		width: 128px;
		height: 36px;
	}

	.cakes-cookies1 {
		top: 58px;
		left: 26px;
		font-size: 12px;
		font-family: var(--font-josefin-slab);
		width: 84px;
		height: 6px;
	}

	.p {
		margin: 0;
	}

	.chocobellafriends-colony-nag-container1 {
		position: absolute;
		top: 123px;
		left: 25px;
		font-size: 10px;
		font-family: var(--font-josefin-sans);
		color: #1e1e1e;
		text-align: left;
		display: inline-block;
		width: 167px;
		text-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
	}

	.back1 {
		position: relative;
		border-radius: 12px;
		width: 300px;
		height: 200px;
		overflow: hidden;
		
		background-size: cover;
		background-repeat: no-repeat;
		background-position: top;
		cursor: pointer;
		text-align: center;
		font-size: 40px;
		color: var(--color-black);
		font-family: var(--font-island-moments);
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
		<button on:click={submitForm}>Apply</button>
	  </div>
	</div>
  
	<div class="preview-section">
	  <h3>Front Side:</h3>
	  <div class="business-card-front">
		<div class="front1" id="frontContainer">
			<img class="front1-child" alt="" src="./r1.png" />
	
			<div class="chocobella">{formData.name}</div>
			<b class="cakes-cookies">{formData.name}</b>
		</div>
	  </div>
	  <h3>Reverse Side:</h3>
	  <div class="business-card-back">
		<div class="back1" id="backContainer">
			<img class="back1-child" alt="" src="./r2.png" />
	
			<div class="chocobella1">{formData.name}</div>
			<b class="cakes-cookies1">{formData.designation}</b>
			<div class="chocobellafriends-colony-nag-container1">
				<p class="p">{formData.phoneNumber}</p>
				<p class="p">{formData.address}</p>
				<p class="p">{formData.website}</p>
			</div>
		</div>
	
	  </div>
	</div>
  </div>
  {/if}
  
  {#if showPrompt}
  <div class="prompt">
	<div class="prompt-content" id="prompt-content">
	  <p>Form Submitted!</p>
	  <h3>Front Side:</h3>
	  <div class="business-card-front" id="card-front">
		<div class="front1" id="frontContainer">
			<img class="front1-child" alt="" src="./r1.png" />
	
			<div class="chocobella">{formData.name}</div>
			<b class="cakes-cookies">{formData.name}</b>
		</div>
	  </div>
	  <h3>Reverse Side:</h3>
	  <div class="business-card-back" id="card-back">
		<div class="back1" id="backContainer">
			<img class="back1-child" alt="" src="./r2.png" />
	
			<div class="chocobella1">{formData.name}</div>
			<b class="cakes-cookies1">{formData.designation}</b>
			<div class="chocobellafriends-colony-nag-container1">
				<p class="p">{formData.phoneNumber}</p>
				<p class="p">{formData.address}</p>
				<p class="p">{formData.website}</p>
				<p class="p">{formData.website}</p>
			</div>
		</div>
	  </div>
	  <button on:click={closePrompt}>Close</button>
	  <Download />
	</div>
  </div>
  {/if}
  