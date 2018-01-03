import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const thread: any;

type IColor = [
  number, // r
  number, // g
  number, // b
  number // a
  ];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {

  @ViewChild('myCanvas')
  private canvasChild: ElementRef;

  private canvas: HTMLCanvasElement = null;
  private context: CanvasRenderingContext2D = null;

  private baseImage: ImageData = null;
  private changedImage: ImageData = null;

  private offscreenCanvas: HTMLCanvasElement = null;
  private offscreenContext: CanvasRenderingContext2D = null;

  public isLoading = false;
  public dislocated = false;

  constructor() {}

  public ngOnInit() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenContext = this.offscreenCanvas.getContext('2d');
  }

  public ngAfterViewInit() {
    this.canvas = this.canvasChild.nativeElement;
    this.context = this.canvas.getContext('2d');
  }

  private draw(image: ImageData): void {
    if (!image) {
      return;
    }

    // clear
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvas.height = image.height;
    this.canvas.width = image.width;

    // clear again
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // and draw
    this.context.putImageData(image, 0, 0);
  }

  public onSelectImage(file: File): void {
    this.isLoading = true;

    this.changedImage = null;
    this.baseImage = null;
    this.dislocated = false;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const image = new Image();

      image.onload = () => {
        this.isLoading = false;

        this.offscreenContext.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);

        this.offscreenCanvas.width = image.width;
        this.offscreenCanvas.height = image.height;

        this.offscreenContext.drawImage(image, 0, 0);

        this.baseImage = this.offscreenContext.getImageData(0, 0, image.width, image.height);

        this.draw(this.baseImage);
      };

      image.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  public onDislocateChange({checked}: { checked: boolean }): void {
    if (this.isLoading) {
      return;
    }

    if (null !== this.changedImage) {

      if (checked) {
        this.draw(this.changedImage);
      } else {
        this.draw(this.baseImage);
      }

      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      // thanks threads.js!
      // http://threadsjs.readthedocs.io/en/latest/

      const thrd = thread.spawn(
        function (imageData, done) {

          console.log('Worker has started its job!');

          const array = new Uint8ClampedArray(imageData.data);

          const reds: IColor[] = [];
          const greens: IColor[] = [];
          const blues: IColor[] = [];

          // convert to arrays of color objects, sorted into buckets
          for (let i = 0; i < array.length; i += 4) {
            const color: IColor = [array[i], array[i + 1], array[i + 2], array[i + 3]];

            switch (Math.max(color[0], color[1], color[2])) {
              case color[0]:
                reds.push(color);
                break;
              case color[1]:
                greens.push(color);
                break;
              case color[2]:
                blues.push(color);
                break;
            }

            // should trigger at every 10% completion
            if (i % Math.floor(array.length / 10) === 0) {
              console.log('Worker at: ' + (i / array.length * 100) + '%, iteration ' + i);
            }
          }

          const colors = [...reds, ...greens, ...blues];

          // convert back to a Uint8Array
          for (let i = 0; i < colors.length; i++) {
            array[(i * 4) + 0] = colors[i][0];
            array[(i * 4) + 1] = colors[i][1];
            array[(i * 4) + 2] = colors[i][2];
            array[(i * 4) + 3] = colors[i][3];
          }

          console.log('Worker has finished (inside thread)');

          done(new ImageData(array, imageData.width, imageData.height));
        });

      thrd
        .send(this.baseImage)
        // The handlers come here: (none of them is mandatory)
        .on('message', response => {
          console.log('Worker has finished (outside thread)');

          this.changedImage = response;
          this.draw(this.changedImage);

          thrd.kill();
        })
        .on('error', function (error) {
          console.error('Worker errored:', error);

          thrd.kill();
        })
        .on('exit', () => {
          console.log('Worker has been terminated.');

          this.isLoading = false;
        });
    });
  }
}
