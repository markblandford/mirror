import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { OpenaiService } from '../services/openai.service';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements AfterViewInit {
  photoWidth = 512;
  photoHeight = 512;

  @ViewChild('video')
  public video!: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas')
  public canvas!: ElementRef<HTMLCanvasElement>;

  takePicture = true;
  loading = false;
  variationUrl = '';

  constructor(public ai: OpenaiService) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.setupDevices();
  }

  async setupDevices(): Promise<void> {
    if (navigator?.mediaDevices?.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      if (stream) {
        this.video.nativeElement.srcObject = stream;
        await this.video.nativeElement.play();
      }
    }
  }

  async capture(): Promise<void> {
    this.variationUrl = '';
    this.loading = true;
    this.takePicture = false;
    const dataURI = this.drawVideoCaptureToCanvas(this.video.nativeElement);

    await this.ai.createImageVariation(dataURI).then(async apiResponse => {
      console.log('....')
      const imageData = await apiResponse;

      console.log('data:');
      console.log(imageData);

      console.log(imageData.data.data);

      this.loading = false;
      this.variationUrl = imageData.data.data[0].url;


      const image = new Image();
      image.src = this.variationUrl;

      this.drawImageToCanvas(image);
    });
  }

  removeCurrent(): void {
    this.variationUrl = '';
    this.takePicture = true;
  }

  private drawImageToCanvas(image: any): void {
    // @ts-ignore
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0);
  }

  private drawVideoCaptureToCanvas(image: any): string {
    this.drawImageToCanvas(image);

    return this.canvas.nativeElement.toDataURL("image/png");
  }

}
