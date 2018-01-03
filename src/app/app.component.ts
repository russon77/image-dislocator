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
          // major thanks to https://www.alanzucconi.com/2015/09/30/colour-sorting/
          // for inspiration and code!
          function sorter(a: IColor, b: IColor): number {
            const hsvA: [number, number, number] = rgb2step(a[0], a[1], a[2]);
            const hsvB: [number, number, number] = rgb2step(b[0], b[1], b[2]);

            const aIsGreater = -1;
            const bIsGreater = 1;

            if (hsvA[0] > hsvB[0]) {
              return aIsGreater;
            } else if (hsvA[0] < hsvB[0]) {
              return bIsGreater;
            } else {
              if (hsvA[1] > hsvB[1]) {
                return aIsGreater;
              } else if (hsvA[1] < hsvA[1]) {
                return bIsGreater;
              } else {
                if (hsvA[2] > hsvB[2]) {
                  return aIsGreater;
                } else if (hsvA[2] < hsvB[2]) {
                  return bIsGreater;
                }
              }
            }

            return 0;
          }

          function rgb2step(r, g, b, repetitions = 8): [number, number, number] {
            const lum = Math.sqrt(.241 * r + .691 * g + .068 * b);
            const [h, s, v] = rgb2hsv(r, g, b);

            const h2 = Math.floor(h * repetitions);
            const lum2 = Math.floor(lum * repetitions);
            const v2 = Math.floor(v * repetitions);

            return [h2, lum2, v2];
          }

          // thanks to http://www.javascripter.net/faq/rgb2hsv.htm
          function rgb2hsv(r: number, g: number, b: number): [number, number, number] {
            let computedH = 0;
            let computedS = 0;
            let computedV = 0;

            r = r / 255;
            g = g / 255;
            b = b / 255;

            const minRGB = Math.min(r, Math.min(g, b));
            const maxRGB = Math.max(r, Math.max(g, b));

            // Black-gray-white
            if (minRGB === maxRGB) {
              computedV = minRGB;
              return [0, 0, computedV];
            }

            // Colors other than black-gray-white:
            const d = (r === minRGB) ? g - b : ((b === minRGB) ? r - g : b - r);
            const h = (r === minRGB) ? 3 : ((b === minRGB) ? 1 : 5);

            computedH = 60 * (h - d / (maxRGB - minRGB));
            computedS = (maxRGB - minRGB) / maxRGB;
            computedV = maxRGB;

            return [computedH, computedS, computedV];
          }

          console.log('Worker has started its job!');

          const array = new Uint8ClampedArray(imageData.data);

          const colors: IColor[] = [];

          // convert to array of color tuples
          for (let i = 0; i < array.length; i += 4) {
            const color: IColor = [array[i], array[i + 1], array[i + 2], array[i + 3]];

            colors.push(color);
          }

          colors.sort(sorter);

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
