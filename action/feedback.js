document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const comment = document.getElementById('comment').value;
    const rating = document.getElementById('rating').value;
    
    if (name && email && comment && rating >= 1 && rating <= 5) {
        // Simula o envio de dados (poderia ser uma requisição para um servidor)
        document.getElementById('message').textContent = "Obrigado pelo seu feedback!";
        document.getElementById('message').style.color = 'green';

        // Limpar o formulário após o envio
        document.getElementById('feedbackForm').reset();
    } else {
        document.getElementById('message').textContent = "Por favor, preencha todos os campos corretamente.";
        document.getElementById('message').style.color = 'red';
    }
});
