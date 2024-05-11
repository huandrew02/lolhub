
//GET ELEMENTS FROM DOM
const imgs = document.getElementById('imgs');
const leftbtn = document.getElementById('left');
const rightbtn = document.getElementById('right');
const playpausebtn = document.getElementById('playPause');
const carasoulsection =document.querySelector('.latest-champ-carousel');
const img= document.querySelectorAll('#imgs .champ-img');
// set up inital place,interval,flag for if the carousel is playing
let idx = 0;
let interval = setInterval(run, 3000)
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
    let imageURL =img[idx].src;
    console.log("url('"+imageURL.substring(21)+"')");
    carasoulsection.style.backgroundImage="linear-gradient( rgba(15, 15, 15, 0.747), rgba(115, 115, 115, 0.49)), url('.."+imageURL.substring(21)+"')";

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