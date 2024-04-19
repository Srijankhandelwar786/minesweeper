var board=[]
var rows=8;
var columns=8;
var minesCount=5;
var mineslocation=[]

var tilesClicked=0;
var flagEnabled=false;

var gameOver=false;

window.onload=function(){
    // startGame();
    // showPopUP();
    document.getElementById('easylevel').addEventListener("click",easychange);
    document.getElementById('mediumlevel').addEventListener("click",mediumchange);
    document.getElementById('hardlevel').addEventListener("click",hardchange);
}

function easychange(){
    minesCount=4;
    document.getElementById("sec-container").style.display="none";
    document.getElementById("fullbody").style.display="block";
    startGame();
}
function mediumchange(){
    minesCount=6;
    document.getElementById("sec-container").style.display="none";
    document.getElementById("fullbody").style.display="block";

    startGame();
}
function hardchange(){
    minesCount=8;
    document.getElementById("sec-container").style.display="none";
    document.getElementById("fullbody").style.display="block";

    startGame();
}
function setMines(){
   
    // mineslocation.push("0-0");
    // mineslocation.push("1-0");
    // mineslocation.push("2-0");
    // mineslocation.push("3-0");
    // mineslocation.push("4-0");
    let minesleft=minesCount;
    while(minesleft){
        let r=Math.floor(Math.random()*rows);
        let c=Math.floor(Math.random()*columns);
        let id=r.toString()+"-"+c.toString();

        if(!mineslocation.includes(id)){
            mineslocation.push(id);
            minesleft--;
        }
    }
}


function startGame(){
    document.getElementById('flag-button').addEventListener("click",setFlag);
    
    document.getElementById("mines-count").innerText=minesCount;
    setMines();

    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<columns;c++){
            let tile=document.createElement("div");
            tile.id=r.toString()+"-"+c.toString();
            tile.addEventListener("click",clickTile);
            document.getElementById("board").append(tile);
            row.push(tile)

        }
        board.push(row);
    }
    console.log(board);
}
function setFlag(){
    if(flagEnabled){
        flagEnabled=false;
        document.getElementById("flag-button").style.backgroundColor="lightgray";
    }
    else{
        flagEnabled=true;
        document.getElementById("flag-button").style.backgroundColor="darkgray";
        
    }
}
function clickTile(){
    if(gameOver || this.classList.contains("tile-clicked")){
        return;
    }
    let tile=this;
    if(flagEnabled){
        if(tile.innerText==""){
            tile.innerText="🚩";
        }
        else if(tile.innerText=="🚩"){
            tile.innerText="";
        }
        return;
    }
    if(mineslocation.includes(tile.id)){
        // alert("GAME OVER");
        gameOver=true;
        revealMines();
        GoPopup.classList.add("show");
        return;
    }

    let coords=tile.id.split("-");
    let r=parseInt(coords[0]);
    let c=parseInt(coords[1]);
    checkMine(r,c);
}

function revealMines(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile=board[r][c];
            if(mineslocation.includes(tile.id)){
                tile.innerText="💣";
                tile.style.backgroundColor="red";
              
            }
        }
    }
}


function checkMine(r,c){
    if(r<0|| r>=rows || c<0 || c>=columns){
        return ;
    }
    if(board[r][c].classList.contains("tile-clicked")){
        return;
    }
    board[r][c].classList.add("tile-clicked");
    tilesClicked+=1;
    let minesFound=0;
    //top 3
    minesFound+=checkTile(r-1,c-1);
    minesFound+=checkTile(r-1,c);
    minesFound+=checkTile(r-1,c+1);
    //left and right
    minesFound+=checkTile(r,c-1);
    minesFound+=checkTile(r,c+1);

    // bottom
    minesFound+=checkTile(r+1,c-1);
    minesFound+=checkTile(r+1,c);
    minesFound+=checkTile(r+1,c+1);

    if(minesFound>0){
        board[r][c].innerText=minesFound;
        board[r][c].classList.add("x"+minesFound.toString());

    }
    else{
        //top
        checkMine(r-1,c-1);
        checkMine(r-1,c);
        checkMine(r-1,c+1);

        //left right
        checkMine(r,c-1);
        checkMine(r,c+1);

        //bottom
        checkMine(r+1,c-1);
        checkMine(r+1,c);
        checkMine(r+1,c+1);
    }
    if(tilesClicked==rows*columns-minesCount){
        document.getElementById("mines-count").innerText="Congratulation";
        // document.getElementsByClassName("confetti").GoPopup.classList.add("show");
        winner.classList.add("show");

        gameOver=true;
    }
}
function checkTile(r,c){
    if(r<0|| r>=rows || c<0 || c>=columns){
        return 0;
    }
    if(mineslocation.includes(r.toString()+"-"+c.toString())){
        return 1;
    }
    else{
        return 0;
    }

}