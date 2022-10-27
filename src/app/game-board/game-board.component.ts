import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  @ViewChild('board', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
    this.canvas.nativeElement.width = 400;
    this.canvas.nativeElement.height = 400;

    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.board = new Array(this.rows);
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(this.cols);
      for (let j = 0; j < this.board[i].length; j++) {
        if (Math.random() <= 0.99) this.board[i][j] = 0;
        else this.board[i][j] = 1;
      }
    }
    console.log(this.board);
    this.render();
  }

  canvasWidth: number = 400;
  canvasHeight: number = 400;
  resolution: number = 20;

  rows: number = this.canvasHeight / this.resolution;
  cols: number = this.canvasWidth / this.resolution;

  board: number[][];

  render() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.ctx.beginPath();
        this.ctx.rect(j * this.resolution, i * this.resolution, this.resolution, this.resolution);
        this.ctx.fillStyle = this.board[i][j] ? 'black' : 'white';
        this.ctx.fill();
        this.ctx.strokeStyle = '#EBE0E0';
        this.ctx.stroke();
      }
    }
  }

}
