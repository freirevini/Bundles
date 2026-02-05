# 🔗 Sistema de Associação de Skills

Este sistema permite vincular skills a planos de ação, gerenciando correlações entre skills necessárias para executar ações específicas.

## 📁 Estrutura

```
AssociarSkill/
├── skill-associations.json   ← Arquivo principal de associações
└── README.md                 ← Esta documentação
```

## 🎯 Tipos de Correlação

| Tipo | Código | Descrição |
|------|--------|-----------|
| **Obrigatória** | `REQ` | Skills essenciais para execução |
| **Complementar** | `COMP` | Skills que agregam valor |
| **Alternativa** | `ALT` | Skills substitutas |
| **Desejável** | `DES` | Skills que melhoram a qualidade |

## 📝 Como Usar

### 1. Adicionar Nova Associação

```json
{
  "id": "assoc-003",
  "plan_id": "seu-plano-id",
  "plan_name": "Nome do Plano",
  "action_id": "action-001",
  "action_name": "Nome da Ação",
  "status": "active",
  "skills": {
    "required": [
      {
        "skill_id": "nome-da-skill",
        "source": "skills/nome-da-skill",
        "reason": "Justificativa"
      }
    ],
    "complementary": [],
    "alternative": [],
    "desirable": []
  }
}
```

### 2. Referenciar Skills

| Tipo | Path |
|------|------|
| Skill única | `skills/<nome>` |
| Bundle JSON | `bundles/Python/<nome>.json` |
| Categoria | `SkillCategorias/<categoria>/<skill>` |

### 3. Vincular Bundle Inteiro

```json
"bundles_linked": [
  {
    "bundle_id": "PythonBackEnd",
    "source": "bundles/Python/PythonBackEnd.json",
    "type": "required"
  }
]
```

## 🔄 Versionamento

Ao modificar uma associação:

1. Atualize `updated_at` e `updated_by`
2. Adicione entrada em `version_history`

```json
"version_history": [
  {
    "version": "1.1",
    "date": "2026-02-05T15:00:00-03:00",
    "author": "seu-usuario",
    "changes": "Descrição das mudanças"
  }
]
```

## 🚀 Exemplo de Uso no Chat

```
Use @bundles/AssociarSkill para vincular skills ao plano de migração de dados
```

A AI lerá as associações e carregará as skills necessárias automaticamente.
