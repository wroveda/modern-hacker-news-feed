// Toggles between dark and light mode
function switchTheme() {
	document.querySelector("html").classList.toggle("dark-mode");
	
	// Switches icons
	document.querySelector("#sun").classList.toggle("hidden");
	document.querySelector("#moon").classList.toggle("hidden");
	
	// Sets theme preference in the browser
	localStorage.setItem(
		"dark-mode",
		document.querySelector("html").classList.contains("dark-mode")
	);
}

// Switches to dark theme if it is prefered
if (window.matchMedia("(prefers-color-scheme: dark)").matches ||
	localStorage.getItem("dark-mode") == "true") {
	
	switchTheme();
}

// --------------- BUTTONS ------------------
document.querySelector("#switch-theme").addEventListener("click", switchTheme);
