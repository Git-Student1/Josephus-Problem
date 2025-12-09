

import { SVG } from "https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js/+esm";
import {josProblem} from "./josephus_problem.js";
const startButtonId = "start_button"
const stopGoButtonId = "go_stop"
const resultLabelId =  "result"


document.getElementById(startButtonId).onclick = start_animation;
const draw = SVG().addTo('#drawing')
let run = false;


//-------------- THIS IS THE MAIN LOOP, AS SUCH IT IS NOT ENTIRELY PURE --------------------------
async function start_animation() {
    //not pure because document control is needed
    //not pure as stopGoButtonId is needed to prevent code duplication and stopGoButtonID cannot be passed in as a parameter since it is saved in the script and thus not provided by the calling HTML button
    function go_stop(){
        run = !run;
        if (run === false){
            document.getElementById(stopGoButtonId).innerText = "continue"
        }
        else {
            document.getElementById(stopGoButtonId).innerText = "stop"
        }
    }
    console.log("start")

    document.getElementById("go_stop").onclick = go_stop;
    go_stop()

    console.log("setup")
    const n = document.getElementById('element_count').value;
    const step_size = document.getElementById('step_size').value;
    draw.clear()


    const circle_radius = 400.0
    const element_radius = circle_radius / n
    const elementXOffset = 500
    const elementYOffset = 500

    function createDrawnElements(draw, xOffset, yOffset, radius){
        const elements = []
        for (let i = 0; i < n; i++) {
            let radians = (2 * Math.PI / n) * i - Math.PI / 2
            const x = circle_radius * Math.cos(radians)
            const y = circle_radius * Math.sin(radians)
            console.log(i, x, y)
            elements[elements.length] = createDrawnElement(draw, x + xOffset, y + yOffset,  i + 1, radius);
        }
        return elements
    }

    function createDrawnElement(draw, x,y, nr, max_radius_size) {
        function createDrawnBody(draw, x, y, radius) {
            return draw.circle(radius * 2).fill('#000006').center(x, y)
        }
        function createDrawnText(draw, x, y,nr) {
            return draw.text("" + nr).font({fill: '#a0a0a0'}).center(x, y)
        }
        const elemBody = createDrawnBody(draw, x,y, max_radius_size)
        const text =  createDrawnText(draw, x, y, nr)
        const crossOfLength = max_radius_size * 4
        const crossOfWidth = max_radius_size / 3
        return {
            highlight: function(duration){
                elemBody.animate({
                    duration: 1,
                    when: 'now',
                }).attr({ fill: '#fff000' });
                elemBody.animate({
                    duration: 1,
                    delay:duration,
                }).attr({ fill: '#000000' })
            },
            crossOff: function(){
                draw.rect(crossOfLength, crossOfWidth).font({fill: '#f06'}).center(x, y).rotate(45);
                draw.rect(crossOfLength, crossOfWidth).font({fill: '#f06'}).center(x, y).rotate(-45);
            },
            x:x,
            y:y,
            nr:nr,
        }
    }
     function animateElementRemoval(startX, startY, endX, endY, centerX, centerY, duration, size) {
        const rect = draw.rect(size, size).fill('red').center(startX, startY);
        const stringPath = `M${Math.round(startX)},${Math.round(startY)} Q${Math.round(centerX)},${Math.round(centerY)} ${Math.round(endX)},${Math.round(endY)}`
        console.log(stringPath)
        const path = draw.path(stringPath).fill('none').stroke({width: 2, color: '#888'});
        const pathLength = path.length(); // Get total length
        rect.animate(duration)
            .during(function(pos) { // pos is 0 to 1 progress
            const point = path.pointAt(pathLength * pos); // Get point at current progress
            rect.move(point.x - size/2, point.y - size/2); // Move circle (subtract half its size)
        }).ease('linear');
        path.animate(200,"<>").opacity(0).after(() => path.remove());


    }


    const drawnElements = createDrawnElements(draw, elementXOffset, elementYOffset, element_radius)
    // use of josProblem functions not pure, but necessary here
    const jos = josProblem(Number(n), Number(step_size))
    document.getElementById(resultLabelId).innerText = `${jos.calculateResult()}`
    await new Promise(r => setTimeout(r, 1000));

    while (jos.hasNext()) {
        await new Promise(r => setTimeout(r, 500));
        if (run){
            const currentElement = drawnElements[jos.nextExecutioner()-1]
            const elementToCrossOf = drawnElements[jos.next().removed - 1]
            currentElement.highlight(1000)
            animateElementRemoval(currentElement.x, currentElement.y, elementToCrossOf.x, elementToCrossOf.y, elementXOffset, elementYOffset, 500, element_radius/2)
            await new Promise(r => setTimeout(r, 500));
            elementToCrossOf.crossOff()

        }
    }
}

