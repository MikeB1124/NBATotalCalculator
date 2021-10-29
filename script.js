const button = document.querySelector("button");
let teamLogos = new Array();





function runWebsite(){
    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard', true);

    xhr.onload = function(){
        if(xhr.status == 200){
            console.log('sucess');
            let games = JSON.parse(this.response);
            console.log(games);

        
        
            for(let i = 0; i < games.events.length; i++){
                let teamOne = games.events[i].competitions[0].competitors[1].team.abbreviation;
                let teamTwo = games.events[i].competitions[0].competitors[0].team.abbreviation;
            
                
                
                const teamImageOne = document.createElement('img');
                teamImageOne.src = games.events[i].competitions[0].competitors[1].team.logo;
                const gameCardOne = document.createElement('h1');
                gameCardOne.innerHTML = teamOne;
                gameCardOne.appendChild(teamImageOne);
                let newDiv = document.createElement('div');
                newDiv.id = "game" + i;
                newDiv.classList = "game";
                document.getElementById("feed").appendChild(newDiv);
                const displayPeriod = document.createElement('h5');
                displayPeriod.innerHTML = "Q" + games.events[i].status.period + "  " + games.events[i].status.displayClock;
                newDiv.appendChild(displayPeriod);
                newDiv.appendChild(gameCardOne);

                const scoreOne = document.createElement('h1');
                scoreOne.innerHTML = games.events[i].competitions[0].competitors[1].score;
                newDiv.appendChild(scoreOne);
                

                const teamImageTwo = document.createElement('img');
                teamImageTwo.src = games.events[i].competitions[0].competitors[0].team.logo;
                const gameCardTwo = document.createElement('h1');
                gameCardTwo.innerHTML = teamTwo;
                gameCardTwo.appendChild(teamImageTwo);
                document.getElementById("feed").appendChild(newDiv);
                newDiv.appendChild(gameCardTwo);

                const scoreTwo = document.createElement('h1');
                scoreTwo.innerHTML = games.events[i].competitions[0].competitors[0].score;
                newDiv.appendChild(scoreTwo);






                let teamOneScore = parseInt(games.events[i].competitions[0].competitors[1].score);
                let teamTwoScore = parseInt(games.events[i].competitions[0].competitors[0].score);
                let period = games.events[i].status.period;
                let timeNow = games.events[i].status.clock;
                let margin = 0;
                let timePlayed = 0;
                let minLeft = 0;
                let deficit = 0;
                let perMin = 0;
                let remainProj = 0;
                let fullgameProj = 0;
                
                //Minutes played
                if(period == 1){
                    timePlayed = 12 - (timeNow/60);
                }else{
                    for(let j = 1; j < period; j++){
                        timePlayed = timePlayed + 12;
                    }
                    let curPeriod = 12 - (timeNow/60);
                    timePlayed = timePlayed + curPeriod;
                }

                //Makeing score margin positive for use
                if(teamOneScore - teamTwoScore < 0){
                    margin = (teamOneScore - teamTwoScore) * (-1);
                }else{
                    margin = teamOneScore - teamTwoScore;
                }

                //Points scored per min
                perMin = (teamOneScore + teamTwoScore) / (timePlayed);

                //taking  3 minute error in consideration 
                if(timePlayed <= 21){
                    minLeft = 47 - timePlayed;
                }else{
                    minLeft = 48 - timePlayed;
                }

                //exponential growth decreases as time left is less
                if(margin >= 0 && margin < 15){
                    if(minLeft <= 9){
                        remainProj = minLeft * (perMin * 0.9);
                    }else{
                        remainProj = minLeft * perMin;
                    }
                }else{
                    remainProj = minLeft * perMin;
                }

                //Foul game if game is close
                if(margin >= 0 && margin <= 6){
                    if(minLeft <= 4){
                        fullgameProj = teamOneScore + teamTwoScore + remainProj + 4.5;
                    }else{
                        fullgameProj = teamOneScore + teamTwoScore + remainProj;
                    }
                }else{
                    fullgameProj = teamOneScore + teamTwoScore + remainProj; 
                }
                
                fullgameProj = Math.round(fullgameProj * 10) / 10;

                const totalProj = document.createElement('h3');
                totalProj.innerHTML = "Total Projection: " + fullgameProj;
                newDiv.appendChild(totalProj);
                

                //game ended or not started
                if(games.events[i].status.period == 4 && games.events[i].status.displayClock == "0.0"){
                    displayPeriod.innerHTML = "FINAL"
                    totalProj.innerHTML = "";
                }else if(games.events[i].status.period == 0){
                    displayPeriod.innerHTML = games.events[i].status.type.shortDetail;
                    totalProj.innerHTML = "";
                }else if(games.events[i].status.period == 1 || games.events[i].status.period == 2){
                    totalProj.innerHTML = "";
                }


            }
        }
    }

    xhr.send();
}

runWebsite();

