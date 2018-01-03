import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare const thread: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public baseImage: string = null;
  public changedImage: string = null;
  public isLoading = false;

  constructor() {}

  public onSelectImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.baseImage = e.target.result;
      this.changedImage = null;
    };

    reader.readAsDataURL(file);
  }

  public onDislocateChange({checked}: { checked: boolean }): void {
    if (!checked) {
      this.changedImage = null;

      return;
    }

    this.isLoading = true;

    Observable.create(
      observer => {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const baseImage = new Image();

        baseImage.onload = () => {
          canvas.width = baseImage.width;
          canvas.height = baseImage.height;

          ctx.drawImage(baseImage, 0, 0);

          // web worker - later!

          // retrieve pixel data
          const baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          baseImageData.data.sort();

          ctx.putImageData(baseImageData, 0, 0);

          // sort
          // baseImageData.data.sort();

          // console.log(baseImageData.data);

          // draw pixel array to result canvas
          // changedCtx.putImageData(baseImageData, 0, 0);

          // finally, return the canvas as an image
          observer.next(canvas.toDataURL('image/png'));
          observer.complete();
        };

        baseImage.src = this.baseImage;
      }
    )
      .subscribe(
        changedImage => {
          this.changedImage = changedImage;
          this.isLoading = false;
        }
      );
  }
}
