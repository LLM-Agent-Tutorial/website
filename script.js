document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mainNav');

  if (navToggle && nav) {
    const navLinks = nav.querySelectorAll('a');

    if (window.bootstrap && typeof bootstrap.Collapse === 'function') {
      const navCollapse = new bootstrap.Collapse(nav, { toggle: false });

      const syncNavToggleState = () => {
        navToggle.setAttribute('aria-expanded', nav.classList.contains('show').toString());
      };

      navToggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isShown = nav.classList.contains('show');
        if (isShown) {
          navCollapse.hide();
        } else {
          navCollapse.show();
        }
        navToggle.setAttribute('aria-expanded', (!isShown).toString());
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (nav.classList.contains('show')) {
            navCollapse.hide();
            navToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });

      nav.addEventListener('shown.bs.collapse', syncNavToggleState);
      nav.addEventListener('hidden.bs.collapse', syncNavToggleState);
    } else {
      navToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
      });

      nav.addEventListener('click', (event) => {
        if (event.target instanceof HTMLElement && event.target.tagName === 'A' && nav.classList.contains('open')) {
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('open')) {
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  const supportedLanguages = ['en', 'zh'];
  const languageStorageKey = 'siteLanguagePreference';
  const languageToggleButtons = {};
  let mathJaxTypesetHandle = null;
  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.foundations': 'Foundations',
      'nav.capabilities': 'Agent Examples',
      'nav.practical': 'Practical Tips',
      'nav.advanced': 'Advanced Frontier',
      'chapter.home': 'Homepage',
      'chapter.foundations': 'What You Must Know About LLM Agents',
      'chapter.capabilities': 'What LLM Agents Can Do and How They Work',
      'chapter.generative-agents': 'Generative Agents',
      'chapter.ai-scientist': 'The AI Scientist',
      'chapter.cellagent': 'CellAgent',
      'chapter.virtual-lab': 'The Virtual Lab',
      'chapter.metagpt': 'MetaGPT',
      'chapter.finagent': 'FinAgent',
      'chapter.voyager': 'Voyager',
      'chapter.mobile-agent': 'Mobile Agent',
      'chapter.palm-saycan': 'PaLM-SayCan',
      'chapter.practical': 'Practical Tips',
      'chapter.adv-knowledge': 'Injecting Domain Knowledge',
      'chapter.adv-reasoning': 'Enhancing Reasoning Capabilities',
      'chapter.adv-context': 'Managing Long Context',
      'chapter.adv-internalize': 'Internalizing Agent Abilities',
      'chapter.adv-safety': 'Agent Safety',
      'chapterParent.examples': 'Example',
      'chapterParent.advanced': 'Advanced Techniques: What is happening at the frontier',
      'sidebar.onThisPage': 'On this page',
      'action.download': 'Download',
    },
    zh: {
      'nav.home': '首页',
      'nav.foundations': '基础',
      'nav.capabilities': 'Agent 示例',
      'nav.practical': '实用建议',
      'nav.advanced': '前沿进展',
      'chapter.home': '主页',
      'chapter.foundations': 'LLM Agent 必知',
      'chapter.capabilities': 'LLM Agent 的能力与原理',
      'chapter.generative-agents': 'Generative Agents',
      'chapter.ai-scientist': 'The AI Scientist',
      'chapter.cellagent': 'CellAgent',
      'chapter.virtual-lab': 'The Virtual Lab',
      'chapter.metagpt': 'MetaGPT',
      'chapter.finagent': 'FinAgent',
      'chapter.voyager': 'Voyager',
      'chapter.mobile-agent': 'Mobile Agent',
      'chapter.palm-saycan': 'PaLM-SayCan',
      'chapter.practical': '实用建议',
      'chapter.adv-knowledge': '注入领域知识',
      'chapter.adv-reasoning': '增强推理能力',
      'chapter.adv-context': '长上下文管理',
      'chapter.adv-internalize': '内化 Agent 能力',
      'chapter.adv-safety': 'Agent 安全',
      'chapterParent.examples': '示例',
      'chapterParent.advanced': '前沿技术',
      'sidebar.onThisPage': '本页内容',
      'action.download': '下载',
    },
  };
  const contentTranslations = {
    zh: {},
  };
  const detailHeaderTranslations = {
    zh: {
      'Example of Injecting Domain Knowledge through In-Context Learning': '示例：通过 In-Context Learning 注入领域知识',
      "Example of Isabella Rodriguez's planning for Valentine's Day": '示例：Isabella Rodriguez 的情人节计划',
      'Example of an agent description': '示例：Agent 描述',
      'Example of an automatically generated task by the automatic curriculum module': '示例：自动课程生成的任务',
      'Example of analyzing market dynamics with low-level reflection': '示例：用低层反思分析市场动态',
      'Example of analyzing past decisions with high-level reflection': '示例：用高层反思分析过往决策',
      'Example of generating a query for literature retrieval': '示例：生成文献检索查询',
      'Example of generating review comments by the reviewer agent': '示例：评审 Agent 生成审稿意见',
      'Example of planning (Say)': '示例：Planning（Say）',
      'Example of planning an experiment list for the generated idea': '示例：为生成的创意规划实验列表',
      'Example of planning for a product requirement document': '示例：规划 Product Requirement Document',
      'Example of planning for clustering (Planner role)': '示例：Planner 角色的聚类规划',
      'Example of planning the next action': '示例：规划下一步动作',
      'Example of rating memory importance': '示例：评估记忆重要性',
      'Example of reflecting on chats to yield high-level thoughts': '示例：反思对话生成高层想法',
      'Example of reflection (Can) and decision': '示例：Reflection（Can）与决策',
      'Example of reflection (Evaluator role)': '示例：Evaluator 角色的反思',
      'Example of reflection (Scientific Critic)': '示例：Scientific Critic 的反思',
      'Example of reflection for checking operation success': '示例：检查操作成功的反思',
      'Example of role-playing as a planner': '示例：扮演 Planner',
      'Example of role-playing as a principal investigator': '示例：扮演 Principal Investigator',
      'Example of role-playing as a product manager': '示例：扮演 Product Manager',
      'Example of role-playing as an executor': '示例：扮演 Executor',
      'Example of role-playing as an expert financial trader': '示例：扮演资深金融交易员',
      'Example of self-verification for checking task success': '示例：自检任务是否成功',
      'Example of skill schema': '示例：技能 Schema',
      'Example of summarizing the discussion (Principal Investigator)': '示例：会议总结（Principal Investigator）',
      'Example of team generation (Principal Investigator)': '示例：组建团队（Principal Investigator）',
      'Example of team member discussion (Computational Biologist)': '示例：团队成员讨论（Computational Biologist）',
      'Example of the Evaluator': '示例：Evaluator',
      'Example of the engineer reviewing the system design using the <code>Editor.open_file</code> tool':
        '示例：Engineer 使用 <code>Editor.open_file</code> 审查系统设计',
      'Example of the generated code for obtaining a wood log': '示例：获取木头的生成代码',
      'Example of the product manager assigning tasks to the architect': '示例：Product Manager 给 Architect 分配任务',
      'Example of tool generation discussion (Computational Biologist)': '示例：工具生成讨论（Computational Biologist）',
      'Example of tool implementation (Computational Biologist)': '示例：工具实现（Computational Biologist）',
      'Example of tool use (Executor role)': '示例：工具使用（Executor 角色）',
      'Python code of literature retrieval': '示例：文献检索的 Python 代码',
    },
  };
  const detailHeaderDefaults = new WeakMap();
  document.querySelectorAll('.detail-box__header h4').forEach((el) => {
    if (el instanceof HTMLElement) {
      detailHeaderDefaults.set(el, el.innerHTML);
    }
  });
  const contentDefaults = {};
  const contentElements = Array.from(document.querySelectorAll('[data-i18n-key]'));
  contentElements.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const key = el.dataset.i18nKey;
    if (!key || contentDefaults[key]) return;
    contentDefaults[key] = el.innerHTML;
  });
  const pageId = document.body.dataset.page || '';

  Object.assign(contentTranslations.zh, {
    'common.citationIntro': '如果觉得这份工作有帮助，欢迎引用我们的论文：',
    'common.pageNav.backHome': '返回首页',
    'common.pageNav.next': '下一页',
    'common.sidebar.overview': '概览',
  });

  const pageSpecificTranslations = {
    home: {
      'home.hero.title': '面向 LLM-based Agents 的新手友好教程',
      'home.hero.body':
        '<p>本教程面向对 LLM-based Agent 感兴趣但缺乏 LLM、机器学习、人工智能或编程背景的研究者与工程师。内容以通俗方式覆盖核心知识，帮助新人快速理解 LLM Agent 能做什么，也为想实践的人提供操作指引。</p><p>主要收获包括：</p><ul><li><strong>LLM 与 LLM-based Agent 的基础概念</strong>；</li><li>九个跨社会模拟、科学、软件、金融、生物、医学等领域的<strong>代表性示例</strong>，展示关键能力与实现机制；</li><li><strong>开发实践建议</strong>；</li><li><strong>前沿技术路线图</strong>，涵盖注入领域知识、增强推理、管理长上下文等。</li></ul>',
      'home.hero.figcaption':
        '教程的整体结构：覆盖基础知识、示例 Agent、实践技巧与前沿技术。',
      'home.structure.title': '从基础到前沿',
      'home.structure.p1': '下图对应教程结构，方便直接跳转到你需要的主题。',
      'home.card1.title': '1. 必备知识',
      'home.card1.p': 'Next-token prediction、上下文窗口，以及六种典型 Agent 能力的基础。',
      'home.card2.title': '2. Agent 能做什么',
      'home.card2.p':
        '九个代表性 Agent，覆盖社会模拟、科学、生物、医学、软件、金融、游戏、移动设备与机器人等领域。',
      'home.card3.title': '3. 实践技巧',
      'home.card3.p': '保持设计简单、目标清晰，用人类工作流引导，依赖示例驱动的提示词。',
      'home.card4.title': '4. 前沿进展',
      'home.card4.p': '注入领域知识、强化推理、管理长上下文、内化 Agent 技能，并确保 Agent 安全。',
    },
    'adv-knowledge': {
      'adv-knowledge.title': '注入领域知识',
      'adv-knowledge.incontext.title': '上下文学习（In-Context Learning）',
      'adv-knowledge.overview.p1':
        '向通用LLM注入领域知识是将其引导为强大的专家级 LLM Agent 的关键。具体采用哪种方式取决于知识规模、更新频率以及希望 Agent 呈现的行为。主要有三种技术：上下文学习（In-Context Learning）、检索增强生成、（Retrieval-Augmented Generation，RAG）和微调（Fine-Tuning）。',
      'adv-knowledge.incontext.p1':
        '最直接的做法是把相关信息直接放入 LLM 的上下文窗口，利用模型的上下文学习能力把这段文本当作生成答案的可信来源。由于用户可以动态插入任意信息而不需要额外基础设施，这种方式非常灵活，尤其适合范围有限的知识，比如某些股票交易规则或患者的临床总结。',
      'adv-knowledge.incontext.p2':
        '不过，这种方式不适合庞大的知识库。每次把大段文本塞进 prompt 成本高（输入输出 token 都会计费），在多轮对话中尤甚。过长的上下文还会挤占用户提问、对话历史和模型输出的空间，导致截断或连贯性下降。长上下文的处理会在 <a href="advanced-context.html"><em>长上下文管理</em></a> 一节展开。',
      'adv-knowledge.rag.title': '检索增强生成（Retrieval-Augmented Generation）',
      'adv-knowledge.rag.p1':
        '当文档规模庞大时，RAG 是更可扩展也更高效的方案。它在查询时“按需”检索最相关的片段，而不是把所有信息都塞进上下文。例如在医疗场景，Agent 可以从大型数据库中检索与心肌缺血相关的具体症状描述，给出精准建议。标准 RAG 将知识块视为彼此独立的平行信息，用户也可以按需构建知识图谱等结构来显式表示概念与实体的关系，从而取回不仅直接相关的文本，还能获取关联信息。此外，RAG 不局限于静态文档；检索可以扩展到结构化数据库（如 text-to-SQL）或在线搜索，确保 Agent 获取最新信息。',
      'adv-knowledge.finetune.title': '微调（Fine-Tuning）',
      'adv-knowledge.finetune.p1':
        '第三种方式是通过微调将领域知识直接嵌入模型参数。它在特定领域数据集上继续训练预训练模型。全参数微调会更新全部参数，性能潜力最高但资源消耗巨大；LoRA、adapter 等 PEFT 方法则冻结大部分参数，只训练少量新增参数，大幅降低成本。微调不只是教模型事实，它会改变行为，把知识内化为推理的一部分。由于知识存储在权重里，推理时无需在 prompt 中放入大量文本，响应更快、成本更低，特别适合高并发应用。',
    },
    'adv-context': {
      'adv-context.title': '长上下文管理',
      'adv-context.compression.title': '上下文压缩（Context Compression）',
      'adv-context.overview.p1':
        'LLM Agent 常要处理多轮、长流程或复杂任务，极长的上下文会显著抬高计算成本、减慢推理，并因模型偏向近期输入而降低准确性。直接用最大长度上下文在现实中并不可行。常见应对手段有三类：上下文压缩（Context Compression）、上下文复用（Context Reuse）、分层上下文管理（Hierarchical Context Management）。',
      'adv-context.compression.p1':
        '上下文压缩通过把 prompt 压缩到必要的最小集合来降本。在 RAG 场景，大型知识源被切分并索引，查询时只把最相关的 top-k 片段插入 prompt。Agent 也可以对过往对话做摘要或合并，保持短对话；或把长期信息放到外部记忆（数据库、向量库），按需再注入，默认让工作 prompt 保持精简。',
      'adv-context.reuse.title': '上下文复用（Context Reuse）',
      'adv-context.reuse.p1':
        '上下文复用的核心是缓存。直观地说，如果前缀没变，就不必在每轮都重复计算。具体做法是在服务端复用预计算的 key–value 注意力状态，跳过冗余前缀以降低时延与成本。要让缓存有效，需要保持前缀稳定——例如系统角色、共享工具和策略保持一致。若工具需要增删，尽量不要改 prompt；把所有工具定义都放在前缀，通过解码时的掩码来开关工具，从而保持字节级相同、对缓存友好的前缀，同时限制可用动作。',
      'adv-context.hierarchical.title': '分层上下文管理（Hierarchical Context Management）',
      'adv-context.hierarchical.p1':
        '分层上下文管理则将上下文按角色与范围分层，而不是不断累加单一对话。一个编排者负责全局目标与约束，再把细节执行交给具备精简、角色化 prompt 的子 Agent。Agent 之间传递结构化摘要（关键信息、假设、输出），而非长对话，以保证每一步上下文短而易缓存。同时，把能力组织成可复用的模块化技能包，按需加载到上下文，进一步控制提示词长度与复杂度。这类分层设计在子 Agent 编排与技能管理实践中日益常见。',
    },
    'adv-reasoning': {
      'adv-reasoning.title': '增强推理能力',
      'adv-reasoning.cot.title': '思维链（Chain-of-Thought）',
      'adv-reasoning.overview.p1':
        '推理（Reasoning）支撑着规划、工具使用、协作等核心 Agent 能力。近期很多工作显著提升了 LLM 的推理水平。例如 OpenAI 的 oseries 与 DeepSeek-R1 都是为推理强化的模型，相比同供应商的标准 LLM（如 GPT-4 系列），它们会在给答案前显式做多步思考，因此在数学、编程等复杂任务上表现更好，但输出更长、token 开销也更高。',
      'adv-reasoning.cot.p1':
        'Chain-of-Thought 是最简单的推理增强技巧。只需在提示中加一句 “Let’s think step by step”，就能鼓励模型先写出中间推理再给答案。尽管简单，却能显著提高推理效果。Long CoT 进一步鼓励更长、更层次化的推理轨迹；Self-consistency 通过汇聚多条 CoT 结果提升可靠性；Tree-of-Thoughts (ToT) 则把 CoT 泛化为在多条推理路径上搜索后再确定最终解。',
      'adv-reasoning.tts.title': '推理时扩展（Test-Time Scaling）',
      'adv-reasoning.tts.p1':
        '推理时扩展技术在推理时增加模型的思考深度，无需重新训练或改架构。核心是生成多条推理样本（如多样的 CoT），再选择最一致或最有信心的输出，利用模型的多路径探索与冗余自校验能力。常见方法包括 Beam Search 和 Monte Carlo Tree Search (MCTS)：前者保留若干高概率且多样的候选序列，后者通过模拟与统计启发式自适应探索推理空间。这类方法能扩展模型的思辨能力，降低多步推理任务中的幻觉与错误。',
      'adv-reasoning.rl.title': '强化学习（Reinforcement Learning，RL）',
      'adv-reasoning.rl.p1':
        '如果要在训练阶段提升推理能力，RL是几乎标准的选择。RL 让模型通过探索不同的推理路径、结合奖励信号来学习。奖励可以是可验证的（例如与标注答案对比），也可以是基于人类偏好的偏好奖励。早期的 REINFORCE 已将此思路用于 LLM，随后 PPO 注重训练稳定性，DPO 直接对齐人类偏好而无需显式奖励，GRPO 则通过在小规模推理路径中对比奖励增益，提供更高效的推理强化。',
    },
    'adv-internalize': {
      'adv-internalize.title': '内化 Agent 能力',
      'adv-internalize.overview.p1':
        '随着 AI Agent 发展，一个趋势是把 Agent 能力直接内化到模型中，让模型本身具备规划、用工具、多步执行等行为，或更顺畅地接入扩展这些能力的框架。比如 Claude Code 内置了面向自动化编程工作流的结构化推理与工具使用；OpenAI 的 Operator 把 GPT-4o 的多模态感知与基于强化学习的高级推理结合起来，内置浏览器可被模型观察与操控，支持查看网页、输入、点击、滚动等标准键鼠操作。内化 Agent 能力本质上是训练模型，常用的 LLM 训练技术都可沿用，关键差别在于数据：需要构造能呈现 Agent 行为的训练数据，覆盖动作、序列与交互式决策。',
    },
    'adv-safety': {
      'adv-safety.title': 'Agent 安全',
      'adv-safety.overview.p1':
        '在真实世界部署 LLM Agent，安全性至关重要，需要它们在不确定环境下仍保持对齐、可控、可恢复。尽管研究尚不充分，四个方向很有前景。第一，对工具调用、物理操作、关键资产与敏感数据的访问建立严格权限与环境约束，确保操作安全。第二，用安全加固的组件来构建 Agent，例如防劫持与防代码注入的 scaffold、保护机密性的记忆模块、通过密码学校验加固的 MCP 通道。第三，通过序列化安全状态形成快照，在检测到异常、目标漂移或未授权行为时能够恢复、回滚到已验证配置，或切换到更严格的策略。第四，在多 Agent 系统中引入监督 Agent，防止因信息不对称或级联放大导致的串谋或越权行为。',
    },
    capabilities: {
      'capabilities.title': 'LLM Agent 能做什么，以及它们如何工作',
      'capabilities.overview.p1':
        '本节精选了一组示例，展示关键 Agent 能力及其背后的提示设计机制，涵盖多种应用场景。概要见下表，每个示例都是自包含的案例。',
      'capabilities.table.caption':
        '代表性 LLM Agent 的概览，包括应用领域与所展示的能力。',
      'capabilities.jump.title': '跳转到任意示例',
      'capabilities.jump.p1': '读者可以直接跳转到感兴趣的示例，无需按顺序阅读。',
      'capabilities.card.generative': '具有记忆、反思和日程规划的模拟人物。',
      'capabilities.card.aiScientist': '自动完成创意生成、实验迭代与论文写作。',
      'capabilities.card.cellagent': 'Planner、executor、evaluator 三人组处理 scRNA-seq 与 ST 数据分析。',
      'capabilities.card.virtualLab': '主导师式编排，结合 AI 与人类协作。',
      'capabilities.card.metagpt': '把 PM、架构师、工程师、QA 打包成一支软件团队。',
      'capabilities.card.finagent': '多模态市场情报、反思与工具增强的交易。',
      'capabilities.card.voyager': '自动生成 Minecraft 学习路径，配可复用技能库。',
      'capabilities.card.mobile': 'LLM 将自然语言翻译成滑动、点击、输入的操作序列。',
      'capabilities.card.palm': '在具身机器人里，将 “say” 的价值与 “can” 的可行性分开评估。',
    },
    foundations: {
      'foundations.title': 'LLM Agent基础知识',
      'foundations.overview.p1':
        '大型语言模型（LLM）如 GPT、DeepSeek、Gemini、Claude 等，都是在海量人类生成的数据（网页、代码、教材等）上预训练的、拥有数十亿参数的深度学习模型。通过这些语料训练，LLM 具备理解和生成语言的能力。',
      'foundations.nextToken.title': 'LLM 原理：Next-Token Prediction',
      'foundations.nextToken.p1':
        '驱动所有 LLM 用途的核心操作是 <strong>next-token prediction</strong>。token 是模型处理的基本文本单位，可以是词、字符或子词。令 <em>x</em> 表示输入（prompt），LLM 按 token 逐个预测生成输出序列 \\(y = (y_1, y_2, \\ldots, y_T)\\)。形式化表示为 \\(p(y \\mid x) = \\prod_{t=1}^{T} p\\big(y_t \\mid x, y_1, y_2, \\ldots, y_T\\big)\\)。预测下一个 token 时，prompt <em>x</em> 和已生成的 \\((y_1, y_2, \\ldots, y_T)\\) 都受限于有限的上下文窗口，决定了模型一次能使用的最大文本长度。',
      'foundations.nextToken.p2':
        'LLM 十分通用。只要任务和输出能用文本表达（输入 x、输出 y），它就能胜任。如今人们用文本提示让 LLM 生成代码、解数学题、回答医疗问题、写文章、翻译、作诗等。给出明确的上下文与要求，通常就能得到质量可接受的输出。',
      'foundations.agentDefinition.title': 'LLM Agent 的特征是什么？',
      'foundations.agentDefinition.p1':
        '对 Agent 的定义尚无共识，LLM 与 LLM Agent 的界限常被模糊。与单次 prompt-响应不同，LLM Agent 通常处理多阶段任务，遵循结构化流程而非一次模型调用。LLM Agent 还常具备额外能力：memory、role-play、planning、tool use、cooperation、reflection。它们在不同情境下形式各异。下面简要概述这些能力，具体示例在下一部分展开。',
      'foundations.memory.p1':
        "Memory 是 Agent 记忆并利用过往信息的能力。由于上下文窗口有限、超长输入不易处理，保留所有细节既不现实也不高效。Memory 让 Agent 能选择性保留与检索信息、合并相似内容降冗、反思并提炼高层想法，从而构建有用的知识库，借鉴经验，同时在长期交互中保持效率。Memory 可以在 prompt 中，也可以在外部存储（数据库等）。",
      'foundations.roleplay.p1':
        'Role-play 是让 Agent 根据高层描述（人设、职业、性格等）生成一致行为的能力。研究表明，当提示采用“a conservative, white, male, strong Republican”与“a liberal, white, female, strong Democrat”时，Agent 的政治态度截然不同；提示其“maximize self-interest”而非“maximize collective benefit”时，合作意愿也明显变化。',
      'foundations.planning.p1':
        'Planning 是把复杂任务拆解为可执行步骤的能力。LLM 仍然难以处理需要多步推理和实时适应的长链条任务。例如“订机票”需要打开网站、填写出发到达和日期、比价、选座并完成支付，任何一步出错都可能失败，界面变化也要求即时调整。有效的规划会把任务拆成可管理的步骤，迭代细化，并根据进展反思和调整。',
      'foundations.tooluse.p1':
        'Tool use 指 Agent 选择、组合并调用外部函数、环境或 API 的能力。LLM 的训练数据是静态的，事实性可能不准，计算也不可靠，且不了解训练截断后的事件。常见表现是生成可在外部环境执行的代码（如 Python），进行数据分析、仿真或可视化；也可以生成结构化函数调用去触发计算器、天气 API、网页搜索等工具。这些代码与调用都在 LLM 外执行，结果再反馈回推理循环，使 Agent 能提供更准确、可验证且最新的回应。',
      'foundations.cooperation.p1':
        'Cooperation 是与其他 Agent 或人协作的能力，使单个 Agent 无法高效完成的任务得以实现。它不仅是并行工作，还包括推断他人目标与意图、高效沟通、分工、策略对齐、建立信任、解决冲突，有时还需识别欺骗或背叛并做出制衡以维护团队完整性。',
      'foundations.reflection.p1':
        'Reflection 让 Agent 像人一样反思过往行为与判断，改进未来决策。它能批判自身表现、诊断错误并调整后续行动。研究表明，反思能帮助 LLM Agent 将互动经验提炼成抽象而有洞见的想法，总结错误经验并改进行为，从而提升复杂环境下的性能、鲁棒性与长期可靠性。',
    },
    finagent: {
      'finagent.title': 'FinAgent：面向金融交易的多模态基础 Agent',
      'finagent.overview.p1':
        'FinAgent 是一款面向金融交易的多模态基础 Agent，通过三大模块提升适应性与泛化： (i) 市场情报模块，从多种市场信息（每日新闻、价格、月度/季度财报等）提取并总结关键信息；(ii) 反思模块，对市场动态与过往决策做双层反思；(iii) 工具增强决策模块，结合专家指导优化交易动作。',
      'finagent.figure.caption':
        'FinAgent 的整体架构。图中的序号表示执行顺序，增强的工具与决策模块一起使用。',
      'finagent.overview.p2':
        '下面用示例与提示模板说明 FinAgent 如何依赖 <strong>role-play</strong>、<strong>memory</strong> 和 <strong>reflection</strong> 做出明智的交易决策。',
      'finagent.roleplay.p1':
        'FinAgent 由高层角色描述约束，以确保在市场分析与金融决策中保持一致的专业性。Role-play 规范包含三部分：Agent 的角色定义、金融市场环境的上下文，以及 Agent 在交易场景下的分析能力。',
      'finagent.memory.p1':
        'Memory 在多模态金融交易 Agent 中至关重要。FinAgent 的记忆模块使用向量化存储，包含三部分：(i) <i>market intelligence 摘要</i>，从多模态金融数据中收集、总结、分析并提炼洞察；(ii) <i>低层反思摘要</i>，识别价格走势的潜在模式，并从 market intelligence 摘要中提炼洞察；(iii) <i>高层反思摘要</i>，存储并反思过往交易决策。这些摘要会作为其他模块的输入，例如反思提示会同时使用过往和最新的 market intelligence 摘要。',
      'finagent.reflection.p1':
        'FinAgent 采用双层反思机制：(i) <i>低层反思</i> 分析价格变动数据，推理并识别市场走势的潜在模式；(ii) <i>高层反思</i> 聚焦过往交易决策，总结成功与失误的经验，提出改进与纠偏建议。',
    },
    practical: {
      'practical.title': '实用提示：如何打造你的第一个 LLM Agent',
      'practical.overview.p1': '本节提供一些通用建议，帮助更广泛的读者设计 Agent。',
      'practical.tip1.title': '1. 尽可能保持 Agent 设计简单。',
      'practical.tip1.p1':
        '第一次尝试很难完美，所以首要原则是追求最简可行设计、尽量少的复杂度。相比几年前（第一版 ChatGPT 问世时），如今的模型能力更强，很多过去需要长链提示才能完成的任务，现在往往一条精简提示就够了。',
      'practical.tip2.title': '2. 为 Agent 清晰定义目标或任务。',
      'practical.tip2.p1':
        '设计 Agent 最重要的是明确你想让它完成什么。花时间写清楚目标或任务，并在提示里直截了当地说明，例如以 “Your goal is to...” 开头。明确的目标能让 Agent 保持聚焦，成功率更高。',
      'practical.tip3.title': '3. 用人类完成同一任务的方式来引导 Agent。',
      'practical.tip3.p1':
        '如果仅设定目标不足以得到理想行为，可以在提示中写出关键里程碑，像指导人一样。比如写作 Agent，可以让它先提出想法、再查阅文献、给出方案并验证。按这些阶段组织提示（“First, propose..., then scan the literature...”），细节留给 Agent 自行处理。',
      'practical.tip4.title': '4. 提供示例。',
      'practical.tip4.p1':
        '示例能加速人类和 LLM Agent 的理解。如果需要结构化输出，先给出格式示例，如 “结果按此 JSON schema 输出：...”。当方法论很重要时（如临床指南），提供涵盖每个步骤的示例。好的示例能引导 Agent 行为、减少歧义。这种做法在文献中常称作 in-context learning。',
      'practical.tip5.title': '5. 先直接与 LLM 对话，谨慎使用 Agent 框架。',
      'practical.tip5.p1':
        '市面上有 LangGraph、Dify、Coze、Bedrock 等众多框架，有些（如 Coze）还提供拖拽式界面。但它们会增加抽象层，遮挡你调试所需的原始提示与回复，也容易让人过度工程化。我们的经验是：先直接与模型聊天（如 ChatGPT），再调用 LLM API，最后视需要再上框架。正如示例所示，很多 Agent 能力只需几行精心设计的提示即可实现。',
    },
    'generative-agents': {
      'generative-agents.title': 'Generative Agents：可信人类行为的仿真',
      'generative-agents.overview.p1':
        'Generative Agents 提出了一种 LLM-based Agent 架构，用于在沙盒环境中模拟人类行为。人类行为本身庞大、动态且依赖情境，传统 Agent 很难生成真正可信的表现。Generative Agents 通过记忆过往体验、反思，并生成在当下和时间维度都保持一致的计划与行动来解决这一问题。它们能按时起床、准备餐食、去上班，也能主动与他人交谈、制定未来计划、协调举办派对。',
      'generative-agents.figcaption':
        'Generative Agents 作为可信的人类行为仿真体应用于交互场景。作者在类似《模拟人生》的沙盒环境中放置了 25 个 Agent，用户可以观察和干预它们规划一天、分享消息、建立关系、组织群体活动。',
      'generative-agents.overview.p2':
        '下面用示例和提示模板展示 Generative Agents 如何利用 <strong>role-play</strong>、<strong>memory</strong>、<strong>planning</strong> 与 <strong>reflection</strong> 来完成可信的社会仿真。',
      'generative-agents.roleplay.p1':
        'Role-play 对 Generative Agents 至关重要，高层的 Agent 描述决定了它们会成为什么样的 Agent。描述包含三部分：(i) 基本信息：如姓名、年龄、先天特质；(ii) 当前状态：当前在做什么，例如正在筹办情人节派对；(iii) 生活方式：日常作息，如起床睡觉时间。这些都可随任务调整。以 Isabella Rodriguez 为例，高层描述会指引其对话和决策与角色特征一致。',
      'generative-agents.memory.p1':
        'Generative Agents 的 Memory 存在 JSON 数据库中，用于记录和检索过往信息，保持行为与经历一致。Memory 分三类：(i) event，记录环境或其他 Agent 的观察；(ii) chat，记录与他人的对话；(iii) thought，存储 Agent 的反思（如 “Maria Lopez is planning something”）。保留所有细节不现实，因此按新近性、相关性、重要性检索。新近性用指数衰减突出最近访问的记忆；相关性用余弦相似度评估当前情境；重要性通过提示 LLM 评分区分平凡与关键经验。',
      'generative-agents.reflection.p1':
        "随着时间推移，记忆会累积冗余，Agent 需要反思长对话并将其总结成高层想法。示例提示展示如何把 Isabella 与 Francisco 关于情人节派对的对话压缩成一句话。",
      'generative-agents.planning.p1':
        'Planning 给出未来的行动序列，保证行为随时间一致。Generative Agents 根据角色档案（基础属性、当前状态、生活方式）生成每日计划，包含地点、开始时间与持续时长。生成后按顺序执行，并在情境变化时基于当前状态动态调整。示例展示 Isabella 在情人节的计划生成与表示方式。',
    },
    'ai-scientist': {
      'ai-scientist.title': 'The AI Scientist：迈向全自动科研',
      'ai-scientist.overview.p1':
        'The AI Scientist 旨在从创意到论文写作的科研流程中完全脱离人工，分三阶段生成论文：(1) 创意生成，(2) 实验迭代，(3) 论文写作。它先产出与现有文献不同的一组想法，再据此执行实验并可视化结果，最后按机器学习会议的风格生成 LaTeX 论文，并通过 LLM 生成的评审反馈来修订。',
      'ai-scientist.figcaption':
        'The AI Scientist 的概念示意：端到端的 LLM 驱动科学发现流程。先提出并评估想法的新颖性，然后确定验证假设的方法，包括用最新的自动代码生成技术改写代码库；接着自动运行实验，收集数值指标和可视化摘要；之后用 LaTeX 报告说明、解释并总结结果；最后生成自动化评审（仿照标准会议流程），用于改进项目或反馈给后续迭代。',
      'ai-scientist.overview.p2':
        '下面用示例和提示模板展示 The AI Scientist 如何结合 <strong>planning</strong>、<strong>tool use</strong> 与 <strong>reflection</strong> 自主开展研究与写作。',
      'ai-scientist.planning.p1':
        'Planning 帮助 The AI Scientist 把复杂目标拆成有序步骤。例如在实验迭代阶段，它会为每个想法规划实验步骤、写代码并按计划执行；在写作阶段，它把科研发现组织成论文。规划能力让它能有条理地生成、改进并执行想法，再把结果写成论文。示例展示了它生成实验计划的方式。',
      'ai-scientist.tools.p1':
        '三个阶段都大量用到工具。创意阶段，它通过检索文献评估新颖性：提示 LLM 生成搜索 query，再调用内置 Python 模块访问 Semantic Scholar API。实验迭代中，它使用 coding assistant Aider，根据 LLM 生成的计划自动写代码并跑实验。写作阶段，LLM 生成 LaTeX 手稿后，AI Scientist 调用 LaTeX 编译器产出 PDF。示例展示了如何生成文献检索 query。',
      'ai-scientist.reflection.p1':
        '科学研究高度依赖反思，AI Scientist 也如此。生成想法时，它通过自我反思打磨创意；实验阶段，分析结果并调整方法；写作阶段，对每个章节做两轮自我反思，提升准确性、简洁性与连贯性。最重要的反思来自自动论文评审：把生成的 PDF 转成文本，由 LLM 评审 Agent 反馈意见，供 AI Scientist 改进论文。示例展示评审意见的生成。',
    },
    cellagent: {
      'cellagent.title': 'CellAgent：用自然语言自动化生物数据分析',
      'cellagent.overview.p1':
        'CellAgent 是一个由 LLM 驱动的多 Agent 框架，接受原始 scRNA-seq 与 ST 数据以及自然语言指令，自动完成端到端分析，输出高质量可视化与处理结果。传统流程需要大量编程和领域知识，门槛高。CellAgent 采用分层的专职 Agent 进行规划、执行和评估，模拟“深度思考”过程，确保自动化发现的质量、透明的推理、迭代优化和清晰输出。',
      'cellagent.figcaption':
        'CellAgent 框架示意。a，用户输入示例；b，Planner 解析意图并拆分子任务；c，最终结果示意；d，子任务处理流程：Executor 获取工具、阅读文档、生成代码并在沙盒执行，异常时重试；Evaluator 评估结果并指导优化，聚合多次结果得到该步输出。',
      'cellagent.overview.p2':
        '下面用示例与提示模板展示 CellAgent 如何利用 <strong>role-play</strong>、<strong>planning</strong>、<strong>tool use</strong>、<strong>reflection</strong>、<strong>cooperation</strong> 与 <strong>memory</strong> 自动化全流程生物分析。',
      'cellagent.roleplay.p1':
        'CellAgent 架构按职责分为三类专职 Agent：<strong>Planner</strong>、<strong>Executor</strong>、<strong>Evaluator</strong>，对应人类专家流程。Planner 像项目负责人，解析高层目标并拆解步骤；Executor 像生信工程师，选工具、写代码并运行分析；Evaluator 像质控专家，评估输出的生物学合理性与一致性，在无人干预下驱动迭代优化。',
      'cellagent.planning.p1':
        'CellAgent 的规划由 Planner 层级管理。收到自然语言请求后，基于角色提示里的专家知识把复杂任务拆成有序子任务，确保流程符合逻辑与科学规范。例如“clustering”会先拆到必要的预处理步骤，再进行聚类，符合领域最佳实践。',
      'cellagent.tools.p1':
        'Executor 配备专家整理的 scOmni 工具箱，汇集单细胞分析常用软件（如 Scanpy、CellTypist、Harmony）并提供详细文档。Executor 会为每个子任务选择合适工具、理解参数并生成代码，弥补通用 LLM 在专用工具使用上的不足。',
      'cellagent.reflection.p1':
        'Evaluator 驱动的自反思机制用于优化。Executor 运行代码后，Evaluator 评估输出（图或统计结果）；若效果不佳（如聚类不清晰、批次矫正不足），会给出可执行的反馈，如调节超参或尝试其他工具。执行与反思的循环确保最终结果稳健准确。',
      'cellagent.cooperation.p1':
        'CellAgent 的协作是结构化、分层的：Planner 给出计划并传递首个子任务；Executor 完成子任务并把结果交给 Evaluator；Evaluator 提供反馈，必要时促使 Executor 改进当前子任务。完成后进入下一个子任务，确保整个分析有序推进。',
      'cellagent.memory.p1':
        '为在多步分析中维持上下文和高效协作，CellAgent 采用全局与局部记忆。Global Memory 保存总体计划和各步骤结果，确保行动与全局目标一致；Local Memory 保存子任务内的代码、参数和评估反馈。该记忆机制保证步骤间一致性，并支撑迭代的自反思优化。',
    },
    'virtual-lab': {
      'virtual-lab.title': 'The Virtual Lab：AI 与人类协作的医学研究',
      'virtual-lab.overview.p1':
        'Virtual Lab 通过 AI Agent 与人类研究者的协作促进跨学科研究。研究者首先定义两个核心 Agent——Principal Investigator (PI) 与 Scientific Critic。PI 会根据研究主题自动组建专业科学家团队。研究通过团队会议与个人会议开展，研究者提供议程引导讨论，Agent 决定如何落实。多场会议并行后，PI 召开汇总会议，在人类协助下整合生成的工具脚本与讨论成果，构建针对初始课题的完整工作流，最终由研究者利用这些工具完成项目。',
      'virtual-lab.figcaption':
        'a，Virtual Lab 中设计 Agent 的流程，每个 Agent 由 Title、Expertise、Goal、Role 四项定义。研究者先定义 PI 与 Scientific Critic，再由 PI 根据项目描述自动生成多个科学家 Agent。b，团队会议流程：研究者给出议程，PI 提供初步想法与问题后，科学家依次回答，Scientific Critic 逐轮点评，PI 综述并追问，最终总结并回答议程。c，个人会议流程：研究者给出议程，负责的科学家回答后由 Scientific Critic 点评，逐轮改进，最终给出完善回答。',
      'virtual-lab.overview.p2':
        '下面用示例与提示模板说明 Virtual Lab 如何利用 <strong>role-play</strong>、<strong>reflection</strong>、<strong>cooperation</strong>、<strong>tool use</strong> 引导 AI–人类协作研究。',
      'virtual-lab.roleplay.p1':
        'Virtual Lab 设定两类关键角色：负责协调的 PI Agent 与提供批判性审视、识别风险的 Scientific Critic。两者共同确保决策质量与流程透明。下例以 PI 展示角色定义的关键要素。',
      'virtual-lab.reflection.p1':
        '在研究者给出高层目标后，PI 会在团队生成会议中决定需要的专家 Agent（如序列设计、结构预测、能量评估、证据检索等）。个人会议让 Agent 聚焦具体任务，Scientific Critic 在每轮后给出定向反馈。团队生成会议中，PI 写出每个 Agent 的 Title、Expertise、Goal、Role，Scientific Critic 评审并反馈，执行前先打磨角色。示例展示 PI 如何为课题组建团队及反思流程。',
      'virtual-lab.cooperation.p1':
        '团队会议由 PI、科学家 Agent 与 Scientific Critic 协作完成。研究者设定议程，PI 提出关键问题开场，随后各 Agent 依次给出见解。经过数轮讨论后，PI 归纳要点并明确下一步，研究者只需看 PI 的简明总结就能掌握进展。下方示例展示团队协作场景。',
      'virtual-lab.tools.p1':
        '团队会议确定项目细节后，在研究者协助下进入工具生成与实现。工具生成阶段通过团队会议共同选择计算工具，示例展示了会议中如何确定合适的工具。',
      'virtual-lab.tools.p2':
        '确定工具集后进入实现阶段。PI 先在个人会议中为各专家分配工具，再由每位专家在研究者引导下生成结构化脚本，并通过反馈迭代打磨，研究者保存最终脚本供执行。示例展示了专家在研究者指导下编写 Rosetta 脚本的过程。',
    },
    metagpt: {
      'metagpt.title': 'MetaGPT：高效写代码的多 Agent 框架',
      'metagpt.overview.p1':
        'MetaGPT 是一个 LLM-based 多 Agent 框架，旨在复刻成熟的软件工程流程。现代软件工程通过拆分流程来管理复杂度、提升效率、保证质量。MetaGPT 通过：(i) 明确分配专职角色；(ii) 结构化规划与任务分解；(iii) 借助工具自动生成代码；(iv) 基于多 Agent 协作迭代调试，来还原这一过程。',
      'metagpt.figcaption':
        'MetaGPT 与现实软件团队的 SOP 对比。SOP 促进各角色协作；MetaGPT 将复杂任务拆成可执行步骤分派给 Product Manager、Architect、Engineer 等角色。',
      'metagpt.overview.p2':
        '下面用示例与提示模板展示 MetaGPT 如何利用 <strong>role-play</strong>、<strong>planning</strong>、<strong>cooperation</strong>、<strong>tool use</strong> 有条理地交付软件。',
      'metagpt.roleplay.p1':
        'Role-play 是 MetaGPT 的基础能力，决定各 Agent 的运行与协作方式。角色包括 Product Manager、Architect、Project Manager、Engineer、QA Engineer 等，对应需求定义、架构设计、流程管理、编码实现、质量保障。Role-play 通过 Name、Profile、Goal、Constraint 四部分定义身份、职责与约束，例如遵守编码规范、保证模块化与可维护性。示例使用 Product Manager。',
      'metagpt.planning.p1':
        'MetaGPT 的规划是把复杂的软件任务系统性拆解为结构化步骤，并明确分配给角色。例如 Product Manager 分析用户需求，产出细致的 PRD，定义产品目标、用户故事和需求优先级，为后续设计、分工和实现提供基础的功能拆分。',
      'metagpt.cooperation.p1':
        'MetaGPT 的协作依赖共享的消息池机制。Agent 将结构化输出（PRD、系统设计等）发布到全局消息池，其他 Agent 可按需订阅，避免信息过载并高效协作。发布-订阅方式保障分工有序。示例展示 Product Manager 如何向 Architect 分派任务。',
      'metagpt.tools.p1':
        '工具使用是软件开发的关键，帮助高效连接外部资源与真实开发环境。在 MetaGPT 中，工具与角色严格对齐：Product Manager 用市场分析工具，Architect 用设计可视化工具，Engineer 使用 Editor、Terminal、Code Review 等编码工具。示例展示 Engineer 如何使用这些工具。',
    },
    voyager: {
      'voyager.title': 'Voyager：在 Minecraft 中自主探索、学习与适应',
      'voyager.overview.p1':
        'Voyager 旨在实现 Minecraft 中的终身学习。Minecraft 是拥有多种生物群系、昼夜循环、各种生物以及可采集、合成、建造、探索的方块与物品的 3D 沙盒。Voyager 的目标是在无人工奖励与干预下探索世界、学习多样技能并做出新发现。它自行生成任务课程，通过代码执行完成任务，并结合反馈与自检迭代行为，逐步累积可复用、可组合的技能库，支撑越来越复杂的行为。',
      'voyager.figcaption':
        'Voyager 包含三大组件：面向开放探索的自动课程、支持复杂行为的技能库，以及以代码为动作空间的迭代提示机制。',
      'voyager.overview.p2':
        '下面用示例与提示模板展示 Voyager 如何利用 <strong>planning</strong>、<strong>tool use</strong>、<strong>memory</strong>、<strong>reflection</strong> 自主探索 Minecraft 并扩展技能库。',
      'voyager.planning.p1':
        'Voyager 的自动课程模块负责规划：自动设定任务并把高层任务拆解为子任务。它根据当前能力与环境状态生成新任务，再依赖 LLM 内部知识将其拆解，推动 Voyager 从简单任务逐步迈向更难任务。在生成技能代码时也会生成对应计划。示例展示自动生成的任务。',
      'voyager.tools.p1':
        'Voyager 通过 LLM 生成的动作代码控制角色完成自动课程提出的任务。代码由 <a href="https://mineflayer.com">Mineflayer</a> API 组成，使角色能移动、采掘、合成、战斗等。Mineflayer 让 LLM 直接获取结构化游戏状态与高层动作接口，无需理解复杂视觉或频繁低级决策，交互更简单高效。更重要的是，每个生成的 Mineflayer 函数都会存入技能库，可被检索并组合成更复杂的行为。',
      'voyager.memory.p1':
        'Voyager 的技能库体现了记忆，存储所有已验证的可执行程序，基于向量库实现可扩展检索。新任务出现时，Voyager 用任务描述与环境反馈的嵌入检索相关技能，再交给 LLM 复用或组合生成新程序。验证后的程序会加入技能库，持续扩展可模块化、可组合的行为，以解决越来越复杂的新任务。',
      'voyager.reflection.p1':
        '迭代提示机制赋予 Voyager 反思能力。每次执行程序后，它观察环境反馈、执行错误与自检结果，根据错误和成功信号持续修订动作代码直到任务成功。这种试错循环类似反思性推理，让 Agent 从错误中学习并自主改进行为。示例展示自检过程。',
    },
    'mobile-agent': {
      'mobile-agent.title': 'Mobile Agent：像人一样流畅操作手机',
      'mobile-agent.overview.p1':
        'Mobile Agent 旨在简化移动设备交互。用户用自然语言给出高层指令，Agent 解析并自动执行所需动作（点击、输入、跨应用导航等），减少手动操作和切换，降低成本与错误。',
      'mobile-agent.figcaption': 'Mobile-Agent 的框架。',
      'mobile-agent.overview.p2':
        '下面用示例与提示模板展示 Mobile Agent 如何结合 <strong>planning</strong>、<strong>tool use</strong>、<strong>reflection</strong>、<strong>memory</strong> 将自然语言需求转化为可靠的手机操作。',
      'mobile-agent.planning.p1':
        'Agent 结合用户指令与设备当前状态（如最新截图）制定操作计划并确定下一步动作，把高层目标转化为具体可执行步骤，确保执行有序。示例展示在提示引导下生成的下一步计划。',
      'mobile-agent.tools.p1':
        '生成下一步动作后，Agent 将其送入动作映射工具，把自然语言动作转为设备可执行指令。例如 Tap(500,800) 会被翻译成 adb 命令并通过 ADB 执行，从而把高层规划与具体操作衔接起来，自动完成启动应用、点击、滑动、输入等动作。',
      'mobile-agent.reflection.p1':
        '每次操作后，Agent 对比操作前后的截图评估效果。若结果符合目标，进入下一轮规划；若偏离（如打开错误页面或动作无效），则检测到错误并纠正，防止错误扩散，保持任务与原目标一致。示例展示基于截图对操作成效的判断。',
      'mobile-agent.memory.p1':
        '在执行过程中，Agent 记录后续步骤可能需要的任务相关信息，跨应用保存中间结果与上下文，必要时回忆以保持多步、跨应用任务的连续性，避免关键信息丢失，确保完成连贯。',
    },
    'palm-saycan': {
      'palm-saycan.title': 'PaLM-SayCan：清晰且有落地性的 Agent 模式',
      'palm-saycan.overview.p1':
        '具身 Agent 需要把开放语言转成安全有效的行为，同时面对部分可观测、长链条、硬件限制与实时不确定性。常见失败包括忽视几何的模糊计划、编造机器人没有的能力、以及无法执行的不安全动作。PaLM-SayCan 通过拆分高层推理与低层可行性解决这些问题：每一步都问 “Say：现在做什么有用？” 和 “Can：机器人现在能做什么？”，只有既有用又可行的动作才执行。决策时，LLM 基于用户指令、当前状态和技能库为各技能打 “有用性” 分（Say）；预训练的 affordance 模型估计成功概率（Can）；系统结合两者执行得分最高的技能，记录结果、更新状态，循环至目标达成或无安全可行动作。',
      'palm-saycan.figcaption':
        'LLM 没有与环境交互过，缺乏落地性。SayCan 通过预训练技能的价值函数为 LLM 落地，使其能在机器人上执行真实、抽象、长链条指令。',
      'palm-saycan.overview.p2':
        '下面用示例与提示模板展示 PaLM-SayCan 如何结合 <strong>planning</strong>、<strong>tool use</strong>、<strong>reflection</strong> 生成安全可行的机器人行为。',
      'palm-saycan.planning.p1':
        'LLM 作为固定技能集合上的语义规划器，不创造新技能，只对给定技能打分并给出简短推理，帮助可解释。',
      'palm-saycan.tools.p1':
        'SayCan 把低层能力视作需要双重落地的工具：<strong>文本到技能</strong>，每个技能暴露可读名称、描述和参数，便于 LLM 对齐；<strong>执行落地</strong>，每个技能有执行器、前置条件与后置条件，执行返回结构化结果更新日志与状态。新增能力很模块化：登记名称/描述，提供（或训练）执行器与可行性估计器即可纳入规划。',
      'palm-saycan.reflection.p1':
        'Reflection 对应 “Can” 的可行性检查。预训练的 affordance 函数（来自机器人经验）对每个技能在当前场景的成功率做估计。原版中，这个模型是语言条件的价值函数，输入当前观测和技能描述，输出成功概率。在决策阶段，将 LLM 给出的有用性概率（Say）与 affordance 的可行性概率（Can）相乘，选择得分最高的技能执行。',
    },
  };

  if (pageSpecificTranslations[pageId]) {
    Object.assign(contentTranslations.zh, pageSpecificTranslations[pageId]);
  }

  const getTranslation = (language, key) => translations[language]?.[key] || translations.en[key] || '';
  const getChapterParentKey = (label) => {
    if (!(label instanceof HTMLElement)) return null;
    if (label.dataset.chapterParentKey) return label.dataset.chapterParentKey;
    const siblingList = label.nextElementSibling;
    const key =
      siblingList instanceof HTMLElement &&
      siblingList.querySelector('[data-chapter-link^="adv-"]')
        ? 'chapterParent.advanced'
        : 'chapterParent.examples';
    label.dataset.chapterParentKey = key;
    return key;
  };

  const applyTranslations = (language) => {
    document.querySelectorAll('[data-nav-target]').forEach((link) => {
      if (!(link instanceof HTMLElement)) return;
      const key = `nav.${link.dataset.navTarget || ''}`;
      const translation = getTranslation(language, key);
      if (translation) link.textContent = translation;
    });

    document.querySelectorAll('[data-chapter-link]').forEach((link) => {
      if (!(link instanceof HTMLElement)) return;
      const key = `chapter.${link.dataset.chapterLink || ''}`;
      const translation = getTranslation(language, key);
      if (translation) link.textContent = translation;
    });

    document.querySelectorAll('.chapter-parent').forEach((label) => {
      if (!(label instanceof HTMLElement)) return;
      const key = getChapterParentKey(label);
      const translation = getTranslation(language, key);
      if (translation) label.textContent = translation;
    });

    const sidebarHeading = document.querySelector('.progress-sidebar h2');
    const sidebarHeadingTranslation = getTranslation(language, 'sidebar.onThisPage');
    if (sidebarHeading instanceof HTMLElement && sidebarHeadingTranslation) {
      sidebarHeading.textContent = sidebarHeadingTranslation;
    }

    document.querySelectorAll('.download-btn').forEach((button) => {
      const translation = getTranslation(language, 'action.download');
      if (!translation) return;
      const textNode = Array.from(button.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = `${translation} `;
      } else {
        button.insertBefore(document.createTextNode(`${translation} `), button.firstChild);
      }
    });
  };

  const applyContentTranslations = (language) => {
    contentElements.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const key = el.dataset.i18nKey;
      if (!key) return;
      if (language === 'zh' && contentTranslations.zh[key]) {
        el.innerHTML = contentTranslations.zh[key];
        return;
      }
      if (contentDefaults[key]) {
        el.innerHTML = contentDefaults[key];
      }
    });
  };

  const applyDetailHeaderTranslations = (language) => {
    document.querySelectorAll('.detail-box__header h4').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const original = detailHeaderDefaults.get(el);
      if (!original) return;
      if (language === 'zh') {
        const translation = detailHeaderTranslations.zh[original.trim()];
        el.innerHTML = translation || original;
        return;
      }
      el.innerHTML = original;
    });
  };

  const updateLanguageToggle = (language) => {
    Object.values(languageToggleButtons).forEach((btn) => {
      if (!(btn instanceof HTMLElement)) return;
      const isActive = btn.dataset.language === language;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const setLanguage = (language) => {
    const normalizedLanguage = supportedLanguages.includes(language) ? language : 'en';
    document.documentElement.setAttribute('lang', normalizedLanguage === 'zh' ? 'zh' : 'en');
    document.body.dataset.language = normalizedLanguage;
    try {
      localStorage.setItem(languageStorageKey, normalizedLanguage);
    } catch (error) {
      /* ignore persistence errors */
    }
    applyTranslations(normalizedLanguage);
    applyContentTranslations(normalizedLanguage);
    applyDetailHeaderTranslations(normalizedLanguage);
    updateLanguageToggle(normalizedLanguage);
    const scheduleTypeset = () => {
      if (mathJaxTypesetHandle) {
        window.clearTimeout(mathJaxTypesetHandle);
      }
      mathJaxTypesetHandle = window.setTimeout(() => {
        mathJaxTypesetHandle = null;
        if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
          MathJax.typesetPromise().catch(() => {
            /* ignore MathJax errors */
          });
        }
      }, 0);
    };

    if (window.MathJax) {
      scheduleTypeset();
    } else {
      const mathJaxScript = document.getElementById('mathjax');
      if (mathJaxScript) {
        mathJaxScript.addEventListener('load', scheduleTypeset, { once: true });
      }
    }
  };

  const createLanguageToggle = () => {
    const headerInner = document.querySelector('.site-header .inner');
    if (!(headerInner instanceof HTMLElement)) return;

    const toggleWrap = document.createElement('div');
    toggleWrap.className = 'language-toggle';

    [
      { code: 'en', label: 'EN' },
      { code: 'zh', label: '中文' },
    ].forEach(({ code, label }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'language-toggle__btn';
      btn.dataset.language = code;
      btn.textContent = label;
      btn.addEventListener('click', () => setLanguage(code));
      languageToggleButtons[code] = btn;
      toggleWrap.appendChild(btn);
    });

    const desktopDownloadBtn = headerInner.querySelector('.download-btn.ms-lg-3');
    if (desktopDownloadBtn) {
      headerInner.insertBefore(toggleWrap, desktopDownloadBtn);
    } else {
      headerInner.appendChild(toggleWrap);
    }
  };

  createLanguageToggle();

  const savedLanguage = (() => {
    try {
      return localStorage.getItem(languageStorageKey);
    } catch (error) {
      return null;
    }
  })();

  setLanguage(supportedLanguages.includes(savedLanguage) ? savedLanguage : 'en');

  const navTarget = document.body.dataset.nav || '';
  document.querySelectorAll('[data-nav-target]').forEach((link) => {
    if (link instanceof HTMLElement && link.dataset.navTarget === navTarget) {
      link.classList.add('active');
    }
  });

  const chapterTarget = document.body.dataset.page || '';
  document.querySelectorAll('[data-chapter-link]').forEach((link) => {
    if (link instanceof HTMLElement && link.dataset.chapterLink === chapterTarget) {
      link.classList.add('current');
    }
  });

  const sidebar = document.querySelector('.chapter-sidebar');
  if (sidebar instanceof HTMLElement) {
    const sidebarScrollKey = 'chapterSidebarScroll';
    const savedScroll = Number(localStorage.getItem(sidebarScrollKey));
    if (!Number.isNaN(savedScroll)) {
      sidebar.scrollTop = savedScroll;
    }

    let scrollSaveHandle = null;
    const persistSidebarScroll = () => {
      scrollSaveHandle = null;
      try {
        localStorage.setItem(sidebarScrollKey, sidebar.scrollTop.toString());
      } catch (error) {
        /* ignore persistence errors */
      }
    };

    sidebar.addEventListener('scroll', () => {
      if (scrollSaveHandle) return;
      scrollSaveHandle = window.requestAnimationFrame(persistSidebarScroll);
    });

    sidebar.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        persistSidebarScroll();
      });
    });

    window.addEventListener('beforeunload', persistSidebarScroll);
  }

  const progressLinks = Array.from(document.querySelectorAll('.progress-link'));
  const sections = progressLinks
    .map((link) => {
      if (!(link instanceof HTMLElement)) return null;
      const targetId = link.dataset.target;
      if (!targetId) return null;
      const targetEl = document.getElementById(targetId);
      return targetEl ? { link, target: targetEl } : null;
    })
    .filter(Boolean);

  if (sections.length) {
    const headerOffset = 140;

    const setActiveLink = (activeTarget) => {
      sections.forEach(({ link, target }) => {
        link.classList.toggle('is-active', target === activeTarget);
      });
    };

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + headerOffset;
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (scrolledToBottom) {
        setActiveLink(sections[sections.length - 1].target);
        return;
      }

      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const { target } = sections[i];
        if (scrollPosition >= target.offsetTop) {
          setActiveLink(target);
          return;
        }
      }

      setActiveLink(sections[0].target);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
  }

  const progressFill = document.querySelector('.progress-meter-fill');
  const updateMeter = () => {
    if (!progressFill) return;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const ratio = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    progressFill.style.width = `${ratio * 100}%`;
  };

  updateMeter();
  window.addEventListener('scroll', updateMeter, { passive: true });
  window.addEventListener('resize', updateMeter);
});
