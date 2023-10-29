<script>
  import Download from "../../Download.svelte";
  // add ID for card-front card-back in promp container

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
        <label for="designation">Designation:</label>
        <input
          type="text"
          id="designation"
          bind:value={formData.designation}
          placeholder="Your Designation"
        />
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input
          type="text"
          id="address"
          bind:value={formData.address}
          placeholder="Your Address"
        />
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
        <label for="website">Website:</label>
        <input
          type="text"
          id="website"
          bind:value={formData.website}
          placeholder="Your Website"
        />
      </div>
      <div class="button-section">
        <button on:click={submitForm}>Apply</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Front Side:</h3>
      <div class="business-card-front">
        <div class="business-card-text">{formData.name}</div>
        <div class="business-card-text">{formData.website}</div>
      </div>
      <h3>Reverse Side:</h3>
      <div class="business-card-back">
        <div class="business-card-text">{formData.name}</div>
        <div class="business-card-text">{formData.designation}</div>
        <div class="business-card-text">{formData.address}</div>
        <div class="business-card-text">{formData.phoneNumber}</div>
        <div class="business-card-text">{formData.website}</div>
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
        <div class="business-card-text">{formData.name}</div>
        <div class="business-card-text">{formData.website}</div>
      </div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <!-- <a href="#" download="front.jpeg">
		<button>Download Front (JPEG)</button>
	  </a>
	  <!-- svelte-ignore a11y-invalid-attribute -->
      <!-- <a href="#" download="front.pdf">
		<button>Download Front (PDF)</button>
	  </a> -->

      <h3>Reverse Side:</h3>
      <div class="business-card-back" id="card-back">
        <div class="business-card-text">{formData.name}</div>
        <div class="business-card-text">{formData.designation}</div>
        <div class="business-card-text">{formData.address}</div>
        <div class="business-card-text">{formData.phoneNumber}</div>
        <div class="business-card-text">{formData.website}</div>
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
</style>
