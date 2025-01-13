/**
 * Description placeholder
 *
 * @type {{}}
 */
const techniques = [
    { name: "fontMetrics", type: "long-term",  
      traces: [
        { 
            getEntropy: function () {
                let baseEntropy = () => Math.pow(2, 20), 
                surplus = 1000,
                arr = [],
                parts,
                methodName,
                items = ["HTMLElement.prototype.appendChild",
                    "HTMLElement.prototype.removeChild",
                    "Element.prototype.innerHTML",
                    "HTMLElement.prototype.offsetWidth", 
                    "HTMLElement.prototype.offsetHeight", 
                    "Node.prototype.textContent", 
                    "HTMLElement.prototype.style.color", 
                    "HTMLElement.prototype.style.visibility", 
                    "HTMLElement.prototype.style.fontSize", 
                    "HTMLElement.prototype.style.fontFamily"];
                items.map( (name, index) => { 
                    parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                    });
                return Math.min(Math.min(...arr) * baseEntropy() / surplus, baseEntropy());
            }
        },
        { 
            getEntropy: function () {
                let baseEntropy = () => Math.pow(2, 20), 
                surplus = 1000,
                arr = [],
                arr2 = [],
                parts,
                methodName,
                items = [
                    "HTMLElement.prototype.getBoundingClientRect", 
                    "HTMLElement.prototype.offsetWidth", 
                    "HTMLElement.prototype.offsetHeight", 
                    "HTMLElement.prototype.style.fontFamily"],
                items2 = [
                    "HTMLElement.prototype.appendChild", 
                    "HTMLElement.prototype.removeChild", 
                    "Element.prototype.innerHTML", 
                    "HTMLElement.prototype.style.position", 
                    "HTMLElement.prototype.style.top", 
                    "HTMLElement.prototype.left", 
                    "HTMLElement.prototype.style.fontSize", 
                    "HTMLElement.prototype.style.whiteSpace"];
                items.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                items2.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], (arr2.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]));
                });
                return (Math.min(...arr) >= 1 && Math.min(...arr2) >= 1) ? Math.min(Math.min(...arr) * baseEntropy() / surplus, baseEntropy()) :  0;
            }
        }
      ]
    },
    /*
        Descrição: A técnica de "benchmarking animation fingerprint" usa a função requestAnimationFrame juntamente com medições de tempo de alta precisão, como performance.now, para obter variações no comportamento de renderização da animação, que podem ser exploradas para gerar uma impressão digital do dispositivo. 
                Essa técnica pode diferenciar máquinas com base nas variações na velocidade de processamento da animação, como as pequenas flutuações de tempo entre as execuções de frames, que podem ser influenciadas por fatores como a arquitetura do processador, a carga da CPU e a precisão dos temporizadores.

        Entropia (20-80 bits):
            A entropia de uma fingerprint gerada por esse método depende de vários fatores:
            - Precisão do temporizador (milionésimos de segundo): Se a precisão for da ordem de microsegundos (1 milionésimo de segundo), a variabilidade dos valores de tempo pode ser medida em cerca de 20-24 bits de entropia para cada amostra de tempo (dependendo da resolução do sistema e da precisão do temporizador). Porém, a precisão de requestAnimationFrame pode ser limitada pela taxa de atualização da tela, que geralmente é de 60 Hz (16,6 ms entre frames) ou 120 Hz em monitores de alta taxa de atualização. Isso limita a entropia observada para uma única amostra de frame.
            - Variações de performance
            - Duração dos testes (mais longo mais frames coletados)

        Obs. Quando o window.requestAnimationFrame é chamado e o frame demora mais para ser processado do que o tempo ideal para a próxima animação (ou seja, se o frame "atrasar"), ele não será renderizado imediatamente assim que estiver pronto. Em vez disso, ele aguarda o próximo ciclo de renderização, ou seja, o próximo "frame".
        - Se um frame atrasar: O navegador simplesmente espera o próximo ciclo de renderização para inserir o quadro já processado. Não há um "skip" de frames ou um "salto" de tempo; ele vai renderizar o próximo quadro na próxima vez que o navegador esteja pronto para fazer a atualização.
        - Por exemplo: Se uma função de animação chamada via requestAnimationFrame levar 30 ms para ser executada em vez dos 16,67 ms ideais, o próximo quadro ainda será exibido na próxima oportunidade disponível, mas o quadro anterior pode não ser exibido ou será "perdido". O objetivo é sempre manter a animação fluida, alinhada ao ciclo de renderização do navegador.

    */
    { name: "benchmarking", type: "long-term",  
        traces: [
          { 
              getEntropy: function () {
                let baseEntropy = () => Math.pow(2, 20),
                arr = [],
                arr2 = [],
                parts,
                methodName,
                items = [
                    "window.requestAnimationFrame"],
                items2 = [
                    "window.performance.now"

                ];
                items.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                items2.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], (arr2.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]));
                });
                return (arr[0] == true && arr2[0] >= 200) ? baseEntropy() :  0;
              }
          },
          { 
            getEntropy: function () {
              let baseEntropy = () => Math.pow(2, 20), 
              surplus = 1000,
              arr = [],
              arr2 = [],
              parts,
              methodName,
              items = [
                  "window.requestAnimationFrame"],
              items2 = [
                  "window.performance.mark",
                  "window.performance.measure",

              ];
              items.map((name, index) => {
                  parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
              });
              items2.map((name, index) => {
                  parts = name.split("."), methodName = parts[parts.length - 1], (arr2.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]));
              });
              return (arr[0] == true && Math.min(...arr2) >= 200) ? baseEntropy() :  0;
            }
            },
            { 
                getEntropy: function () {
                  let baseEntropy = () => Math.pow(2, 20), 
                  surplus = 1000,
                  arr = [],
                  arr2 = [],
                  parts,
                  methodName,
                  items = [
                      "window.requestAnimationFrame"],
                  items2 = [
                      "Date.now"
                  ];
                  items.map((name, index) => {
                      parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                  });
                  items2.map((name, index) => {
                      parts = name.split("."), methodName = parts[parts.length - 1], (arr2.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]));
                  });
                  return (arr[0] == true && arr2[0] >= 1000) ? baseEntropy() :  0;
                }
            },
            { 
                getEntropy: function () {
                  let baseEntropy = () => Math.pow(2, 20), 
                  surplus = 1000,
                  arr = [],
                  arr2 = [],
                  parts,
                  methodName,
                  items = [
                      "window.requestAnimationFrame"],
                  items2 = [
                      "document.timeline.currentTime"
                  ];
                  items.map((name, index) => {
                      parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                  });
                  items2.map((name, index) => {
                      parts = name.split("."), methodName = parts[parts.length - 1], (arr2.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]));
                  });
                  return (arr[0] == true && arr2[0] >= 1000) ? baseEntropy() :  0;
                }
            }
        ]
    },
    /*
        Descrição: O fingerprinting do AudioContext é uma técnica que explora as diferenças subtis entre os dispositivos, navegadores e ambientes para criar um identificador único. Os navegadores implementam a API AudioContext (ou webkitAudioContext para compatibilidade) de maneira ligeiramente diferente, devido a variações no hardware (como a CPU, placa de som) e drivers, entre outros fatores.
            - A ideia básica é criar um AudioContext e executar uma série de operações, como a criação de um AnalyserNode ou GainNode, e observar como essas operações se comportam no contexto de áudio.
            - Esses comportamentos podem incluir diferenças no tempo de resposta, latência ou características específicas do sistema de áudio, que podem ser detectadas e usadas para gerar um fingerprint.

        Entropia (20-60 bits)  alguns dos fatores que contribuem para a entropia:
            - Características de Hardware: Diferenças no hardware, como a placa de som, o processador e a GPU, podem afetar como o áudio é processado e renderizado, o que aumenta a entropia.
            - Implementação do Navegador: Cada navegador (Chrome, Firefox, Safari, etc.) tem suas próprias otimizações e peculiaridades no processamento de áudio, o que pode ser uma fonte significativa de variação.
            - Sistema Operacional: O sistema operacional também pode influenciar o comportamento do AudioContext. Por exemplo, sistemas como Windows, macOS, e Linux podem ter diferenças no modo como gerenciam a latência de áudio e buffers de som.
            - Capacidade de Detecção de Latência: A latência no contexto de áudio é um dos principais fatores para gerar uma assinatura única, e ela pode ser influenciada por drivers de áudio ou configurações específicas do dispositivo.

        Obs. a quantidade de entropia não é uma cifra fixa, mas depende de vários fatores, como a configuração do dispositivo, do sistema operacional, e das características específicas do navegador e hardware.

    */
    { name: "audioctx", type: "long-term",  
        traces: [
          { 
              getEntropy: function () {
                let baseEntropy = () => Math.pow(2, 20),
                arr = [],
                parts,
                methodName,
                items = [
                    "window.AudioContext",
                    "BaseAudioContext.prototype.createOscillator",
                    "BaseAudioContext.prototype.createDynamicsCompressor",
                    "OfflineAudioContext.prototype.startRendering",
                    "OscillatorNode.prototype.frequency",
                    "OscillatorNode.prototype.type"
                ];
                items.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                return (Math.min(...arr) == 1) ? baseEntropy() : 0;
              }
          }
        ]
    },
    /*
        Descrição: O ataque PRIME+PROBE tenta explorar a maneira como diferentes dados, como informações de recursos e padrões de carregamento de página, afetam o cache do navegador. 

        Como funciona:
         Prime: O atacante preenche a cache do sistema com dados específicos (chamados de "prime") com o objetivo de modificar o estado da cache.
         Probe: Em seguida, o atacante faz uma verificação (probe) para ver quais desses dados ainda estão na cache. Dependendo de quais dados estão presentes ou ausentes, o atacante pode inferir o comportamento do navegador e informações sobre ele.

         Entropia: 
          O número de bits de entropia que a técnica pode computar depende de vários fatores:
            - Granularidade do cache: Se o navegador ou sistema possui um cache de alta granularidade, que armazena muitas informações sobre recursos carregados, o ataque pode obter informações mais detalhadas, aumentando a entropia.
    */
    { name: "cache", type: "long-term",  
        traces: [
          { 
              getEntropy: function () {
                let baseEntropy = () => Math.pow(2, 40),
                arr = [], arr2 = [], arr3 = [],
                parts,
                methodName,
                items = [
                    "window.performance.now",
                    "window.performance.mark",
                    "window.performance.measure"
                ],
                items2 = [
                    "window.Int8Array",
                    "window.Uint8Array",
                    "window.Uint8ClampedArray",
                    "window.Int16Array",
                    "window.Uint16Array",
                    "window.Int32Array",
                    "window.Uint32Array",
                    "window.Float32Array",
                    "window.Float64Array",
                    "window.BigInt64Array",
                    "window.BigUint64Array",
                ],
                items3 = [
                    "window.crossOriginIsolated"
                ]
                items.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                items2.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr2.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                items3.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr3.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                return (Math.min(...arr) >= 250 && Math.max(...arr2) == true) ? baseEntropy() : 0;
              }
          }
        ]
    },
    /*



    */
    { name: "canvas", type: "long-term",  
        traces: [
          { 
              getEntropy: function () {
                let baseEntropy = () => Math.pow(2, 20),
                arr = [], arr2 = [], arr3 = [], arr4 = [],
                parts,
                methodName,
                textopt1 = [
                    "HTMLCanvasElement.prototype.getContext",
                    "HTMLCanvasElement.prototype.toDataURL",
                    "CanvasRenderingContext2D.prototype.fillText",
                    "CanvasRenderingContext2D.prototype.textBaseline",
                    "CanvasRenderingContext2D.prototype.font"
                ],
                textopt2 = [
                    "HTMLCanvasElement.prototype.getContext",
                    "HTMLCanvasElement.prototype.toDataURL",
                    "CanvasRenderingContext2D.prototype.strokeText",
                    "CanvasRenderingContext2D.prototype.textBaseline",
                    "CanvasRenderingContext2D.prototype.font"
                ],
                path = [
                    "HTMLCanvasElement.prototype.getContext",
                    "HTMLCanvasElement.prototype.toDataURL",
                    "CanvasRenderingContext2D.prototype.isPointInPath",
                    "CanvasRenderingContext2D.prototype.beginPath",
                    "CanvasRenderingContext2D.prototype.arc",
                    "CanvasRenderingContext2D.prototype.closePath",
                    "CanvasRenderingContext2D.prototype.fill"
                ]
                rect = [
                    "HTMLCanvasElement.prototype.getContext",
                    "HTMLCanvasElement.prototype.toDataURL",
                    "CanvasRenderingContext2D.prototype.rect",
                    "CanvasRenderingContext2D.prototype.fillRect",
                    "CanvasRenderingContext2D.prototype.fillStyle",
                    "CanvasRenderingContext2D.prototype.globalCompositeOperation"
                ];
                textopt1.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                textopt2.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr2.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                path.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr3.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                rect.map((name, index) => {
                    parts = name.split("."), methodName = parts[parts.length - 1], arr4.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                });
                return (Math.min(...arr) >= 1 || Math.min(...arr2) == 1 || Math.min(...arr3) == 1 || Math.min(...arr4) == 1) ? baseEntropy() : 0;
              }
          }
        ]
    },
        /*



    */
    { name: "fontEnumeration", type: "long-term",  
        traces: [
            { 
                getEntropy: function () {
                    let baseEntropy = () => Math.pow(2, 20),
                    arr = [], arr2 = [],
                    parts,
                    methodName,
                    items = [
                        "HTMLElement.prototype.style.position",
                        "HTMLElement.prototype.style.top",
                        "HTMLElement.prototype.style.left",
                        "HTMLElement.prototype.style.fontFamily",
                    ],
                    items2 = [
                        "CanvasRenderingContext2D.prototype.font",
                        "HTMLElement.prototype.offsetWidth",
                        "HTMLElement.prototype.offsetHeight",
                        "Node.prototype.textContent",
                        "CanvasRenderingContext2D.prototype.measureText"
                    ];
                    items.map((name, index) => {
                        parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                    });
                    items2.map((name, index) => {
                        parts = name.split("."), methodName = parts[parts.length - 1], arr2.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                    });
                    return (Math.min(...arr) >= 1 && Math.min(...arr2) >= 30) ? baseEntropy() : 0;
                }
            }
        ]
    },
      /*



    */
      { name: "pluginEnumeration", type: "long-term",  
        traces: [
            { 
                getEntropy: function () {
                    let baseEntropy = () => Math.pow(2, 10),
                    arr = [],
                    parts,
                    methodName,
                    items = [
                        "window.fetch"
                    ];
                    items.map((name, index) => {
                        parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                    });
                    return (Math.min(...arr) >= 40) ? baseEntropy() : 0;
                }
            },
            { 
                getEntropy: function () {
                    let baseEntropy = () => Math.pow(2, 10),
                    arr = [],
                    parts,
                    methodName,
                    items = [
                        "window.performance.getEntriesByType"
                    ];
                    items.map((name, index) => {
                        parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                    });
                    return (Math.min(...arr) >= 1) ? baseEntropy() : 0;
                }
            },
            { 
                getEntropy: function () {
                    let baseEntropy = () => Math.pow(2, 10),
                    arr = [],
                    parts,
                    methodName,
                    items = [
                        "window.onmessage"
                    ];
                    items.map((name, index) => {
                        parts = name.split("."), methodName = parts[parts.length - 1], arr.push(resolvePath(parts.slice(0,-1).join("."), fingerstatus)[methodName]);
                    });
                    return (Math.min(...arr) >= 1) ? baseEntropy() : 0;
                }
            }
        ]
    }

];
