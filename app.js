import { supabase } from './supabaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signout').addEventListener('click', async (e) => {
        const { error } = await supabase.auth.signOut()
        window.location.href = '/signin.html'
    })
})