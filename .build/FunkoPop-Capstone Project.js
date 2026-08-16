const { json, text } = require("express");

//google.com UserBio
const userBio =  document.getElementById("userBio");
const saveBio = document.getElementById("saveBio");
const updatedStatus = document.getElementById("updatedStatus");

window.addEventListener("DOMContentLoaded", () => {
    const bioSaved = localStorage.getItem("userBio");
    if (bioSaved) {
        userBio.value = bioSaved;
    }
});

saveBio.addEventListener("click", () => {
    localStorage.setItem("userBio", userBio.value);
    updatedStatus.textContent = "Bio save successfully!";
    setTimeout(() => { updatedStatus.textContent = "";}, 2000);
});
//google.com UserBio
