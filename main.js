/* Variables for DOM elements */
const togglerSwitch = document.querySelector(".toggle-switch");
const togglerSlider = document.querySelector(".toggle-slider");
const calculatorScreen = document.querySelector(".calculator-screen");
const btnReset = document.querySelector(".btn-reset");
const divResult = document.querySelector(".div-result");
const divDisplay = document.querySelector(".div-display");
const calculatorButtons = document.querySelector(".calculator-buttons");

// Default setting of the theme toggler (light theme)
togglerSlider.checked = false;

// Add listener to handle button click on the parent. Use event delegation to handle the click
calculatorButtons.addEventListener("click", handleButtonClick);

// Add listener to handle theme toggle on the slider
togglerSlider.addEventListener('click', handleTooggle);


let currentResultValue = "",
    expression = "",
    currentOperand = "";

let currChar = "", prevChar = "";

setDivResultOpacity("0.5");
setDisplayText("");
setResultText("0");

function handleButtonClick(e) {
    // The target of click.
    const clickTarget = e.target;

    // The classlist of the target
    const targetClassList = clickTarget.classList;

    // Check if the target was one of the button
    if (targetClassList.contains("btn")) {
        
        // Get the text of button
        const btnText = clickTarget.textContent;

    
        // Check if the button was an operator
            // Yes => Check if the button was = or any other math operator.
        if (targetClassList.contains("btn-op")) {
            prevChar = currChar;
            currChar = btnText;


            // 1) if the button is "="
                // 1.1) Equal was pressed without an expression that is currentValue = 0
                // 1.2) Equal pressed after an operand
                // 1.3) Equal pressed after a period

            if (btnText === "=") {
                // Add the final expression to divDisplay.textContent
                // set currentValue = "0", and final evaluated result to the final answer.
                if (validExpression()) {
                    currentOperand = "";
                    currChar = "";
                    prevChar = "";
                    console.log(currentResultValue);
                    setResultText(eval(currentResultValue));

                    setDivResultOpacity("1");

                    setExpression(currentResultValue + " = ");
                    setDisplayText(expression);
                }  
            }
            else {

                // Check if there is the result of a previous expression
                    // Can do this by checking the divDisplay.textContent === ""
                    // Yes => then set currentValue as previous answer
                // Check if an operand was the first character to be pressed
                if(checkPreviousExpression()) {
                    prevChar = "";
                    updateCurrentResult(divResult.textContent);
                }

                if(operatorIsFirstCharacter()) {
                    prevChar = "0";
                    updateCurrentResult("0");
                }
                
                // Check if the last character was an operator in currentValue.
                    // Yes => replace with this operator 
                checkIfLastCharIsOperator();

                setDivResultOpacity("1");

                updateCurrentResult(currentResultValue + ` ${btnText} `);
                setResultText(currentResultValue);
                currentOperand = "";
            }
        }

        // Check if the button was an operand (number or period)
        else if (targetClassList.contains("btn-num")) {
            prevChar = currChar;
            currChar = btnText;
            
            checkPreviousExpression();

            setDivResultOpacity("1");

            // Check if the button is a period
            if (btnText === ".") {
                // Check if the period has already been clicked
                if (!periodInOperand()) {
                    updateCurrentResult(currentResultValue + btnText);
                    currentOperand += btnText;
                }
            }

            // Check if the button is other operands
            else {
                if(btnText !== '0') {
                    if(currentOperand === "0") {
                        currentOperand = btnText;
                        updateCurrentResult(currentResultValue.slice(0, currentResultValue.length-1));
                    }
                    else {
                        currentOperand += btnText;
                    }
                    updateCurrentResult(currentResultValue + btnText);
                }
                else {
                    if(currentOperand !== "0") {
                        updateCurrentResult(currentResultValue + btnText);
                        currentOperand += btnText;

                    }
                }
            } 
            setResultText(currentResultValue);
        }
        else if (targetClassList.contains("btn-reset")) {
            clearDisplay();
            clearExpression();
            clearResult();
            clearCurrentResultValue();
            setResultText("0");
            setDivResultOpacity(".5");
            currentOperand = "";
            currChar = "";
            prevChar = "";
        }

        else if(targetClassList.contains("btn-del")) {
            deletePrevChar();
        }
    }
}


function setDisplayText(text) {
    divDisplay.textContent = text;
}

function setResultText(text) {
    divResult.textContent = text;
}

function clearDisplay() {
    divDisplay.textContent = "";
}

function clearExpression() {
    expression = "";
}

function clearResult() {
    divResult.textContent = "";
}

function clearCurrentResultValue() {
    currentResultValue = "";
}

function setExpression(exp) {
    expression = exp;
}

function updateCurrentResult(text) {
    currentResultValue = text;

}

function periodInOperand() {
    if (currentOperand.indexOf(".") !== -1) {
        return true;
    }
    return false;
}

function validExpression() {
    console.log()
    if(prevChar === "" && currentResultValue === "") {
        updateCurrentResult("0");
    }
    const char = currentResultValue[currentResultValue.length-2];
    console.log(char);
    if(char === "*" || char === "+" || char === "-" || char === "/") {
        updateCurrentResult(currentResultValue + "0");
    }
    else if(prevChar === ".") {
        updateCurrentResult(currentResultValue.slice(0, currentResultValue.length - 1));
    }
    
    return true;
}

function setDivResultOpacity(opacity) {
    divResult.style.opacity = opacity;
}

function checkPreviousExpression() {
    if(divDisplay.textContent !=="" && divDisplay.textContent !== null) {
        clearDisplay();
        setExpression("");
        clearCurrentResultValue();
        return true;
        
    } 
    return false;
}

function operatorIsFirstCharacter() {
    if(divResult.textContent === "0" && prevChar === "" && currentOperand === "") {
        return true;
    }
}

function checkIfLastCharIsOperator() {
    if(prevChar === "+" || prevChar === "-" || prevChar === "/"  || prevChar ==="*") {
        updateCurrentResult(currentResultValue.slice(0, currentResultValue.length-3));
    }
}

function deletePrevChar() {
    if(currentOperand!=="") {
        currentOperand = currentOperand.slice(0, currentOperand.length-1);
        
        updateCurrentResult(currentResultValue.slice(0, currentResultValue.length-1));
        console.log(currentResultValue, currentOperand);
        if(currentOperand === "") {
            currentOperand = "0"
            currentResultValue+= "0";
        }
        setResultText(currentResultValue);
    }
}


function handleTooggle(e) {
    if(togglerSlider.checked === false) {
        togglerSlider.checked = true;
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
    else {
        togglerSlider.checked = false;
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
}