document.querySelector(".loginContainer__signInButton").onclick = ()=>{
	let styles = event.target.style;
	styles.color = "#008AFF";
	document.querySelector(".spinner").classList.remove("disabled");
};