document.querySelectorAll('form').forEach(
  form => form.querySelectorAll('input[required]').forEach(
    input => input.addEventListener(
      'input',
      () => 
      form.querySelector('input[type=submit]').disabled = !Array(...form.querySelectorAll('input[required]')).every(input => input.checkValidity())
    )
  )
);

document.querySelectorAll('.password-wrapper').forEach(wrapper => {
  const input = wrapper.querySelector('input[type=password]');
  const toggle = wrapper.querySelector('.password-toggle');
  const eye = toggle.querySelector('.eye');
  const eyeSlash = toggle.querySelector('.eye-slash');

  toggle.addEventListener('click', () => {
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    eye.classList.toggle('hidden');
    eyeSlash.classList.toggle('hidden');
  });
});