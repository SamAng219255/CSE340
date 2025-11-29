document.querySelectorAll('form').forEach(
  form => {
    const inputs = Array(...form.querySelectorAll('input[required]'));
    const check = () => form.querySelector('input[type=submit]').disabled = !(
      inputs.every(input => input.checkValidity()) &&
      (!form.classList.contains('requires-update') || inputs.some(input => input.value != input.getAttribute('value')))
    );
    form.querySelectorAll('input[required]').forEach(
      input => input.addEventListener('input', check)
    );
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