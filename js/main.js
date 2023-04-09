document.querySelector('header .hamburger').addEventListener('click', function(e) {
  document.querySelector('header').classList.toggle('visible');
});
document.querySelectorAll('#faqs .item .icon').forEach(it => { it.addEventListener('click', function(e) {
  e.target.parentElement.classList.toggle('visible');
}); });

document.querySelector('#contact').addEventListener('click', function(e) {
  if (e.target && e.target.id == 'contact') {
    document.querySelector('#contact').classList.remove('visible');
  }
});

document.querySelectorAll('[data-contact]').forEach(it => { it.addEventListener('click', function(e) {
  const classList = document.querySelector('#contact').classList;
  classList.remove('success');
  classList.remove('error');
  classList.add('visible');
  e.preventDefault();
}); });

document.querySelector('#contact form').addEventListener('submit', function(e) {

  e.preventDefault();

  const formData = new FormData(e.target);
  fetch('https://contact.cubeapm.com/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  }).then(response => {
    document.querySelector('#contact').classList.add('success');
  }).catch(e => {
    document.querySelector('#contact').classList.add('error');
  });
});

// document.getElementById('link-features').onclick = (e => {
//   document.getElementById("features").scrollIntoView({ behavior: 'smooth' });
//   return false;
// });
