import * as React from 'react';
import { RouteComponentProps } from 'react-router';
//import ReactDOM from 'react-dom';


interface DraftState {
	Round: number;
	Rules: string;
	draftnumber: number;
	teams: TeamState[];
	selectedPlayers: string[];
	selectplayer:string;
}

interface Player {
	number: number;
	name: string;
	position: string;
	team: string;
}
interface TeamState {
	Ranking: Player[];
	SelectedPlayers: Player[];
	Teamnumber:number;
}
interface GameState {
	Round: number;
}

function Team(props:any) {
	//constructor(props:any){
	//	super(props);
	//	this.state = {
	//		Ranking: [],
	//		SelectedPlayers: 'null', 
	//		Value:props.Value
	//	};
	//}

		
		//static fileReader: any;


		//private handleFileRead = (e: any) => {
		//	const content = Team.fileReader.result;
		//	//console.log(content);
			
		//	this.setState({
		//		Ranking: content,
		//		SelectedPlayers: this.state.SelectedPlayers,
		//		Value:this.state.Value
		//	});
		//};

		//private handleFileChosen= (file: any) => {
		//	Team.fileReader = new FileReader();
		//	Team.fileReader.onloadend = this.handleFileRead;
		//	Team.fileReader.readAsText(file);
		//};


//	Lag { this.state.Value }
//<input type='file'
//       id='file'
//       className='input-file'
//       accept='.csv'
//       onChange={(e: React.ChangeEvent<HTMLInputElement>) => e != null && e.target != null && e.target.files != null ? this.handleFileChosen(e.target.files[0]) : alert("null")}

///>

	let allRanking: string='';
	for (let i = 0; i < props.Ranking.length; i++) {
		allRanking = allRanking.concat(props.Ranking[i].number +
			" " +
			props.Ranking[i].name +
			" " +
			props.Ranking[i].position +
			" " +
			props.Ranking[i].team);
	}

	let allPlayers: string = '';
	for (let i = 0; i < props.SelectedPlayers.length; i++) {
		allPlayers = allPlayers.concat(props.SelectedPlayers[i].number +
			" " +
			props.SelectedPlayers[i].name +
			" " +
			props.SelectedPlayers[i].position +
			" " +
			props.SelectedPlayers[i].team);
	}
	//render() {
		return (<div>
			Lag {props.Teamnumber}
			Valda spelare {allPlayers}
			Ranking { allRanking
			//	props.Ranking[0] != null ? props.Ranking.forEach((r:any) => r.name) :'ksd'
		}
		
	        </div>);
	//}

}


class Draft extends React.Component<any, DraftState> {
	constructor(props: any) {
		super(props);
		let teamstemp: TeamState[] = new Array<TeamState>();
		for (var i = 1; i < 11; i++) {
			const team: TeamState =
			{
				Ranking: new Array<Player>(),
				SelectedPlayers: new Array<Player>(),
				Teamnumber: i
			};
			teamstemp.push(team);
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangePlayer = this.handleChangePlayer.bind(this);
		this.handleSubmitPlayer = this.handleSubmitPlayer.bind(this);
		this.state = {
			Round: 0,
			Rules: 'null',
			draftnumber: 0,
			teams: teamstemp,
			selectedPlayers: [],
			selectplayer:''
			//teams: new Array<TeamState>(10)
		};

	}

	handleChange(e: any) {
		this.setState({
			Round: this.state.Round,
			Rules:this.state.Rules,
			draftnumber: e.target.value,
			teams: this.state.teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers
		});
	}


	handleSubmit(e: any) {
		e.preventDefault();
		//TODO ändra till 17
		for (let i = 1; i < 4; i++) {
			if (i % 2 === 1) {
				//TODO ändra till 11
				for (let team = 1; team < 3; team++) {
					if (team == this.state.draftnumber) {
						if (this.state.selectedPlayers.length < i) {
							//this.SelectTeamManually(i);
							console.log(i);
							continue;
						} else {
							//TODO: kanske göra annorlunda. Låta input från manuell gubbe styra de automatiska till behöver göra manuell igen. När klickar på börja drafta kör de automatiska till hittar en manuell ->break. Låt en lista medd vilket lags tur det är styra draften istället för loopar ->lättare att göra tradings.
						}
						
					} else {
						this.selectTeam(team);
					}
				}
			}
			else {
				//TODO: ändra till 10
				for (let team = 2; team > 0; team--) {
					if (team == this.state.draftnumber) {

					} else {
						this.selectTeam(team);
					}
				}
			}
		}
	}

	SelectTeamManually(round: number) {
		
		const teams = this.state.teams.slice();
		
		let selectedplayer: Player = {name:'',number:0, position:'', team:''};
		let count = 0;
		while (selectedplayer.name === '') {
			if (teams[this.state.draftnumber - 1].Ranking[count].name === this.state.selectedPlayers[round - 1]) {
				selectedplayer = teams[this.state.draftnumber - 1].Ranking[count];
			} else {
				count++;
			}
		}
		teams[this.state.draftnumber - 1].SelectedPlayers = teams[this.state.draftnumber - 1].SelectedPlayers.concat(selectedplayer);
		this.setState({
			Round: this.state.Round,
			Rules: this.state.Rules,
			draftnumber: this.state.draftnumber,
			teams: teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers
		});
	}

	selectTeam(teamnumber: number) {

		const teams = this.state.teams.slice();
		let playernumber = 0;
		let selectedplayer = teams[teamnumber - 1].Ranking[playernumber];

		let notalone = true;
		while (notalone) {
			let numbernotin = 0;
			for (let i = 0; i < teams.length; i++) {
				let teamHasPlayer = false;
				for (let y = 0; y < teams[i].SelectedPlayers.length; y++) {
					if (teams[i].SelectedPlayers[y].name === selectedplayer.name) {
						
						teamHasPlayer = true;
						continue;
					}
				}
				if (!teamHasPlayer) {
					numbernotin++;
				}
			}
			if (numbernotin < 10) {
				const ranking = teams[teamnumber - 1].Ranking.slice();
				ranking.splice(playernumber, 1);
				teams[teamnumber - 1].Ranking = ranking;

				playernumber++;
				selectedplayer = teams[teamnumber - 1].Ranking[playernumber];


			} else {

				notalone = false;
			}

		}
		teams[teamnumber - 1].SelectedPlayers= teams[teamnumber - 1].SelectedPlayers.concat(selectedplayer);
		this.setState({
			Round: this.state.Round,
			Rules:this.state.Rules,
			draftnumber: this.state.draftnumber,
			teams: teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers
		});

	}


	handleChangePlayer(e: any) {
		this.setState({
			Round: this.state.Round,
			Rules: this.state.Rules,
			draftnumber: this.state.draftnumber,
			teams: this.state.teams,
			selectplayer: e.target.value,
			selectedPlayers: this.state.selectedPlayers
		});
	}

	handleSubmitPlayer(e:any) {
		e.preventDefault();
		console.log(this.state.selectplayer);
		if (!this.state.selectplayer.length) {
			return;
		}

		this.setState((prevState:any) => ({
			selectedPlayers: prevState.selectedPlayers.concat(this.state.selectplayer),
			selectplayer: ''
		}));
	}

	private handleFileChosen = (file: any, teamnumber: number) => {
		let fileReader = new FileReader();
		fileReader.onloadend = (e) => {
			let content = fileReader.result;
			const teams = this.state.teams.slice();
			if (content.startsWith("Rank,Namn,Position,Lag")) {

				content = content.substring(("Rank,Namn,Position,Lag/n").length, content.length);
			}
			let players: Player[]= new Array<Player>();
			for (var i = 0; i < content.split('\n').length; i++) {
				let player: Player = {
					number : content.split('\n')[i].split(',')[0],
					name: content.split('\n')[i].split(',')[1],
					position: content.split('\n')[i].split(',')[2],
					team: content.split('\n')[i].split(',')[3],
				}
				players.push(player);
			}

			teams[teamnumber - 1].Ranking = players;

			this.setState({
				Round: this.state.Round,
				Rules: this.state.Rules,
				teams: teams,
				draftnumber: this.state.draftnumber,
				selectplayer: this.state.selectplayer,
				selectedPlayers: this.state.selectedPlayers
			});
		};
		fileReader.readAsText(file);


	};
	
	renderTeam(i:any){
		return (<div>Lag {i}
			        <input type='file'
			               id='file'
			               className='input-file'
			               accept='.csv'
			               onChange={(e: React.ChangeEvent<HTMLInputElement>) => e != null && e.target != null && e.target.files != null ? this.handleFileChosen(e.target.files[0], i) : alert("null")}
			/>
			<Team Teamnumber={i} SelectedPlayers={this.state.teams[i - 1].SelectedPlayers} Ranking={this.state.teams[i-1].Ranking} /></div>);

	}	


	CreateBoard = () => {
		let table: any[] = [];
		//TOOO ändra till 11
		for (let i = 1; i < 3; i++) {
			table.push(<div key={i} className="board-row">{this.renderTeam(i)}</div>);
		}
		return table;
	}

	render() {
		return (
			<div>
				<form>
					<label htmlFor="draft-number">
						Vilket draftnummer har du?
					</label>
					<input
						id="draft-number"
						onChange={this.handleChange}
						value={this.state.draftnumber}
					/>
				</form>
				<div>Draftnummer {this.state.draftnumber}</div>
				<form onSubmit={this.handleSubmit}>
					<button id="draft-number" >Börja draft</button>
				</form>
				<form onSubmit={this.handleSubmitPlayer}>
					<label htmlFor="new-todo">
						Vilken spelar väljer du?
					</label>
					<input
						id="new-todo"
						onChange={this.handleChangePlayer}
						value={this.state.selectplayer}
					/>
					<button>
						Lägg till spelare #{this.state.selectedPlayers.length + 1}
					</button>
				</form>

				{this.CreateBoard()}
			</div>
		);
	}
}


export class DraftGame extends React.Component<RouteComponentProps<{}>, GameState> {

	public render() {
		return (
			<div>
				<Draft/>
				
			</div>

					);
	}
}




//const ImportFromFileBodyComponent = (rank:string) => {

//	let fileReader:any;

//	const handleFileRead = (e: any) => {
//		fileReader = new FileReader();

//		const content = fileReader.result;
//		console.log(content);
//		rank = content;
//		// … do something with the 'content' …
//	};

//	const handleFileChosen = (file:any) => {
//		fileReader = new FileReader();
//		//console.log(fileReader.result);

//		fileReader.onloadend = handleFileRead;
//		fileReader.readAsText(file);
//	};

	
//		return <div className='upload-expense'>
//			       <input type='file'
//			              id='file'
//			              className='input-file'
//			              accept='.csv'
//			              onChange={(e: React.ChangeEvent<HTMLInputElement>) => e != null && e.target != null && e.target.files != null
//						? handleFileChosen(e.target.files[0])
//						: alert("null")}
//			              //onChange={handleChange.bind(this:any)}///>
//		       </div>;
	
//};


