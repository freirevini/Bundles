# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-02-05

### Adicionado

- Estrutura inicial do repositório
- 75 skills únicas em `templates/Skill/skills/`
- 11 bundles temáticos em `templates/Skill/SkillCategorias/`
- 19 bundles JSON em `templates/Skill/bundles/` (Python/SQL)
- Sistema de associação de skills `bundles/AssociarSkill/`
- `skills-index.json` com índice global de 195 skills
- Scripts de automação:
  - `bin/generate-index.js` - Gera índice de skills
  - `bin/install.js` - Instalação incremental (sync)
- `.gitignore` padrão
- Documentação completa em `README.md`

### Estrutura

```
templates/Skill/
├── skills/           ← Skills únicas
├── SkillCategorias/  ← Bundles físicos
├── bundles/          ← Referências JSON
└── skills-index.json ← Índice global
```

### Bundles Físicos (SkillCategorias)

- ControledeQualidadeTestes
- DesenvolvedordeSeguranca
- EngenheirodeSeguranca
- MestreWeb
- WebDesigner
- DesenvolvedorFullStack
- LLMAgenteArquiteto
- DesenvolvedordeAplicativosLLM
- ExpertDBT
- DocumentarProjetos
- OutrasLinguagens
- Planejamento

### Bundles JSON (Python)

- AgendamentoPython, PythonAutomocaoRPA, PythonEmail
- MelhorarCodigoPython, PythonBackEnd, PythonIAVertex
- ConexaoBancodeDadosPython, CriarCodigoPythonAnaliseDeDados
- DebugCodigoPython, PythonBussinesIntelligencie
- CriarCodigoPythonGeral, PythonMachineLearning

### Bundles JSON (SQL)

- CriarCodigoSQLGeral, CriarCodigoSQLAnaliseDeDados
- DebugCodigoSQL, MelhorarCodigoSQL
- PythonSQL, SQLBigQuery, SQLParaDashBoardPowerBI
