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
	MinRules: string;
	MaxRules: string;
	draftnumber: number;
	teams: TeamState[];
	selectedPlayers: string[];
    selectplayer: string;
    trades: string[];
    keepers: string[];
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
}
interface GameState {
	Round: number;
}

function Team(props:any) {
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
				MinRulesFullfilled: false
		};
			teamstemp.push(team);
		}
		let allrounds: number[][] = new Array<number[]>();
		//TODO: ändra till 17 4
		for (let i = 1; i < 17; i++) {
			let round : number[]= new Array<number>();
			if (i % 2 === 1) {
				//TODO ändra till 11 3
				for (let team = 1; team < 3; team++) {
					round.push(team);
				}
			}
			else {
				//TODO: ändra till 10 2
				for (let team = 2; team > 0; team--) {
					round.push(team);
				}
			}
			allrounds.push(round);
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangePlayer = this.handleChangePlayer.bind(this);
        this.handleSubmitPlayer = this.handleSubmitPlayer.bind(this);
        this.openPopupbox = this.openPopupbox.bind(this);
        this.updatetrade = this.updatetrade.bind(this);
        this.updatekeeper = this.updatekeeper.bind(this);
        this.savetrade = this.savetrade.bind(this);
		this.state = {
			Rounds: allrounds,
			CurrentRound: 1,
            MinRules: 'QB:1,RB:2,WR:2,TE:1,K:1,DST:1',
            MaxRules: 'QB:3,RB:6,WR:6,TE:3,K:2,DST:2',
			draftnumber: 0,
			teams: teamstemp,
			selectedPlayers: [],
            selectplayer: '',
            trades: [],
            keepers:[]

		};

	}

	handleChange(e: any) {
		this.setState({
			Rounds: this.state.Rounds,
			CurrentRound: this.state.CurrentRound,
			MinRules:this.state.MinRules,
			MaxRules:this.state.MaxRules,
			draftnumber: e.target.value,
			teams: this.state.teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers
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
				MinRules: this.state.MinRules,
				MaxRules: this.state.MaxRules,
				draftnumber: this.state.draftnumber,
				teams: this.state.teams,
				selectplayer: this.state.selectplayer,
				selectedPlayers: this.state.selectedPlayers
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
			MinRules: this.state.MinRules,
			MaxRules: this.state.MaxRules,
			draftnumber: this.state.draftnumber,
			teams: teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers
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

	        let minrules = this.state.MinRules.split(',');

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

		let maxrules = this.state.MaxRules.split(',');

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
			MinRules: this.state.MinRules,
			MaxRules: this.state.MaxRules,
			draftnumber: this.state.draftnumber,
			teams: teams,
			selectplayer: this.state.selectplayer,
			selectedPlayers: this.state.selectedPlayers
		});

	}


	handleChangePlayer(e: any) {
		this.setState({
			Rounds: this.state.Rounds,
			CurrentRound: this.state.CurrentRound,
			MinRules: this.state.MinRules,
			MaxRules: this.state.MaxRules,
			draftnumber: this.state.draftnumber,
			teams: this.state.teams,
			selectplayer: e.target.value,
			selectedPlayers: this.state.selectedPlayers
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
			MinRules: this.state.MinRules,
			MaxRules: this.state.MaxRules,
			draftnumber: this.state.draftnumber,
			teams: this.state.teams,
			selectplayer: '',
			selectedPlayers: this.state.selectedPlayers
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
				MinRules: this.state.MinRules,
				MaxRules: this.state.MaxRules,
				draftnumber: this.state.draftnumber,
				teams: this.state.teams,
				selectplayer: '',
				selectedPlayers: this.state.selectedPlayers
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
				MinRules: this.state.MinRules,
				MaxRules: this.state.MaxRules,
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

    openPopupbox() {

        let children = [];
        let content = [];
        const options = [
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            {
                type: 'group', name: 'group1', items: [
                    { value: 'three', label: 'Three' },
                    { value: 'four', label: 'Four' }
                ]
            },
            {
                type: 'group', name: 'group2', items: [
                    { value: 'five', label: 'Five' },
                    { value: 'six', label: 'Six' }
                ]
            }
        ]
        for (let i = 0; i < this.state.Rounds.length; i++) {
                children.push(<div key={'runda' + i.toString()}>Runda {i + 1}</div>)
            for (let y = 0; y < this.state.Rounds[i].length; y++) {
                const options = this.state.teams[this.state.draftnumber - 1] != null ? this.state.teams[this.state.draftnumber - 1].Ranking.map((r) => { return { label: (r.name + ' ' + r.position + ' ' + r.team), value: (r.name + ' ' + r.position + ' ' + r.team+':'+ i.toString() + ',' + y.toString() + ';' + this.state.Rounds[i][y].toString() ) } }) : [];

                //    content.push(
                //        <div key={i.toString() + y.toString()}>
                //    {this.state.Rounds[i][y]}
                //</div>);
                children.push(
                    <div key={i.toString() + y.toString()}>
                            <label htmlFor={i.toString() + ',' + y.toString()}>Pick {y + 1} </label>
                        <input id={i.toString() + ',' + y.toString() + ';' + this.state.Rounds[i][y].toString()} key={i.toString() + y.toString()} type="text" className="mm-popup__input" defaultValue={this.state.Rounds[i][y].toString()} onChange={this.updatetrade} />
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

    updatetrade(e: any) {
        let alltrades = this.state.trades.slice();
        let allreadyexist = false;
        for (let i = 0; i < this.state.trades.length; i++) {
            console.log(alltrades[i].split(':')[0])

            if (alltrades[i].split(':')[0] == e.target.id) {
                alltrades[i] = e.target.id + ':' + e.target.value;
                allreadyexist = true;
            }
        }
        if (!allreadyexist) {
            alltrades.push(e.target.id + ':' + e.target.value)
        }
        console.log(e.target.id)
        console.log(alltrades);
        this.setState({ trades: alltrades });
    }

    savetrade(e: any) {
        e.preventDefault()
        let teams = this.state.teams.slice();
        let rounds = this.state.Rounds.slice();

        for (let i = 0; i < this.state.trades.length; i++) {
          
                rounds[parseInt(this.state.trades[i].split(':')[0].split(',')[0])][parseInt(this.state.trades[i].split(':')[0].split(',')[1])] = parseInt(this.state.trades[i].split(':')[1])
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

   

            //TODO: ta bort draftnummer i rounds
            rounds[parseInt(this.state.keepers[i].split(':')[1].split(';')[0].split(',')[0])][parseInt(this.state.keepers[i].split(':')[1].split(';')[0].split(',')[1])] = 0;
        }
        this.setState({ teams:teams, Rounds:rounds });


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
		const options = this.state.teams[this.state.draftnumber - 1] !=null ? this.state.teams[this.state.draftnumber - 1].Ranking.map((r) => {return (r.name+ ' '+r.position+' '+r.team)}): [];
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
                <button onClick={this.openPopupbox}>Justera trades och keepers</button>
                <PopupboxContainer {...popupboxConfig}/>
                <div>Rundnummer {this.state.CurrentRound}</div>
			
				<section>
					<Dropdown
						options={options}
						onChange={this.handleSubmitPlayer}
						//value={defaultOption}
						placeholder="välj en spelare" />

				</section>


				{this.CreateBoard()}
			</div>
		);
	}
}



//<form onSubmit={this.handleSubmitPlayer}>
//	<label htmlFor="new-todo">
//		Vilken spelar väljer du?
//	</label>
//	<input
//		id="new-todo"

//		onChange={this.handleChangePlayer}

//		value={this.state.selectplayer}

//	/>

//	<button>

//		Lägg till spelare #{this.state.selectedPlayers.length + 1}

//	</button>

//</form>


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


//{
//	this.props.Players.map(item => (
//		<li key={item.number}>{item.name}</li>
//	))
//}

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
//			              //onChange={handleChange.bind(this:any)}
///>
//		       </div>;
	
//};


