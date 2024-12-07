import { supabase } from './supabaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {

    const alertText = document.getElementById('alert-text');

    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Set alert-text to default
        alertText.innerText = '';

        let siginEmail = document.getElementById('signin-email').value;
        let signinPassword = document.getElementById('signin-password').value;

        if(siginEmail == '' || signinPassword == ''){
            alertText.innerText = 'Fill up the login form to sign in.';
            alertText.style.color = 'red';
            throw new Error('Fill up the login form to sign in.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: siginEmail,
            password: signinPassword,
          })
        
        if(error==null){
            window.location.href = 'index.html'
        } else {
            alertText.innerText = 'Signin failed. Try again.';
            alertText.style.color = 'red';
        }
    })
})

// Redirect if user already signed in
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        window.location.href = 'index.html'
    }
  })

  