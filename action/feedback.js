document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const comment = document.getElementById('comment').value;

    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
        chrome.action.setPopup(
          {popup: "action/feedback.html"}
        );
    
        alert("Window id: ", tabs[0].windowId, tabs[0].url);
    

        
      });
    
    if (name && email && comment) {
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

document.getElementById("fallback").onclick = function() {
  window.location.href = chrome.runtime.getURL("action/main.html");
}