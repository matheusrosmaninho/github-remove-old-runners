# github-remove-old-runners

Uma ferramenta para automatizar a remoção de GitHub Actions runners antigos e inativos de organizações e repositórios.

## 📋 Descrição

Este projeto fornece uma solução automatizada para limpar runners do GitHub Actions que não estão mais em uso, ajudando a manter a organização e reduzir custos desnecessários com runners self-hosted.

## ✨ Funcionalidades

- 🔍 Lista todos os runners de uma organização ou repositório
- 📅 Identifica runners inativos baseado em critérios de tempo
- 🗑️ Remove runners antigos automaticamente
- 📊 Relatório detalhado das operações realizadas
- 🔐 Suporte completo à autenticação GitHub (PAT)
- 🏢 Suporte para organizações e repositórios individuais

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/matheusrosmaninho/github-remove-old-runners.git
cd github-remove-old-runners

# Instale as dependências
npm install
```

## ⚙️ Configuração

1. Crie um Personal Access Token (PAT) no GitHub com as seguintes permissões:
   - `repo` (para repositórios)
   - `admin:org` (para organizações)

## Exemplo

```
- name: github-remove-old-runners
  uses: matheusrosmaninho/github-remove-old-runners@1.0.0
  with:
   api_token: "${{ secrets.TOKEN }}"
   repo_owner: "matheusrosmaninho"
   repo_name: "github-remove-old-runners"
   days_retention: 10
```