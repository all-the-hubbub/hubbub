import { Component, OnInit, Injectable } from '@angular/core';

@Injectable()
export class ShapeService {
  shapeId: number = 0;
  shapeName: string;
  allShapes: [string] = ['circle', 'square', 'heart', 'triangle', 'diamond', 'pentagon', 'star', 'rectangle'];
}

@Component({
  selector: 'app-bub',
  templateUrl: './bub.component.html',
  styleUrls: ['./bub.component.scss'],
  providers: [ShapeService]
})
export class BubComponent implements OnInit {
  // public shapeName: String = 'circle';

  constructor(private shape: ShapeService) {
    this.shape.shapeName = this.shape.allShapes[this.shape.shapeId];
  }

  ngOnInit() {
    // this.shape.shapeName = 'rectangle';
  }

}
