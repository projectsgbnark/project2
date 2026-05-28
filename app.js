const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'Please complete all fields before sending.',
    });
  }

  console.log('New contact submission:');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Message: ${message}`);

  return res.json({
    status: 'success',
    message: 'Thanks for reaching out! We will contact you shortly.',
  });
});

app.get('/api/services', (req, res) => {
  res.json({
    services: [
      {
        title: 'Web & Mobile Development',
        description: 'Build responsive web applications and mobile solutions with robust architecture and modern UX.',
      },
      {
        title: 'IT Consulting & Strategy',
        description: 'Align your technology investments to business goals with strategic planning and advisory support.',
      },
      {
        title: 'Network & Security',
        description: 'Design and maintain secure, resilient network infrastructure for reliable operations.',
      },
    ],
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
