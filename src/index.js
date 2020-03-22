function eval() {
    // Do not use eval!!!
    return;
}
let prios = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 3,
    undefined: 0,
};

function checkBrackets(tokens) {
    stack = new Stack();
    for (let i = 0; i < tokens.length; i++) {
        let c = tokens[i];
        if (c === "(" || c === ")") {
            if (c === ")") {
                let prev = stack.pop();
                if (prev !== "(") {
                    throw "ExpressionError: Brackets must be paired";
                }
                continue
            }
            stack.push(c)
        }
    }
    if (stack.size() !== 0) {
        throw "ExpressionError: Brackets must be paired";
    }
}

function expressionCalculator(expr) {
    let tokens = tokenize(expr);
    checkBrackets(tokens);

    let digitStack = new Stack();
    let signsStack = new Stack();

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (isDigit(token)) {
            digitStack.push(parseInt(token))
        } else {
            pairSign(digitStack, signsStack, token);
        }
    }

    while (signsStack.size() > 0) {
        evaluateOnStack(digitStack, signsStack);
    }
    return digitStack.pop();
}

function pairSign(digitStack, signsStack, currentSign) {
    let prevSign = signsStack.peek();
    if (prios[currentSign] > prios[prevSign] || currentSign === "(" || prevSign === "(") {
        signsStack.push(currentSign);
        return
    } else if (currentSign === ")") {
        while (signsStack.peek() !== "(") {
            evaluateOnStack(digitStack, signsStack);
        }
        signsStack.pop();
    } else {
        evaluateOnStack(digitStack, signsStack);
        pairSign(digitStack, signsStack, currentSign);
    }
}

function evaluateOnStack(digitStack, signsStack) {
    let rightOp = digitStack.pop();
    let leftOp = digitStack.pop();
    let operator = signsStack.pop();
    let result = calcBinary(leftOp, rightOp, operator);
    console.log("left", leftOp, "right", rightOp, "operator", operator, "result", result);
    digitStack.push(result);
}

function calcBinary(left, right, op) {
    switch (op) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            if (right === 0) {
                throw "TypeError: Division by zero."
            }
            return left / right;
        default:
            throw "Unknown operator " + op;
    }
}

function tokenize(expr) {
    let out = [];
    for (let i = 0; i < expr.length; i++) {
        let character = expr[i];
        if (isSing(character)) {
            out.push(character)
        } else if (isDigit(character)) {
            if (out.length > 0 && isDigit(out[out.length - 1])) {
                out[out.length - 1] = out[out.length - 1] + character
            } else {
                out.push(character)
            }
        }
    }
    return out;
}

function isDigit(c) {
    return /[0-9]/.test(c)
}

function isSing(c) {
    return /[-+*/()]/.test(c)
}

var Stack = function () {
    this.storage = [];
}

// Adds a value onto the end of the stack
Stack.prototype.push = function (value) {
    this.storage.push(value);
}

// Removes and returns the value at the end of the stack
Stack.prototype.pop = function () {
    return this.storage.pop();
}

Stack.prototype.peek = function () {
    return this.storage[this.storage.length - 1];
}

// Returns the length of the stack
Stack.prototype.size = function () {
    return this.storage.length;
}

module.exports = {
    expressionCalculator
}

