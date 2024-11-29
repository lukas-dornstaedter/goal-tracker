import { supabase } from './supabaseConfig.js';

window.goals = []; 

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signout').addEventListener('click', async (e) => {
        const { error } = await supabase.auth.signOut();
        window.location.href = '/signin.html';
    });

    getGoals().then((data) => {
        window.goals = data;
        renderGoals()
    });
});

async function getGoals() {
    const { data, error } = await supabase.from('goal').select();

    if (error == null) {
        console.log(data);
        return data;
    } else {
        console.error('Error fetching goals:', error);
        return [];
    }
}

function renderGoals(){
    window.goals.forEach((goal)=>{
        const goalList = document.getElementsByClassName('goal-list')[0];
        const goalItem = document.createElement('div')
        goalItem.classList.add('goal-item');
        goalItem.innerHTML = `
                        <h3>${goal.name}</h3>
                        <div>
                            <p>Angaben zur Frequenz</p>
                        </div>
        `;
        console.log(goalItem)
        goalList.appendChild(goalItem);
    })
}

