import * as React from 'react';
import { RouteComponentProps, Route } from 'react-router';
import Dropdown from 'react-dropdown';
//import Popup from 'react-popup';
import {
    PopupboxManager,
    PopupboxContainer
} from 'react-popupbox';
import 'react-popupbox/dist/react-popupbox.css';
import 'react-dropdown/style.css';
//import ReactDOM from 'react-dom';


interface DraftState {
	Rounds: number[][];
	CurrentRound: number;
	draftnumber: number;
	teams: TeamState[];
	selectedPlayers: string[];
    selectplayer: string;
    trades: string[];
	keepers: string[];
	DefaultRanking: Player[];
	SelectableRules: string[];
	options: string[];
	filteroption: string[];


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
    Teamnumber: number;
	MinRulesFullfilled: boolean;
	TeamName: string;
	MinRules: string;
	MaxRules: string;
	SelectedRule:string;
}
interface GameState {
	Round: number;
}

function Team(props: any) {
	
	//let allRanking: string='';
	//for (let i = 0; i < props.Ranking.length; i++) {
	//	allRanking = allRanking.concat(props.Ranking[i].number +
	//		" " +
	//		props.Ranking[i].name +
	//		" " +
	//		props.Ranking[i].position +
	//		" " +
	//		props.Ranking[i].team);
	//}

	//let allPlayers: string = '';
	//for (let i = 0; i < props.SelectedPlayers.length; i++) {
	//	allPlayers = allPlayers.concat(props.SelectedPlayers[i].number +
	//		" " +
	//		props.SelectedPlayers[i].name +
	//		" " +
	//		props.SelectedPlayers[i].position +
	//		" " +
	//		props.SelectedPlayers[i].team);
	//}

		return (<div>
		<div>	Lag {props.Teamnumber}</div>
			Valda spelare <AllPlayers Players={props.SelectedPlayers} />		
					
	        </div>);
	

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
				Teamnumber: i,
				MinRulesFullfilled: false,
				TeamName: 'Lag' + i,
				MinRules: 'QB:1,RB:2,WR:2,TE:1,K:1,DST:1',
					MaxRules: 'QB:3,RB:6,WR:6,TE:3,K:2,DST:2',
				SelectedRule:'Default'
		};
			teamstemp.push(team);
		}
		let allrounds: number[][] = new Array<number[]>();
		//TODO: ändra till 17 4
		for (let i = 1; i < 17; i++) {
			let round : number[]= new Array<number>();
			if (i % 2 === 1) {
				//TODO ändra till 11 3
				for (let team = 1; team <11; team++) {
					round.push(team);
				}
			}
			else {
				//TODO: ändra till 10 2
				for (let team = 10; team > 0; team--) {
					round.push(team);
				}
			}
			allrounds.push(round);
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleChangeTeamName = this.handleChangeTeamName.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangePlayer = this.handleChangePlayer.bind(this);
        this.handleSubmitPlayer = this.handleSubmitPlayer.bind(this);
        this.openPopupbox = this.openPopupbox.bind(this);
        this.updatetrade = this.updatetrade.bind(this);
		this.updatekeeper = this.updatekeeper.bind(this);
		this.updateRules = this.updateRules.bind(this);
		this.savetrade = this.savetrade.bind(this);
		this.filterList = this.filterList.bind(this);
		this.state = {
			Rounds: allrounds,
			CurrentRound: 1,

			draftnumber: 0,
			teams: teamstemp,
			selectedPlayers: [],
            selectplayer: '',
            trades: [],
			keepers: [],
			DefaultRanking: new Array<Player>(),
			SelectableRules:[
				'Default|Min|QB:1,RB:2,WR:2,TE:1,K:1,DST:1|Max|QB:3,RB:6,WR:6,TE:3,K:2,DST:2',
				'RB-WR RB-tung|Min|QB:1,RB:5,WR:3,TE:1,K:1,DST:1|Max|QB:2,RB:8,WR:5,TE:2,K:1,DST:1',
				'RB-WR WR-tung|Min|QB:1,RB:4,WR:5,TE:1,K:1,DST:1|Max|QB:2,RB:6,WR:8,TE:2,K:1,DST:1',
				'RB-WR balanserad|Min|QB:1,RB:5,WR:5,TE:1,K:1,DST:1|Max|QB:2,RB:7,WR:7,TE:2,K:1,DST:1',
			],
			options: [],
			filteroption:[]
		};

	}

	handleChange(e: any) {
		this.setState({
			Rounds: this.state.Rounds,
			CurrentRound: this.state.CurrentRound,
			draftnumber: e.target.value,
			teams: this.state.teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers,
			trades: this.state.trades,
			keepers: this.state.keepers,
			options: this.state.teams[e.target.value - 1] != null ? this.state.teams[e.target.value - 1].Ranking.map((r) => { return (r.name + ' ' + r.position + ' ' + r.team) }) : []
		});
	}

	handleChangeTeamName(e: any) {
		let teams = this.state.teams.slice();

		teams[e.target.id.split(',')[1]] = e.target.value;
		this.setState({
			teams:teams
		});
	}

	handleSubmit(e: any) {
		e.preventDefault();
		const rounds = this.state.Rounds.slice();
		let currentRound = this.state.CurrentRound;
		for (let y = 0; y < rounds.length; y) {
			console.log('Antal rundor' + rounds.length);
			console.log('den här rundan'+rounds[0]);
			let breakit = false;
			let round = rounds[0].slice();

            for (let i = 0; i < round.length; i) {
				console.log('vilket lags tur är det'+round[0]);
				if (round[0] == this.state.draftnumber) {
					breakit = true;
					break;
				} else {
					this.selectTeam(round[0], currentRound);
					round.splice(0, 1);
				}
			}
			if (round.length==0) {
                rounds.splice(0, 1);
				currentRound++;
			} else {
				rounds[0] = round;
			}
			this.setState({
				Rounds: rounds,
				CurrentRound: currentRound,
				draftnumber: this.state.draftnumber,
				teams: this.state.teams,
				selectplayer: this.state.selectplayer,
				selectedPlayers: this.state.selectedPlayers,
				trades: this.state.trades,
				keepers: this.state.keepers
			});
			if (breakit) {
				break;
			}
		}
	
	}

	SelectTeamManually(selectplayer:string) {
		
		const teams = this.state.teams.slice();
		
		let selectedplayer: Player = {name:'',number:0, position:'', team:''};
		let count = 0;
		while (selectedplayer.name === '') {
			console.log(teams[this.state.draftnumber - 1].Ranking[0]);
			console.log(selectplayer);
			if (teams[this.state.draftnumber - 1].Ranking[count].name + ' ' + teams[this.state.draftnumber - 1].Ranking[count].position + ' ' + teams[this.state.draftnumber - 1].Ranking[count].team === selectplayer) {
				selectedplayer = teams[this.state.draftnumber - 1].Ranking[count];
			} else {
				count++;
			}
		}
		let ranking = teams[this.state.draftnumber - 1].Ranking.slice();
		ranking.splice(count, 1);
		teams[this.state.draftnumber - 1].SelectedPlayers = teams[this.state.draftnumber - 1].SelectedPlayers.concat(selectedplayer);
		teams[this.state.draftnumber - 1].Ranking = ranking;
		this.setState({
			Rounds: this.state.Rounds,
			CurrentRound: this.state.CurrentRound,
			draftnumber: this.state.draftnumber,
			teams: teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers,
			trades: this.state.trades,
			keepers: this.state.keepers,
			options: this.state.teams[this.state.draftnumber - 1] != null ? this.state.teams[this.state.draftnumber - 1].Ranking.map((r) => { return (r.name + ' ' + r.position + ' ' + r.team) }) : []
			
		});
    }


    selectTeam(teamnumber: number, currentRound: number) {
        if (teamnumber == 0) {
            return;
        }
		console.log('vilket lag'+teamnumber);
        const teams = this.state.teams.slice();
        let minrulesfullfilled = teams[teamnumber - 1].MinRulesFullfilled;
		let mqb = 0;
		let mrb = 0;
		let mwr = 0;
		let mte = 0;
		let mk = 0;
        let mdst = 0;
		let xqb = 0;
		let xrb = 0;
		let xwr = 0;
		let xte = 0;
		let xk = 0;
		let xdst = 0;
		let cqb = 0;
		let crb = 0;
		let cwr = 0;
		let cte = 0;
		let ck = 0;
        let cdst = 0;
		for (let k = 0; k < teams[teamnumber - 1].SelectedPlayers.length; k++) {
			if (teams[teamnumber - 1].SelectedPlayers[k].position == 'QB') {
				cqb++;
			}
			else if (teams[teamnumber - 1].SelectedPlayers[k].position == 'RB') {
				crb++;
			}
			else if (teams[teamnumber - 1].SelectedPlayers[k].position == 'WR') {
				cwr++;
			}
			else if (teams[teamnumber - 1].SelectedPlayers[k].position == 'TE') {
				cte++;
			}
			else if (teams[teamnumber - 1].SelectedPlayers[k].position == 'K') {
				ck++;
			}
			else if (teams[teamnumber - 1].SelectedPlayers[k].position == 'DST') {
				cdst++;
			}
		}

		let minrules = teams[teamnumber - 1].MinRules.split(',');

	        for (let j = 0; j < minrules.length; j++) {
		        if (minrules[j].split(':')[0] == 'QB') {
			        mqb = parseInt(minrules[j].split(':')[1]);
		        } else if (minrules[j].split(':')[0] == 'RB') {
			        mrb = parseInt(minrules[j].split(':')[1]);
		        } else if (minrules[j].split(':')[0] == 'WR') {
			        mwr = parseInt(minrules[j].split(':')[1]);
		        } else if (minrules[j].split(':')[0] == 'TE') {
			        mte = parseInt(minrules[j].split(':')[1]);
		        } else if (minrules[j].split(':')[0] == 'K') {
			        mk = parseInt(minrules[j].split(':')[1]);
		        } else if (minrules[j].split(':')[0] == 'DST') {
			        mdst = parseInt(minrules[j].split(':')[1]);
		        }
	        }

		if (cqb >= mqb &&
			crb >= mrb &&
			cwr >= mwr &&
			cte >= mte &&
            (currentRound >= 14 ? ck >= mk : true) &&
            (currentRound >= 13 ? cdst >= mdst : true)) {
            console.log('Runda ' + currentRound + 'spelare ' + teamnumber + ' minrulesfullfilled true. antal WR '+cwr+ ' antal rb '+crb);

			minrulesfullfilled = true;
			teams[teamnumber - 1].MinRulesFullfilled = true;
        } else {
            console.log('Runda ' + currentRound + 'spelare ' + teamnumber + ' minrulesfullfilled false. antal WR ' + cwr + ' antal rb ' + crb);
			minrulesfullfilled = false;
			teams[teamnumber - 1].MinRulesFullfilled = false;
		}

		let maxrules = teams[teamnumber - 1].MaxRules.split(',');

            for (let j = 0; j < maxrules.length; j++) {
                if (maxrules[j].split(':')[0] == 'QB') {
                    xqb = parseInt(maxrules[j].split(':')[1]);
		        }
                else if (maxrules[j].split(':')[0] == 'RB') {
                    xrb = parseInt(maxrules[j].split(':')[1]);
		        }
                else if (maxrules[j].split(':')[0] == 'WR') {
                    xwr = parseInt(maxrules[j].split(':')[1]);
		        }
                else if (maxrules[j].split(':')[0] == 'TE') {
                    xte = parseInt(maxrules[j].split(':')[1]);
		        }
                else if (maxrules[j].split(':')[0] == 'K') {
                    xk = parseInt(maxrules[j].split(':')[1]);
		        }
                else if (maxrules[j].split(':')[0] == 'DST') {
                    xdst = parseInt(maxrules[j].split(':')[1]);
		        }
	        }
        
		let playernumber = 0;
		let selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
     //   console.log('försök välja spelare' + selectedplayer.name);

        if (!minrulesfullfilled) {
	        while (true) {
                if (selectedplayer.position == 'QB' && cqb >= mqb) {
                    playernumber++;
                    selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
                    continue;
                }
                else if (selectedplayer.position == 'RB' && crb >= mrb) {
			//		console.log('försöker välja rb'+selectedplayer.name+', öka teamnumber, crb '+crb+' mrb '+mrb);
	                playernumber++;
	                selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
	                continue;
                }
                else if (selectedplayer.position == 'WR' && cwr >= mwr) {
	                playernumber++;
	                selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
	                continue;
                }
                else if (selectedplayer.position == 'TE' && cte >= mte) {
	                playernumber++;
	                selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
	                continue;
                }
                else if (selectedplayer.position == 'K' && (currentRound<14 || ck >= mk)) {
	                playernumber++;
	                selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
	                continue;
                }
                else if (selectedplayer.position == 'DST' && (currentRound<13 || cdst >= mdst)) {
	                playernumber++;
	                selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
	                continue;
                }
				break;
	        }
        } else {
	        while (true) {
		        if (selectedplayer.position == 'QB' && cqb >= xqb) {
			        playernumber++;
			        selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
			        continue;
		        }
		        else if (selectedplayer.position == 'RB' && crb >= xrb) {
			    //    console.log('försöker välja rb' + selectedplayer.name + ', öka teamnumber, crb ' + crb + ' mrb ' + mrb);
			        playernumber++;
			        selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
			        continue;
		        }
		        else if (selectedplayer.position == 'WR' && cwr >= xwr) {
			        playernumber++;
			        selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
			        continue;
		        }
		        else if (selectedplayer.position == 'TE' && cte >= xte) {
			        playernumber++;
			        selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
			        continue;
		        }
                else if (selectedplayer.position == 'K' && (currentRound<14 || ck >= xk)) {
			        playernumber++;
			        selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
			        continue;
		        }
                else if (selectedplayer.position == 'DST' && (currentRound<13 || cdst >= xdst)) {
			        playernumber++;
			        selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
			        continue;
		        }
		        break;
	        }

		}
		let notalone = true;
		while (notalone) {
			let numbernotin = 0;
			for (let i = 0; i < teams.length; i++) {
				let teamHasPlayer = false;
                for (let y = 0; y < teams[i].SelectedPlayers.length; y++) {
                    if (teams[i].SelectedPlayers[y].name === selectedplayer.name && teams[i].SelectedPlayers[y].position === selectedplayer.position && teams[i].SelectedPlayers[y].team === selectedplayer.team) {
					//	console.log(selectedplayer.name + ' redan vald');
						teamHasPlayer = true;
						continue;
					}
				}
                if (!teamHasPlayer) {
					numbernotin++;
				}
			}
			if (numbernotin < 10) {
    //            const ranking = teams[teamnumber - 1].Ranking.slice();
				//console.log('spelarnummer', playernumber);
				//ranking.splice(playernumber, 1);
				//teams[teamnumber - 1].Ranking = ranking;

				playernumber++;
				selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
				if (!minrulesfullfilled) {
					while (true) {
						if (selectedplayer.position == 'QB' && cqb >= mqb) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
						else if (selectedplayer.position == 'RB' && crb >= mrb) {
						//	console.log('försöker välja rb' + selectedplayer.name + ', öka teamnumber, crb ' + crb + ' mrb ' + mrb);
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
						else if (selectedplayer.position == 'WR' && cwr >= mwr) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
						else if (selectedplayer.position == 'TE' && cte >= mte) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
                        else if (selectedplayer.position == 'K' && (currentRound < 14 || ck >= mk)) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
                        else if (selectedplayer.position == 'DST' && (currentRound < 13 || cdst >= mdst)) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
						break;
					}
				} else {
					while (true) {
						if (selectedplayer.position == 'QB' && cqb >= xqb) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
						else if (selectedplayer.position == 'RB' && crb >= xrb) {
					//		console.log('försöker välja rb' + selectedplayer.name + ', öka teamnumber, crb ' + crb + ' mrb ' + mrb);
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
						else if (selectedplayer.position == 'WR' && cwr >= xwr) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
						else if (selectedplayer.position == 'TE' && cte >= xte) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
                        else if (selectedplayer.position == 'K' && (currentRound < 14 || ck >= xk)) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
                        else if (selectedplayer.position == 'DST' && (currentRound < 13 || cdst >= xdst)) {
							playernumber++;
							selectedplayer = teams[teamnumber - 1].Ranking[playernumber];
							continue;
						}
						break;
					}
				}

			} else {

				notalone = false;
			}

		}

        console.log('vald spelare' + selectedplayer.name);
        if (this.state.draftnumber > 0) {
            let ranking = teams[this.state.draftnumber - 1].Ranking.slice();

            let count = 0;
            while (true) {
                if (teams[this.state.draftnumber - 1].Ranking[count].name === selectedplayer.name && teams[this.state.draftnumber - 1].Ranking[count].position === selectedplayer.position && teams[this.state.draftnumber - 1].Ranking[count].team === selectedplayer.team) {
                    break;
                } else {
                    count++;
                }
            }
            ranking.splice(count, 1);
            teams[this.state.draftnumber - 1].Ranking = ranking;
        }

		teams[teamnumber - 1].SelectedPlayers= teams[teamnumber - 1].SelectedPlayers.concat(selectedplayer);
		this.setState({
			Rounds: this.state.Rounds,
			CurrentRound: this.state.CurrentRound,
			draftnumber: this.state.draftnumber,
			teams: teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers,
			trades: this.state.trades,
			keepers: this.state.keepers,
			options: this.state.teams[this.state.draftnumber - 1] != null ? this.state.teams[this.state.draftnumber - 1].Ranking.map((r) => { return (r.name + ' ' + r.position + ' ' + r.team) }) : []

		});

	}


	handleChangePlayer(e: any) {
		this.setState({
			Rounds: this.state.Rounds,
			CurrentRound: this.state.CurrentRound,
			draftnumber: this.state.draftnumber,
			teams: this.state.teams,
			selectplayer: e.target.value,
			selectedPlayers: this.state.selectedPlayers,
			trades: this.state.trades,
			keepers: this.state.keepers
		});
	}

	handleSubmitPlayer(option:any) {
    //    e.preventDefault();
		console.log(option);
		let currentRound = this.state.CurrentRound;
		if (!option.value.length) {
			return;
		}

		this.SelectTeamManually(option.value);

		const rounds = this.state.Rounds.slice();
		let round = rounds[0].slice();
		round.splice(0, 1);

		if (round.length == 0) {
            rounds.splice(0, 1);
			currentRound++;
		} else {
			rounds[0] = round;
		}
		this.setState({
			Rounds: rounds,
			CurrentRound: currentRound,
			draftnumber: this.state.draftnumber,
			teams: this.state.teams,
			selectplayer: '',
			selectedPlayers: this.state.selectedPlayers,
			trades: this.state.trades,
			keepers: this.state.keepers
		});

		for (let y = 0; y < rounds.length; y) {
			let breakit = false;
			//const rounds = this.state.Rounds.slice();
			let round = rounds[0].slice();
			console.log('runda'+y);
			console.log('längd round'+round.length);
			console.log('första round'+round[0]);
			for (let i = 0; i < round.length; i) {
				if (round[0] == this.state.draftnumber) {
					breakit = true;
					break;
				} else {
					this.selectTeam(round[0], currentRound);
					round.splice(0, 1);
				}
			}

			if (round.length == 0) {
                rounds.splice(0, 1);
				currentRound++;
			} else {
				rounds[0] = round;
			}
			this.setState({
				Rounds: rounds,
				CurrentRound: currentRound,
				draftnumber: this.state.draftnumber,
				teams: this.state.teams,
				selectplayer: '',
				selectedPlayers: this.state.selectedPlayers,
				trades: this.state.trades,
				keepers: this.state.keepers
			});
			if (breakit) {
				break;
			}
		}

		//this.setState((prevState:any) => ({
		//	selectedPlayers: prevState.selectedPlayers.concat(this.state.selectplayer),
		//	selectplayer: ''
		//}));
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
				Rounds: this.state.Rounds,
				CurrentRound: this.state.CurrentRound,
				teams: teams,
				draftnumber: this.state.draftnumber,
				selectplayer: this.state.selectplayer,
				selectedPlayers: this.state.selectedPlayers,
				trades: this.state.trades,
				keepers: this.state.keepers
			});
		};
		fileReader.readAsText(file);


	};

	private handleRulesFileChosen = (file: any, teamnumber: number) => {
		let fileReader = new FileReader();
		fileReader.onloadend = (e) => {
			let content = fileReader.result;
			const teams = this.state.teams.slice();
			if (content.startsWith("Position,Min,Max")) {

				content = content.substring(("Position,Min,Max/n").length, content.length);
			}
			let minrules = '';
			let maxrules = '';
			for (var i = 0; i < content.split('\n').length; i++) {

				if (content.split('\n')[i].split(',')[0] == 'QB' ||
					content.split('\n')[i].split(',')[0] == 'RB' ||
					content.split('\n')[i].split(',')[0] == 'WR' ||
					content.split('\n')[i].split(',')[0] == 'TE' ||
					content.split('\n')[i].split(',')[0] == 'K' ||
					content.split('\n')[i].split(',')[0] == 'DST') {

					minrules=minrules.concat(content.split('\n')[i].split(',')[0] + ':' + content.split('\n')[i].split(',')[1] + ',')
					maxrules=maxrules.concat(content.split('\n')[i].split(',')[0] + ':' + content.split('\n')[i].split(',')[2] + ',')
				}
			}
			teams[teamnumber - 1].MinRules = minrules.substring(0, minrules.length-1);
			teams[teamnumber - 1].MaxRules = maxrules.substring(0, maxrules.length-1);
			this.setState({
				Rounds: this.state.Rounds,
				CurrentRound: this.state.CurrentRound,
				teams: teams,
				draftnumber: this.state.draftnumber,
				selectplayer: this.state.selectplayer,
				selectedPlayers: this.state.selectedPlayers,
				trades: this.state.trades,
				keepers: this.state.keepers
			});
		};
		fileReader.readAsText(file);


	};

	private handleFileChosenDefault = (file: any) => {
		let fileReader = new FileReader();
		fileReader.onloadend = (e) => {
			let content = fileReader.result;
			if (content.startsWith("Rank,Namn,Position,Lag")) {

				content = content.substring(("Rank,Namn,Position,Lag/n").length, content.length);
			}
			let players: Player[] = new Array<Player>();
			for (var i = 0; i < content.split('\n').length; i++) {
				let player: Player = {
					number: content.split('\n')[i].split(',')[0],
					name: content.split('\n')[i].split(',')[1],
					position: content.split('\n')[i].split(',')[2],
					team: content.split('\n')[i].split(',')[3],
				}
				players.push(player);
			}

			let teams = this.state.teams.slice();

			for (let y = 0; y < teams.length; y++) {
				if (teams[y].Ranking.length == 0) {
					teams[y].Ranking=players
				}
			}

			this.setState({
				Rounds: this.state.Rounds,
				CurrentRound: this.state.CurrentRound,
				teams: teams,
				draftnumber: this.state.draftnumber,
				selectplayer: this.state.selectplayer,
				selectedPlayers: this.state.selectedPlayers,
				trades: this.state.trades,
				keepers: this.state.keepers,
				DefaultRanking: players
			});
		};
		fileReader.readAsText(file);


	};
	
	renderTeam(i: any) {
		let optionsrules = this.state.SelectableRules.map((r) => {
			return { label: (r.split('|')[0]), value: (r.split('|')[0] + ':' + i.toString()) }
		});
		let id = 0;
		for (let y = 0; y < optionsrules.length; y++) {
			if (this.state.teams[i - 1].SelectedRule == optionsrules[y].label) {
				id = y;
			}
		}
		let defaultvalue = optionsrules[id];
		return (<div>Lag {i}
			        <form>
				        <label htmlFor="team-name">
					        Lagnamn
				        </label>
				        <input
					id={'team-name,'+(i-1).toString()}
					        onChange={this.handleChangeTeamName}
					value={this.state.teams[i - 1].TeamName}
				        />
			</form>
			        <label>Regler</label>
			<section>
			        <Dropdown
				options={optionsrules}
				onChange={this.updateRules}
				value={defaultvalue}
				/>
			</section>
			<label htmlFor="file">Välj regler via fil</label>
			        <input type='file'
			               id='file'
			               className='input-file'
			               accept='.csv'
			               onChange={(e: React.ChangeEvent<HTMLInputElement>) => e != null && e.target != null && e.target.files != null ? this.handleRulesFileChosen(e.target.files[0], i) : alert("null")}
			        />
			<label htmlFor="file">Ranking:</label>
			        <input type='file'
			               id='file'
			               className='input-file'
			               accept='.csv'
			               onChange={(e: React.ChangeEvent<HTMLInputElement>) => e != null && e.target != null && e.target.files != null ? this.handleFileChosen(e.target.files[0], i) : alert("null")}
            />
	
			<Team TeamName={this.state.teams[i - 1].TeamName} Teamnumber={i} SelectedPlayers={this.state.teams[i - 1].SelectedPlayers} Ranking={this.state.teams[i-1].Ranking} /></div>);

	}	


	CreateBoard = () => {
		let table: any[] = [];
		//TOOO ändra till 11
		for (let i = 1; i < 11; i++) {
			table.push(<div key={i} className="board-row">{this.renderTeam(i)}</div>);
		}
		return table;
	}

    openPopupbox() {

        let children = [];
        let content = [];

        for (let i = 0; i < this.state.Rounds.length; i++) {
			children.push(<h2 key={'runda' + i.toString()}>Runda {i + 1}</h2>)

            for (let y = 0; y < this.state.Rounds[i].length; y++) {
                const options = this.state.teams[this.state.draftnumber - 1] != null ? this.state.teams[this.state.draftnumber - 1].Ranking.map((r) => { return { label: (r.name + ' ' + r.position + ' ' + r.team), value: (r.name + ' ' + r.position + ' ' + r.team+':'+ i.toString() + ',' + y.toString() + ';' + this.state.Rounds[i][y].toString() ) } }) : [];
				const optionsTeam = this.state.teams.map((r) => { return { label: (r.TeamName), value: (r.TeamName + ':' + i.toString() + ',' + y.toString()) } });

                //    content.push(
                //        <div key={i.toString() + y.toString()}>
                //    {this.state.Rounds[i][y]}
                //</div>);

	        //    <input id={i.toString() + ',' + y.toString() + ';' + this.state.Rounds[i][y].toString()} key={i.toString() + y.toString()} type="text" className="mm-popup__input" defaultValue={this.state.Rounds[i][y].toString()} onChange={this.updatetrade} />

                children.push(
                    <div key={i.toString() + y.toString()}>
						<label htmlFor={i.toString() + ',' + y.toString()}>Pick {y + 1} </label>
	                    <section id={i.toString() + ',' + y.toString() + ';' + this.state.Rounds[i][y].toString()}>
		                    <Dropdown
			                    options={optionsTeam}
								onChange={this.updatetrade}
								value={optionsTeam[this.state.Rounds[i][y]-1]}
			                     />

	                    </section>
                        <section id={i.toString() + ',' + y.toString() + ';' + this.state.Rounds[i][y].toString()}>
                            <Dropdown
                                options={options}
                                onChange={this.updatekeeper}
                                placeholder="Välj spelare att behålla" />

                        </section>
                    </div>
                );
            }
        }
        content.push(<form onSubmit={this.savetrade}><button type="submit">Spara</button>{children}</form>);
        //let content = (
        //    <div>
        //        {this.state.Rounds[0][0]}
        //    </div>
        
        //)

        PopupboxManager.open({ content })
    }


    updatekeeper(option: any) {
        console.log(option)
        if (!option.value.length) {
            return;
        }
        let allkeepers = this.state.keepers.slice();
        let allreadyexist = false;
        for (let i = 0; i < this.state.keepers.length; i++) {
            console.log(allkeepers[i].split(':')[0])

            if (allkeepers[i].split(':')[1] == option.value.split(':')[1]) {
                allkeepers[i] = option.value;
                allreadyexist = true;
            }
        }
        if (!allreadyexist) {
            allkeepers.push(option.value)
        }
        console.log(option.value)
        console.log(allkeepers);
        this.setState({ keepers: allkeepers });
    }

    updatetrade(option: any) {
        let alltrades = this.state.trades.slice();
        let allreadyexist = false;
        for (let i = 0; i < this.state.trades.length; i++) {
            console.log(alltrades[i].split(':')[0])

			if (alltrades[i].split(':')[1] == option.value.split(':')[1]) {
                alltrades[i] = option.value;
                allreadyexist = true;
            }
        }
        if (!allreadyexist) {
            alltrades.push(option.value)
        }
        console.log(alltrades);
        this.setState({ trades: alltrades });
    }

    savetrade(e: any) {
        e.preventDefault()
        let teams = this.state.teams.slice();
        let rounds = this.state.Rounds.slice();

		for (let i = 0; i < this.state.trades.length; i++) {
		    let teamnumber = 0;
			for (let y = 0; y < this.state.teams.length; y++) {
				if (this.state.teams[y].TeamName == this.state.trades[i].split(':')[0]) {
					teamnumber = y+1;
				}
			}
	    rounds[parseInt(this.state.trades[i].split(':')[1].split(',')[0])][parseInt(
		    this.state.trades[i].split(':')[1].split(',')[1])] = teamnumber;
	    //parseInt(this.state.trades[i].split(':')[1])
    }
        for (let i = 0; i < this.state.keepers.length; i++) {
            let player: Player = { name: '', number: 0, position: '', team: '' };

            for (let u = 0; u < teams[parseInt(this.state.keepers[i].split(':')[1].split(';')[1]) - 1].Ranking.length; u++) {
                if (teams[parseInt(this.state.keepers[i].split(':')[1].split(';')[1]) - 1].Ranking[u].name + ' '+teams[parseInt(this.state.keepers[i].split(':')[1].split(';')[1]) - 1].Ranking[u].position + ' '+teams[parseInt(this.state.keepers[i].split(':')[1].split(';')[1]) - 1].Ranking[u].team == this.state.keepers[i].split(':')[0]) {
                    player = teams[parseInt(this.state.keepers[i].split(':')[1].split(';')[1]) - 1].Ranking[u];
                }
            }
            teams[parseInt(this.state.keepers[i].split(':')[1].split(';')[1]) - 1].SelectedPlayers.push(player)

            if (this.state.draftnumber > 0) {
                let ranking = teams[this.state.draftnumber - 1].Ranking.slice();

                let count = 0;
                while (true) {
                    if (teams[this.state.draftnumber - 1].Ranking[count].name === player.name && teams[this.state.draftnumber - 1].Ranking[count].position === player.position && teams[this.state.draftnumber - 1].Ranking[count].team === player.team) {
                        break;
                    } else {
                        count++;
                    }
                }
                ranking.splice(count, 1);
                teams[this.state.draftnumber - 1].Ranking = ranking;
            }

   

      
            rounds[parseInt(this.state.keepers[i].split(':')[1].split(';')[0].split(',')[0])][parseInt(this.state.keepers[i].split(':')[1].split(';')[0].split(',')[1])] = 0;
        }
        this.setState({
			teams: teams,
			Rounds: rounds,
			options: this.state.teams[this.state.draftnumber - 1] != null ? this.state.teams[this.state.draftnumber - 1].Ranking.map((r) => { return (r.name + ' ' + r.position + ' ' + r.team) }) : []

        });


	}



	updateRules(option: any) {
		let teams = this.state.teams.slice();
		let rules = '';
		for (let i = 0; i < this.state.SelectableRules.length; i++) {
			if (this.state.SelectableRules[i].split('|')[0] == option.label) {
				rules = this.state.SelectableRules[i];
			}
		}
		console.log(parseInt(option.value.split(':')[1]))
		teams[parseInt(option.value.split(':')[1])-1].MinRules = rules.split('|')[2];
		teams[parseInt(option.value.split(':')[1]) - 1].MaxRules = rules.split('|')[4];
		teams[parseInt(option.value.split(':')[1]) - 1].SelectedRule = option.label;
		console.log(option.value);
		console.log(teams[parseInt(option.value.split(':')[1]) - 1].MinRules);
		console.log(teams[parseInt(option.value.split(':')[1]) - 1].MaxRules);
		this.setState({
			teams: teams,
			SelectableRules: this.state.SelectableRules
		});
	}


	filterList(event: any) {
		let filteroptions = this.state.filteroption.slice();
		console.log(filteroptions.length)
		if (event.target.checked) {
			filteroptions.push(event.target.value)
		} else {
			for (let i = 0; i < filteroptions.length; i++) {
				if (filteroptions[i] == event.target.value) {
					filteroptions.splice(i, 1);
				}
			}
		}
		console.log(filteroptions.length)

		let completelist = this.state.teams[this.state.draftnumber - 1] != null ? this.state.teams[this.state.draftnumber - 1].Ranking.map((r) => { return (r.name + ' ' + r.position + ' ' + r.team) }) : [];
		let updatedList = completelist;
		//for (let i = 0; i < filteroptions.length; i++) {
		//		let list = completelist.filter(function (item) {
		//			return item.toLowerCase().search(
		//					filteroptions[i].toLowerCase() ||filteroptions[i+1].toLowerCase()) !==
		//				-1;
		//	});
		//	updatedList=updatedList.concat(list)
		//}
		console.log(filteroptions[0])
		if (filteroptions.length == 2) {
			updatedList = completelist.filter(function(item) {
				return item.toLowerCase().search(
						filteroptions[0].toLowerCase()) !==
					-1 ||
					item.toLowerCase().search(filteroptions[1].toLowerCase()) !== -1;
			});
		} else if (filteroptions.length == 1) {
			updatedList = completelist.filter(function (item) {
				return item.toLowerCase().search(
						filteroptions[0].toLowerCase()) !==
					-1;
			});
		}
		else if (filteroptions.length == 3) {
			updatedList = completelist.filter(function (item) {
				return item.toLowerCase().search(
						filteroptions[0].toLowerCase()) !==
					-1 ||
					item.toLowerCase().search(filteroptions[1].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[2].toLowerCase()) !== -1
			});
		}
		else if (filteroptions.length == 4) {
			updatedList = completelist.filter(function (item) {
				return item.toLowerCase().search(
						filteroptions[0].toLowerCase()) !==
					-1 ||
					item.toLowerCase().search(filteroptions[1].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[2].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[3].toLowerCase()) !== -1
			});
		}
		else if (filteroptions.length == 5) {
			updatedList = completelist.filter(function (item) {
				return item.toLowerCase().search(
						filteroptions[0].toLowerCase()) !==
					-1 ||
					item.toLowerCase().search(filteroptions[1].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[2].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[3].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[4].toLowerCase()) !== -1
			});
		}
		else if (filteroptions.length == 6) {
			updatedList = completelist.filter(function (item) {
				return item.toLowerCase().search(
						filteroptions[0].toLowerCase()) !==
					-1 ||
					item.toLowerCase().search(filteroptions[1].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[2].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[3].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[4].toLowerCase()) !== -1 ||
					item.toLowerCase().search(filteroptions[5].toLowerCase()) !== -1
			});
		}


		this.setState({
			options: updatedList,
			filteroption: filteroptions
		});
	}


    render() {
        const popupboxConfig = {
            titleBar: {
                enable: true,
                text: 'Trades and keepers'
            },
            fadeIn: true,
            fadeInSpeed: 500
        }
	//	const options = this.state.teams[this.state.draftnumber - 1] !=null ? this.state.teams[this.state.draftnumber - 1].Ranking.map((r) => {return (r.name+ ' '+r.position+' '+r.team)}): [];
	    return (

			<div>
				<label>Defaultranking</label>
				<input type='file'
				       id='file'
				       className='input-file'
				       accept='.csv'
				       onChange={(e: React.ChangeEvent<HTMLInputElement>) => e != null && e.target != null && e.target.files != null ? this.handleFileChosenDefault(e.target.files[0]) : alert("null")}
				/>
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
                <button onClick={this.openPopupbox}>Justera trades och keepers</button>
                <PopupboxContainer {...popupboxConfig}/>
                <div>Rundnummer {this.state.CurrentRound}</div>
			
				<section>

					<label>QB
						<input type="checkbox" placeholder="Search" value=" QB " onChange={this.filterList} />
					</label>
					<label>RB
						<input type="checkbox" placeholder="Search" value=" RB " onChange={this.filterList} />
					</label>
					<label>WR
						<input type="checkbox" placeholder="Search" value=" WR " onChange={this.filterList} />
					</label>
					<label>TE
						<input type="checkbox" placeholder="Search" value=" TE " onChange={this.filterList} />
					</label>
					<label>K
						<input type="checkbox" placeholder="Search" value=" K " onChange={this.filterList} />
					</label>
					<label>DST
						<input type="checkbox" placeholder="Search" value=" DST " onChange={this.filterList} />
					</label>
					<Dropdown 
						options={this.state.options}
						onChange={this.handleSubmitPlayer}
						placeholder="välj en spelare" >
						
					</Dropdown>

				</section>


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

interface AllPlayersInterface {
	Players:Player[];
}

class AllPlayers extends React.Component<AllPlayersInterface, any> {
	render() {
		if (this.props.Players != null && this.props.Players[0]!=null) {
		}
		return (
			<ul>
				{
					this.props.Players.map(item => (
						<li key={item.number}>{item.number} {item.name} {item.position} {item.team}</li>
					))
				}
			</ul>
		);
	}
}




