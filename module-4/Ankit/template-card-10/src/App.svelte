<script>
  import Download from "../../../Download.svelte";
  let formData = {
    name: "Business",
    owner: "John Doe",
    profession: "Profession",
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
        <label for="owner">Owner:</label>
        <input
          type="text"
          id="owner"
          bind:value={formData.owner}
          placeholder="Owner's Name"
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
        <button on:click={submitForm}>Apply</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Front Side:</h3>
      <div class="business-card-front">
        <img class="wolf-icon" alt="Logo" src="./wolf@2x.png" />
        <div class="business-card-text name">{formData.name}</div>
      </div>

      <h3>Reverse Side:</h3>
      <div class="business-card-back flex-row">
          <div class="business-card-text owner">{formData.owner}</div>
          <!-- <div class="business-card-text">{formData.name}</div> -->
          <i class="business-card-text">{formData.profession}</i>
          <div class="gap" />
          <table>
            <tr class="align">
              <td>
                <img class="icon" alt="Call" src="./phone@2x.png" />
              </td>
              <td>
                <div class="business-card-text">{formData.phoneNumber}</div>
              </td>
            </tr>
            <tr class="align">
              <td>
                <img class="icon" alt="Website" src="./website@2x.png" />
              </td>
              <td>
                <div class="business-card-text">{formData.website}</div>
              </td>
            </tr>
            <tr class="align">
              <td>
                <img class="icon" alt="" src="./circled-envelope@2x.png" />
              </td>
              <td>
                <div class="business-card-text">{formData.email}</div>
              </td>
            </tr>
            <tr class="align">
              <td>
                <img class="icon" alt="Address" src="./address@2x.png" />
              </td>
              <td>
                <div class="business-card-text">{formData.address}</div>
              </td>
            </tr>
          </table>      
          <img class="wolf-icon-rev" alt="" src="./wolf@2x.png" />
     

        <!-- <div class="rectangle" /> -->
      </div>
    </div>
  </div>
{/if}

{#if showPrompt}
  <div class="prompt">
    <div class="prompt-content">
      <p>Form Submitted!</p>
      <h3>Front Side:</h3>
      

      <h3>Reverse Side:</h3>
      

      <button on:click={closePrompt}>Close</button>
      <Download />
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
    /* border: 2px solid #333; */
    background-color: lightblue;
    /* font-family: "Times New Roman", Times, serif; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #2e224a;
    color: white;
  }
  .preview-section .business-card-back,
  .prompt-content .business-card-back {
    width: 300px;
    height: 200px;
    /* border: 2px solid #333; */
    /* background-color: lightblue; */
    /* font-family: "Times New Roman", Times, serif; */
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;

    background-color: #fff;
    /* color: #2e224a; */
  }
  .preview-section .business-card-front:hover,
  .preview-section .business-card-back:hover {
    background-color: lightcoral;
  }

  .business-card-text {
    /* max-width: 80%; */
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
    z-index: 102;
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
    margin-top: -8px;
  }
  .owner {
    font-size: large;
    font-weight: bolder;
  }

  .gap {
    margin-top: 12px;
  }

  .icon {
    height: 16px;
    margin: 0;
  }

  .align {
    align-items: center;
    margin: 0;
  }



  /* ----------------------------- */

  .wolf-icon {
    height: 96px;
  }
  .wolf-icon-rev {
    height: 56px;
    width: 56px;
  }


</style>
