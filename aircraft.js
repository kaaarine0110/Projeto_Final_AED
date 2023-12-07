let myCanvas = document.getElementById("my-canvas");
let canvasContext = myCanvas.getContext("2d");
let displayLandings = document.getElementById("landings");
let displayFallen = document.getElementById("accidenteds");
canvasContext.font = "bold 13px sans-serif";

myCanvas.tenthPart = myCanvas.width * 0.1;
myCanvas.controladorArea = myCanvas.width - 100;
let listaControladorArea = [];


const imgAircraft = new Image();
imgAircraft.src = './aviao.png';

const controllerState = {
    landedPlanes: 0,
    fallenPlanes: 0,
    runningTime: 0
};

//classe do aviao
class Aircraft {
    static counter = 0;
    //propriedades do aviao
    constructor(fuel_amount,x_pos, y_pos, planeId){
        this.id = planeId;
        this.fuel = fuel_amount;
        this.x = x_pos;
        this.y = y_pos;
        this.width = 60;
        this.height = 50;
        this.distance = 0; 
        this.hidden = false;
        this.incontroladorArea = false;
        this.image = imgAircraft;
    };

    //movimentação no x
    movimentacao() {
        this.x += (11 - this.fuel) * 2;
        this.distance += (11 - this.fuel) * 2;
    };

    // diminui o combustível
    diminuiCombustivel() {
    if (this.distance >= myCanvas.tenthPart) {
      this.distance = 0;
      if (this.fuel <= 3) {
        this.fuel -= 0.2;
        } else {
        this.fuel--;
        };
     };
    };
    // posição do avião relativo ao canvas em porcentagem
    relativePosition() {
        return Math.floor(this.x * 100 / myCanvas.width);   
    };
};

//array de avioes
let Avioes = []; 

function  randomIntFromInterval(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function arrivingPlanes(){
    const randomNumber = randomIntFromInterval(0, 3);
    //criei um for para lançar uma remessa de avioes
    for (let i = randomNumber; i >= 0; i--){
        let fuel =  randomIntFromInterval(3, 10);
        let x_axis = randomIntFromInterval(0, myCanvas.width * 0.5);
        let y_axis = randomIntFromInterval(0, myCanvas.height - 50);
        const id = Aircraft.counter++;


        //declarando um obejto
        let oAircraft = new Aircraft(fuel, x_axis, y_axis, id);
        Avioes[Avioes.length] = oAircraft;
        };
};

function ControladorInicia(){
    canvasContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
    //desenha todos os avioes
    for (let i = 0; i < Avioes.length; i++) {
        let umAviao = Avioes[i];

        if(!umAviao.hidden){
            //aviao pousado
            if(umAviao.x >= myCanvas.width && umAviao.fuel > 0){
                umAviao.hidden = true;
                umAviao.fuel = 10;
                displayLandings.innerText = ++controllerState.landedPlanes;
            //avioes acidentados    
            }else if (umAviao.x < myCanvas.width && umAviao.fuel <= 0) {
                umAviao.hidden = true;
                umAviao.fuel = 10;
                displayDamageds.innerText = ++controllerState.fallenPlanes;
            }else {
                 //avioes chegando
                if(umAviao.x >= myCanvas.controladorArea){
                    if(!umAviao.inControladorArea){
                        umAviao.inControladorArea = true;
                        listaControladorArea[listaControladorArea.length] = umAviao;
                    };
                    // dá prioridade ao avião com menos combustível na 'controlArea'
                    listaControladorArea.sort((a, b) => a.fuel - b.fuel);
                    const priorityAvioes = listaControladorArea[0];
                    Avioes[priorityAvioes.id].movimentacao();
                    Avioes[priorityAvioes.id].diminuiCombustivel();
                };
                //move o aviao e calcula o combustivel
                umAviao.movimentacao();
                umAviao.diminuiCombustivel();

                //desenho no canvas
                canvasContext.drawImage(umAviao.image, umAviao.x, umAviao.y, umAviao.width, umAviao.height);
                canvasContext.fillText(umAviao.fuel.toFixed(2), umAviao.x + 25, umAviao.y + 10);
            };
        
        };

    };
    //ciclo de chegada dos avioes no canvas
    controllerState.runningTime += 100;
    if (controllerState.runningTime % 2500 === 0){
        arrivingPlanes();
    };
    setTimeout(ControladorInicia, 100); 
};
ControladorInicia();
