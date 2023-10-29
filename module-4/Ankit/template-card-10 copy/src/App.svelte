<script>
  let formData = {
    name: "Company Name",
    tagline: "Tagline",
    owner: "John Doe",
    position: "Manager",
    address: "Address",
    email: "example@email.com",
    website: "example.com",
    phoneNumber: "+91 9999999999",
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
        <label for="tagline">Tagline:</label>
        <input
          type="text"
          id="tagline"
          bind:value={formData.tagline}
          placeholder="tagline's Name"
        />
      </div>
      <div class="form-group">
        <label for="owner">Your Name:</label>
        <input
          type="text"
          id="owner"
          bind:value={formData.owner}
          placeholder="owner's Name"
        />
      </div>
      <div class="form-group">
        <label for="owner">Position:</label>
        <input
          type="text"
          id="position"
          bind:value={formData.position}
          placeholder="Position"
        />
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input
          type="text"
          id="address"
          bind:value={formData.address}
          placeholder="Your address"
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          bind:value={formData.email}
          placeholder="Your Email"
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
        <label for="phoneNumber">Website:</label>
        <input
          type="text"
          id="website"
          bind:value={formData.website}
          placeholder="Your Website URL"
        />
      </div>
      <div class="button-section">
        <button on:click={submitForm}>Submit</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Front Side:</h3>
      <div class="business-card-front">
        <img
          class="icon-grid-three-up"
          alt="None"
          src="./icon-grid-three-up.png"
        />

        <b class="company-name">{formData.name}</b>
        <div class="tagline">{formData.tagline}</div>
      </div>

      <h3>Reverse Side:</h3>
      <div class="business-card-back">
        <div class="">
          <div class="your-name">{formData.owner}</div>
          <div class="position">{formData.position}</div>
          <img class="frame-child" alt="" src="./rectangle-1.png" />

          <div class="contact">{formData.phoneNumber}</div>
          <div class="website-url">{formData.website}</div>
          <div class="email">{formData.email}</div>
          <div class="address">{formData.address}</div>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if showPrompt}
  <div class="prompt">
    <div class="prompt-content">
      <p>Form Submitted!</p>
      <h3>Front Side:</h3>
      <div class="business-card-front">
        <img class="wolf-icon" alt="Logo" src="../public/wolf@2x.png" />
        <div class="business-card-text name">{formData.name}</div>
      </div>

      <h3>Reverse Side:</h3>
      <div class="business-card-back left-items">
        <div class="padding-left">
          <div class="business-card-text tagline">{formData.tagline}</div>
          <!-- <div class="business-card-text">{formData.name}</div> -->

          <div class="gap" />
          <div class="business-card-text">{formData.phoneNumber}</div>
          <div class="business-card-text">{formData.website}</div>
          <div class="business-card-text">{formData.email}</div>
          <div class="business-card-text">{formData.address}</div>
        </div>
        <!-- <img class="website-icon" alt="Website" src="../public/website@2x.png" /> -->

        <!-- <img class="phone-icon" alt="Call" src="../public/phone@2x.png" /> -->

        <!-- <img class="address-icon" alt="Address" src="../public/address@2x.png" /> -->

        <img
          class="circled-envelope-icon"
          alt=""
          src="../public/circled-envelope@2x.png"
        />

        <img class="wolf-icon1" alt="" src="../public/wolf@2x.png" />
      </div>

      <button on:click={closePrompt}>Close</button>
    </div>
  </div>
{/if}

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
    /* font-family: "Times New Roman", Times, serif; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(9, 45, 57, 0.89);
    color: white;
    overflow: hidden;
    text-align: left;
    font-size: 20px;
    font-family: var(--font-inter);
  }
  .preview-section .business-card-back,
  .prompt-content .business-card-back {
    width: 300px;
    height: 200px;
    border: 2px solid #333;
    background-color: lightblue;
    /* font-family: "Times New Roman", Times, serif; */
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;

    background-color: rgba(231, 240, 244, 0.89);
    overflow: hidden;
    text-align: left;
    font-size: var(--font-size-3xs);
    font-family: var(--font-inter);
    color: white;
  }
  .preview-section .business-card-front:hover,
  .preview-section .business-card-back:hover {
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
  .prompt-content .business-card-front:hover,
  .prompt-content .business-card-back:hover {
    background-color: lightcoral;
  }

  /* ---------------------------------------------- */
  /* front css */

  .name {
    font-size: xx-large;
    font-weight: bolder;
  }

  .left-items {
    display: flex;
    flex-direction: column;
    align-items: left;
    /* justify-content: center; */
    /* padding-left: 30px; */
  }

  .padding-left {
    margin-top: -2px;
    margin-bottom: -2px;
    margin-left: 32px;
    margin-right: 96px;

    height: 100%;
    padding: 8px;
    padding-top: 16px;
    background-color: snow;
    color: #2e224a;
  }

  .tagline {
    font-size: large;
    font-weight: bolder;
  }

  .gap {
    margin-top: 24px;
  }

  :root {
    /* fonts */
    --font-inter: Inter;
    /* font sizes */
    --font-size-3xs: 10px;

    /* Colors */
    --color-white: #fff;
    --color-darkslategray: rgba(9, 45, 57, 0.89);
  }

  /* front css */
  .icon-grid-three-up {
    /* position: absolute; */
    width: 14.67%;
    top: 46px;
    right: 42.67%;
    left: 42.67%;
    max-width: 100%;
    overflow: hidden;
    height: 42.12px;
  }



 





  /* ----------------------------- */
</style>
