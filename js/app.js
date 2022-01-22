const urlBase = '';

let userId = 0;
let firstName = "";
let lastName = "";

function login() 
{
    userId = 0;
	firstName = "";
	lastName = "";

    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;
    const hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";
    const tmp = {login:login,password:hash};
	const jsonPayload = JSON.stringify(tmp);
    
    const url = urlBase + '/Login.php';
	const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "./index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function register() 
{
    const fName = document.getElementById("firstName").value;
    const lName = document.getElementById("lastName").value;
	const email = document.getElementById("email").value;
	const userName = document.getElementById("userName").value;
	const password = document.getElementById("password").value;
	const confirmPassword = document.getElementById("conPassword").value;
	

	const hash = md5(password);
    

    document.getElementById("registerResult").innerHTML = "";
    
	const tmp = {firstName:fName, lastName:lName, email:email, userName:userName, password:hash};
	const jsonPayload = JSON.stringify(tmp);
    
    const url = urlBase + '/Register.php';
	const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( password != confirmPassword )
				{		
					document.getElementById("registerResult").innerHTML = "Passwords did not match!";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				email = jsonObject.email;
				userName = jsonObject.userName;
				password = jsonObject.password;

				saveCookie();
	
				window.location.href = "./index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}


function setFormMessage(formElement, type, message) 
{
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) 
{
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) 
{
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => 
{
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#createAccountLink").addEventListener("click", e => 
	{
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#loginLink").addEventListener("click", e => 
	{
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => 
		{
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) 
			{
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => 
		{
            clearInputError(inputElement);
        });
    });
});
