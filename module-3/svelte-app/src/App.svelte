<script>
	let name = '';
	let title = '';
	let company = '';
	let countryCode = '';
	let phoneNumber = '';
	let email = '';
	let address = '';
	let website = '';
  
	// Function to handle Google Sign In
  
	function handleSubmit() {
	  if (validateForm()) {
		alert('Submitted!');
	  } else {
		alert('Please fill out all required fields correctly.');
		return;
	  }
  
	  const formattedPhoneNumber = `${countryCode}-${phoneNumber}`;
	  console.log('Form submitted:', { name, title, company, phoneNumber: formattedPhoneNumber, email, address, website });
	}
  
	function validateForm() {
	  return (
		name.trim() !== '' &&
		email.trim() !== '' &&
		address.trim() !== '' &&
		countryCode.match(/^[\+\d]+$/) &&
		phoneNumber.match(/^[\d]+$/) &&
		phoneNumber.length >= 10 &&
		countryCode.length <= 4
	  );
	}
  </script>
  
  <style>
	/* Add your responsive CSS styles here */
  
	/* Use Montserrat for headings and Roboto for text */
	.navbar {
	  display: flex;
	  justify-content: space-between;
	  background-color: #000000;
	  color: #fff;
	  padding: 10px 20px;
	  font-family: 'Montserrat', sans-serif;
	}
  
	.navbar button {
	  background-color: transparent; /* Removed background color */
	  color: #fff;
	  padding: 5px 10px;
	  border: none;
	  border-radius: 5px;
	  cursor: pointer;
	  font-weight: 700;
	  transition: background-color 0.3s;
	  margin-right: 10px; /* Add spacing between buttons */
	}
  
	.navbar button:last-child {
	  margin-right: 0; /* Remove margin from the last button */
	}
  
	.navbar button:hover {
	  background-color: #5faef8;
	  padding: 10px 20px;
	}
  
	.form-container {
	  max-width: 400px;
	  margin: 20px auto;
	  padding: 20px;
	  border: 1px solid #ccc;
	  border-radius: 10px;
	  background-color: #f9f9f9;
	  font-family: 'Roboto', sans-serif;
	}
  
	.title {
	  font-size: 24px;
	  font-weight: bold;
	  text-align: center;
	  margin-bottom: 20px;
	  color: #5faef8;
	  cursor: pointer;
	  font-family: 'Montserrat', sans-serif;
	}
  
	.title:hover {
	  text-decoration: underline;
	}
  
	label {
	  display: block;
	  margin-top: 10px;
	  font-weight: 700;
	  color: #333;
	}
  
	input,
	textarea {
	  width: 100%;
	  padding: 10px;
	  margin-top: 5px;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  font-size: 16px;
	  color: #555;
	}
  
	button {
	  background-color: #007bff;
	  color: #fff;
	  padding: 10px 20px;
	  border: none;
	  border-radius: 5px;
	  cursor: pointer;
	  margin-top: 20px;
	  font-size: 18px;
	  font-weight: bold;
	  transition: background-color 0.3s;
	}
  
	button:hover {
	  background-color: #0056b3;
	}
  
	/* Add responsive CSS for smaller screens */
	@media screen and (max-width: 600px) {
	  .navbar {
		flex-direction: column;
		align-items: center;
	  }
	  .navbar button {
		margin: 10px 0;
	  }
	}
  </style>
  
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  
  <div class="navbar">
	<!-- svelte-ignore missing-declaration -->
	<button on:click={navigateToHome}>Home</button>
	<!-- svelte-ignore missing-declaration -->
	<button on:click={navigateToAbout}>About</button>
	<!-- svelte-ignore missing-declaration -->
	<button on:click={navigateToTemplates}>Templates</button>
	<!-- svelte-ignore missing-declaration -->
	<button on:click={navigateToSupport}>Support</button> 
	<!-- svelte-ignore missing-declaration -->
	<button class="sign-in-button" on:click={signInWithGoogle}>Login/Signup</button>
  </div>
  
  <div class="form-container">
	<div class="title">The Business Card Generator: Input Form</div>
	<form on:submit={handleSubmit}>
	  <label for="name">Name</label>
	  <input type="text" id="name" bind:value={name} required />
  
	  <label for="title">Title</label>
	  <input type="text" id="title" bind:value={title} />
  
	  <label for="company">Company</label>
	  <input type="text" id="company" bind:value={company} />
  
	  <label for="phoneNumber">Phone Number</label>
	  <div style="display: flex;">
		<input type="tel" id="countryCode" bind:value={countryCode} style="width: 20%; margin-right: 5px;" placeholder="Country Code" />
		<input type="tel" id="phoneNumber" bind:value={phoneNumber} style="width: 70%;" placeholder="Phone Number" required />
	  </div>
  
	  <label for="email">Email</label>
	  <input type="email" id="email" bind:value={email} required />
  
	  <label for="website">Website</label>
	  <input type="url" id="website" bind:value={website} />
  
	  <label for="address">Address</label>
	  <textarea id="address" bind:value={address} required></textarea>
  
	  <button type="submit">Generate Business Card</button>
	</form>
  </div>
  