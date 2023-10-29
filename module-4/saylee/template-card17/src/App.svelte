<script> 
  import Download from "../../../Download.svelte"
	let formData = {
	  name: "Company",
	  tagline: "One stop solution",
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
	  justify-content: space-evenly;
	  justify-content: space-between;
	  font-family: 'Times New Roman', Times, serif ;
	}
	.input-section,
	.preview-section {
	  width: 45%;
	  padding: 20px;
	  background-color: #f0f0f0;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  font-family: 'Times New Roman', Times, serif ;
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
    font-family: 'Playfair Display';
	  width: 300px;
	  height: 200px;
	  border: 2px solid #333;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	}
	.prompt {
	  position: fixed;
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
      --font-playfair-display: "Playfair Display";
      --font-dm-serif-display: "DM Serif Display";


      /* font sizes */
      --font-size-2xs-3: 10.3px;
      --font-size-smi: 13px;


      /* Colors */
      --color-white: #fff;
    }
    /* front css */
    .frame,
    .icon {
      overflow: hidden;
    }
    .icon {
      align-self: stretch;
      position: relative;
      max-width: 100%;
      height: 83.71px;
      flex-shrink: 0;
      object-fit: cover;
    }


    .frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }


    .icon1 {
      position: relative;
      width: 54.29px;
      height: 58.57px;
      object-fit: cover;
    }


    .frame3 {
      position: absolute;
      top: 45px;
      left: 44.86px;
      width: 54.29px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }


    .fauget {
      margin: 0;
      font-weight: 600;
    }


    .real-estate {
      margin: 0;
      font-size: 10.29px;
    }


    .fauget-real-estate-container {
      align-self: stretch;
      position: relative;
    }


    .frame4 {
      position: absolute;
      top: 113.33px;
      left: 0;
      width: 144px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }


    .frame1,
    .frame2 {
      width: 168px;
      overflow: hidden;
    }


    .frame2 {
      position: relative;
      height: 192.67px;
      flex-shrink: 0;
    }


    .frame1 {
      position: absolute;
      top: 0;
      left: 82.29px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }


    .front17 {
      position: relative;
      background-color: #12222b;
      width: 100%;
      height: 200px;
      overflow: hidden;
      cursor: pointer;
      text-align: center;
      font-size: 25.71px;
      color: var(--color-white);
      font-family: var(--font-playfair-display);
    }
    /* back css */
    .john-leopard {
      margin: 0;
      font-weight: 600;
    }


    .real-estate-agent {
      margin: 0;
      font-size: 10.29px;
    }


    .john-leopard-real-container {
      position: absolute;
      top: 0;
      left: 133.14px;
      display: inline-block;
      width: 166.86px;
      height: 200px;
    }


    .frame-icon {
      position: absolute;
      top: 0;
      left: 0;
      max-height: 100%;
      width: 300px;
      overflow: hidden;
      object-fit: cover;
    }


    .icon2,
    .john-leopard-real-estate-agent-parent {
      position: absolute;
      top: 0;
      left: 0;
      width: 300px;
      height: 200px;
    }


    .icon2 {
      width: 131px;
      object-fit: cover;
    }


    .frame-child {
      position: absolute;
      top: 82px;
      left: 122px;
      background-color: #ffbd59;
      width: 18px;
      height: 89px;
    }


    .div {
      align-self: stretch;
      position: relative;
    }


    .frame6 {
      position: absolute;
      top: 82px;
      left: 145px;
      width: 155px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 14px;
      font-size: var(--font-size-smi);
      font-family: var(--font-dm-serif-display);
    }


    .frame-icon1,
    .frame-icon2 {
      left: 0;
      width: 17.14px;
      height: 17.14px;
      object-fit: cover;
    }


    .frame-icon1 {
      position: absolute;
      top: 0;
      overflow: hidden;
    }


    .frame-icon2 {
      top: 35.14px;
    }


    .frame-icon2,
    .frame-icon3,
    .frame7 {
      position: absolute;
      overflow: hidden;
    }


    .frame-icon3 {
      top: 70.28px;
      left: 0;
      width: 17.14px;
      height: 17.14px;
      object-fit: cover;
    }


    .frame7 {
      top: 82px;
      left: 122px;
      width: 23px;
      height: 115px;
    }


    .back,
    .frame5 {
      position: relative;
      overflow: hidden;
    }


    .frame5 {
      width: 300px;
      height: 200px;
      flex-shrink: 0;
      text-align: center;
      font-size: 25.74px;
      color: var(--color-white);
      font-family: var(--font-playfair-display);
    }


    .back{
      background-color: #012531;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
    }
  
  </style>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair Display:wght@400;600&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM Serif Display:wght@400&display=swap" />

  
  {#if currentPage === "home"}
  <div class="business-card-container">
	<div class="input-section">
	  <h3>Your Business Card:</h3>
	  <div class="form-group">
		<label for="name">Name:</label>
		<input type="text" id="name" bind:value={formData.name} placeholder="Your Name" />
	  </div>
	  <div class="form-group">
		<label for="tagline">Tagline:</label>
		<input type="text" id="tagline" bind:value={formData.tagline} placeholder="Your tagline" />
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
		  <div class="front17" id="frontContainer">
			  <section class="frame">
				<img class="icon" alt="" src=".\a.png" />
			  </section>
			  <div class="frame1">
				<div class="frame2">
				  <div class="frame3">
					<img class="icon1" alt="" src=".\b.png" />
				  </div>
				  <div class="frame4">
					<div class="fauget-real-estate-container">
					  <p class="fauget">{formData.name}</p>
					  <p class="real-estate">{formData.website}</p>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		    
		</div>
		<h3>Reverse Side:</h3>
		<div class="business-card-back">
		  <div class="back" id="backContainer">
			  <section class="frame5">
				<div class="john-leopard-real-estate-agent-parent">
				  <div class="john-leopard-real-container">
					<p class="john-leopard">{formData.name}</p>
					<p class="real-estate-agent">{formData.tagline}</p>
				  </div>
				  <img class="frame-icon" alt="" src=".\a.png" />
				</div>
				<img class="icon2" alt="" src=".\left.png" />
		  
		  
				<div class="frame-child"></div>
				<div class="frame6">
				  <div class="div">{formData.phoneNumber}</div>
				  <div class="div">{formData.website}</div>
				  <div class="div">{formData.address}</div>
				</div>
				<div class="frame7">
				  <img class="frame-icon1" alt="" src=".\zero.png" />
		  
		  
				  <img class="frame-icon2" alt="" src=".\first.png" />
		  
		  
				  <img class="frame-icon3" alt="" src=".\second.png" />
				</div>
			  </section>
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
		  <div class="front17" id="frontContainer">
			  <section class="frame">
				<img class="icon" alt="" src=".\a.png" />
			  </section>
			  <div class="frame1">
				<div class="frame2">
				  <div class="frame3">
					<img class="icon1" alt="" src=".\b.png" />
				  </div>
				  <div class="frame4">
					<div class="fauget-real-estate-container">
					  <p class="fauget">{formData.name}</p>
					  <p class="real-estate">{formData.website}</p>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		    
		</div>

		<h3>Reverse Side:</h3>
		<div class="business-card-back" id="card-back">
		  <div class="back" id="backContainer">
			  <section class="frame5">
				<div class="john-leopard-real-estate-agent-parent">
				  <div class="john-leopard-real-container">
					<p class="john-leopard">{formData.name}</p>
					<p class="real-estate-agent">{formData.tagline}</p>
				  </div>
				  <img class="frame-icon" alt="" src=".\a.png" />
				</div>
				<img class="icon2" alt="" src=".\left.png" />
		  
		  
				<div class="frame-child"></div>
				<div class="frame6">
				  <div class="div">{formData.phoneNumber}</div>
				  <div class="div">{formData.website}</div>
				  <div class="div">{formData.address}</div>
				</div>
				<div class="frame7">
				  <img class="frame-icon1" alt="" src=".\zero.png" />
		  
		  
				  <img class="frame-icon2" alt="" src=".\first.png" />
		  
		  
				  <img class="frame-icon3" alt="" src=".\second.png" />
				</div>
			  </section>
			</div>
		</div>
	  <button on:click={closePrompt}>Close</button>
    <Download />
	</div>
  </div>
  {/if}
  