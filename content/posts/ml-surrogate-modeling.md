---
title: "机器学习代理模型：让仿真从“算一次”变成“随时预测”"
date: "2026-09-28"
summary: "当单次仿真太慢时，可以用代理模型学习输入到输出的映射。本文覆盖试验设计、特征构造、交叉验证、误差度量与工程落地边界。"
tags: ["计算机", "机器学习"]
series: "计算机建模"
---

## 为什么需要代理模型

一次高保真仿真，可能从几分钟到几十小时不等。做参数扫描、优化或实时交互时，直接调用仿真器往往不可行。

代理模型（surrogate model）的思路是：先在一批精心选择的输入点上运行仿真，得到一个数据集；再训练一个回归模型，学习“输入参数 → 仿真输出”的映射。之后用毫秒级预测替代小时级计算。

它本质上是一种**受控的插值**。理解这一点，就能理解它的边界：训练数据覆盖不到的区域，预测没有可靠依据。

## 先设计试验，再谈模型

随机撒点是最差的采样方式之一，容易在空间里留下空洞。常见方案：

| 方法 | 特点 | 适用场景 |
| --- | --- | --- |
| 拉丁超立方（LHS） | 每维分层，覆盖均匀 | 中低维参数空间 |
| 正交试验 | 组合数少，便于分析主效应 | 因子筛选 |
| Sobol 序列 | 低差异、可增量 | 高维、需要逐步加点 |
| 自适应采样 | 在误差大的区域补点 | 样本预算紧张 |

在 Python 里可以用 `scipy.stats.qmc` 直接生成 LHS 或 Sobol 点：

```python
from scipy.stats import qmc
import numpy as np

bounds = np.array([
    [0.5, 3.0],    # 壁厚
    [20.0, 80.0],  # 孔径
    [1.0, 5.0],    # 流速
])

sampler = qmc.LatinHypercube(d=bounds.shape[0], seed=42)
unit = sampler.random(n=120)
X = qmc.scale(unit, bounds[:, 0], bounds[:, 1])
```

采样数量取决于维度、输出非线性和预算。经验上，先用 10×维度 的量级做第一轮，再看误差决定是否补点。

## 特征不是越多越好

仿真输入通常已经是物理量，不需要复杂的特征工程。但以下几类信息值得显式加入：

- **无量纲数**：雷诺数、傅里叶数、长径比，比原始尺寸更能表达相似性。
- **几何描述子**：体积、表面积、最小壁厚、曲率统计。
- **类别变量**：材料牌号、边界类型，做 one-hot 或目标编码。
- **变换后的目标**：跨数量级的输出可以取对数再回归。

如果特征之间存在强共线性，树模型通常不敏感，线性模型和核方法则需要处理。

## 一个最小可用的训练流程

下面用随机森林做基线。它的好处是训练快、对特征尺度不敏感、能给出特征重要性；缺点是对训练范围外的数据会“自信地胡说”。

```python
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import KFold, cross_val_predict
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

# X: (n_samples, n_features), y: (n_samples,)
model = make_pipeline(
    StandardScaler(),
    RandomForestRegressor(
        n_estimators=400,
        max_depth=None,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    ),
)

kf = KFold(n_splits=5, shuffle=True, random_state=42)
pred = cross_val_predict(model, X, y, cv=kf)

rmse = mean_squared_error(y, pred, squared=False)
mae = mean_absolute_error(y, pred)
r2 = r2_score(y, pred)
print(f"RMSE={rmse:.4g}  MAE={mae:.4g}  R2={r2:.4f}")
```

如果输出跨越多个数量级，建议先对 `y` 取对数，再在预测后指数还原。否则大值样本会主导损失，小值区域的相对误差会很难看。

## 评估：别只看 R²

| 指标 | 回答的问题 | 注意 |
| --- | --- | --- |
| RMSE | 平均误差有多大 | 对大误差敏感 |
| MAE | 典型误差有多大 | 更稳健 |
| R² | 拟合了多大方差 | 样本少时容易虚高 |
| 最大相对误差 | 最坏情况能否接受 | 工程决策更关心 |
| 覆盖率 | 置信区间是否可信 | 需要不确定性估计 |

更重要的拆分方式是**按工况分组交叉验证**：如果数据来自不同几何族或不同边界条件，随机切分会让相近样本同时出现在训练和验证集，导致过于乐观的结果。按族留出（leave-one-group-out）更接近真实使用。

## 不确定性与适用域

代理模型最危险的失败模式，是在训练域外给出平滑但错误的预测。至少做三件事：

1. **适用域检查**：预测前判断输入是否落在训练样本的凸包或距离阈值内。
2. **集成方差**：用随机森林或 bootstrap 集成，输出预测均值与标准差。
3. **高误差回退**：当不确定性超过阈值时，回退到真实仿真，而不是强行预测。

在工程系统里，“不确定时调用慢路径”比“永远快速但偶尔错得离谱”更可靠。

## 从模型到工具

一个可交付的代理模型，除了权重文件，还应包含：

- 输入范围与单位说明；
- 训练数据的采样方法和仿真版本；
- 预处理与后处理代码；
- 评估报告与已知失效案例；
- 版本号和重新训练脚本。

否则几个月后，没人能判断这个模型还能不能用。

## 适合与不适合的场景

**适合**：参数扫描、优化内环、实时预览、敏感性分析、数字孪生的快速推演。

**不适合**：外推预测、极端工况、训练数据不足、物理约束完全未知的问题。

如果能把物理约束（守恒律、单调性、边界条件）加入模型，泛化能力通常会明显提升。纯数据驱动的代理模型，永远只是仿真器的一个近似，而不是替代品。
