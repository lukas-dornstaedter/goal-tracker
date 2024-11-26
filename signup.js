import { supabase } from './supabaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        let formEmail = document.getElementById('signup-email');
        let formPassword = document.getElementById('signup-password');
        let alertText = document.getElementById('alert-text');

        const { data, error } = await supabase.auth.signUp({
            email: formEmail.value,
            password: formPassword.value,
          })
        
        console.log(data)
        console.log(error)
        if(error == null){
            formEmail.value = '';
            formPassword.value = '';
            alertText.innerHTML = 'Signup sucessful. <a href="/signin.html">Click here to login</a>.'

        } else {
            alertText.innerText = error;
            alertText.style.color = red;
        }
    });
});

