<script>
  import Download from "../../Download.svelte";
  // add ID for card-front card-back in promp container

  let formData = {
    name: "Name",
    Profession: "Prof",
    phoneNumber: "PhoneNumber",
    Initials: "Initials",
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

{#if currentPage === "home"}
  <div class="business-card-container">
    <div class="input-section">
      <h3>Your Business Card:</h3>
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          type="text"
          id="name"
          bind:value={formData.name}
          placeholder="Your Name"
        />
      </div>
      <div class="form-group">
        <label for="profession">Profession:</label>
        <input
          type="text"
          id="profession"
          bind:value={formData.profession}
          placeholder="Your Profession"
        />
      </div>
      </div>
      <div class="form-group">
        <label for="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          bind:value={formData.phoneNumber}
          placeholder="Your Phone Number with Country Code"
        />
      </div>
      <div class="form-group">
        <label for="initials">Initials:</label>
        <input
          type="text"
          id="initials"
          bind:value={formData.initials}
          placeholder="Your Initials"
        />
      </div>
      <div class="button-section">
        <button on:click={submitForm}>Apply</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Front Side:</h3>
      <div class="business-card-front">
        <div class="js-parent" id="frontContainer">
          <div class="js">{formData.initials}</div>
          <div class="juliana-silva-photography-container">
              <p class="juliana-silva">{formData.name}</p>
              <p class="juliana-silva">{formData.profession}</p>
          </div>
          <div class="call-us">{formData.phoneNumber}</div>
          <img class="frame-child" alt="" src="./public/rectangle-1@2x.png" />
      </div>
      </div>
      <h3>Reverse Side:</h3>
      <div class="business-card-back">
        <div class="js-parent" id="backContainer">
          <div class="js1">{formData.initials}</div>
          <img class="potrait2-icon" alt="" src="./public/potrait2@2x.png" />
  
          <img class="potrait1-icon" alt="" src="./public/potrait1@2x.png" />
  
          <div class="wwwjsphotographycom">www.jsphotography.com</div>
      </div>
    </div>
  </div>
{/if}

{#if showPrompt}
  <div class="prompt">
    <div class="prompt-content">
      <p>Form Submitted!</p>
      <h3>Front Side:</h3>
      <div class="business-card-front" id="card-front">
        <img class="frame-child" alt="" src="./public/rectangle-1@2x.png" />
        <div class="business-card-front">
          <div class="js-parent" id="frontContainer">
            <div class="js">{formData.initials}</div>
            <div class="juliana-silva-photography-container">
                <p class="juliana-silva">{formData.name}</p>
                <p class="juliana-silva">{formData.profession}</p>
            </div>
            <div class="call-us">{formData.phoneNumber}</div>
            <img class="frame-child" alt="" src="./public/rectangle-1@2x.png" />
        </div>
        </div></div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <!-- <a href="#" download="front.jpeg">
		<button>Download Front (JPEG)</button>
	  </a>
	  !-- svelte-ignore a11y-invalid-attribute -->
      <!-- <a href="#" download="front.pdf">
		<button>Download Front (PDF)</button>
	  </a> -->

      <h3>Reverse Side:</h3>
      <div class="business-card-back" id="card-back">
        <div class="business-card-back">
          <div class="js-parent" id="backContainer">
            <div class="js1">{formData.initials}</div>
            <img class="potrait2-icon" alt="" src="./public/potrait2@2x.png" />
    
            <img class="potrait1-icon" alt="" src="./public/potrait1@2x.png" />
    
            <div class="wwwjsphotographycom">www.jsphotography.com</div>
        </div>
      </div>
    </div>
      </div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <!-- <a href="#" download="back.jpeg">
		<button>Download Back (JPEG)</button>
	  </a> -->
      <!-- svelte-ignore a11y-invalid-attribute -->
      <!-- <a href="#" download="back.pdf">
		<button>Download Back (PDF)</button>
	  </a> -->
      <button on:click={closePrompt}>Close</button>
      <Download />
    </div>
{/if}

<style>
  .business-card-container {
    display: flex;
    justify-content: space-evenly;
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
    font-family: "Times New Roman", Times, serif;
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
            --font-judson: Judson;
            --font-averia-serif-libre: "Averia Serif Libre";

            /* Colors */
            --color-black: #000;

            /* Border radiuses */
            --br-xs: 12px;
        }

        /* front */
        .js {
            position: absolute;
            top: 30px;
            left: 77px;
            font-size: 50px;
            font-weight: 500px;
        }

        .juliana-silva {
            margin: 0;
        }

        .juliana-silva-photography-container {
            position: absolute;
            top: 100px;
            left: calc(50% - 109px);
            font-size: 20px;
            text-transform: capitalize;
            font-family: var(--font-averia-serif-libre);
            text-align: center;
        }

        .call-us {
            position: absolute;
            bottom: 12px;
            left: 41px;
            font-size: 12px;
        }

        .frame-child {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 0 var(--br-xs) var(--br-xs) 0;
            width: 113px;
            height: 200px;
            object-fit: cover;
        }

        .js-parent {
            position: relative;
            border-radius: var(--br-xs);
            background-color: rgba(24, 109, 146, 0.94);
            width: 300px;
            height: 200px;
            overflow: hidden;
            text-align: left;
            font-size: 50px;
            color: var(--color-black);
            font-family: var(--font-judson);
        }

        /* back css */
        .js1 {
            position: absolute;
            top: 22px;
            right: 32px;
        }

        .potrait1-icon,
        .potrait2-icon {
            position: absolute;
            width: 100px;
            height: 100px;
            object-fit: cover;
        }

        .potrait2-icon {
            top: 14px;
            left: 22px;
        }

        .potrait1-icon {
            top: calc(50% - 43px);
            left: 108px;
        }

        .wwwjsphotographycom {
            position: absolute;
            bottom: 9px;
            left: calc(50% - 48px);
            font-size: 12px;
        }

        .js-parent {
            position: relative;
            border-radius: 12px;
            background-color: rgba(24, 109, 146, 0.94);
            width: 300px;
            height: 200px;
            overflow: hidden;
            text-align: left;
            font-size: 30px;
            color: var(--color-black);
            font-family: var(--font-judson);
        }
</style>
