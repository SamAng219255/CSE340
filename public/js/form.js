document.querySelectorAll('form').forEach(
  form => {
    const check = () => form.querySelector('input[type=submit]').disabled = !Array(...form.querySelectorAll('input[required]')).every(input => input.checkValidity())
    form.querySelectorAll('input[required]').forEach(
      input => input.addEventListener('input', check)
    );
    if(form.classList.contains('requires-update'))
      form.querySelector('input[type=submit]').disabled = true;
    else
      check();
  }
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