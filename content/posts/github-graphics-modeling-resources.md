---
title: "GitHub 高星图形学与三维建模资源地图"
date: "2026-10-21"
summary: "按渲染入门、网格处理、几何算法、参数化 CAD、点云与重建五条线，整理一批高星开源项目，并给出从哪开始读、怎么避免收藏吃灰的建议。"
tags: ["计算机", "开源资源", "图形学"]
series: "开源资源地图"
---

## 先说明这份清单的用法

GitHub 上的“高星”只能说明关注度高，不能直接等于“适合你现在读”。一个 10 万星的框架，可能对刚学图形学的人毫无帮助；一个 1 千星的领域库，反而可能是某个问题的标准答案。

这份地图按**问题**组织，而不是按星数排名。星标数据来自 2026-10-21 的 GitHub API，之后会继续变化。每个项目都附了链接，建议先看 README、示例和 LICENSE，再决定要不要投入时间。

## 一、渲染与图形学入门

| 项目 | Stars | 适合解决的问题 | 怎么用 |
| --- | ---: | --- | --- |
| [tinyrenderer](https://github.com/ssloy/tinyrenderer) | 24,423 | 从零理解光栅化、深度缓冲、着色 | 跟着课程手写一遍软渲染器 |
| [LearnOpenGL](https://github.com/JoeyDeVries/LearnOpenGL) | 12,666 | 系统学 OpenGL 管线 | 按章节跑代码，再改参数观察结果 |
| [three.js](https://github.com/mrdoob/three.js) | 116,685 | Web 端 3D 场景与可视化 | 从 examples 里找最接近需求的 demo |
| [taichi](https://github.com/taichi-dev/taichi) | 28,425 | 用 Python 写高性能 GPU 计算 | 做粒子、流体、可微渲染原型 |

`tinyrenderer` 和 `LearnOpenGL` 是“理解原理”的路线，`three.js` 是“快速交付”的路线。两条路不冲突，但不要同时开。先选一个能两周内做出画面的，再补另一条。

`taichi` 值得单独提：它把 GPU 编程藏进 Python 语法里，适合验证仿真或图形算法，而不必先写大量 CUDA。代价是生态和调试体验与原生图形 API 不同，做产品前要评估。

## 二、建模、网格与资产管线

| 项目 | Stars | 定位 | 注意点 |
| --- | ---: | --- | --- |
| [Blender](https://github.com/blender/blender) | 21,111 | 开源三维创作套件 | GitHub 是官方镜像，主仓库在 Blender projects |
| [Open3D](https://github.com/isl-org/Open3D) | 14,110 | 点云与网格处理、可视化 | Python 接口友好，适合做实验 |
| [trimesh](https://github.com/mikedh/trimesh) | 3,704 | Python 三角网格读写与几何运算 | 轻量，适合脚本化处理 |
| [meshoptimizer](https://github.com/zeux/meshoptimizer) | 8,583 | 网格压缩与渲染优化 | 更偏引擎侧，不是建模工具 |
| [Draco](https://github.com/google/draco) | 7,520 | 网格与点云压缩 | 关注解码端支持与精度损失 |

这一组的关键不是“都学”，而是分清**创作、处理、传输**三件事：

- 创作：Blender。
- 处理：Open3D、trimesh、libigl。
- 传输：Draco、meshoptimizer。

如果你的模型最终要进 Web 或引擎，压缩和 LOD 早晚要补；如果只是做分析，先把 Open3D/trimesh 用熟更划算。

## 三、几何算法与网格处理

| 项目 | Stars | 强项 | 学习门槛 |
| --- | ---: | --- | --- |
| [CGAL](https://github.com/CGAL/cgal) | 6,084 | 稳健几何谓词、三角剖分、布尔运算 | 高，C++ 与几何基础都要过关 |
| [libigl](https://github.com/libigl/libigl) | 5,106 | 几何处理算法集合 | 中高，适合有 Eigen 基础的人 |
| [geogram](https://github.com/BrunoLevy/geogram) | 2,566 | 几何算法与网格处理 | 中高，文档相对分散 |

CGAL 的价值在于“稳健”：自己写布尔运算，很容易在共面、退化三角形上翻车；CGAL 用精确谓词把这些边界情况处理掉。代价是编译和接入成本高，不适合当第一周的练手库。

libigl 更像一本“可运行的几何处理教材”，很多算法都有对应论文和示例。想实现 Laplacian 平滑、参数化、调和场，从它的 tutorial 入手比从头推公式快。

## 四、参数化与程序化 CAD

| 项目 | Stars | 定位 | 适合谁 |
| --- | ---: | --- | --- |
| [FreeCAD](https://github.com/FreeCAD/FreeCAD) | 34,589 | 开源参数化实体建模 | 想要完整 CAD 工作流的人 |
| [OpenSCAD](https://github.com/openscad/openscad) | 10,476 | 代码描述实体 | 喜欢“写模型”而不是“拖模型”的人 |
| [CadQuery](https://github.com/CadQuery/cadquery) | 5,968 | Python 参数化 CAD（OCCT） | 要批量生成零件、接自动化的人 |

三者的分界很清楚：

- FreeCAD 有 GUI、草图、特征树，适合做完整设计。
- OpenSCAD 用脚本描述几何，适合简单零件和 3D 打印。
- CadQuery 把 Python 和 B-rep 结合起来，适合“参数表驱动”的系列化零件。

如果你已经会 Python，CadQuery 的上手成本通常低于 FreeCAD 的脚本接口；如果你需要可视化和装配，FreeCAD 更完整。

## 五、点云、重建与神经渲染

| 项目 | Stars | 方向 | 备注 |
| --- | ---: | --- | --- |
| [PCL](https://github.com/PointCloudLibrary/pcl) | 11,179 | 点云处理 | C++ 老牌库，功能全但偏重 |
| [3D Gaussian Splatting](https://github.com/graphdeco-inria/gaussian-splatting) | 24,288 | 辐射场重建与实时渲染 | 原论文参考实现，显存要求高 |
| [Instant-NGP](https://github.com/NVlabs/instant-ngp) | 17,578 | NeRF / 神经图形 | 依赖 NVIDIA GPU，适合做基线 |

这一方向变化很快，今天的“最佳实践”半年后可能就被替换。建议把注意力放在**输入输出与评估**上：数据怎么采集、相机位姿怎么来、重建误差怎么量，而不是只追某个仓库的 demo。

## 六、值得单独收藏的清单

| 清单 | Stars | 内容 |
| --- | ---: | --- |
| [awesome-creative-coding](https://github.com/terkelg/awesome-creative-coding) | 15,467 | 创意编程、生成艺术、交互设计 |
| [3D-Machine-Learning](https://github.com/timzhang642/3D-Machine-Learning) | 10,206 | 3D 深度学习论文与资源 |
| [awesome-blender](https://github.com/agmmnn/awesome-blender) | 7,466 | Blender 插件、教程与资产 |

清单类仓库适合“找入口”，不适合“当教材”。看到感兴趣的项目，回到它的 README 和论文，而不是继续在清单里滑动。

## 高星不等于该学：三个过滤条件

1. **维护状态**：最近一年是否有提交？issue 是否有人回？长期不维护的库，可能只适合读代码，不适合接入。
2. **许可证**：MIT/Apache-2.0 相对宽松；GPL 系库进入商业产品前要确认义务。CAD 和图形库尤其容易忽略这一点。
3. **语言与构建成本**：C++ 库的编译链、Python 库的二进制依赖、GPU 库的驱动要求，都会决定你能不能在一周内跑起来。

## 把仓库变成知识，而不是收藏夹

一个可执行的四步法：

1. **只选一个主仓库**：例如这周只碰 `tinyrenderer`，别同时开三个。
2. **跑通最小示例**：先让 demo 出画面，再谈改代码。
3. **改一个变量并解释结果**：改相机、改光照、改网格密度，写一段“为什么变成这样”。
4. **留下可复现记录**：命令、版本、参数、截图。三个月后还能跑起来，才算学会。

## 一条建议路线

- 想学渲染：`tinyrenderer` → `LearnOpenGL` → `three.js`。
- 想做几何处理：`trimesh`/`Open3D` → `libigl` → `CGAL`。
- 想做参数化设计：`OpenSCAD` → `CadQuery` → `FreeCAD` 脚本。
- 想做重建：`Open3D` → `Instant-NGP` → `3D Gaussian Splatting`。

路线不是门槛，目的是让你在每一步都有一个能交付的小结果。高星项目只是路标，真正留下的是你亲手跑过、改过、解释过的那部分。
