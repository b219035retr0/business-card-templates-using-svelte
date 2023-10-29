<script>
  import Download from "../../../Download.svelte";

  let formData = {
    name: "Medical Center",
    domain: "Health Safety",
    tagline: "Health Tagline",
    phoneNumber: "+91 9999999999",
    service1: "Emergency Services",
    service2: "Health Screening",
    service3: "Get a free Consultation",
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
  var frontContainer = document.getElementById("frontContainer");
        var backContainer = document.getElementById("backContainer");


        frontContainer.style.display = "block";
        backContainer.style.display = "none";

        if (frontContainer && backContainer) {
            frontContainer.addEventListener("click", function (e) {
                frontContainer.style.display = "none"; // Hide the frontContainer
                backContainer.style.display = "block"; // Show the backContainer
            });

            backContainer.addEventListener("click", function (e) {
                frontContainer.style.display = "block"; // Hide the frontContainer
                backContainer.style.display = "none"; // Show the backContainer
            });


        }
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
        <label for="domain">Domain:</label>
        <input
          type="text"
          id="domain"
          bind:value={formData.domain}
          placeholder="Your domain"
        />
      </div>
      <div class="form-group">
        <label for="domain">Tagline:</label>
        <input
          type="text"
          id="tagline"
          bind:value={formData.tagline}
          placeholder="Your Tagline"
        />
      </div>
      <div class="form-group">
        <label for="service-1">Service 1:</label>
        <input
          type="text"
          id="service1"
          bind:value={formData.service1}
          placeholder="Service 1"
        />
      </div>
      <div class="form-group">
        <label for="service-2">Service 2:</label>
        <input
          type="text"
          id="service2"
          bind:value={formData.service2}
          placeholder="Service 2"
        />
      </div>
      <div class="form-group">
        <label for="service-3">Service 3:</label>
        <input
          type="text"
          id="service3"
          bind:value={formData.service3}
          placeholder="Service 3"
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
      <div class="button-section">
        <button on:click={submitForm}>Apply</button>
      </div>
    </div>

    <div class="preview-section">
      <h3>Front Side:</h3>
      <div class="business-card-front">
        <img class="dr-icon" alt="Doctor" src="./dr@2x.png" />
        <div class="center-items">
          <div class="business-card-text name">{formData.name}</div>
          <div class="business-card-text domain">{formData.domain}</div>
          <div class="business-card-text tagline">{formData.tagline}</div>
        </div>
      </div>

      <h3>Reverse Side:</h3>
      <div class="business-card-back center-items">
        <div class="flex">
          <div class="center-items">
            <div class="business-card-text namerev">{formData.name}</div>
            <div class="business-card-text health-safety">
              {formData.domain}
            </div>
          </div>
          <img
            class="heart-with-pulse"
            alt="Heart With Pulse"
            src="./heart-with-pulse@2x.png"
          />
        </div>

        <table>
          <tr>
            <td>
              <img class="stethoscope-icon" alt="" src="./stethoscope@2x.png" />
            </td>
            <td>
              <p class="business-card-text service1">
                {formData.service1}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <img
                class="organ-transplantation-icon"
                alt=""
                src="./organ-transplantation@2x.png"
              />
            </td>
            <td>
              <p class="business-card-text service2">
                {formData.service2}
              </p>
            </td>
          </tr>

          <tr>
            <td>
              <img class="hospital-3-icon" alt="" src="./hospital-3@2x.png" />
            </td>
            <td>
              <p class="business-card-text service3">
                {formData.service3}
              </p>
            </td>
          </tr>
        </table>

        <div class="business-card-text">Call Now {formData.phoneNumber}</div>
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
        <img class="dr-icon" alt="Doctor" src="./dr@2x.png" />
        <div class="center-items">
          <div class="business-card-text name">{formData.name}</div>
          <div class="business-card-text domain">{formData.domain}</div>
          <div class="business-card-text tagline">{formData.tagline}</div>
        </div>
      </div>

      <h3>Reverse Side:</h3>
      <div class="business-card-back center-items" id="card-back">
        <div class="flex">
          <div class="center-items">
            <div class="business-card-text namerev">{formData.name}</div>
            <div class="business-card-text health-safety">
              {formData.domain}
            </div>
          </div>
          <img
            class="heart-with-pulse"
            alt="Heart With Pulse"
            src="./heart-with-pulse@2x.png"
          />
        </div>

        <table>
          <tr>
            <td>
              <img class="stethoscope-icon" alt="" src="./stethoscope@2x.png" />
            </td>
            <td>
              <p class="business-card-text service1">
                {formData.service1}
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <img
                class="organ-transplantation-icon"
                alt=""
                src="./organ-transplantation@2x.png"
              />
            </td>
            <td>
              <p class="business-card-text service2">
                {formData.service2}
              </p>
            </td>
          </tr>

          <tr>
            <td>
              <img class="hospital-3-icon" alt="" src="./hospital-3@2x.png" />
            </td>
            <td>
              <p class="business-card-text service3">
                {formData.service3}
              </p>
            </td>
          </tr>
        </table>

        <div class="business-card-text">Call Now {formData.phoneNumber}</div>
      </div>

      <button on:click={closePrompt}>Close</button>
      <!--  -->
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
    border: 2px solid #333;
    background-color: lightblue;
    /* font-family: "Times New Roman", Times, serif; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0c540;
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

    background-color: #f0c540;
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
  .dr-icon {
    margin-top: 10px;
    height: 100px;
    object-fit: cover;
    /* border: 1px solid blue; */
  }

  .heart-with-pulse {
    /* position: absolute; */
    width: 41px;
    height: 45px;
    float: inline-end;
    object-fit: cover;
    /* border: 1px solid blue; */
  }

  .hospital-3-icon,
  .organ-transplantation-icon,
  .stethoscope-icon {
    /* position: absolute; */
    top: calc(50% + 5px);
    left: calc(50% - 74px);
    width: 20px;
    height: 20px;
    object-fit: cover;
    /* border: 1px solid blue; */
  }

  .service1,
  .service2,
  .service3 {
    padding: 0;
    margin: 0;
  }

  .flex {
    display: flex;
  }

  .name {
    font-size: xx-large;
    font-weight: bolder;
  }

  .domain,
  .namerev {
    font-size: large;
    font-weight: bold;
  }

  .center-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    margin-bottom: 16px;
  }

  table {
    margin-bottom: 8px;
  }
</style>
