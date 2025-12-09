

import { SVG } from "https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js/+esm";
import {josProblem} from "./josephus_problem.js";
const stopGoButtonId = "go_stop"


document.getElementById(stopGoButtonId).onclick = start_animation;
const draw = SVG().addTo('#drawing')
let run = false;



async function start_animation() {
    //not pure because document control is needed
    //not pure as stopGoButtonId is needed to prevent code duplication and stopGoButtonID cannot be passed in as a parameter since it is saved in the script and thus not provided by the calling HTML button
    function go_stop(){
        run = !run;
        if (run === false){
            document.getElementById(stopGoButtonId).innerText = "re_start"
        }
        else {
            document.getElementById(stopGoButtonId).innerText = "stop"
        }
    }
    console.log("start")

    document.getElementById("go_stop").onclick = go_stop;
    go_stop()



    function createElements(xOffset, yOffset) {
        function createElement(nr, x, y) {
            return {nr: nr, x: x, y: y}
        }
        const elements = []
        for (let i = 0; i < n; i++) {
            let radians = (2 * Math.PI / n) * i - Math.PI / 2
            const x = circle_radius * Math.cos(radians)
            const y = circle_radius * Math.sin(radians)
            console.log(i, x, y)
            elements[elements.length] = createElement(i + 1, x + xOffset, y + yOffset);
        }
        return elements
    }

    function drawElement(draw, nr, x, y, radius) {
        //not pure as a foreign method is called. Why: The drawing is done by a library instead of by an own method for simplicity
        draw.circle(radius * 2).fill('#f000006').center(x, y)
        draw.text("" + nr).font({fill: '#a0a0a0'}).center(x, y)
    }

    function drawElements(draw, elements, radius, drawElementFn) {
        for (let elem of elements) {
            drawElementFn(draw, elem.nr, elem.x, elem.y, radius)
        }
    }

    function crossOffElement(draw, element, length, width) {
        //not pure as a foreign method is called. Why: The drawing is done by a library instead of by an own method for simplicity
        draw.rect(length, width).font({fill: '#f06'}).center(element.x, element.y).rotate(45);
        draw.rect(length, width).font({fill: '#f06'}).center(element.x, element.y).rotate(-45);
    }

    function highlightElement(draw, element, length, width) {

    }
    console.log("setup")
    const n = document.getElementById('element_count').value;
    const step_size = document.getElementById('step_size').value;
    draw.clear()


    const circle_radius = 400.0
    const element_radius = circle_radius / n
    const elementXOffset = 500
    const elementYOffset = 500

    const crossOfLength = element_radius * 4
    const crossOfWidth = element_radius / 3

    function createDrawnElement(draw, createDrawnElementFn, createDrawnTextFn, highlightElemFn) {
        const element = createDrawnElementFn()
        const text =  createDrawnTextFn()
        return {
            highlight: function(duration){
                highlightElemFn(element)
            }
        }
    }


    const elements = createElements(elementXOffset, elementYOffset)
    drawElements(draw, elements, element_radius, drawElement)
    // use of josProblem functions not pure, but necessary here
    const jos = josProblem(Number(n), Number(step_size))
    console.log("josProblem")
    while (jos.hasNext()) {
        await new Promise(r => setTimeout(r, 1000));
        if (run){
            const elementToCrossOf =  elements[jos.next().removed - 1]

            crossOffElement(draw,elementToCrossOf, crossOfLength, crossOfWidth)
        }
    }
}

