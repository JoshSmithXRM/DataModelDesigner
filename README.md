# Data Model Designer

A modern, interactive database schema visualization tool built with React, TypeScript, and ReactFlow. Design and visualize your database models using DBML (Database Markup Language) with an intuitive drag-and-drop interface.

## ✨ Features

- **DBML Support**: Parse and visualize Database Markup Language files
- **Interactive Design**: Drag-and-drop table positioning with automatic relationship rendering
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Import/Export**: Load DBML files and export your designs as JSON
- **Real-time Parsing**: Instant visualization as you modify your database schema
- **Relationship Mapping**: Automatic detection and visualization of table relationships
- **Sample Data**: Built-in sample database schema to get started quickly

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JoshSmithXRM/DataModelDesigner.git
cd DataModelDesigner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Loading a Sample
Click **"Load Sample"** to see the tool in action with a pre-built e-commerce database schema.

### Parsing DBML
1. Enter your DBML code in the text area
2. Click **"Parse DBML"** to generate the visual representation
3. Drag tables around to organize your layout

### Import/Export
- **Export**: Save your current design as a JSON file
- **Import**: Load a previously exported design

### DBML Syntax Example
```dbml
Table users {
  id integer [primary key]
  username varchar
  email varchar [unique]
  created_at timestamp
}

Table posts {
  id integer [primary key]
  title varchar
  content text
  author_id integer
  created_at timestamp
}

Ref: posts.author_id > users.id
```

## 🛠️ Technology Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **ReactFlow** - Interactive node-based UI
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

## 📁 Project Structure

```
src/
├── components/
│   ├── TableNode.tsx    # Individual table visualization
│   └── Toolbar.tsx      # Main toolbar with actions
├── types/
│   └── DbmlTypes.ts     # TypeScript type definitions
├── utils/
│   └── DbmlParser.ts    # DBML parsing logic
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ReactFlow](https://reactflow.dev/) for the excellent graph visualization library
- [DBML](https://www.dbml.org/) for the database markup language specification
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
