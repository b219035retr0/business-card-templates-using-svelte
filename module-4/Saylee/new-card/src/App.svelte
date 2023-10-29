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
      <div class="business-card-front" id="card-front">
        <div class="front" id="frontContainer">
          <div class="frame-parent">
            <img
              class="frame-icon"
              alt=""
              src="./frame@2x.png"
              id="frameImage"
            />
    
            <div class="frame">
              <img class="icon" alt="" src="./3-1@2x.png" />
    
              <div class="vegan-catering">
                {formData.name}
              </div>
              <div class="for-wedding-birthday">
                For wedding, birthday party & gathering
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3>Reverse Side:</h3>
      <div class="business-card-back">
        <div class="back" id="backContainer">
          <div class="frame1">
            <div class="frame2">
              <div class="frame3">
                <img class="icon1" alt="" src="./4-1@2x.png" />
    
                <b class="vegan-catering1">
                  <p class="vegan1">Vegan</p>
                  <p class="vegan1">Catering</p>
                </b>
              </div>
              <div class="frame4">
                <div class="for-wedding-birthday1">
                  For wedding, birthday party & gathering
                </div>
              </div>
            </div>
            <img class="frame-icon1" alt="" src="./frame1.svg" />
          </div>
          <div class="frame5">
            <div class="frame6">
              <img
                class="green-vegan-food-catering-busi"
                alt=""
                src="./green-vegan-food-catering-business-card-2@2x.png"
              />
    
              <div class="frame7">
                <b class="hatim-hakkan">{formData.name}</b>
                <div class="div">{formData.phoneNumber}</div>
                <div class="div">{formData.address}</div>
                <div class="div">20010997@ycce.in</div>
                <div class="div">{formData.website}</div>
              </div>
            </div>
          </div>
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
      <div class="business-card-front" id="card-front">
        <div class="front" id="frontContainer">
          <div class="frame-parent">
            <img
              class="frame-icon"
              alt=""
              src="./frame@2x.png"
              id="frameImage"
            />
    
            <div class="frame">
              <img class="icon" alt="" src="./3-1@2x.png" />
    
              <div class="vegan-catering">
                {formData.name}
              </div>
              <div class="for-wedding-birthday">
                For wedding, birthday party & gathering
              </div>
            </div>
          </div>
        </div>
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
        <div class="back" id="backContainer">
          <div class="frame1">
            <div class="frame2">
              <div class="frame3">
                <img class="icon1" alt="" src="./public/4-1@2x.png" />
                <img class="icon1" alt="" src="./4-1@2x.png" />
    
                <b class="vegan-catering1">
                  <p class="vegan1">Vegan</p>
                  <p class="vegan1">Catering</p>
                </b>
              </div>
              <div class="frame4">
                <div class="for-wedding-birthday1">
                  For wedding, birthday party & gathering
                </div>
              </div>
            </div>
            <img class="frame-icon1" alt="" src="./frame1.svg" />
          </div>
          <div class="frame5">
            <div class="frame6">
              <img
                class="green-vegan-food-catering-busi"
                alt=""
                src="./green-vegan-food-catering-business-card-2@2x.png"
              />
    
              <div class="frame7">
                <b class="hatim-hakkan">{formData.name}</b>
                <div class="div">{formData.phoneNumber}</div>
                <div class="div">{formData.address}</div>
                <div class="div">20010997@ycce.in</div>
                <div class="div">{formData.website}</div>
              </div>
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
      --font-news-cycle: "News Cycle";
      --font-playfair-display: "Playfair Display";
      --font-dm-serif-display: "DM Serif Display";
    
      /* font sizes */
      --font-size-5xs-1: 7.1px;
      --font-size-4xs-7: 8.7px;
    
      /* Colors */
      --color-olivedrab: #7ba02f;
      --color-white: #fff;
    
      /* Gaps */
      --gap-sm: 14px;
      --gap-0: 0px;
    
      /* Paddings */
      --padding-11xs: 2px;
    }

    .frame-icon {
flex: 1;
max-width: 100%;
overflow: hidden;
height: 200px;
object-fit: cover;
cursor: pointer;
}
.icon {
position: relative;
width: 57.14px;
height: 33.64px;
object-fit: cover;
}

.for-wedding-birthday,
.vegan-catering {
position: relative;
display: inline-block;
flex-shrink: 0;
}
.vegan-catering {
font-weight: 600;
width: 158px;
height: 68px;
}
.for-wedding-birthday {
font-size: 7.14px;
font-family: var(--font-news-cycle);
color: #fffefe;
width: 170.57px;
height: 12.57px;
}
.frame {
flex: 1;
height: 163px;
overflow: hidden;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
}
.frame-parent,
.front {
width: 300px;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
}
.front {
position: relative;
background-color: var(--color-olivedrab);
box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
width: 300px;
overflow: hidden;
justify-content: space-between;
cursor: pointer;
text-align: center;
font-size: 25.71px;
color: var(--color-white);
font-family: var(--font-playfair-display);
}
@media screen and (max-width: 1200px) {
.frame-icon {
  width: 453px;
}
.front {
  height: 200px;
}
}
@media screen and (max-width: 960px) {
.frame-icon {
  height: 600px;
  align-items: center;
  justify-content: flex-start;
  padding-left: var(--padding-11xs);
  padding-right: var(--padding-11xs);
  box-sizing: border-box;
}
.front {
  gap: var(--gap-sm);
}
}
@media screen and (max-width: 420px) {
.frame-icon {
  height: 600px;
}
}

.icon1 {
position: relative;
width: 57.14px;
height: 33.64px;
object-fit: cover;
}
.vegan1 {
margin: 0;
}
.vegan-catering1 {
flex: 1;
position: relative;
}
.frame3 {
width: 128.29px;
overflow: hidden;
display: flex;
flex-direction: row;
align-items: flex-start;
justify-content: flex-start;
gap: 13px;
}
.for-wedding-birthday1 {
align-self: stretch;
position: relative;
}
.frame2,
.frame4 {
overflow: hidden;
display: flex;
flex-direction: column;
}
.frame4 {
width: 258.57px;
align-items: flex-end;
justify-content: center;
text-align: center;
font-size: 7.14px;
font-family: var(--font-news-cycle);
}
.frame2 {
align-self: stretch;
align-items: flex-start;
justify-content: flex-start;
gap: 3px;
}
.frame-icon1,
.frame1 {
width: 258.57px;
overflow: hidden;
}
.frame-icon1 {
position: relative;
height: 2.99px;
flex-shrink: 0;
}
.frame1 {
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
gap: 4.33px;
}
.green-vegan-food-catering-busi {
position: relative;
width: 124px;
height: 98px;
object-fit: cover;
}
.div,
.hatim-hakkan {
position: relative;
display: inline-block;
width: 110.33px;
flex-shrink: 0;
}
.hatim-hakkan {
font-size: 13.71px;
font-family: var(--font-playfair-display);
height: 23.33px;
}
.div {
height: 14px;
}
.frame7 {
width: 119px;
height: 98px;
flex-shrink: 0;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 4.67px;
}
.back,
.frame5,
.frame6,
.frame7 {
overflow: hidden;
display: flex;
}
.frame6 {
align-self: stretch;
flex-direction: row;
align-items: center;
justify-content: flex-start;
gap: var(--gap-sm);
}
.back,
.frame5 {
flex-direction: column;
}
.frame5 {
align-self: stretch;
align-items: flex-end;
justify-content: center;
font-size: 8.67px;
font-family: var(--font-dm-serif-display);
}
.back {
position: relative;
background-color: var(--color-white);
width: 100%;
height: 200px;
align-items: flex-start;
justify-content: flex-start;
padding: 16.66699981689453px 24.285999298095703px 11.666999816894531px
  17.14299964904785px;
box-sizing: border-box;
gap: 15px;
cursor: pointer;
text-align: left;
font-size: 14.29px;
color: var(--color-olivedrab);
font-family: var(--font-playfair-display);
}
.back:active {
cursor: auto;
}
@media screen and (max-width: 1200px) {
.frame6 {
  gap: var(--gap-sm);
  align-items: center;
  justify-content: flex-start;
}
.back {
  height: 600px;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--gap-0);
}
}
@media screen and (max-width: 960px) {
.frame6 {
  width: 300px;
  height: 200px;
}
.back {
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--gap-0);
}
}
@media screen and (max-width: 420px) {
.frame6 {
  height: 200px;
}
.back {
  height: 600px;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--gap-0);
}
}

</style> 
<link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Playfair Display:wght@600;700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=News Cycle:wght@400&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=DM Serif Display:wght@400&display=swap"
    />