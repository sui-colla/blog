---
title: "网格与半边结构：三维模型在计算机里怎么存"
date: "2026-10-15"
summary: "从顶点、边、面的索引表讲到半边结构，理解流形网格、邻接查询与法线计算，并用 Python 实现一个最小可用的半边网格。"
tags: ["计算机", "计算几何"]
series: "计算机建模"
---

## 三种最常见的存法

一个三角网格，最直觉的存法是“顶点表 + 面表”：

```text
V = [(0,0,0), (1,0,0), (1,1,0), (0,1,0)]
F = [(0,1,2), (0,2,3)]
```

这种表示叫**索引面集（indexed face set）**。它紧凑、通用，OBJ、STL、glTF 都能直接映射，渲染管线也喜欢它。但它有一个硬伤：想知道“与某条边相邻的另一个面”时，只能全表扫描。

第二种是**邻接表**：为每个顶点存一圈邻居。查询快，但更新拓扑时要同步维护多张表，容易写出一致性 bug。

第三种是**半边结构（half-edge）**。它把每条无向边拆成两条有向半边，让“下一条边”“孪生边”“所属面”都变成 O(1) 指针跳转。代价是内存翻倍，以及实现时必须认真处理边界。

## 半边结构到底存了什么

一条半边至少需要五个字段：

| 字段 | 含义 |
| --- | --- |
| `origin` | 这条半边的起点顶点 |
| `twin` | 方向相反的另一条半边 |
| `next` | 同一面内按逆时针排列的下一条半边 |
| `face` | 所属面；边界半边为空 |
| `prev` | 可选，指向上一条半边 |

如果网格是封闭的流形，每条边恰好被两个面共享，`twin` 永远存在。现实中的模型经常有开口，所以必须允许边界半边存在。

## 用 Python 搭一个最小实现

下面的代码只做三件事：从面表构建半边、遍历一个顶点的邻接面、计算面积加权的顶点法线。它不追求性能，但足以看清结构。

```python
from dataclasses import dataclass


@dataclass
class HalfEdge:
    origin: int
    twin: int = -1
    next: int = -1
    face: int = -1


class HalfEdgeMesh:
    def __init__(self, vertices, faces):
        self.vertices = list(vertices)
        self.faces = [tuple(f) for f in faces]
        self.edges: list[HalfEdge] = []
        self._build()

    def _build(self):
        edge_map = {}
        for fi, face in enumerate(self.faces):
            start = len(self.edges)
            n = len(face)
            for i, v in enumerate(face):
                self.edges.append(HalfEdge(origin=v, face=fi))
            for i in range(n):
                h = start + i
                self.edges[h].next = start + (i + 1) % n
                u, w = face[i], face[(i + 1) % n]
                edge_map[(u, w)] = h

        for (u, w), h in edge_map.items():
            twin = edge_map.get((w, u))
            if twin is not None:
                self.edges[h].twin = twin

    def vertex_faces(self, v):
        """遍历顶点 v 的出边，返回相邻面。边界处需要额外处理。"""
        result = []
        for h, e in enumerate(self.edges):
            if e.origin != v or e.face < 0:
                continue
            result.append(e.face)
        return result

    def vertex_normals(self):
        normals = [[0.0, 0.0, 0.0] for _ in self.vertices]
        for face in self.faces:
            a, b, c = (self.vertices[i] for i in face)
            u = [b[i] - a[i] for i in range(3)]
            v = [c[i] - a[i] for i in range(3)]
            n = [
                u[1] * v[2] - u[2] * v[1],
                u[2] * v[0] - u[0] * v[2],
                u[0] * v[1] - u[1] * v[0],
            ]
            for idx in face:
                for k in range(3):
                    normals[idx][k] += n[k]

        for n in normals:
            length = sum(x * x for x in n) ** 0.5 or 1.0
            for k in range(3):
                n[k] /= length
        return normals
```

这段实现有两个刻意保留的简化：

- `vertex_faces` 仍是线性扫描，真正的半边结构应该沿 `twin.next` 绕顶点旋转。
- 没有创建边界半边，因此 `twin == -1` 时表示开口。

把它们补全并不难，但会让代码迅速变长。理解结构比抄完所有分支更重要。

## 法线：几何正确不等于视觉正确

上面算的是**面积加权**的顶点法线：叉积的模长正比于三角形面积，所以大面对法线贡献更多。这在多数情况下是合理的。

但硬表面模型经常需要另一套规则：

- 需要保持棱角时，使用**面法线**或按角度阈值拆分顶点。
- 需要平滑过渡时，使用**角度加权**而非面积加权。
- 导入引擎后出现黑面，先检查三角形绕序和法线方向，而不是材质。

法线不是模型的附属信息，它直接决定光照、烘焙和碰撞检测的结果。

## 边界、非流形与真实数据

半边结构默认网格是**二维流形**：每条内部边恰好两个面，每个顶点周围是一个圆盘。现实模型经常不满足：

- 一条边被三个面共享，是**非流形边**。
- 两个面只在一个顶点相接，是**非流形顶点**。
- 重复顶点、退化三角形、零面积面，会让邻接关系变得不可预测。

工程上的处理顺序通常是：先做顶点焊接（按距离阈值），再删退化面，再检查非流形边，最后才构建半边。不要在脏数据上直接建拓扑。

## 什么时候值得用半边

| 场景 | 建议 |
| --- | --- |
| 纯渲染、只读几何 | 索引面集足够 |
| 网格简化、细分、重拓扑 | 半边或更完整的网格库 |
| 布尔运算、几何编辑 | 半边 + 稳健谓词 |
| 大规模点云处理 | 空间索引（kd-tree、八叉树）优先 |
| 仿真前处理 | 关注单元质量，未必需要半边 |

如果只是把模型画出来，不要为半边结构付出复杂度。如果要做编辑、查询、拓扑操作，它带来的 O(1) 邻接会让后续代码干净很多。

## 小结

网格不是“一堆三角形”，而是一张带方向的关系网。索引面集描述“有哪些面”，半边结构描述“面与面怎么连”。先把这两层分清，再谈简化、细分和重建，路线会清楚很多。
