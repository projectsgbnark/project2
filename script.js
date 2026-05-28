const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const formStatus = document.getElementById('formStatus');

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Please complete all fields before sending.';
    return false;
  }

  formStatus.textContent = 'Sending your message...';

  fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, message }),
  })
    .then((response) => response.json())
    .then((data) => {
      formStatus.textContent = data.message || 'Message submitted successfully.';
      if (data.status === 'success') {
        form.reset();
      }
    })
    .catch(() => {
      formStatus.textContent = 'Unable to submit right now. Please try again later.';
    });

  return false;
}
