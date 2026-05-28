const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const formStatus = document.getElementById('formStatus');
const serviceCards = document.getElementById('serviceCards');

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('show');
  });
});

function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const submitButton = form.querySelector('button[type="submit"]');

  if (!name || !email || !message) {
    formStatus.textContent = 'Please complete all fields before sending.';
    return false;
  }

  formStatus.textContent = 'Sending your message...';
  submitButton.disabled = true;

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
    })
    .finally(() => {
      submitButton.disabled = false;
    });

  return false;
}

function createServiceCard(service) {
  const card = document.createElement('article');
  card.className = 'service-card';
  card.innerHTML = `
    <h4>${service.title}</h4>
    <p>${service.description}</p>
  `;
  return card;
}

function loadServices() {
  if (!serviceCards) return;

  fetch('/api/services')
    .then((response) => response.json())
    .then((data) => {
      serviceCards.innerHTML = '';
      data.services.forEach((service) => {
        serviceCards.appendChild(createServiceCard(service));
      });
    })
    .catch(() => {
      serviceCards.innerHTML = '<div class="loading">Unable to load services right now.</div>';
    });
}

loadServices();
