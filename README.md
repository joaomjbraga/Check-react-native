# Check Plus ✅

Um aplicativo de lista de tarefas intuitivo, desenvolvido em React Native com Expo.

## ✨ Características

- 📱 **Multiplataforma**: Funciona em iOS, Android e Web
- 💾 **Armazenamento Local**: Suas tarefas ficam seguras no seu dispositivo
- 🚀 **Performance**: Construído com React Native 0.79.3 e React 19
- 📱 **Suporte Completo**: Compatible com tablets iPad e dispositivos Android
- 🏗️ **Nova Arquitetura**: Utiliza a New Architecture do React Native para melhor performance

## 🛠️ Tecnologias Utilizadas

- **React Native**: 0.79.3
- **React**: 19.0.0
- **Expo**: ~53.0.11 com EAS Build
- **TypeScript**: ~5.8.3
- **AsyncStorage**: Para persistência de dados local
- **Safe Area Context**: Para compatibilidade com diferentes dispositivos
- **New Architecture**: Habilitada para melhor performance

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente
- Para Android: Android Studio
- Para iOS: Xcode (apenas no macOS)
- Conta no Expo (opcional, para builds e deploy)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/joaomjbraga/Check-react-native.git
cd Check-react-native
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
# Iniciar o servidor de desenvolvimento
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web
```

## 📦 Builds e Deploy

O projeto está configurado com EAS Build para facilitar a criação de builds de produção:

```bash
# Build para Android (APK/AAB)
eas build --platform android

# Build para iOS (IPA)
eas build --platform ios

# Build para ambas as plataformas
eas build --platform all
```

**Informações do App:**
- **Package ID Android**: com.joaomjbraga.checkplus
- **Orientação**: Portrait (vertical)
- **Tema**: Interface escura por padrão
- **Suporte**: iPad e tablets Android
- **PWA**: Compatível com navegadores web

## 📱 Como Usar

1. **Adicionar Tarefa**: Toque no botão "+" para criar uma nova tarefa
2. **Excluir Tarefa**: Deslize ou use as opções para remover tarefas

## 🏗️ Estrutura do Projeto

```
Check-react-native/
├── src/
│   ├── components/     # Componentes reutilizáveis (TaskItem, TaskList, etc.)
│   ├── screens/        # Telas da aplicação (Home, Add Task, etc.)
│   ├── services/       # Serviços de persistência de dados
│   ├── types/          # Definições TypeScript (Task, etc.)
│   └── utils/          # Funções auxiliares
├── assets/             # Ícones, splash screen e recursos
└── App.tsx            # Componente principal
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**João M J Braga**
- Email: joomdeveloper.app@gmail.com
- Website: [joaomjbraga.vercel.app](https://joaomjbraga.vercel.app/)

## 🔮 Próximas Features

- [ ] Categorias de tarefas
- [ ] Lembretes e notificações
- [ ] Sincronização em nuvem
- [ ] Compartilhamento de listas
- [ ] Estatísticas de produtividade
- [ ] Temas personalizáveis
- [ ] Integração com calendário
- [ ] Modo offline completo

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
