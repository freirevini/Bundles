# 📦 Bundles - Skills Organizadas para AI Assistants

Coleção curada de skills organizadas em bundles temáticos para uso com **VS Code Code Assist**, **Antigravity**, **Claude Code**, **Cursor** e outras ferramentas de AI.

## 🚀 Instalação

### Git Clone (Recomendado)

```bash
# Primeira instalação
git clone https://github.com/freirevini/Bundles.git .agent/skills

# Atualização (mantém arquivos não alterados)
cd .agent/skills && git pull
```

### NPX (Incremental)

```bash
# Instala ou atualiza apenas arquivos modificados
npx @freirevini/bundles
```

O script de instalação usa **sync incremental**: apenas cria/atualiza arquivos que mudaram, preservando os existentes.

---

## 📁 Estrutura do Repositório

```
templates/Skill/
├── skills/              ← 75 skills únicas (fonte)
├── SkillCategorias/     ← 11 bundles temáticos (físicos)
│   ├── ControledeQualidadeTestes/
│   ├── DesenvolvedorFullStack/
│   ├── MestreWeb/
│   └── ...
├── bundles/             ← Referências JSON (Python/SQL)
│   ├── Python/          ← 12 bundles
│   ├── SQL/             ← 7 bundles
│   └── AssociarSkill/   ← Sistema de vinculação
└── skills-index.json    ← Índice global (195 skills)
```

---

## 🎯 Como Usar

### No Chat (VS Code / Antigravity)

```
@clean-code revise este código
```

```
@rag-engineer implemente RAG com ChromaDB
```

```
Use @bundles/Python/MelhorarCodigoPython para refatorar
```

### Por Categoria

```
Use @SkillCategorias/DesenvolvedorFullStack para criar uma API
```

### Por Bundle JSON

```
Aplique @bundles/Python/PythonBackEnd neste projeto
```

---

## 📊 Conteúdo

| Categoria | Bundles | Skills |
|-----------|---------|--------|
| **SkillCategorias** | 11 físicos | ~120 |
| **bundles/Python** | 12 JSON | 75 refs |
| **bundles/SQL** | 7 JSON | 45 refs |
| **skills/** | - | 75 únicas |
| **Total indexado** | - | 195 |

---

## 📋 Bundles Disponíveis

### SkillCategorias (Físicos)

| Bundle | Descrição |
|--------|-----------|
| `ControledeQualidadeTestes` | TDD, debugging, code review |
| `DesenvolvedordeSeguranca` | APIs seguras, OWASP |
| `EngenheirodeSeguranca` | Pentesting, auditorias |
| `MestreWeb` | React, Next.js, frontend |
| `WebDesigner` | UI/UX, design systems |
| `DesenvolvedorFullStack` | Stack completo |
| `LLMAgenteArquiteto` | Agentes AI autônomos |
| `DesenvolvedordeAplicativosLLM` | Apps com LLM |
| `ExpertDBT` | Data Build Tool |
| `DocumentarProjetos` | Markdown, Word, docs |
| `OutrasLinguagens` | XML, JSON, Markdown |
| `Planejamento` | Planejamento e qualidade |

### bundles/Python (JSON)

| Bundle | Skills |
|--------|--------|
| `AgendamentoPython` | 15 |
| `PythonAutomocaoRPA` | 11 |
| `PythonEmail` | 12 |
| `MelhorarCodigoPython` | 8 |
| `PythonBackEnd` | 6 |
| `PythonIAVertex` | 9 |
| ... | ... |

### bundles/SQL (JSON)

| Bundle | Skills |
|--------|--------|
| `CriarCodigoSQLGeral` | 4 |
| `SQLBigQuery` | 7 |
| `PythonSQL` | 6 |
| ... | ... |

---

## 🔧 Scripts

```bash
# Regenerar índice de skills
node bin/generate-index.js

# Instalar/atualizar em projeto
node bin/install.js
```

---

## 📦 Compatibilidade

- ✅ VS Code Code Assist
- ✅ Antigravity
- ✅ Claude Code
- ✅ Cursor
- ✅ Gemini CLI

---

## 📄 Licença

MIT - Use livremente!

---

**Mantido por:** [@freirevini](https://github.com/freirevini)
