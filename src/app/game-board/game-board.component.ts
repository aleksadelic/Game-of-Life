import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { resolve } from 'dns';
import { delay } from 'rxjs';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  @ViewChild('board', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
    this.canvas.nativeElement.width = 400;
    this.canvas.nativeElement.height = 400;

    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.createBoard();
  }

  canvasWidth: number = 400;
  canvasHeight: number = 400;
  resolution: number = 10;

  rows: number = this.canvasHeight / this.resolution;
  cols: number = this.canvasWidth / this.resolution;

  board: number[][];

  async createBoard() {
    this.board = new Array(this.rows);
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = new Array(this.cols);
      for (let j = 0; j < this.board[i].length; j++) {
        if (Math.random() <= 0.9) this.board[i][j] = 0;
        else this.board[i][j] = 1;
      }
    }
    this.render();
    this.play();
  }

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

  nextGeneration() {
    let future: number[][] = new Array(this.rows);
    for (let i = 0; i < this.board.length; i++) {
      future[i] = new Array(this.cols);
      for (let j = 0; j < this.board[i].length; j++) {
        let aliveNeighbours: number = this.countNeighbours(i, j);
        if (this.board[i][j] == 1 && (aliveNeighbours < 2 || aliveNeighbours > 3)) {
          future[i][j] = 0; // Cell dies due to underpopulation or overpopulation
        }
        else if (this.board[i][j] == 0 && aliveNeighbours == 3) {
          future[i][j] = 1; // Cell becomes alive due to reproduction
        }
        else {
          future[i][j] = this.board[i][j]; // Cell remains the same
        } 
      }
    }
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        this.board[i][j] = future[i][j];
      }
    }
  }

  countNeighbours(row: number, col: number): number {
    let aliveNeighbours: number = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i < 0 || i >= this.board.length || j < 0 || j >= this.board[i].length || i == row && j == col)
          continue;
        if (this.board[i][j] == 1) 
          aliveNeighbours++;
      }
    }
    return aliveNeighbours;
  }

  async play() {
    while (this.stopped == false) {
      await new Promise(f => setTimeout(f, 1000));
      this.nextGeneration();
      this.render();
    }
  }

  stopped: boolean = true;

  start() {
    this.stopped = false;
    this.play();
  }

  stop() {
    this.stopped = true;
  }

  next() {
    this.nextGeneration();
    this.render();
  }

}
