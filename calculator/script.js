const currentDisplay = document.getElementById('current-display');
const previousDisplay = document.getElementById('previous-display');
const buttons = document.querySelectorAll('.btn');
const powerSwitch = document.getElementById('power-switch');
const calculator = document.querySelector('.calculator');
const catSvg = document.getElementById('cat-svg');

let expression = '';
let justCalculated = false;
let powerOn = false;

// 初始化计算器为关闭状态
calculator.classList.add('off');
catSvg.style.animationPlayState = 'paused';

powerSwitch.addEventListener('click', () => {
    powerOn = !powerOn;
    powerSwitch.classList.toggle('on');
    powerSwitch.classList.toggle('off');
    calculator.classList.toggle('off');

    if (!powerOn) {
        expression = '';
        previousDisplay.textContent = '';
        updateCurrentDisplay('0');
        catSvg.style.animationPlayState = 'paused';
    }
});

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (!powerOn) return;

        const value = button.dataset.value;

        if (value === 'AC') {
            expression = '';
            previousDisplay.textContent = '';
            updateCurrentDisplay('0');
            justCalculated = false;
        } else if (value === 'DE') {
            if (justCalculated) return;
            expression = expression.toString().slice(0, -1);
            updateCurrentDisplay(expression || '0');
        } else if (value === '=') {
            if (expression === '' || justCalculated) return;
            try {
                const result = eval(expression);
                previousDisplay.textContent = `${expression}=`;
                updateCurrentDisplay(result);
                expression = result.toString();
                justCalculated = true;
            } catch (error) {
                updateCurrentDisplay('Error');
                expression = '';
                justCalculated = false;
            }
        } else {
            if (justCalculated) {
                if (['+', '-', '*', '/'].includes(value)) {
                    previousDisplay.textContent = `${expression}${value}`;
                } else {
                    previousDisplay.textContent = '';
                    expression = '';
                }
                justCalculated = false;
            }
            
            if (currentDisplay.textContent === '0' && value !== '.') {
                 expression = '';
            }
            if (currentDisplay.textContent === 'Error') {
                expression = '';
            }
            
            expression += value;
            updateCurrentDisplay(expression);
        }
    });
});

function updateCurrentDisplay(value) {
    currentDisplay.textContent = value;
    updateCatSpeed(value);
}

function updateCatSpeed(value) {
    if (!powerOn) {
        catSvg.style.animationPlayState = 'paused';
        return;
    }

    const num = parseFloat(value);
    if (isNaN(num) || num === 0) {
        catSvg.style.animationPlayState = 'paused';
    } else {
        catSvg.style.animationPlayState = 'running';
        // 数字越大，动画持续时间越短，跑得越快
        // 将速度限制在合理范围内
        const speed = Math.max(0.1, 1 - Math.log10(Math.abs(num) + 1) * 0.2);
        catSvg.style.animationDuration = `${speed}s`;
    }
}
