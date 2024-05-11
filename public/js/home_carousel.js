
//GET ELEMENTS FROM DOM
const imgs = document.getElementById('imgs');
const leftbtn = document.getElementById('left');
const rightbtn = document.getElementById('right');
const playpausebtn = document.getElementById('playPause');

const img = document.querySelectorAll('#imgs .champ-profile');

// set up inital place,interval,flag for if the carousel is playing
let idx = 0;
let interval = setInterval(run, 2000)
let isPlaying = true;

function run(){
    idx++;
    changeImage();
}// changes images each ACTIVE  interval


function changeImage(){
    if (idx>img.length-1){
        idx =0;
    }else if (idx<0){
        idx = img.length-1;
    }
    imgs.style.transform=`translateX(${-idx*60}vw)`;
}// change image

function resetInterval(){
    clearInterval(interval);
    interval = setInterval(run, 2000);
}//reset

playpausebtn.addEventListener('click',()=>{
    if (isPlaying){
        playpausebtn.textContent="| |";
        clearInterval(interval);
        isPlaying=false;
    }else{
        playpausebtn.textContent='\u25ba';
        interval=setInterval(run,2000);
        isPlaying=true;
    }
})// handles the play and pause feature of the carousel

rightbtn.addEventListener('click',()=>{
    idx++;
    changeImage();
    if (isPlaying){
        resetInterval();
    }//handles if the carousel can self move or not
    
})// moves carousel to the next image
leftbtn.addEventListener('click',()=>{
    idx--;
    changeImage();
    if (isPlaying){
        resetInterval();
    }//handles if the carousel can self move or not

})// moves carousel to the previous image

/*done by: Camille C.Y. */