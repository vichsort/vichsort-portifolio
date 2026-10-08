---
title: Energin
summary: Painel em tempo real de uma micro usina hidrelétrica, com os dados lidos por um Raspberry Pi.
---

## Sobre o projeto

O **Energin** é o painel de uma micro usina hidrelétrica: a água entra, faz girar uma turbina e a turbina move o gerador. Um [[raspberry-pi|Raspberry Pi]] ligado ao gerador lê os sensores e expõe as medições numa pequena API que escrevi para ele; o site consulta essa API a cada dois segundos e mostra a geração ao vivo, para quem estiver olhando a apresentação acompanhar pelo celular.

O projeto ficou em [[feira-energia-limpa-ita|1º lugar na Feira de Ciências: Circuito da Energia do Consórcio Itá]], na categoria Ensino Médio/Técnico.

### O que o painel mostra

- **Ao vivo.** Um velocímetro com a rotação da turbina (RPM), potência (W), tensão (V) e o status do sistema.
- **Modo de operação.** As faixas de rotação viram modos (econômico, normal e alto), cada um com sua cor, para leigos entenderem num relance o que está acontecendo.
- **Resumo da geração.** Energia total gerada em Wh e kWh, potência e tensão médias, pico de RPM e tempo de funcionamento.
- **Histórico.** Um gráfico de área da potência ao longo do tempo.

### Como foi feito

O front-end é em [[vue|Vue 3]] com [[vite|Vite]] e Bootstrap, pensado primeiro para a tela do celular. O velocímetro e o gráfico de histórico são desenhados com [[d3|D3]], com transição suave entre as leituras. Toda a comunicação com a API fica num único composable, que faz o polling, guarda o último estado e avisa quando o Raspberry Pi sai do ar.
