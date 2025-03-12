# ast详解

## 在线网站

https://astexplorer.net/

## 为什么要学习ast

学习抽象语法树（AST，Abstract Syntax Tree）是深入理解编程语言和开发相关工具（如编译器、解释器、代码分析器和代码混淆器）的一个重要步骤。AST 在源代码的分析和转换中扮演着核心角色，以下是一些关键点和资源，可以帮助你开始学习AST。

### 什么是AST？
AST 是源代码的树状表示，用于抽象出代码的结构而忽略掉无关的语法细节如空白符、括号和标点符号。每个节点代表了程序中的一个构造，比如语句、表达式、声明等。

### 学习AST的关键点
1. **节点类型**：了解不同的节点类型，例如表达式、语句、标识符和字面量等，以及它们在AST中的作用。
2. **树的遍历**：学习如何遍历AST，包括深度优先遍历和广度优先遍历，这对于分析和修改代码至关重要。
3. **使用工具生成和操作AST**：熟悉工具如Esprima、Babel等，这些工具可以帮助你生成JavaScript的AST并进行操作。
4. **实际应用**：学习AST在不同领域的应用，如代码混淆、静态代码分析、代码转换等。

### 学习资源
- **在线教程和课程**：查找关于编译技术或现代JavaScript工具链的在线课程，这些课程经常包含关于如何操作AST的模块。
- **文档和工具**：
  - [Babel Handbook](https://github.com/jamiebuilds/babel-handbook): 一个关于Babel及其插件开发的手册，特别是如何使用Babel处理AST。
  - [Esprima](http://esprima.org/): 一个开源的JavaScript解析器，用于生成AST，网站上有丰富的文档和示例。
  - [AST Explorer](https://astexplorer.net/): 一个在线工具，可以实时查看不同解析器生成的AST，并尝试自己的代码。

通过这些资源的学习和实践，你可以逐步掌握如何生成、分析和操作AST，这对开发相关的工具和技术会非常有帮助。

## ast学习路线

要学习抽象语法树（AST）的概念和应用，你可以按照以下目录结构来逐步深入学习：

### 1. 基础介绍
- **什么是AST**：了解AST的定义和它在编程语言中的作用。
- **AST的组成**：学习AST的基本组成元素，如节点类型（如表达式、语句、标识符）。

### 2. AST生成
- **解析器介绍**：了解常用的JavaScript解析器如Esprima、Acorn、Babel等。
- **生成AST**：学习如何使用这些工具生成JavaScript代码的AST。

### 3. AST操作
- **遍历技术**：掌握如何遍历AST（深度优先遍历和广度优先遍历）。
- **修改AST**：学习如何修改AST的节点，实现代码的转换或优化。
- **生成代码**：从修改后的AST重新生成源代码。

### 4. AST在工具中的应用
- **代码混淆**：探讨如何使用AST进行JavaScript代码混淆。
- **静态代码分析**：了解AST如何被用于静态代码分析，提高代码质量和安全性。
- **编译器设计**：简介AST在编译器设计中的应用，如何从AST生成目标代码。

### 5. 实际项目与练习
- **练习项目**：通过具体的练习加深理解，如编写一个简单的AST基的代码转换工具。
- **开源项目贡献**：参与开源项目，如Babel插件开发，实践AST的操作和应用。

### 6. 高级主题
- **性能优化**：学习在操作AST时如何考虑性能优化。
- **错误处理和调试**：如何在处理AST时进行错误检测和调试。

### 学习资源推荐
- **书籍**：查找有关编译原理和JavaScript引擎的书籍。
- **在线课程**：参加Coursera或Udemy上的相关课程，如编译技术或现代JavaScript工具。
- **文档和社区**：阅读Esprima和Babel的官方文档，参与Stack Overflow等社区的讨论。

通过系统地学习这些内容，你可以获得关于AST的深入理解并能够在实际项目中应用这些知识。这些步骤不仅帮助你掌握理论，更重要的是通过实践来加深理解和技能。

## ast学习目标

为了有效地学习JSVMP（JavaScript Virtual Machine Protection），你可以设定以下学习目标：

### 1. 理解JSVMP的基本概念
- **目标**：学习JSVMP的定义、它如何工作以及它在前端代码保护中的作用。
- **方法**：阅读相关的技术文章和官方文档，理解其核心原理和技术基础。

### 2. 掌握JSVMP的实现机制
- **目标**：深入了解JSVMP的内部结构，包括它如何将JavaScript代码转换为字节码，以及如何通过自定义的解释器执行这些字节码。
- **方法**：研究相关技术文献，参考现有的开源项目，了解虚拟机技术和字节码的生成与执行过程。

### 3. 学习JSVMP的应用场景
- **目标**：了解JSVMP可以解决的安全问题，以及它在实际开发中的应用场景。
- **方法**：查找案例研究或行业报告，学习如何在实际项目中应用JSVMP来提高代码的安全性。

### 4. 实践JSVMP的应用
- **目标**：通过项目实践来加深对JSVMP技术的理解和应用能力。
- **方法**：开始一个小项目，尝试使用JSVMP技术来保护一个简单的JavaScript应用。记录并解决在实践过程中遇到的问题。

### 5. 分析JSVMP的优势与局限
- **目标**：评估JSVMP技术的优势和可能的局限性，以及与其他JavaScript保护技术的比较。
- **方法**：通过比较JSVMP与其他技术如代码混淆、加密等，写一篇综述，总结各自的优缺点和最适应的应用条件。

这些目标将帮助你系统地学习JSVMP，不仅仅是理论知识，还包括实际操作和应用，从而更全面地掌握这一技术。通过设定这些具体的学习目标，你可以有针对性地安排学习计划和实践，逐步提升你在前端安全领域的专业能力。

## 学习ast可以做的项目

学习AST（抽象语法树）时，实践项目可以帮助你更深入地理解AST的结构和操作。这里有一些适合初学者到中级开发者的小项目建议：

### 1. 简单的代码格式化器
- **项目目标**：创建一个工具，它可以读取JavaScript代码，然后重新格式化并输出美化后的代码。
- **涉及技能**：解析代码生成AST，遍历AST并重新生成代码。

### 2. 变量重命名工具
- **项目目标**：开发一个工具，它能遍历JavaScript代码的AST，将指定的变量名改为新的名称。
- **涉及技能**：解析代码，遍历AST，修改特定节点，生成新代码。

### 3. 检测未使用的代码
- **项目目标**：创建一个工具，用于检测和报告JavaScript代码中未被使用的变量和函数。
- **涉及技能**：AST解析，深度遍历，作用域分析。

### 4. 实现一个简单的lint工具
- **项目目标**：构建一个基本的lint工具，它能检查常见的代码问题，如未声明的变量，或者可能的类型错误。
- **涉及技能**：代码解析，问题模式识别，报告生成。

### 5. 构建一个简单的代码转换器
- **项目目标**：开发一个转换工具，比如将ES6代码转换为ES5代码，以提高代码的兼容性。
- **涉及技能**：AST解析，节点类型识别和转换，代码生成。

### 6. 添加自定义语法特性
- **项目目标**：扩展一个现有的JavaScript解析器，添加一种自定义的语法特性（如新的操作符或语句），并处理这种新语法的解析和代码生成。
- **涉及技能**：语言设计，解析器修改，AST扩展。

### 7. AST可视化工具
- **项目目标**：创建一个工具，它可以将JavaScript代码的AST以图形方式显示，帮助开发者更好地理解AST的结构。
- **涉及技能**：AST解析，图形界面编程，数据可视化。

这些项目不仅帮助你加深对AST的理解，还能让你学习如何使用现代JavaScript工具链中的工具，如Babel和ESLint。完成这些项目后，你将能更有效地使用AST进行代码分析和转换。

## ast的组成

抽象语法树（AST）是源代码的结构化表示，用于捕捉编程语言构造的语法关系。AST通过节点来表示编程语言中的各种构造，每个节点代表程序中的一种结构，如语句、表达式或声明。以下是AST的主要组成部分：

### 1. 节点（Node）
- **根节点（Root Node）**：代表整个程序或一个独立代码块的起点。
- **内部节点（Internal Nodes）**：通常表示控制结构（如循环、条件判断）和数据结构（如类定义、函数定义），反映了程序的逻辑结构。
- **叶节点（Leaf Nodes）**：代表程序中的基本元素，如变量名、常数、操作符等。

### 2. 边（Edges）
- **边**连接节点，表示程序构造之间的关系，如父子关系。在AST中，从一个节点到另一个节点的边定义了程序的控制流或数据流。

### 3. 节点类型
- **声明节点（Declaration Nodes）**：用于变量声明、函数声明等。
- **表达式节点（Expression Nodes）**：涵盖各种运算和函数调用，如算术表达式、逻辑表达式等。
- **语句节点（Statement Nodes）**：如赋值语句、控制流语句（if、while、for等）。

### 4. 属性（Properties）
- **每个节点可以有属性**，这些属性包含了额外信息，如数据类型、作用域、访问权限等，这有助于在后续的编译或代码分析阶段使用。

### 实例解析
考虑简单的JavaScript代码：
```javascript
var x = 1;
```
对应的AST可能包括：
- **根节点**：表示整个声明。
- **声明节点**：表示变量声明。
- **标识符节点**（Leaf Node）：变量名 `x`。
- **数值节点**（Leaf Node）：数值 `1`。

每个节点的具体类型和属性取决于使用的语言和解析器。例如，使用不同的JavaScript解析器（如Esprima、Babel）生成的AST在细节上可能会有所不同。

学习AST对于进行代码分析、转换或优化都是非常重要的。它不仅是编译器设计的基础，也是现代代码工具（如代码美化器、混淆器、静态分析工具）的核心。通过掌握AST的结构和操作，你可以更深入地理解和影响程序的行为。

## 常用的ast解析器

在JavaScript开发中，有几种流行的AST（抽象语法树）解析器，它们可以帮助开发者分析和处理代码。这些解析器能够读取JavaScript代码并生成AST，这对于代码的深入分析、优化或转换非常有用。下面是一些常用的JavaScript AST解析器：

### 1. **Esprima**
Esprima 是一个高性能的JavaScript解析器，支持ECMAScript的标准。它生成的AST遵循Mozilla的Parser API规范。Esprima广泛用于各种工具和库中，如代码质量检查工具和文档生成工具。
- **官方网站**：[Esprima](http://esprima.org/)

### 2. **Acorn**
Acorn 是一个小巧、快速的JavaScript解析器，同样支持ECMAScript标准。它比Esprima更模块化，容易扩展，因此很适合在需要自定义解析器行为的场景中使用。
- **GitHub 仓库**：[Acorn](https://github.com/acornjs/acorn)

### 3. **Babel Parser (babylon)**
Babel Parser，原名Babylon，是Babel编译器的一部分。它不仅支持最新的JavaScript标准，还可以处理实验性语法。Babel Parser特别适合在代码转换和编译工具链中使用。
- **GitHub 仓库**：[Babel Parser](https://github.com/babel/babel/tree/main/packages/babel-parser)

### 4. **UglifyJS**
虽然UglifyJS主要是作为一个压缩工具使用，但它内部包含一个解析器，可以生成和操作AST。UglifyJS常用于生产环境中的代码压缩和混淆。
- **GitHub 仓库**：[UglifyJS](https://github.com/mishoo/UglifyJS)

### 5. **TypeScript Compiler API**
对于TypeScript代码，TypeScript自身的编译器API也提供了强大的AST生成和操作能力。虽然它主要用于TypeScript，但也可以处理纯JavaScript代码。
- **官方文档**：[TypeScript Compiler API](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

这些解析器各有特点，选择合适的解析器取决于项目的具体需求，比如所需处理的语法特性、性能要求、以及是否需要扩展解析器的能力。在实际应用中，开发者可能需要根据具体的开发环境和目标来选择最合适的工具。

## 推荐解析器

对于学习JavaScript反编译技术，我推荐使用 **Babel Parser**（之前称为Babylon）。这个解析器是Babel编译器的一部分，非常适合于现代JavaScript项目，支持最新的ECMAScript标准以及实验性的语法。Babel Parser的以下特点使其成为学习反编译技术的理想选择：

1. **广泛支持**：Babel Parser支持包括ES2020在内的最新JavaScript语法，这意味着你可以解析几乎所有现代JavaScript代码。

2. **插件系统**：Babel的强大插件系统允许你自定义解析过程，通过插件可以修改或扩展语法树（AST），这在进行代码转换和分析时非常有用。

3. **社区和文档**：作为Babel项目的一部分，Babel Parser拥有广泛的社区支持和详尽的文档，这可以帮助你快速解决学习过程中遇到的问题。

4. **实用性和教育资源**：许多教程和项目都使用Babel来展示代码转换和编译原理，学习这些资源可以帮助你更深入地理解JavaScript的编译和反编译过程。

开始学习时，你可以查看Babel的官方文档，尤其是有关Babel Parser的部分，这将帮助你快速入门：
- [Babel官方文档](https://babeljs.io/docs/en/)

此外，实际操作中尝试编写一些Babel插件，用于转换或分析JavaScript代码，也是一个很好的学习方法。通过这些实践，你将能够深入理解JavaScript的编译和反编译技术。

## Acorn和Babel Parser (babylon)使用起来差别大吗

Acorn 和 Babel Parser（以前称为Babylon）都是非常流行的JavaScript解析器，它们在使用上有一些相似之处，也有各自的特点和差异。以下是一些关键的比较点：

### 性能和大小
- **Acorn**：以其轻量和速度而闻名，适合需要快速解析的场合。Acorn的核心非常紧凑，特别适用于性能敏感的应用。
- **Babel Parser**：虽然性能略逊于Acorn，但考虑到它支持更多实验性语法和插件系统，这种性能差异通常是可接受的。

### 语法支持
- **Acorn**：支持现代JavaScript（ECMAScript标准）的大部分特性。由于其模块化设计，Acorn易于扩展，开发者可以添加自己的插件来支持更多语法。
- **Babel Parser**：支持最新的ECMAScript标准及许多实验性语法特性。Babel Parser是Babel生态系统的一部分，这使得它在处理将来可能成为标准的JavaScript新特性方面特别强大。

### 扩展性和定制性
- **Acorn**：提供了易于使用的插件接口，允许开发者创建自定义的语法结构和功能。
- **Babel Parser**：作为Babel生态系统的一部分，拥有庞大的插件库和高度的定制性。这使得它在进行复杂的代码转换和编译任务时非常灵活。

### 用途
- **Acorn**：由于其轻量和快速的特性，非常适合作为构建工具或在线应用的JavaScript解析器。
- **Babel Parser**：更适合用于开发需要处理最新JavaScript特性或进行大量代码转换的应用，如开发编译器或开发工具链的一部分。

总的来说，如果你需要一个轻量级且快速的解析器，并且你的项目不需要太多针对最新JavaScript特性的支持，Acorn可能是一个更好的选择。而如果你的项目依赖于Babel生态系统，或者你需要广泛支持最新和实验性的JavaScript特性，Babel Parser会是更合适的选择。

## Babel Parser的使用方法

使用Babel Parser进行AST操作涉及到三个主要步骤：遍历AST、修改AST节点以及从修改后的AST生成新的源代码。下面，我将一步步指导你如何使用Babel Parser完成这些任务。

### 1. 安装Babel及其插件

首先，你需要安装Babel核心库和解析器。如果你还没有安装，可以通过npm（Node.js包管理器）来安装：

```bash
npm install --save-dev @babel/core @babel/parser
```

### 2. 解析代码生成AST

使用`@babel/parser`来解析JavaScript代码，生成AST：

```javascript
const parser = require('@babel/parser');

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code, {
  sourceType: "module", // 或 "script" 根据代码类型选择
  plugins: [
    // 如果需要使用的话，可以添加额外的语言特性支持
    "jsx", // 支持JSX
    "typescript" // 支持TypeScript
  ]
});
```

### 3. 遍历AST

遍历AST可以使用`@babel/traverse`库。这个库提供了一种方法来访问AST中的所有节点，你可以安装它：

```bash
npm install --save-dev @babel/traverse
```

然后使用它来遍历AST。你可以指定针对特定类型节点的访问者方法（Visitor methods）：

```javascript
const traverse = require("@babel/traverse").default;

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

上面的代码遍历AST，并将所有名为`n`的标识符改为`x`。

### 4. 修改AST

在遍历过程中，你可以根据需要修改节点。例如，上面的示例已经演示了如何在遍历时修改标识符的名称。你可以添加新节点、替换节点或删除节点等。

### 5. 生成代码

修改完AST后，你可以使用`@babel/generator`来从AST生成新的代码。安装这个库：

```bash
npm install --save-dev @babel/generator
```

然后生成代码：

```javascript
const generator = require("@babel/generator").default;

const output = generator(ast, {
  /* options */
}, code);

console.log(output.code); // 输出修改后的代码
```

这将输出修改后的JavaScript代码。

### 总结

这个过程涉及到将源代码解析为AST，遍历并修改这个AST，最后从AST生成新的代码。Babel的强大功能使得它在现代JavaScript开发中非常有用，特别是在开发构建工具、编译器插件或进行代码转换和优化时。

通过这些步骤，你可以开始使用Babel进行基本的AST操作。随着实践的深入，你可以探索更多高级特性和技术，比如编写自定义Babel插件来处理复杂的代码转换任务。

## 输出解析后完整的ast

要输出JavaScript代码解析后的完整AST，你可以使用前面提到的`@babel/parser`来解析代码，并使用Node.js的`console.log`来打印整个AST对象。这里是一个简单的步骤说明：

### 1. 安装必要的库

确保你已经安装了`@babel/parser`。如果未安装，可以使用以下命令安装：

```bash
npm install @babel/parser
```

### 2. 解析JavaScript代码并打印AST

创建一个JavaScript文件，比如`print-ast.js`，然后使用以下代码来解析一个简单的JavaScript函数并打印出其AST：

```javascript
const parser = require('@babel/parser');

// 示例JavaScript代码
const code = `function square(n) {
  return n * n;
}`;

// 解析代码生成AST
const ast = parser.parse(code, {
  sourceType: "module", // 或 "script"，根据代码类型
  plugins: [] // 根据需要添加插件
});

// 打印AST
console.log(JSON.stringify(ast, null, 2)); // 美化输出
```

### 3. 运行脚本

在命令行中运行你的脚本：

```bash
node print-ast.js
```

这将在控制台输出完整的AST。输出将是一个格式化的JSON对象，其中包含了AST的所有节点和属性。

### 解析输出

输出的AST是一个复杂的JSON对象，顶级通常是一个`File`节点，包含一个`program`属性，它又包含整个程序的AST。你可以看到不同类型的节点，如`FunctionDeclaration`（函数声明）、`VariableDeclaration`（变量声明）等，以及它们的位置信息、作用域信息等。

通过这种方式，你可以获取到任何JavaScript代码的AST结构，这对于学习AST的结构、开发相关工具或进行代码分析非常有帮助。

## 使用AST进行JavaScript代码混淆，小工具

制作一个使用AST进行JavaScript代码混淆的小工具是一个很好的实践项目，可以加深你对AST操作和JavaScript安全性的理解。以下是创建这样一个工具的基本步骤：

### 1. 环境准备
首先，确保你的开发环境中已经安装了Node.js。然后，你需要安装几个npm包：`@babel/parser`用于解析JavaScript代码生成AST，`@babel/traverse`用于遍历AST，`@babel/types`用于创建或更新AST节点，以及`@babel/generator`用于从AST生成代码。

```bash
npm install @babel/parser @babel/traverse @babel/types @babel/generator
```

### 2. 解析代码生成AST
创建一个JavaScript文件，例如`obfuscate.js`，并写入以下代码来解析源代码：

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;
const fs = require('fs');

const code = fs.readFileSync('input.js', 'utf-8'); // 读取你想要混淆的代码
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx'] // 如果你的代码中包含JSX
});
```

### 3. 遍历并修改AST
接下来，你可以遍历AST并对其进行修改。例如，你可以重命名变量，或者替换一些简单的表达式：

```javascript
traverse(ast, {
  FunctionDeclaration(path) {
    // 给函数声明生成一个新的随机名字
    path.node.id.name = `func_${Math.floor(Math.random() * 1000)}`;
  },
  VariableDeclarator(path) {
    // 给变量声明生成一个新的随机名字
    path.node.id.name = `var_${Math.floor(Math.random() * 1000)}`;
  },
  StringLiteral(path) {
    // 使用一个简单的字符串替换方法
    path.node.value = path.node.value.split('').reverse().join('');
  }
});
```

### 4. 生成新的混淆代码
最后，使用`@babel/generator`从修改后的AST生成新的代码，并将其写入文件：

```javascript
const output = generator(ast, { /* options */ });
fs.writeFileSync('output.js', output.code); // 输出混淆后的代码到文件
```

### 5. 运行你的工具
将你想混淆的代码放在`input.js`文件中，然后运行`obfuscate.js`：

```bash
node obfuscate.js
```

你将在`output.js`中看到生成的混淆代码。

### 总结
这个简单的工具介绍了如何使用AST来混淆JavaScript代码。通过修改遍历和修改步骤，你可以实现更复杂的混淆策略，如逻辑混淆、控制流混淆等。这个项目不仅帮助你学习AST的操作，也为你提供了JavaScript代码保护的基础知识。





