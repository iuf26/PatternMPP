export default function GameInfo(props){

    return(

        <>
            <div style={{display: "flex" ,justifyContent: "center",gap:"12px"}}>
                <p>{props.details.rank}</p>
                <p>Sore: {props.details.score} </p>
                <p>Player: {props.details.player} </p>
                <p>Prize : {props.details.prize}</p>         
                <p> Begin time :   {props.details.gameDate[3]}:{props.details.gameDate[4]}:{props.details.gameDate[5]}  {props.details.gameDate[0]}/{props.details.gameDate[1]}/{props.details.gameDate[2]}</p>
            </div>
        
        </>
    )
}