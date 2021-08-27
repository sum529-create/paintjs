// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

const canvas = document.getElementById("jsCanvas");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");

// ctx -> canvas 안에서 픽셀 다루기
const ctx = canvas.getContext("2d");

const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

const INITIAL_COLOR = "#2c2c2c";

// strokeStyle -> 색상이나 스타일을 shape안에 사용할 수 있음
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
// 펜 크기
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function stopPainting() {
  painting = false;

}

function startPainting(){
  painting = true;
}

function onMouseMove(event){
  // console.log(event);
  const x = event.offsetX;
  const y = event.offsetY;
  if(!painting){
    // 선의 시작 path === line
    ctx.beginPath();
    // 마우스를 움직이는 모든순간 선을 만든다.
    ctx.moveTo(x,y);
    // path들은 만들었는데 지금 당장 사용하지는 않는 상태
  }else{
    // 전에 있던 위치에서부터 지금 위치까지 선을 만듬
    // ex) ctx.moveTo(1,2); ctx.lineTo(3,4); 1,2부터 ~3.4까지 라인이 만들어짐
    ctx.lineTo(x, y);
    // 획을 긋는다.
    ctx.stroke();
    // 절때 begin-point end-point가 아니다 이전 path를 시작점으로 잡아서 계속그리는것처럼 보일뿐
    // 위와 같이 begin-point end-point 같이 되는 것은
    // ctx.closePath(); 이전 path 위치를 사용하지 않고 처음 path위치를 사용
  }
}

function handleColorClick(event){
  const color = event.target.style.backgroundColor; // event.target: event가 전달한 객체에대한 참조
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleRangeChange(event){
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick(){
  // mode -> button
  if(filling === true){
    filling = false;
    mode.innerText = "Fill";
  }else {
    filling = true;
    mode.innerText = "Paint";
  }
}

function handleCanvasClick(){
  if(filling){
    // 사각형을 만들어서 채운다.
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

// contextMenu 금지
function handleCM(event){
  event.preventDefault(); // contextMenu는 마우스 우클릭 메뉴, preventDefault는 우클릭 메뉴 금지
}

// 사진 저장
function handleSaveClick(){
  const image = canvas.toDataURL();
  // 이곳에서의 a는 html의 a태그이다. <a href="path" download>
  const link = document.createElement("a");
  // link.href -> 이미지 링크
  link.href = image;
  // link.download -> 이미지 이름
  link.download = "PaintJs";
  link.click();
}

if(canvas) {
  // canvas부분에서 mousemove가 된다면(마우스가 움직이게 된다면)
  // onMouseMove를 출력 mousemove가 됐을 때 canvas안에서의 값들을 출력 console.log(event);
  // offsetX, offsetY 부분이 canvas안에서의 위치값, clientX|Y는 윈도우 상의 마우스 위치
  canvas.addEventListener("mousemove", onMouseMove);

  // 이제 마우스를 클릭했을 때 painting을 해줘야 함으로 그에 대한 이벤트를 만들어 준다.
  canvas.addEventListener("mousedown", startPainting);
  // 마우스를 땠을 때 
  canvas.addEventListener("mouseup", stopPainting);
  // canvas를 벗어날 때 painting false
  canvas.addEventListener("mouseleave", stopPainting);
  // full color
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleCM);
}

// Array.from -> object로부터 array를 만든다.
if(colors){
  Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));
}

// 브러쉬 사이즈
if(range){
  // 조절하는 바가 input
  range.addEventListener("input", handleRangeChange);
}

if(mode){
  mode.addEventListener("click", handleModeClick);
}

if(saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}