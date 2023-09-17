import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-kelly-pool',
  templateUrl: './kelly-pool.component.html',
  styleUrls: ['./kelly-pool.component.scss']
})
export class KellyPoolComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) { }

  totalPlayers = Array(15).fill(1).map((_, i) => i+1);
  players: any[] = [];
  reset = false;

  ngOnInit(): void {
    this.titleService.setTitle('Kelly Pool Generator');
    this.metaService.addTags([
      {name: 'keywords', content: 'Angular, Universal, Example'},
      {name: 'description', content: 'Kelly Pool Ball Generator. Select the number of players and pass your phone around!'},
      {name: 'robots', content: 'index, follow'},
      {name: 'og:title', content:'Kelly Pool Generator'},
      {name: 'og:image', content:'../../assets/kelly_pool_logo.png'},
      {name: 'og:description', content:'Kelly Pool Ball Generator. Select the number of players and pass your phone around!'}
    ]);
  }

  changePlayerCount(value: string) {
    this.players =  Array.from({ length: Number(value) } , (v,i) => ({
      playerId: i+1,
      assignedBall: '',
      visible: false
    }))
    this.generateBalls(true);
  }

  generateBalls(initial: boolean) {
    var availableBalls = [...this.totalPlayers];
    for (var i = 0; i < this.players.length; i++) {
      var rand = Math.floor((Math.random() * (15 - (i+1))) + 0);
      this.players[i].assignedBall = availableBalls[rand];
      this.players[i].visible = false;
      availableBalls.splice(rand, 1);
    }

    // Only add class for subsequent runs
    if (!initial) {
      this.reset = true;

      setTimeout(()=>{
        this.reset = false;
      }, 500);
    }
  }

  changeVisibility(playerId: string) {
    this.players[Number(playerId) - 1].visible = !this.players[Number(playerId) - 1].visible;
  }
}
