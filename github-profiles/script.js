const APIURL = 'https://api.github.com/users/';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');
const toggle = document.getElementById('theme-toggle');

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    toggle.checked = true;
  }
});

// Toggle theme
toggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
  const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
});

// Fetch user
async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    createErrorCard('User not found');
  }
}

// Fetch repos
async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + '/repos?sort=created');
    addReposToCard(data);
  } catch (err) {
    createErrorCard('Error fetching repositories');
  }
}

// Display profile
function createUserCard(user) {
  const cardHTML = `
    <div class="card">
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar" />
      <div class="user-info">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || ''}</p>
        <ul>
          <li>${user.followers} <strong>Followers</strong></li>
          <li>${user.following} <strong>Following</strong></li>
          <li>${user.public_repos} <strong>Repos</strong></li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;
  main.innerHTML = cardHTML;
}

// Display repos
function addReposToCard(repos) {
  const reposEl = document.getElementById('repos');
  repos.slice(0, 5).forEach(repo => {
    const a = document.createElement('a');
    a.classList.add('repo');
    a.href = repo.html_url;
    a.target = '_blank';
    a.innerText = repo.name;
    reposEl.appendChild(a);
  });
}

// Error display
function createErrorCard(message) {
  main.innerHTML = `<div class="card"><h1>${message}</h1></div>`;
}

// Form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = '';
  }
});
