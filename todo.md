# Champ Man 2026 - TODO

## Fase 1: Base de Dados e Schema
- [x] Pesquisar e consolidar dados dos 20 clubes do Brasileirão Série A 2026
- [x] Pesquisar e consolidar dados dos 50 melhores jogadores mundiais
- [x] Pesquisar e consolidar dados das principais promessas (wonderkids)
- [x] Estruturar schema de banco de dados (clubes, jogadores, usuários, temporadas, partidas)
- [ ] Criar fixtures com dados dos clubes e jogadores

## Fase 2: Backend Core
- [x] Criar helpers de banco de dados (getClubsWithPlayers, getPlayersByClub, getSeasonByUserAndClub, etc)
- [x] Implementar simulador de partidas com cálculo de probabilidades baseado em atributos
- [x] Implementar gerador de narrativas de partidas
- [x] Implementar 11 tRPC procedures para o jogo
- [x] Criar seed script com dados dos 20 clubes + 200+ jogadores
- [ ] Implementar sistema de temporada (rodadas, calendário, tabela de classificação)
- [ ] Implementar sistema de mercado de transferências
- [ ] Implementar sistema de gestão de elenco (escalação, dispensa, contratação)
- [ ] Implementar sistema de táticas e formações

## Fase 3: Frontend - Layout e Navegação
- [x] Configurar estética brutalista tipográfica (tipografia, cores, espaçamento)
- [ ] Criar layout principal do dashboard
- [ ] Criar navegação entre seções do jogo
- [x] Implementar sistema de autenticação e seleção de clube
- [x] Criar tRPC procedures para o jogo

## Fase 4: Frontend - Telas Principais
- [ ] Tela de visão geral do clube (dashboard)
- [ ] Tela de gestão de elenco (visualizar, escalar, dispensar)
- [ ] Tela de táticas e formação
- [ ] Tela de simulação de partidas
- [ ] Tela de mercado de transferências
- [ ] Tela de tabela de classificação e rodadas
- [ ] Tela de perfil detalhado de jogador
- [x] Tela de seleção de clube no início do jogo

## Fase 5: Integração e Testes
- [ ] Testar fluxo completo de temporada
- [ ] Testar simulador de partidas
- [ ] Testar mercado de transferências
- [ ] Testar gestão de elenco
- [ ] Testes unitários das funções core (matchSimulator.test.ts, etc)
- [ ] Criar fixtures de teste com dados reais

## Fase 6: Polimento e Entrega
- [ ] Ajustes visuais e responsividade
- [ ] Otimização de performance
- [ ] Documentação de uso
- [ ] Revisão de UX/UI brutalista
- [ ] Checkpoint final
