import { supabase } from './supabaseConfig.js';

window.goals = []; 

document.addEventListener('DOMContentLoaded', () => {

    checkIfLoggedIn();

    document.getElementById('signout').addEventListener('click', async (e) => {
        const { error } = await supabase.auth.signOut();
        window.location.href = 'signin.html';
    });

    document.getElementById('new-goal-button').addEventListener('click', ()=>{
        const newGoalContainer = document.getElementById('new-goal-container');
        if(newGoalContainer.style.display == 'none'){
            newGoalContainer.style.display = 'block';
        } else {
            newGoalContainer.style.display = 'none';
        }
    })

    document.getElementById('cancel-new-gaol').addEventListener('click', (e)=> {
        e.preventDefault();
        const newGoalContainer = document.getElementById('new-goal-container');
        newGoalContainer.style.display = 'none'
    })

    document.getElementById('new-gaol').addEventListener('click', (e) => {
        e.preventDefault();
        createGoal().then((data) => {
            if(data==true){
                window.alert('Sucessful')
                getGoals().then((data) => {
                    window.goals = data;
                    renderGoals()
                    const newGoalContainer = document.getElementById('new-goal-container')
                    newGoalContainer.style.display = 'none';
                });
            }
        })
    })

    getGoals().then((data) => {
        window.goals = data;
        renderGoals()
    });
});

async function getGoals() {
    const { data, error } = await supabase.from('goal').select();

    if (error == null) {
        return data;
    } else {
        console.error('Error fetching goals:', error);
        return [];
    }
}

async function createGoal() {
    const goalName = document.getElementById('goal-name').value;
    const goalFrequencyType = document.getElementById('goal-frequency_type').value;
    const goalFrequency = document.getElementById('goal-frequency').value;
    const { error } = await supabase
  .from('goal')
  .insert({ name: goalName, frequency_type: goalFrequencyType, frequency: goalFrequency })

  if (error == null) {
    return true
  }
}

async function checkIfLoggedIn() {
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      window.location.href = 'signin.html';
    }
  }

function renderGoals(){
    const goalList = document.getElementsByClassName('goal-list')[0];
    goalList.innerHTML = '';
    window.goals.forEach((goal)=>{
        const goalItem = document.createElement('a')
        goalItem.href = 'goal.html?goalid=' + goal.id
        goalItem.classList.add('goal-item');
        goalItem.innerHTML = `
                        <h3>${goal.name}</h3>
                        <div>
                            <p>${goal.frequency} time per ${goal.frequency_type}</p>
                        </div>
        `;
        goalList.appendChild(goalItem);
    })
}

