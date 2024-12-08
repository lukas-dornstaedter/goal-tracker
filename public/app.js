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
        renderProgressBars();
    });
});

async function getGoals() {
    const { data, error } = await supabase.rpc('get_goal_progress');
    if (error) {
      console.error('Error fetching goal progress:', error);
      return;
    }
    return data;

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

  function setDonutProgress(id, value) {
    const progressBar = document.querySelector(`#${id}`);
    if (!progressBar) {
      console.error(`Progress bar with ID "${id}" not found.`);
      return;
    }
  
    const circle = progressBar.querySelector('.donut-progress-fill');
    const progressText = progressBar.querySelector('.donut-text');
  
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
  
    const progress = Math.min(Math.max(value, 0), 100);
  
    const offset = circumference - (progress / 100) * circumference;
  
    circle.style.strokeDashoffset = offset;
    progressText.textContent = `${Math.round(progress)}%`;
  }

function renderGoals(){
    const goalList = document.getElementsByClassName('goal-list')[0];
    goalList.innerHTML = '';
    window.goals.forEach((goal)=>{
        const goalItem = document.createElement('a')
        goalItem.href = 'goal.html?goalid=' + goal.goal_id
        goalItem.classList.add('goal-item');
        goalItem.innerHTML = `
                        <h3>${goal.name}</h3>
                        <div>
                            <p>${goal.frequency} time per ${goal.frequency_type}</p>
                            <div class="donut-progress" id="progress-${goal.goal_id}">
                                <svg class="donut" viewBox="0 0 36 36">
                                <circle class="donut-bg" cx="18" cy="18" r="15"></circle>
                                <circle class="donut-progress-fill" cx="18" cy="18" r="15"></circle>
                                </svg>
                                <div class="donut-text">0%</div>
                            </div>
                        </div>
        `;
        goalList.appendChild(goalItem);
    })
}

function renderProgressBars(){
    window.goals.forEach((goal)=>{
        setTimeout(() => {
            setDonutProgress(`progress-${goal.goal_id}`,goal.progress_percentage);
          }, 100);
        
    })
}