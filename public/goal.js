import { supabase } from './supabaseConfig.js';

window.goal = null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signout').addEventListener('click', async (e) => {
        const { error } = await supabase.auth.signOut();
        window.location.href = '/signin.html';
    });

    const urlParams = new URLSearchParams(window.location.search)
    const goalID = Number(urlParams.get('goalid'));

    document.getElementById('capture-activity').addEventListener('click', ()=> {
        captureActivity(goalID);
    })


    getGoal(goalID).then((data) => {
        //window.goal = data[0];
        renderHeadline(window.goal.name)
        readerActivities(window.goal.activity)
    });
});

async function getGoal(goalID) {
    const { data, error } = await supabase.from('goal').select('name, activity(*)').eq('id', goalID);

    if (error == null) {
        window.goal = data[0];
        return data;
    } else {
        console.error('Error fetching goals:', error);
        return [];
    }
}

function renderHeadline(goalName){
    document.getElementById('goal-headline').innerText = goalName
}

function readerActivities(goalActivities){
    const tableBody = document.getElementById('activities-history');
    tableBody.innerHTML = '';
    goalActivities.forEach((activity) => {

        const formattedDate = new Intl.DateTimeFormat('de-DE', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }).format(new Date(activity.datetime));

        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${activity.id}</td>
        <td>${formattedDate}</td>
        `
        tableBody.appendChild(tr);
    })
}

async function captureActivity(goalID){
    const { error } = await supabase
  .from('activity')
  .insert({ goal_id: goalID})

  if(error == null){
    getGoal(goalID).then((data) => {
        readerActivities(window.goal.activity)
    });
  }
}