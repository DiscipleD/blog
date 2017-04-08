> 原文链接：[A step-by-step guide to building a simple chess AI](https://medium.freecodecamp.com/simple-chess-ai-step-by-step-1d55a9266977)

我们先来了解一下，在我们创建一个简单的国际象棋 AI 过程中所会接触到的一些基本概念：

* 棋子的移动
* 绘制棋盘
* Minimax（极小化极大算法）
* Alpha-beta 剪枝

我们将一步一步将这些加入最终的算法中，并分别展示它们对算法所产生的影响。

你可以在 Github 上查看[最终版本](https://github.com/lhartikk/simple-chess-ai)。

> 译者试了下最终版本，一不小心就被吊打了...😂

## 第一步：棋子的移动和绘制棋盘
这里我们使用 [chess.js](https://github.com/jhlywa/chess.js) 和 [chessboard.js](https://github.com/oakmac/chessboardjs/) 分别来控制棋子的移动和绘制棋盘。chess.js 库实现了所有棋子的移动规则，基于此我们可以根据棋局状态得到棋子所有可能的移动。

![根据输入的棋盘状态生成所有可能的棋子移动](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/possible-moves-according-input.png)

有了以上两个类库，我们就能将精力放在最有趣的事上——创建一个能够找到最佳移动的 AI。

接下来就开始创建这样一个 AI，我们先创建一个方法，它会在所有合法的移动中随机选取一个。

```JavaScript
var calculateBestMove =function(game) {
    //generate all the moves for a given position
    var newGameMoves = game.ugly_moves();
    return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
};
```

尽管，这个 AI 像一个刚懂规则的新手，但是，我们已经可以和它下棋了，这是一个好的开始。

![随机移动，[点击试玩](https://jsfiddle.net/lhartikk/m14epfwb/4)](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/play-with-random-moves.gif)

## 第二步：棋盘状态评估
现在，我们试着计算在棋局某一状态下哪边更具优势，最简单的方法就是根据下表来统计棋局剩余棋子权重。

![棋子对应权重表](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/chess-position-table.png)

根据这个方法，我们就能让我们的 AI 选择在棋局某一状态下使棋局权重最高的移动了。

```JavaScript
var calculateBestMove = function (game) {

    var newGameMoves = game.ugly_moves();
    var bestMove = null;
    //use any negative large number
    var bestValue = -9999;

    for (var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i];
        game.ugly_move(newGameMove);

        //take the negative as AI plays as black
        var boardValue = -evaluateBoard(game.board())
        game.undo();
        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = newGameMove
        }
    }

    return bestMove;

};
```

加入了计算权重后，我们的 AI 就会尽可能地去吃对方的棋子。

![尽可能地吃子，[点击试玩](https://jsfiddle.net/lhartikk/m5q6fgtb/1/)](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/play-with-simple-evaluation.gif)

## 第三步：使用极小化极大算法来探索树
下一步，我们使用 [极小化极大算法(Minimax)](https://en.wikipedia.org/wiki/Minimax) 来使我们的 AI 能从探索树中选出最优移动。

首先，我们先根据给定深度递归构建棋子所有可能移动的树，并用上一节的方法来计算所有子节点的权重

然后，依据不同的行棋颜色，父节点取子节点的最大或最小值，若白子则取子节点的最大值返回给父节点，反之返回最小值。

![深度为 2 的情况下，极小化极大算法图解](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/minimax-algorithm.jpeg)

```JavaScript
var minimax = function (depth, game, isMaximisingPlayer) {
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }
    var newGameMoves = game.ugly_moves();
    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
            game.undo();
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
            game.undo();
        }
        return bestMove;
    }
};
```

加入了极小化极大算法之后，我们的 AI 已经不再是任人宰割了。

![加入了极小化极大算法，[点击试玩](https://jsfiddle.net/lhartikk/m5q6fgtb/1/)](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/play-with-minimax.gif)

极小化极大算法很大程度上取决于我们能够探索深度，下一步我们就来优化它。

## 第四步：Alpha-beta 剪枝
[Alpha-beta 剪枝](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) 是对极小化极大算法的一种优化，用于减少搜索树中需要探索的节点数。这样在同样的资源条件下，就增加了探索树的搜索深度。

当探索路径的结果比之前探索的更糟时，Alpha-beta 剪枝就不再搜索该子树。它并不影响极小化极大算法的计算结果，而是加快极小化极大算法运算速度。无论何种情况，Alpha-beta 剪枝总是能优化计算效率，即使，我们最初探索的就是最优解。

![alpha-beta 剪枝用于极小化极大算法](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/alpha-beta-pruning.jpeg)

如下图所示，通过 alpha-beta 剪枝，我们能显著减少极小化极大算法的计算次数。

![深度为 4 时，使用或不使用 alpha-beta 剪枝时的计算次数](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/using-alpha-beta-or-not.png)

```JavaScript
var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        return -evaluateBoard(game.board());
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};
```

## 第五步：升级计算权重方法
最初计算权重的方法相当简单就是通过计算棋盘上棋子所对应的权重，单凭这一点无法判断棋的局势。为了改善这一点，我们需要将棋子在棋盘中的位置因素计算在内。比如，骑士在棋盘中间就比在棋盘边缘位置更优，这样它可以有更多的选择。

这里我们在 chess-programming-wiki 所提供的表格的基础上稍作修改已适应我们的程序。

![棋子位置所对应的权重表](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/location-of-the-piece.png)

这样我们的 AI 就已经像模像样了，至少从业余玩家的角度来说。

![优化后，[点击试玩](https://jsfiddle.net/lhartikk/m5q6fgtb/1/)](https://raw.githubusercontent.com/DiscipleD/image-storage/master/blog/simple-chess-ai-step-by-step/play-with-evaluation-improved.gif)

## 结语
总的来说，我们所创造的这个简单的 AI 不会犯一些愚蠢的错误，但依旧缺乏大局观。

通过以上我介绍的方法，已经能够使我们的 AI 进行基本的对战。最终 AI 部分的代码（不包括移动棋子）不足 200 行，这意味着它实现来非常简单。你可以在 Github 上查看[最终版本](https://github.com/lhartikk/simple-chess-ai)。

我们还可以继续优化我们的 AI，比如：

* [落子排序，在 alpha-beta 剪枝的过程中，将可能的最优解先进行探测，从而减少计算量](https://chessprogramming.wikispaces.com/Move+Ordering)
* [加快遍历所有落子可能的计算](https://chessprogramming.wikispaces.com/Move+Generation)
* [胜负判定](https://chessprogramming.wikispaces.com/Endgame)

如果你对此感兴趣，你可以到 [chess programming wiki](https://chessprogramming.wikispaces.com/) 中发现更多内容。

感谢阅读。
