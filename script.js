const rangeSlider= document.getElementById("myRange");

const dataBox = document.getElementById('DataBox');

const speedSlider = document.getElementById('sortSpeed');

let barArray = [];

let terminateSort = false;

const setArray = () => {
    let index = rangeSlider.value;
    barArray = [];
    for(let i=0; i < index; i++) {
        barArray[i] = [i, `<div class='dataBar' style='width: ${100/index + 1}%; border: black 0.2px solid; font-size: ${10/index}rem;'> <div  style='flex: ${1- (i+1)/index}'></div> <div class='insideDataBox' style='flex: ${(i+1)/index}'>${1+i}</div> </div>`]
    }
    barArray = shuffleArray(barArray);
    dataBox.innerHTML = "";
    for(let i=0; i < index; i++) {
        dataBox.innerHTML += barArray[i][1];
    }
}

const shuffleArray = (array) => {
    return array.sort( ()=>Math.random()-0.5 );
}

let speed;

const setSpeed = () => {
    speed = speedSlider.value;
}

window.onload = async () => {
    await setArray();
    setSpeed();
}

rangeSlider.oninput = async () => {
    await setArray();
    changeButtonStatus(0);
};

speedSlider.oninput = () => {
    setSpeed();
}

const displaySortedBar = () => {
    dataBox.innerHTML = "";
    for(let i=0; i < rangeSlider.value; i++) {
        dataBox.innerHTML += barArray[i][1];
    }
}

const setColor = async (element, color) => {
    let setElement = barArray[element];
    setElement[1] = `<div class='dataBar' style='width: ${100/rangeSlider.value+ 1}%; border: black 0.2px solid; font-size: ${10/rangeSlider.value}rem;'> <div  style='flex: ${1- (element+1)/rangeSlider.value}'></div> <div class='insideDataBox' style='flex: ${(element+1)/rangeSlider.value}; background: ${color}'>${1+element}</div> </div>`;
}

let halt = false;

let haltButton = document.getElementById('haltButton');
let resetButton = document.getElementById('resetButton');

haltButton.disabled = true;

let tempHalt = false;

const sleep = async (milliseconds) => {
    if(tempHalt){
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    if(halt){
        let currentTime = 0;
        tempHalt = true;
        while (currentTime !== 1000000){
            await sleep(100);
            if(halt===false){
                break;
            }
            currentTime ++;
        }
        return new Promise(resolve => setTimeout(resolve, speed));
    }
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


const haltSort = async () => {
    if(halt === true){
        halt = false;
        tempHalt = false;
        haltButton.innerText = "Halt";
    }
    else{
        halt = true;
        haltButton.innerText = "Resume";
    }
}

const resetSort = async () => {
    terminateSort = true;
    speed = 0;
    setArray();
    await sleep(100);
    setSpeed();
    terminateSort = false;
    changeButtonStatus(0);
}

async function BubbleSort(array) {
    changeButtonStatus(1);
    try{
        let arrayLength = array.length;
        let temp;
        for(let i=0; i < arrayLength; i++) {
            for (let j = 1; j < (arrayLength - i); j++) {
                if (array[j - 1][0] > array[j][0]) {
                    temp = array[j - 1];
                    array[j - 1] = array[j];
                    array[j] = temp;

                    if(terminateSort){
                        changeButtonStatus(0);
                        return;
                    }
                    await sleep(speed / 10);
                    displaySortedBar();
                }
            }
            if(terminateSort){
                return;
            }
            await sleep(speed / 10);
            await setColor(arrayLength - i - 1, "green");
            displaySortedBar();
        }
    }
    catch (error){
        console.log("Bubble Sort terminated");
        changeButtonStatus(0);
        return;
    }
    changeButtonStatus(0);
}


async function InsertionSort(array) {
    changeButtonStatus(1);
    try {
        let arrayLength = array.length;
        let compareElement, j;
        for (let i = 1; i < arrayLength; i++) {
            compareElement = array[i];
            for (j = i; j > 0; j--) {
                if (array[j - 1][0] < compareElement[0]) {
                    break;
                }
                array[j] = array[j - 1];
                if(terminateSort){
                    return;
                }
                await sleep(speed);
                displaySortedBar();
            }
            array[j] = compareElement
            if(terminateSort){
                changeButtonStatus(0);
                return;
            }
            await sleep(speed);
            displaySortedBar();
        }
    }
    catch (error){
        console.log("Insertion Sort terminated");
        changeButtonStatus(0);
        return;
    }
    changeButtonStatus(0);
}

async function SelectionSort(array){
    changeButtonStatus(1);
    try {
        let arrayLength = array.length;
        let compareElement, minValue, minPosition;
        for (let i = 0; i < arrayLength; i++) {
            compareElement = array[i];
            minValue = compareElement[0];
            minPosition = i;
            for (let j = i + 1; j < arrayLength; j++) {
                if (array[j][0] < minValue) {
                    minPosition = j;
                    minValue = array[j][0];
                    displaySortedBar();
                    if(terminateSort){
                        changeButtonStatus(0);
                        return;
                    }
                    await sleep(speed);
                }
            }
            array[i] = array[minPosition];
            array[minPosition] = compareElement;
            await setColor(i, "green");
            // await setColor(minPosition, "yellow");
            if(terminateSort){
                changeButtonStatus(0);
                return;
            }
            await sleep(speed);
            displaySortedBar();
        }
    }
    catch (error) {
        console.log("Selection Sort terminated");
        changeButtonStatus(0);
        return;
    }
    changeButtonStatus(0);
}

async function QuickSort(array, low, high){
    if (low === 1 && high === array.length - 1) {
        changeButtonStatus(1);
    }
    let pivotElement = array[low - 1],
        upperLimit = high,
        lowerLimit = low,
        temp;

    displaySortedBar();
    if(terminateSort){
        changeButtonStatus(0);
        return;
    }
    await sleep(speed);

    try {
        if ((high - low) === 0) {
            if (array[low][0] < pivotElement[0]) {
                array[low - 1] = array[low];
                array[low] = pivotElement;
            }
            return;
        }

        while (low <= high) {
            while (array[low][0] < pivotElement[0]) {
                low++;
                if (!(low < high)) {
                    break;
                }
            }
            while (array[high][0] > pivotElement[0]) {
                high--;
                if (!(low < high)) {
                    break;
                }
            }
            if (!(low <= high)) {
                break;
            }

            temp = array[low];
            array[low] = array[high];
            array[high] = temp;

            if(terminateSort){
                return;
            }
            await sleep(speed);
            displaySortedBar();
        }

        temp = array[high];
        array[high] = pivotElement;
        array[lowerLimit - 1] = temp;

        if(terminateSort){
            changeButtonStatus(0);
            return;
        }
        await sleep(speed);
        displaySortedBar();


        if (lowerLimit !== high && high - lowerLimit >= 1) {
            await QuickSort(array, lowerLimit, high - 1);
        }

        if (upperLimit !== high && upperLimit - high > 1) {
            await QuickSort(array, high + 2, upperLimit);
        }

        if(terminateSort){
            changeButtonStatus(0);
            return;
        }
        await sleep(speed);
        displaySortedBar();
    }
    catch (error) {
        console.log("Quick Sort terminated");
        changeButtonStatus(0);
        return;
    }
    if(upperLimit === array.length - 1 && lowerLimit === 1){
        changeButtonStatus(0);
    }

}

let DummyArray;

const merge = async (array, low, mid, high) => {
    DummyArray = [];
    let i = low, j = mid + 1, k = 0;
    while(i <= mid && j <= high){
        if(array[j][0] > array[i][0]){
            DummyArray[k] = array[i];
            i++;
        }
        else{
            DummyArray[k] = array[j];
            j++;
        }
        k++;
    }
    while(i <= mid){
        DummyArray[k++] = array[i++];
    }
    while(j <= high){
        DummyArray[k++] = array[j++];
    }
    for(i = low, j = 0; i <= high; i++, j++) {
        array[i] = DummyArray[j];

        if(terminateSort){
            changeButtonStatus(0);
            return;
        }
        await sleep(speed);
        displaySortedBar();
    }
}

async function MergeSort(array, low, high) {
    if(low === 0 && high === array.length - 1){
        changeButtonStatus(1);
    }
    let mid;
    if(low < high){
        try {
            mid = Math.floor((low + high) / 2);
            await MergeSort(array, low, mid);
            await MergeSort(array, mid + 1, high);
            await merge(array, low, mid, high);

            if(terminateSort){
                changeButtonStatus(0);
                return;
            }
            await sleep(speed);
            displaySortedBar();
        }
        catch (error) {
            console.log("Merge Sort terminated");
            changeButtonStatus(0);
            return;
        }
    }
    if(low === 0 && high === array.length - 1){
        changeButtonStatus(0);
    }
}

async function ShellSort(array){
    changeButtonStatus(1);
    let arrayLength = array.length,
        temp;
    try {
        for (let gap = Math.floor(arrayLength / 2); gap >= 1; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < arrayLength; i++) {
                temp = array[i];
                let j;
                for (j = i; j - gap >= 0 && array[j - gap][0] > temp[0]; j = j - gap) {
                    array[j] = array[j - gap];
                }
                array[j] = temp;

                if(terminateSort){
                    changeButtonStatus(0);
                    return;
                }
                await sleep(speed);
                displaySortedBar();
            }
        }
    }
    catch (error) {
        console.log("Shell Sort terminated");
        changeButtonStatus(0);
        return;
    }
    changeButtonStatus(0);
}

async function CountingSort(array) {
    console.log(array);
    let arrayLength = array.length;
    let max = array[0];
    let sortedArray = [],
        countingArray = [];
    for(let i = 1; i < arrayLength; i++){
        if(array[i][0] > max[0]){
            max = array[i];
        }
    }

    for(let i = 0; i <= max[0] ; i++){
        countingArray[i] = 0;
    }
    for(let i = 0; i < arrayLength ; i++){
        countingArray[array[i][0]] += 1
    }
    for(let i = 1; i <= max[0] ; i++){
        countingArray[i] += countingArray[i - 1];
    }
    console.log(countingArray);

    for(let i = arrayLength - 1; i >= 0 ; i--){
        sortedArray[countingArray[array[i][0]] - 1] = array[i];
        countingArray[array[i]]--;
    }
    for(let i = 0; i < arrayLength; i++) {
        array[i] = sortedArray[i];
    }
    await sleep(100)
    displaySortedBar();
}

let buttons = document.getElementsByClassName('sortButton');

const changeButtonStatus = (status) => {
    if(status === 1){
        for (let button of buttons){
            button.disabled = true;
            speedSlider.disabled = true;
            rangeSlider.disabled = true;
            haltButton.disabled = false;
        }
    }
    else{
        for(let button of buttons){
            button.disabled = false;
            speedSlider.disabled = false;
            rangeSlider.disabled = false;
            haltButton.disabled = true;
        }
    }
}