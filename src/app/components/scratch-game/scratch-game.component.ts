import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ScratchCard, SCRATCH_TYPE } from 'scratchcard-js'
import { CelebrateService } from '../../modules/shared/services/celebrate.service';

@Component({
  templateUrl: './scratch-game.component.html',
  styleUrls: ['./scratch-game.component.scss']
})
export class ScratchGameComponent implements OnInit {
  public showGame = false;
  public scratchCard: ScratchCard;

  constructor(private spinnerService: NgxSpinnerService,
              private celebrateService: CelebrateService) {
  }

  ngOnInit(): void {
  }

  private createWiningScratchCard() {
    const lastPrize = localStorage.getItem('SMARTCART.prizeNum');
    let prizeNum = Math.floor(Math.random() * 3);
    if (lastPrize) {
      const lastPrizeNum = Number(lastPrize)
      prizeNum = lastPrizeNum + 1;
      if (prizeNum > 2) {
        prizeNum = 0;
      }
    }
    localStorage.setItem('SMARTCART.prizeNum', prizeNum.toString());
    let prizeStr = '';
    switch (prizeNum) {
      case 0:
        prizeStr = '🏕️🏕️🏕️'
        break;
      case 1:
        prizeStr = '🎟️🎟️🎟️'
        break;
      case 2:
        prizeStr = '$200'
        break;
    }
    const containerProps = document.getElementById('js--sc--container').getBoundingClientRect();
    this.scratchCard = new ScratchCard('#js--sc--container', {
      scratchType: SCRATCH_TYPE.LINE,
      containerWidth: containerProps.width,
      containerHeight: 220,
      imageForwardSrc: './assets/img/scratch-cover.png',
      htmlBackground: `<div class="scratched-card"><div class="result-icons text-center">${prizeStr}</div></div>`,
      clearZoneRadius: 100,
      nPoints: 30,
      pointSize: 4,
      callback: () => {
        const celebrationParams = {
          particleCount: 300,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          shapes: ['circle']
        }
        this.celebrateService.startCelebration(celebrationParams);
      }
    })
    this.scratchCard.init();
  }

  private createLoserScratchCard() {
    const containerProps = document.getElementById('js--sc--container').getBoundingClientRect();
    this.scratchCard = new ScratchCard('#js--sc--container', {
      scratchType: SCRATCH_TYPE.LINE,
      containerWidth: containerProps.width,
      containerHeight: 220,
      imageForwardSrc: './assets/img/scratch-cover.png',
      htmlBackground:
        '<div class="scratched-card"><div class="result-icons text-center">🎟️🏕️🏕️</div></div>',
      clearZoneRadius: 100,
      nPoints: 30,
      pointSize: 4,
      callback: () => {
        const celebrationParams = {
          particleCount: 300,
          startVelocity: 1,
          spread: -20,
          ticks: 60,
          shapes: ['square'],
          colors: ['#575757']
        }
        this.celebrateService.startCelebration(celebrationParams);
      }
    })
    // Init
    this.scratchCard.init();
  }


  public loadGame(type: string) {
    this.spinnerService.show('scratchGameSpinner')
    this.showGame = true;
    setTimeout(() => {
      switch (type) {
        case 'win':
          this.createWiningScratchCard();
          break;
        case 'lose':
          this.createLoserScratchCard();
          break;
      }
      this.spinnerService.hide('scratchGameSpinner')
    }, 1000)
  }

  public reloadGame() {
    window.location.reload();
  }

}
