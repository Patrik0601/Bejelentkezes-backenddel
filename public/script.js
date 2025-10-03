function validateEmail(email) {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function login(){
    let email = document.getElementById('email').value;
    let jelszo = document.getElementById('password').value;

    if (!validateEmail(email)) {
        alert("Hibás e-mail formátum!");
        return;
    }
    if (jelszo.trim() === "") {
        alert("A jelszó nem lehet üres!");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: jelszo })
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.message);
            return;
        }

        const user = await res.json();
        alert("Sikeres bejelentkezés!");
        localStorage.setItem("loggedInUser", user.email);
        // átirányítás pl. főoldalra
        // window.location.href = "index.html"
    } catch (err) {
        alert("Hiba történt a bejelentkezéskor!");
    }
}

async function register(){
    let email = document.getElementById('email').value;
    let jelszo1 = document.getElementById('password1').value;
    let jelszo2 = document.getElementById('password2').value;

    if (!validateEmail(email)) {
        alert("Hibás e-mail formátum!");
        return;
    }

    

    if (jelszo1 == "" || jelszo2 == "") {
        alert("A jelszó mezők nem lehetnek üresek!");
        return;
    }
    if (jelszo1 != jelszo2) {
        alert("A két jelszó nem egyezik!");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: jelszo1 })
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.message);
            return;
        }

        alert("Sikeres regisztráció!");
        window.location.href = "bejelentkezes.html";
    } catch (err) {
        alert("Hiba történt a regisztráció során!");
    }
}
