# FINGER - Web Browser Privacy Monitoring Tool

FINGER é uma ferramenta desenvolvida como uma extensão para o navegador Google Chrome com o objetivo de monitorar e proteger a privacidade dos usuários na web. Ela detecta atividades de fingerprinting, um método utilizado para rastrear os usuários através de características únicas do navegador e do sistema, e permite ao usuário gerenciar e bloquear esses rastreadores em tempo real.

## Funcionalidades

- **Interceptação de scripts**: A extensão insere scripts (content scripts) que interceptam e monitoram métodos JavaScript para detectar fingerprinting.
- **Detecção de fingerprinting**: Monitora diversas técnicas de fingerprinting, incluindo:
  - Canvas API
  - Font Metrics
  - Plugin Enumeration
  - Audio Context
  - Battery Status API
  - Cache-Based Fingerprinting
  - Detecção de propriedades de hardware e navegador.
- **Alertas ao usuário**: Quando uma tentativa de fingerprinting é detectada, a extensão notifica o usuário via uma interface popup.
- **Bloqueio dinâmico**: A extensão permite ao usuário bloquear tentativas de rastreamento por redirecionamento através de regras dinâmicas.

## Arquitetura e Fluxo de Trabalho

1. Ao carregar uma página, o arquivo `main.js` é injetado e intercepta potenciais atividades de fingerprinting, modificando métodos JavaScript e propriedades de objetos.
2. Eventos de fingerprinting detectados são registrados e enviados ao script de plano de fundo (`service-worker.js`).
3. O script de plano de fundo processa os eventos e pode atualizar o estado da extensão ou notificar o usuário através de um popup.
4. O usuário pode interagir com o popup para ver detalhes sobre tentativas de fingerprinting e configurar o comportamento da extensão.

![Diagrama de Arquitetura](path/to/diagram.png)

## Estrutura de Arquivos

- **manifest.json**: Arquivo de configuração principal da extensão que define permissões, scripts a serem injetados, e outros metadados.
- **main.js**: Script de conteúdo que intercepta tentativas de fingerprinting em páginas web.
- **popup.html**: Interface da extensão que mostra informações ao usuário sobre eventos de fingerprinting detectados.
- **popup.js**: Script que gerencia as interações e exibe as informações no popup.
- **service-worker.js**: Gerencia processos de fundo, incluindo a sincronização de estado, bloqueio dinâmico de rastreamento, e monitoramento de redirecionamentos maliciosos.

## Tecnologias Utilizadas

- **Google Chrome Extensions API**: Utilizada para injetar scripts e manipular as permissões necessárias.
- **JavaScript**: Para interceptar, monitorar e modificar o comportamento de scripts de fingerprinting.
- **HTML/CSS**: Para a interface gráfica do popup.
  
## Instalação

1. Clone o repositório:
    ```bash
    git clone https://gitlab.com/usuario/projeto-finger.git
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd projeto-finger
    ```
3. Carregue a extensão no Google Chrome:
    - Abra `chrome://extensions/`.
    - Ative o "Modo de desenvolvedor".
    - Clique em "Carregar sem compactação" e selecione o diretório do projeto.

## Como Contribuir

1. Fork o projeto.
2. Crie uma branch para sua funcionalidade (`git checkout -b feature/nome-da-funcionalidade`).
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova funcionalidade'`).
4. Envie as alterações para o repositório remoto (`git push origin feature/nome-da-funcionalidade`).
5. Abra um Pull Request.

## Licença

«
