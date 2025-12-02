document.querySelectorAll('form').forEach(
  form => {
    const inputs = Array(...form.querySelectorAll('[required]'));
    const check = () => form.querySelector('input[type=submit]').disabled = !(
      inputs.every(input => input.checkValidity()) &&
      (!form.classList.contains('requires-update') || inputs.some(input => input.value != input.getAttribute('value')))
    );
    form.querySelectorAll('[required]').forEach(
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

document.querySelectorAll('textarea').forEach(elem => {
  const setRows = () => { // This function is finicky and esoteric but magic
    elem.rows = 4; // Minimum number of rows
    elem.rows = parseInt((elem.scrollHeight - 24) / 18.5); // Increases rows as needed
    /*
      The element's scroll height is equal to the number of rows of text (which are at least the set number of rows)
      times the line height (why that's 18.5, I can't figure out but it is and it's consistent) plus the
      padding (12px on top and bottom) plus a few pixels (from rounding I think?).
    */
    while(elem.scrollHeight > elem.clientHeight) { // Dumber clean up, just in case
      elem.rows++; // Increase number of rows one at a time while it can scroll.
    }
  };
  setRows();
  elem.addEventListener('input', setRows);
});

document.querySelectorAll('.comments-comment').forEach(comment => {
  const comment_id = parseInt(comment.dataset.commentId);
  const confirmElem = {
    modal: document.getElementById('comment-confirm'),
    user: document.getElementById('comment-confirm-user'),
    body: document.getElementById('comment-confirm-body'),
    id: document.getElementById('comment-confirm-id'),
  };
  const editElem = {
    modal: document.getElementById('comment-edit'),
    body: document.getElementById('comment-edit-body'),
    id: document.getElementById('comment-edit-id'),
  };
  comment.querySelectorAll('.comment-delete').forEach(dltBtn => 
    dltBtn.addEventListener('click', () => {
      confirmElem.user.innerText = `${comment.querySelector('.comment-user').innerText}'s`;
      confirmElem.body.innerText = `"${comment.querySelector('.comment-body').innerText}"`;
      confirmElem.id.value = comment_id;

      confirmElem.modal.setAttribute('closedby', 'any');
      confirmElem.modal.showModal();
    })
  );
  comment.querySelectorAll('.comment-edit').forEach(dltBtn => 
    dltBtn.addEventListener('click', (event) => {
      editElem.body.value = comment.querySelector('.comment-body').innerText;
      editElem.id.value = comment_id;

      editElem.modal.setAttribute('closedby', 'any');
      editElem.modal.showModal();
    })
  );
});

document.getElementById('comment-confirm-cancel')?.addEventListener('click', () => document.getElementById('comment-confirm').close());
document.getElementById('comment-edit-cancel')?.addEventListener('click', (event) => document.getElementById('comment-edit').close() ^ event.preventDefault());

document.querySelectorAll('dialog.open').forEach(dialog => dialog.showModal());