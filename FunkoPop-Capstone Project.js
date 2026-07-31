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
//Saved funko pop list items
const savedIn = document.getElementById('savedInput');

savedIn.addEventListener('click', function() {
    addedPop.textContent = " Pop successfully added!";
    setTimeout(() => { addedPop.textContent = "";}, 2000);
});

function addPop() {
    const inputField = document.getElementById('funkoInput');
    const targetList = document.getElementById('funkoList');
    const itemText = inputField.value.trim();
    const newListItem = document.createElement('li');
    newListItem.textContent = itemText;
    targetList.appendChild(newListItem);
    inputField.value= "";
}

document.getElementById('funkoInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addPop();
    }
});
//chatgpt Saved funko list items

//save new user info
const regForm = document.getElementById("registerForm");

regForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = {
        username: document.getElementById("InputUserName").value,
        password: document.getElementById("InputPassword").value,
        birthDate: document.getElementById("EnterBirthday").value,
        age: document.getElementById("EnterAge").value,
        email: document.getElementById("UserEmail").value
    };

    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    const result = await response.json();

    alert(result.message);
});
